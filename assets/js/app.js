/* Main app: loads the course index, renders the TOC and lesson bodies,
   wires up settings toggles, persists progress, and provides search. */

(function () {
  "use strict";

  const CONTENT_ROOT = "content";
  const INDEX_URL = "tools/index.json";
  const SEARCH_INDEX_URL = "tools/search-index.json";

  const state = {
    index: [],
    searchIndex: null,           // loaded lazily on first search
    currentLessonId: null,
    searchDebounce: null,
    searchResults: [],
    searchSelection: -1,
  };

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  // ---------- Routing & lesson loading ----------

  function lessonIdFromHash() {
    const raw = location.hash.replace(/^#\/?/, "");
    return raw || null;
  }

  function lessonPath(entry, lang) {
    return `${CONTENT_ROOT}/${entry.semester}/${entry.chapter}/${entry.lesson}.${lang}.md`;
  }

  function lessonKey(e) {
    return `${e.semester}/${e.chapter}/${e.lesson}`;
  }

  function findEntryById(id) {
    return state.index.find(e => lessonKey(e) === id) || null;
  }

  function localized(obj, fallback = "") {
    if (!obj || typeof obj !== "object") return fallback;
    const lang = window.I18N.current;
    return obj[lang] || obj.fr || obj.en || fallback;
  }

  async function fetchText(url) {
    const r = await fetch(url);
    if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
    return r.text();
  }

  async function loadIndex() {
    try {
      const r = await fetch(INDEX_URL);
      if (r.ok) return JSON.parse(await r.text());
    } catch (_) { /* fall through */ }
    return [{
      semester: "semester-01",
      chapter: "chapter-01-apprendre-a-apprendre",
      lesson: "lesson-01",
      title: {
        fr: "Bienvenue — et pourquoi ce cours est différent",
        en: "Welcome — and why this course is different",
      },
      chapterTitle: { fr: "Apprendre à apprendre", en: "Learning to learn" },
      semesterTitle: { fr: "Fondations de la pensée", en: "Foundations of thinking" },
      chapterNumber: 1,
      semesterNumber: 1,
      estimatedMinutes: 15,
    }];
  }

  async function loadSearchIndex() {
    if (state.searchIndex) return state.searchIndex;
    try {
      const r = await fetch(SEARCH_INDEX_URL);
      if (!r.ok) throw new Error(`${r.status}`);
      state.searchIndex = await r.json();
    } catch (e) {
      console.warn("Search index unavailable:", e);
      state.searchIndex = [];
    }
    return state.searchIndex;
  }

  // ---------- Table of contents ----------

  function renderToc() {
    const nav = $("#toc-nav");
    if (!nav) return;

    // Group: semester -> chapter -> lessons
    const tree = new Map();
    for (const entry of state.index) {
      if (!tree.has(entry.semester)) {
        tree.set(entry.semester, {
          id: entry.semester,
          number: entry.semesterNumber,
          title: entry.semesterTitle || { fr: entry.semester, en: entry.semester },
          chapters: new Map(),
        });
      }
      const sem = tree.get(entry.semester);
      if (!sem.chapters.has(entry.chapter)) {
        sem.chapters.set(entry.chapter, {
          id: entry.chapter,
          number: entry.chapterNumber,
          title: entry.chapterTitle || { fr: entry.chapter, en: entry.chapter },
          lessons: [],
        });
      }
      sem.chapters.get(entry.chapter).lessons.push(entry);
    }

    const lang = window.I18N.current;
    const activeChapter = state.currentLessonId
      ? state.currentLessonId.split("/")[1]
      : null;

    const parts = [];
    for (const sem of tree.values()) {
      const semTitle = localized(sem.title, sem.id);
      parts.push(
        `<details class="toc-semester" open>` +
        `<summary><span class="sem-label">${window.I18N.t("semester")} ${sem.number}</span> — ${escapeHtml(semTitle)}</summary>`
      );

      for (const ch of sem.chapters.values()) {
        const chTitle = localized(ch.title, ch.id);
        const total = ch.lessons.length;
        const done = ch.lessons.filter(l => window.Progress.isCompleted(lessonKey(l))).length;
        const isActive = ch.id === activeChapter;
        const openAttr = isActive ? " open" : "";

        parts.push(
          `<details class="toc-chapter${isActive ? " active" : ""}"${openAttr}>` +
          `<summary>` +
          `<span class="ch-label">Ch.${ch.number}</span> ` +
          `<span class="ch-title">${escapeHtml(chTitle)}</span>` +
          `<span class="ch-progress">${done}/${total}</span>` +
          `</summary>` +
          `<ol class="toc-lessons">`
        );

        for (const e of ch.lessons) {
          const id = lessonKey(e);
          const classes = [];
          if (window.Progress.isCompleted(id)) classes.push("done");
          if (id === state.currentLessonId) classes.push("active");
          const title = localized(e.title, e.lesson);
          parts.push(
            `<li><a class="${classes.join(" ")}" href="#/${id}">${escapeHtml(title)}</a></li>`
          );
        }

        parts.push(`</ol></details>`);
      }

      parts.push(`</details>`);
    }
    nav.innerHTML = parts.join("");
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // ---------- Progress UI ----------

  function updateProgressBar() {
    const total = state.index.length || 1;
    const done = state.index.filter(
      e => window.Progress.isCompleted(lessonKey(e))
    ).length;
    const pct = Math.round((done / total) * 100);
    $("#progress-fill").style.width = `${pct}%`;
    $("#progress-label").textContent = `${pct} %`;
  }

  function updateCompleteButton() {
    const btn = $("#complete-btn");
    if (!btn) return;
    btn.disabled = !state.currentLessonId;
    if (state.currentLessonId && window.Progress.isCompleted(state.currentLessonId)) {
      btn.classList.add("done");
      btn.textContent = window.I18N.t("completed");
    } else {
      btn.classList.remove("done");
      btn.textContent = window.I18N.t("complete");
    }
  }

  // ---------- Lesson rendering ----------

  async function renderLesson() {
    const container = $("#lesson-content");
    const id = lessonIdFromHash() ||
      (state.index[0] ? lessonKey(state.index[0]) : null);

    if (!id) {
      container.innerHTML = `<p>${window.I18N.t("notFound")}</p>`;
      return;
    }
    state.currentLessonId = id;
    const entry = findEntryById(id);
    if (!entry) {
      container.innerHTML = `<p>${window.I18N.t("notFound")}</p>`;
      return;
    }

    container.innerHTML = `<p class="loading">${window.I18N.t("loading")}</p>`;

    const lang = window.I18N.current;
    let md;
    try {
      md = await fetchText(lessonPath(entry, lang));
    } catch (_) {
      try {
        md = await fetchText(lessonPath(entry, "fr"));
      } catch (e) {
        container.innerHTML = `<p>${window.I18N.t("notFound")}</p>`;
        return;
      }
    }

    container.innerHTML = window.marked.parse(md);
    if (window.renderMathInElement) {
      window.renderMathInElement(container, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false },
          { left: "\\(", right: "\\)", display: false },
          { left: "\\[", right: "\\]", display: true },
        ],
        throwOnError: false,
      });
    }
    window.Progress.markVisited(id);
    renderToc();
    updateProgressBar();
    updateCompleteButton();
    window.scrollTo({ top: 0, behavior: "instant" });
    $("#main").focus();
  }

  // ---------- Settings ----------

  function applySettingsFromStorage() {
    const html = document.documentElement;
    html.dataset.theme = window.Progress.getSetting("theme", "light");
    html.dataset.font = window.Progress.getSetting("font", "hyperlegible");
    html.dataset.stim = window.Progress.getSetting("stim", "normal");
    html.dataset.width = window.Progress.getSetting("width", "standard");

    const setRadio = (name, val) => {
      const el = document.querySelector(`input[name="${name}"][value="${val}"]`);
      if (el) el.checked = true;
    };
    setRadio("theme", html.dataset.theme);
    setRadio("font", html.dataset.font);
    setRadio("width", html.dataset.width);
    const lowStim = document.querySelector("#low-stim");
    if (lowStim) lowStim.checked = html.dataset.stim === "low";
  }

  function wireSettings() {
    $$('input[name="theme"]').forEach(el =>
      el.addEventListener("change", () => {
        document.documentElement.dataset.theme = el.value;
        window.Progress.setSetting("theme", el.value);
      })
    );
    $$('input[name="font"]').forEach(el =>
      el.addEventListener("change", () => {
        document.documentElement.dataset.font = el.value;
        window.Progress.setSetting("font", el.value);
      })
    );
    $$('input[name="width"]').forEach(el =>
      el.addEventListener("change", () => {
        document.documentElement.dataset.width = el.value;
        window.Progress.setSetting("width", el.value);
      })
    );
    $("#low-stim").addEventListener("change", (e) => {
      const v = e.target.checked ? "low" : "normal";
      document.documentElement.dataset.stim = v;
      window.Progress.setSetting("stim", v);
    });

    $("#progress-export").addEventListener("click", () => {
      const blob = new Blob([window.Progress.exportJson()], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pyda-progress-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });

    $("#progress-import").addEventListener("click", () => {
      $("#progress-import-file").click();
    });
    $("#progress-import-file").addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const text = await file.text();
      try {
        window.Progress.importJson(text);
        applySettingsFromStorage();
        renderToc();
        updateProgressBar();
        updateCompleteButton();
      } catch (err) {
        alert(err.message);
      }
    });

    $("#progress-reset").addEventListener("click", () => {
      if (confirm(window.I18N.t("resetConfirm"))) {
        window.Progress.resetAll();
        renderToc();
        updateProgressBar();
        updateCompleteButton();
      }
    });
  }

  // ---------- Panels ----------

  function closeAllPanels() {
    ["#toc", "#settings", "#search"].forEach(sel => {
      const panel = $(sel);
      if (panel) panel.setAttribute("hidden", "");
    });
    ["#toc-toggle", "#settings-toggle", "#search-toggle"].forEach(sel => {
      const b = $(sel);
      if (b) b.setAttribute("aria-expanded", "false");
    });
  }

  function openPanel(panelSel, btnSel) {
    closeAllPanels();
    $(panelSel).removeAttribute("hidden");
    $(btnSel).setAttribute("aria-expanded", "true");
  }

  function togglePanel(panelSel, btnSel) {
    const panel = $(panelSel);
    if (panel.hasAttribute("hidden")) openPanel(panelSel, btnSel);
    else closeAllPanels();
  }

  function wirePanels() {
    $("#toc-toggle").addEventListener("click", () => togglePanel("#toc", "#toc-toggle"));
    $("#settings-toggle").addEventListener("click", () => togglePanel("#settings", "#settings-toggle"));
    $("#search-toggle").addEventListener("click", () => {
      togglePanel("#search", "#search-toggle");
      const input = $("#search-input");
      if (input && !$("#search").hasAttribute("hidden")) {
        input.focus();
        input.select();
      }
    });
  }

  // ---------- Language toggle & completion ----------

  function wireLangToggle() {
    $("#lang-toggle").addEventListener("click", () => {
      const next = window.I18N.current === "fr" ? "en" : "fr";
      window.I18N.set(next);
      renderLesson();
      renderToc();
      updateCompleteButton();
      renderSearchResults();  // re-render search with new language snippets
    });
  }

  function wireCompleteBtn() {
    $("#complete-btn").addEventListener("click", () => {
      if (!state.currentLessonId) return;
      window.Progress.markCompleted(state.currentLessonId);
      updateProgressBar();
      updateCompleteButton();
      renderToc();
    });
  }

  // ---------- Search ----------

  function tokenize(q) {
    return q.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "")
      .split(/\s+/).filter(Boolean);
  }

  function normalize(s) {
    return s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
  }

  function scoreEntry(entry, tokens, lang) {
    const title = normalize(localized(entry.title, ""));
    const chTitle = normalize(localized(entry.chapterTitle, ""));
    const body = normalize(entry.body?.[lang] || entry.body?.fr || "");
    let score = 0;
    for (const tok of tokens) {
      if (!tok) continue;
      if (title.includes(tok)) score += 10;
      if (chTitle.includes(tok)) score += 3;
      if (body.includes(tok)) score += 1;
      else if (!title.includes(tok) && !chTitle.includes(tok)) return -1;
    }
    return score;
  }

  function snippetAround(body, token, ctx = 60) {
    const normBody = normalize(body);
    const idx = normBody.indexOf(token);
    if (idx < 0) return body.slice(0, ctx * 2) + (body.length > ctx * 2 ? "…" : "");
    const start = Math.max(0, idx - ctx);
    const end = Math.min(body.length, idx + token.length + ctx);
    let snippet = body.slice(start, end);
    if (start > 0) snippet = "…" + snippet;
    if (end < body.length) snippet += "…";
    return snippet;
  }

  function highlight(text, tokens) {
    let out = escapeHtml(text);
    for (const tok of tokens) {
      if (!tok) continue;
      // Match insensitive + diacritic-tolerant by regex on normalized form
      const re = new RegExp(
        "(" + tok.split("").map(c => {
          const esc = c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          return esc;
        }).join("[\\u0300-\\u036f]*") + ")",
        "giu"
      );
      out = out.replace(re, "<mark>$1</mark>");
    }
    return out;
  }

  async function runSearch(q) {
    const lang = window.I18N.current;
    const tokens = tokenize(q);
    if (!tokens.length) {
      state.searchResults = [];
      state.searchSelection = -1;
      renderSearchResults();
      return;
    }

    const idx = await loadSearchIndex();
    const results = [];
    for (const entry of idx) {
      const score = scoreEntry(entry, tokens, lang);
      if (score > 0) {
        const body = entry.body?.[lang] || entry.body?.fr || "";
        const snippet = snippetAround(body, tokens[0]);
        results.push({ entry, score, snippet });
      }
    }
    results.sort((a, b) => b.score - a.score);
    state.searchResults = results.slice(0, 30);
    state.searchSelection = state.searchResults.length ? 0 : -1;
    renderSearchResults();
  }

  function renderSearchResults() {
    const list = $("#search-results");
    if (!list) return;
    const empty = $("#search-empty");
    const countEl = $("#search-count");

    const q = $("#search-input")?.value || "";
    const tokens = tokenize(q);

    if (!tokens.length) {
      list.innerHTML = "";
      if (empty) empty.textContent = window.I18N.t("searchPrompt");
      if (empty) empty.hidden = false;
      if (countEl) countEl.textContent = "";
      return;
    }

    const results = state.searchResults;
    if (countEl) countEl.textContent = window.I18N.t("searchCount", results.length);

    if (!results.length) {
      list.innerHTML = "";
      if (empty) empty.textContent = window.I18N.t("searchNoResults");
      if (empty) empty.hidden = false;
      return;
    }
    if (empty) empty.hidden = true;

    const lang = window.I18N.current;
    list.innerHTML = results.map((r, i) => {
      const id = lessonKey(r.entry);
      const title = localized(r.entry.title, r.entry.lesson);
      const chTitle = localized(r.entry.chapterTitle, r.entry.chapter);
      const active = i === state.searchSelection ? " active" : "";
      return (
        `<li class="search-result${active}">` +
        `<a href="#/${id}" data-idx="${i}">` +
        `<div class="sr-title">${highlight(title, tokens)}</div>` +
        `<div class="sr-meta">${escapeHtml(chTitle)}</div>` +
        `<div class="sr-snippet">${highlight(r.snippet, tokens)}</div>` +
        `</a></li>`
      );
    }).join("");
  }

  function wireSearch() {
    const input = $("#search-input");
    const close = $("#search-close");

    if (input) {
      input.addEventListener("input", () => {
        clearTimeout(state.searchDebounce);
        state.searchDebounce = setTimeout(() => runSearch(input.value), 120);
      });
      input.addEventListener("keydown", (e) => {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          state.searchSelection = Math.min(
            state.searchResults.length - 1,
            state.searchSelection + 1
          );
          renderSearchResults();
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          state.searchSelection = Math.max(0, state.searchSelection - 1);
          renderSearchResults();
        } else if (e.key === "Enter") {
          e.preventDefault();
          const r = state.searchResults[state.searchSelection];
          if (r) {
            location.hash = `#/${lessonKey(r.entry)}`;
            closeAllPanels();
          }
        } else if (e.key === "Escape") {
          closeAllPanels();
        }
      });
    }
    if (close) close.addEventListener("click", closeAllPanels);

    // Results list: clicking navigates + closes.
    $("#search-results").addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      // default href navigation happens; also close panel.
      setTimeout(closeAllPanels, 0);
    });

    // Keyboard shortcut: "/" or Cmd/Ctrl+K opens search.
    document.addEventListener("keydown", (e) => {
      // Skip when typing in input/textarea/contenteditable
      const tag = (e.target && e.target.tagName) || "";
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(tag) ||
        (e.target && e.target.isContentEditable);
      if ((e.key === "/" && !typing) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k")) {
        e.preventDefault();
        openPanel("#search", "#search-toggle");
        input?.focus();
        input?.select();
      } else if (e.key === "Escape" && !$("#search").hasAttribute("hidden")) {
        closeAllPanels();
      }
    });
  }

  // ---------- Boot ----------

  async function main() {
    window.Progress.init();
    window.I18N.init();
    applySettingsFromStorage();
    wirePanels();
    wireSettings();
    wireLangToggle();
    wireCompleteBtn();
    wireSearch();

    state.index = await loadIndex();
    renderToc();
    updateProgressBar();
    await renderLesson();

    window.addEventListener("hashchange", renderLesson);
  }

  document.addEventListener("DOMContentLoaded", main);
})();
