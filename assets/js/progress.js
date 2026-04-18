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

    completedCount() {
      return Object.values(this._data.lessons).filter(l => l.completed).length;
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
