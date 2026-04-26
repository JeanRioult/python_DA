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
