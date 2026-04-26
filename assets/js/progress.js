/* Progress persistence via localStorage.
   Schema:
   {
     version: 1,
     lessons: {
       "semester-01/chapter-01-.../lesson-01": {
         completed: true,
         completedAt: "2026-04-18T12:00:00.000Z",
         lastVisited: "...",
         quizScores: [],
         flashcardState: {}
       },
       ...
     },
     settings: { theme, font, stim, lang }
   }
*/

(function () {
  "use strict";

  const KEY = "pyda.progress.v1";

  // Spaced-repetition intervals (in days) per mastery level 0..5.
  const SR_INTERVAL_DAYS = [0, 1, 3, 7, 14, 30];

  function todayKey(d = new Date()) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }
  function dayDiff(aKey, bKey) {
    const a = new Date(aKey + "T00:00:00");
    const b = new Date(bKey + "T00:00:00");
    return Math.round((b - a) / 86400000);
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return { version: 1, lessons: {}, settings: {} };
      const parsed = JSON.parse(raw);
      if (!parsed.lessons) parsed.lessons = {};
      if (!parsed.settings) parsed.settings = {};
      return parsed;
    } catch (e) {
      console.warn("Progress read failed, starting fresh", e);
      return { version: 1, lessons: {}, settings: {} };
    }
  }

  function save(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
  }

  const Progress = {
    _data: null,

    init() {
      this._data = load();
      if (!this._data.game) this._data.game = { xp: 0, streakDays: 0, lastActivityDate: null };
      if (!this._data.cards) this._data.cards = {};
      if (!this._data.achievements) this._data.achievements = {};
      return this;
    },

    isCompleted(id) {
      return !!(this._data.lessons[id] && this._data.lessons[id].completed);
    },

    markCompleted(id) {
      const now = new Date().toISOString();
      this._data.lessons[id] = {
        ...(this._data.lessons[id] || {}),
        completed: true,
        completedAt: now,
        reading: 1,
      };
      save(this._data);
    },

    markVisited(id) {
      const now = new Date().toISOString();
      this._data.lessons[id] = {
        ...(this._data.lessons[id] || { completed: false }),
        lastVisited: now,
      };
      save(this._data);
    },

    getReading(id) {
      const l = this._data.lessons[id];
      if (!l) return 0;
      if (l.completed) return 1;
      return Number.isFinite(l.reading) ? l.reading : 0;
    },

    setReading(id, value) {
      const v = Math.max(0, Math.min(1, value));
      const cur = this.getReading(id);
      if (v <= cur) return false;
      this._data.lessons[id] = {
        ...(this._data.lessons[id] || { completed: false }),
        reading: v,
      };
      save(this._data);
      return true;
    },

    completedCount() {
      return Object.values(this._data.lessons).filter(l => l.completed).length;
    },

    getCardState(cardId) {
      if (!this._data.cards) this._data.cards = {};
      return this._data.cards[cardId] || { level: 0, seen: 0, knew: 0, missed: 0 };
    },

    setCardState(cardId, partial) {
      if (!this._data.cards) this._data.cards = {};
      const cur = this.getCardState(cardId);
      this._data.cards[cardId] = { ...cur, ...partial };
      save(this._data);
    },

    rateCard(cardId, knewIt) {
      const cur = this.getCardState(cardId);
      const next = {
        level: knewIt ? Math.min(5, cur.level + 1) : Math.max(0, cur.level - 1),
        seen: (cur.seen || 0) + 1,
        knew: (cur.knew || 0) + (knewIt ? 1 : 0),
        missed: (cur.missed || 0) + (knewIt ? 0 : 1),
        lastSeen: new Date().toISOString(),
      };
      this.setCardState(cardId, next);
      return next;
    },

    // True if the card is due for review today (never seen, or interval elapsed).
    isCardDue(cardId, now = new Date()) {
      const c = this.getCardState(cardId);
      if (!c.lastSeen) return true;
      const lvl = Math.max(0, Math.min(5, c.level || 0));
      const intervalMs = SR_INTERVAL_DAYS[lvl] * 86400000;
      return (now - new Date(c.lastSeen)) >= intervalMs;
    },

    // ---- Game state ----

    getGame() {
      return { xp: 0, streakDays: 0, lastActivityDate: null, ...(this._data.game || {}) };
    },

    addXp(n) {
      const g = this.getGame();
      g.xp = (g.xp || 0) + Math.max(0, n | 0);
      this._data.game = g;
      save(this._data);
      return g.xp;
    },

    // Call on any meaningful learning activity. Updates streak counter.
    recordActivity(now = new Date()) {
      const g = this.getGame();
      const t = todayKey(now);
      if (g.lastActivityDate === t) return g;
      if (!g.lastActivityDate) g.streakDays = 1;
      else {
        const d = dayDiff(g.lastActivityDate, t);
        if (d === 1) g.streakDays = (g.streakDays || 0) + 1;
        else if (d > 1) g.streakDays = 1;
        // d <= 0 (clock went back) — leave as is
      }
      g.lastActivityDate = t;
      this._data.game = g;
      save(this._data);
      return g;
    },

    // Streak is "alive" only if last activity was today or yesterday.
    liveStreak(now = new Date()) {
      const g = this.getGame();
      if (!g.lastActivityDate) return 0;
      const d = dayDiff(g.lastActivityDate, todayKey(now));
      if (d <= 1) return g.streakDays || 0;
      return 0;
    },

    // ---- Achievements ----

    isUnlocked(id) {
      return !!(this._data.achievements && this._data.achievements[id]);
    },

    unlock(id) {
      if (!this._data.achievements) this._data.achievements = {};
      if (this._data.achievements[id]) return false;
      this._data.achievements[id] = new Date().toISOString();
      save(this._data);
      return true;
    },

    unlockedAchievements() {
      return { ...(this._data.achievements || {}) };
    },

    getSetting(key, fallback) {
      return this._data.settings[key] ?? fallback;
    },

    setSetting(key, value) {
      this._data.settings[key] = value;
      save(this._data);
    },

    exportJson() {
      return JSON.stringify(this._data, null, 2);
    },

    importJson(text) {
      const parsed = JSON.parse(text);
      if (!parsed || parsed.version !== 1) {
        throw new Error("Unsupported progress format");
      }
      this._data = parsed;
      save(this._data);
    },

    resetAll() {
      this._data = { version: 1, lessons: {}, settings: {} };
      localStorage.removeItem(KEY);
    },
  };

  window.Progress = Progress;
})();
