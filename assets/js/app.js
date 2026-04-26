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
    let sum = 0;
    let done = 0;
    for (const e of state.index) {
      const id = lessonKey(e);
      if (window.Progress.isCompleted(id)) {
        sum += 1;
        done += 1;
      } else {
        sum += window.Progress.getReading(id);
      }
    }
    const pct = Math.round((sum / total) * 100);
    const fill = $("#progress-fill");
    const label = $("#progress-label");
    if (fill) fill.style.width = `${pct}%`;
    if (label) {
      label.textContent = `${pct} %`;
      label.title = `${done}/${total} ${window.I18N.t("completed").replace("✓ ", "")}`;
    }
  }

  // ---------- Reading tracker ----------
  // Credits a depth `d` only if the user has been at-or-below `d` continuously
  // for at least READ_DWELL_MS. Going back upward never reduces credit.
  // Implementation: keep a sliding window of (timestamp, depth) samples covering
  // the last READ_DWELL_MS. The credited depth is the MIN depth in that window
  // — which is the lowest position the user has held continuously for that long.

  const READ_DWELL_MS = 15000;
  const reading = {
    samples: [],     // [{t, d}], oldest first, spanning up to READ_DWELL_MS
    lessonId: null,
    pollTimer: null,
    sessionStart: 0,        // ms since user started current continuous session
    sessionLastTick: 0,
    sessionMinutesAwarded: 0,
  };

  function articleScrollDepth() {
    const article = $("#lesson-content");
    if (!article) return 0;
    const rect = article.getBoundingClientRect();
    const total = article.scrollHeight || article.offsetHeight || 0;
    if (total <= 0) return 0;
    const viewBottom = window.innerHeight || document.documentElement.clientHeight;
    let d = (viewBottom - rect.top) / total;
    if (!Number.isFinite(d)) d = 0;
    if (d < 0) d = 0;
    if (d > 1) d = 1;
    return d;
  }

  function recordSample(now) {
    const id = state.currentLessonId;
    if (!id) return;
    if (reading.lessonId !== id) {
      reading.lessonId = id;
      reading.samples = [];
      reading.sessionStart = now;
      reading.sessionLastTick = now;
      reading.sessionMinutesAwarded = 0;
    }
    const d = articleScrollDepth();
    reading.samples.push({ t: now, d });
    while (
      reading.samples.length > 1 &&
      reading.samples[0].t < now - READ_DWELL_MS
    ) {
      reading.samples.shift();
    }
  }

  function readingTick() {
    const now = Date.now();
    recordSample(now);
    // Continuous-session timing: only count time if user was idle <10s.
    if (now - reading.sessionLastTick > 10000) reading.sessionStart = now;
    reading.sessionLastTick = now;
    const minutes = Math.floor((now - reading.sessionStart) / 60000);
    if (window.Game && minutes > reading.sessionMinutesAwarded) {
      reading.sessionMinutesAwarded = minutes;
      window.Game.checkAchievements({ lastReadingMinutes: minutes });
    }
    const id = reading.lessonId;
    if (!id || !reading.samples.length) return;
    if (now - reading.samples[0].t < READ_DWELL_MS) return;
    let minD = 1;
    for (const s of reading.samples) if (s.d < minD) minD = s.d;
    const before = window.Progress.getReading(id);
    if (window.Progress.setReading(id, minD)) {
      updateProgressBar();
      updateLessonReadingBar(minD);
      if (window.Game) {
        const milestones = [0.25, 0.5, 0.75, 1.0];
        for (const m of milestones) {
          if (before < m && minD >= m) {
            window.Game.award(10, "reading");
            window.Game.recordActivity();
          }
        }
        window.Game.checkAchievements();
      }
    }
  }

  function updateLessonReadingBar(value) {
    const bar = $("#lesson-reading-fill");
    if (!bar) return;
    const id = state.currentLessonId;
    const v = typeof value === "number"
      ? value
      : (id ? window.Progress.getReading(id) : 0);
    bar.style.width = `${Math.round(v * 100)}%`;
  }

  function startReadingTracker() {
    if (reading.pollTimer) clearInterval(reading.pollTimer);
    reading.pollTimer = setInterval(readingTick, 1000);
    window.addEventListener("scroll", () => recordSample(Date.now()), { passive: true });
    window.addEventListener("resize", () => recordSample(Date.now()), { passive: true });
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
    // The "Réviser cette leçon" button is shown only once the lesson is done,
    // so the user can opt back into another pass at the cards without losing
    // their mastery (knowledge stays, only try counters are restored).
    const restartBtn = $("#restart-lesson-btn");
    if (restartBtn) {
      restartBtn.hidden = !(
        state.currentLessonId && window.Progress.isCompleted(state.currentLessonId)
      );
    }
  }

  function wireOeuvreBtn() {
    const btn = $("#oeuvre-btn");
    if (!btn || !window.Oeuvres) return;
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      window.Oeuvres.openForCurrentChapter();
    });
  }

  function wireRestartLessonBtn() {
    const btn = $("#restart-lesson-btn");
    if (!btn) return;
    btn.addEventListener("click", () => {
      if (!state.currentLessonId) return;
      const ok = confirm(
        "Réviser cette leçon ?\n\n" +
        "Les essais des cartes du chapitre seront restaurés.\n" +
        "Tes maîtrises (étoiles) sont gardées."
      );
      if (!ok) return;
      const ref = chapterIdFromLessonId(state.currentLessonId);
      if (window.Cards && ref) window.Cards.restartLessonCards(ref);
      // Reset reading depth on this lesson so the bar re-fills as they re-read.
      const lessonState = window.Progress._data.lessons[state.currentLessonId];
      if (lessonState) {
        lessonState.reading = 0;
        // markVisited will save; but force a save by re-marking
        window.Progress.markVisited(state.currentLessonId);
      }
      updateProgressBar();
      updateLessonReadingBar(0);
    });
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
    refreshCardsAvailability();
    if (window.Oeuvres) window.Oeuvres.refreshAvailability();
    window.scrollTo({ top: 0, behavior: "instant" });
    $("#main").focus();
    // Reset reading tracker for the new lesson and reflect saved depth.
    reading.lessonId = id;
    reading.samples = [];
    updateLessonReadingBar();
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

    // Mode confiance — apply persisted value on init, save on change.
    const confianceEl = $("#confiance-mode");
    if (confianceEl) {
      confianceEl.checked = window.Progress.getSetting("confiance", true) !== false;
      confianceEl.addEventListener("change", () => {
        window.Progress.setSetting("confiance", !!confianceEl.checked);
      });
    }

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
        if (window.Game) { window.Game.renderBadges(); window.Game.renderAchievementsList(); }
      } catch (err) {
        alert(err.message);
      }
    });

    $("#progress-reset").addEventListener("click", () => {
      if (confirm(window.I18N.t("resetConfirm"))) {
        window.Progress.resetAll();
        window.Progress.init();   // reseed game/cards/achievements containers
        renderToc();
        updateProgressBar();
        updateCompleteButton();
        if (window.Game) { window.Game.renderBadges(); window.Game.renderAchievementsList(); }
      }
    });
  }

  // ---------- Panels ----------

  let _savedScrollY = 0;

  function lockBodyScroll() {
    if (document.body.classList.contains("panel-open")) return;
    _savedScrollY = window.scrollY || window.pageYOffset || 0;
    document.body.classList.add("panel-open");
    document.body.style.top = `-${_savedScrollY}px`;
  }
  function unlockBodyScroll() {
    if (!document.body.classList.contains("panel-open")) return;
    document.body.classList.remove("panel-open");
    document.body.style.top = "";
    window.scrollTo(0, _savedScrollY);
  }
  // Exposed so cards.js / quest-map.js (which open their own modals
  // bypassing openPanel) can also lock the background.
  window.PanelLock = { lock: lockBodyScroll, unlock: unlockBodyScroll };

  function closeAllPanels() {
    ["#toc", "#settings", "#search", "#flashcards", "#quest-map"].forEach(sel => {
      const panel = $(sel);
      if (panel) panel.setAttribute("hidden", "");
    });
    ["#toc-toggle", "#settings-toggle", "#search-toggle"].forEach(sel => {
      const b = $(sel);
      if (b) b.setAttribute("aria-expanded", "false");
    });
    const bd = $("#panel-backdrop");
    if (bd) bd.setAttribute("hidden", "");
    unlockBodyScroll();
  }

  function openPanel(panelSel, btnSel) {
    closeAllPanels();
    $(panelSel).removeAttribute("hidden");
    if (btnSel && $(btnSel)) $(btnSel).setAttribute("aria-expanded", "true");
    // Show backdrop for side panels (TOC / settings / search). Modal panels
    // (flashcards / quest-map) are already full-screen and supply their own
    // background.
    const sidePanel = panelSel === "#toc" || panelSel === "#settings" || panelSel === "#search";
    if (sidePanel) {
      const bd = $("#panel-backdrop");
      if (bd) bd.removeAttribute("hidden");
    }
    lockBodyScroll();
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

    // Tap on the visible backdrop = close.
    const bd = $("#panel-backdrop");
    if (bd) {
      bd.addEventListener("click", closeAllPanels);
      bd.addEventListener("touchend", (e) => { e.preventDefault(); closeAllPanels(); }, { passive: false });
    }

    // Belt-and-braces: tap anywhere outside an open panel closes it. Useful
    // for the modal panels (flashcards / quest-map) that don't use the
    // backdrop. (Side panels also covered, but the backdrop catches them
    // first since it has a higher z-index than the body content.)
    document.addEventListener("pointerdown", (e) => {
      const panels = ["#toc", "#settings", "#search", "#flashcards", "#quest-map"];
      const anyOpen = panels.some(s => {
        const p = $(s);
        return p && !p.hasAttribute("hidden");
      });
      if (!anyOpen) return;
      if (e.target.closest(panels.join(","))) return;
      if (e.target.closest(
        "#toc-toggle, #settings-toggle, #search-toggle, #map-toggle, #cards-btn, #cards-review, #cards-topbar-btn, #panel-backdrop"
      )) return;
      closeAllPanels();
    }, true);

    // Escape closes any open panel.
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      const panels = ["#toc", "#settings", "#search", "#flashcards", "#quest-map"];
      const anyOpen = panels.some(s => {
        const p = $(s);
        return p && !p.hasAttribute("hidden");
      });
      if (anyOpen) closeAllPanels();
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
      refreshCardsAvailability();
    });
  }

  function wireCompleteBtn() {
    $("#complete-btn").addEventListener("click", () => {
      if (!state.currentLessonId) return;
      const wasCompleted = window.Progress.isCompleted(state.currentLessonId);
      window.Progress.markCompleted(state.currentLessonId);
      updateProgressBar();
      renderToc();
      if (!wasCompleted && window.Game) {
        window.Game.award(50, "lesson");
        window.Game.recordActivity();
        window.Game.checkAchievements();
      }
      if (window.Oeuvres) window.Oeuvres.refreshAvailability();

      // Navigate to the next lesson in the linear index if one exists.
      const idx = state.index.findIndex(e => lessonKey(e) === state.currentLessonId);
      const next = state.index[idx + 1];
      if (next) {
        location.hash = `#/${lessonKey(next)}`;
      } else {
        // Last lesson of the course — just update the button visibly.
        updateCompleteButton();
      }
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

  function openSearchResult(r) {
    if (r.kind === "card") {
      const ref = r.card._ref;
      // Navigate to first lesson of the card's chapter so the bottom card btn matches
      const lessonEntry = state.index.find(e => e.semester === ref.semester && e.chapter === ref.chapter);
      if (lessonEntry) {
        const id = lessonKey(lessonEntry);
        const sameChapter = chapterIdFromLessonId(state.currentLessonId);
        if (!sameChapter || sameChapter.chapter !== ref.chapter) {
          location.hash = `#/${id}`;
        }
        // Open the cards panel on this chapter
        setTimeout(() => {
          window.Cards.openForChapter(
            { semester: ref.semester, chapter: ref.chapter },
            lessonEntry,
            "library"
          );
        }, 80);
      }
      closeAllPanels();
      return;
    }
    location.hash = `#/${lessonKey(r.entry)}`;
    closeAllPanels();
  }

  // Lazy-loaded cross-chapter card index for search.
  async function loadAllCardsForSearch() {
    if (state.cardsForSearch) return state.cardsForSearch;
    state.cardsForSearch = [];
    const seen = new Set();
    const refs = state.index
      .map(e => ({ semester: e.semester, chapter: e.chapter, chapterTitle: e.chapterTitle }))
      .filter(r => {
        const k = `${r.semester}/${r.chapter}`;
        if (seen.has(k)) return false; seen.add(k); return true;
      });
    await Promise.all(refs.map(async ref => {
      try {
        const r = await fetch(`${CONTENT_ROOT}/${ref.semester}/${ref.chapter}/flashcards.json`);
        if (!r.ok) return;
        const data = await r.json();
        if (data && data.cards) {
          for (const c of data.cards) {
            state.cardsForSearch.push({ ...c, _ref: ref });
          }
        }
      } catch (_) { /* ignore */ }
    }));
    return state.cardsForSearch;
  }

  function scoreCard(card, tokens, lang) {
    const front = normalize(card.front?.[lang] || card.front?.fr || "");
    const back  = normalize(card.back?.[lang]  || card.back?.fr  || "");
    let score = 0;
    for (const tok of tokens) {
      if (!tok) continue;
      if (front.includes(tok)) score += 5;
      if (back.includes(tok))  score += 2;
      if (!front.includes(tok) && !back.includes(tok)) return -1;
    }
    return score;
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
        results.push({ kind: "lesson", entry, score, snippet });
      }
    }

    const cards = await loadAllCardsForSearch();
    for (const card of cards) {
      const score = scoreCard(card, tokens, lang);
      if (score > 0) {
        const front = card.front?.[lang] || card.front?.fr || "";
        const back  = card.back?.[lang]  || card.back?.fr  || "";
        results.push({ kind: "card", card, score, snippet: front + " — " + back });
      }
    }

    results.sort((a, b) => b.score - a.score);
    state.searchResults = results.slice(0, 40);
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
      const active = i === state.searchSelection ? " active" : "";
      if (r.kind === "card") {
        const ref = r.card._ref || {};
        const chTitle = localized(ref.chapterTitle, ref.chapter || "");
        const front = r.card.front?.[lang] || r.card.front?.fr || "";
        return (
          `<li class="search-result search-result--card${active}">` +
          `<a href="#/${ref.semester}/${ref.chapter}" data-idx="${i}" data-kind="card" data-card-id="${escapeHtml(r.card.id || "")}">` +
          `<div class="sr-title"><span class="sr-tag">CARTE</span> ${highlight(front, tokens)}</div>` +
          `<div class="sr-meta">${escapeHtml(chTitle)}</div>` +
          `<div class="sr-snippet">${highlight(r.snippet, tokens)}</div>` +
          `</a></li>`
        );
      }
      const id = lessonKey(r.entry);
      const title = localized(r.entry.title, r.entry.lesson);
      const chTitle = localized(r.entry.chapterTitle, r.entry.chapter);
      return (
        `<li class="search-result${active}">` +
        `<a href="#/${id}" data-idx="${i}" data-kind="lesson">` +
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
            openSearchResult(r);
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
      const idx = parseInt(a.dataset.idx, 10);
      const r = state.searchResults[idx];
      if (r && r.kind === "card") {
        e.preventDefault();
        openSearchResult(r);
        return;
      }
      // For lessons: default href navigation happens; also close panel.
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

  // ---------- Flashcards (delegates to window.Cards) ----------

  function chapterIdFromLessonId(lessonId) {
    if (!lessonId) return null;
    const parts = lessonId.split("/");
    if (parts.length < 2) return null;
    return { semester: parts[0], chapter: parts[1] };
  }

  async function refreshCardsAvailability() {
    const chapterRef = chapterIdFromLessonId(state.currentLessonId);
    const { count } = chapterRef
      ? await window.Cards.refreshAvailability(chapterRef)
      : { count: 0 };
    const btn = $("#cards-btn");
    const topbarBtn = $("#cards-topbar-btn");
    const reviewBtn = $("#cards-review");
    const hint = $("#cards-hint");
    if (btn) {
      btn.hidden = count === 0;
      if (count) btn.textContent = window.I18N.t("cardsBtn", count);
    }
    if (topbarBtn) {
      topbarBtn.hidden = count === 0;
      if (count) topbarBtn.title = `Cartes du chapitre (${count})`;
    }
    if (reviewBtn) reviewBtn.disabled = count === 0;
    if (hint) {
      hint.textContent = count > 0
        ? window.I18N.t("cardsCountHint", count)
        : window.I18N.t("cardsNoneHint");
    }
  }

  async function openCardsForCurrentChapter(mode = "library") {
    const chapterRef = chapterIdFromLessonId(state.currentLessonId);
    if (!chapterRef) return;
    const lessonEntry = findEntryById(state.currentLessonId);
    await window.Cards.openForChapter(chapterRef, lessonEntry, mode);
    window.Cards.refreshDueCount(() => state.index.map(e => ({ semester: e.semester, chapter: e.chapter })));
  }

  function wireCards() {
    window.Cards.init();
    const cardsBtn = $("#cards-btn");
    const topbarBtn = $("#cards-topbar-btn");
    const reviewBtn = $("#cards-review");
    if (cardsBtn)   cardsBtn.addEventListener("click",   () => openCardsForCurrentChapter("library"));
    if (topbarBtn)  topbarBtn.addEventListener("click",  () => openCardsForCurrentChapter("library"));
    if (reviewBtn)  reviewBtn.addEventListener("click",  () => openCardsForCurrentChapter("library"));
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
    wireRestartLessonBtn();
    wireOeuvreBtn();
    wireSearch();
    wireCards();

    state.index = await loadIndex();
    window.AppIndex = state.index;   // exposed for cards.js daily mode + others

    // Lore / compagnonnage data — best effort, never blocks boot.
    try {
      const r = await fetch("assets/data/compagnonnage.json");
      if (r.ok) {
        const data = await r.json();
        window.Compagnonnage = data;
        if (window.Game && data.ranks_compagnonnage) {
          window.Game.setRanks(data.ranks_compagnonnage);
        }
      }
    } catch (_) { /* lore is optional */ }

    if (window.Game) window.Game.init({ getIndex: () => state.index });
    if (window.QuestMap) window.QuestMap.init({ getIndex: () => state.index });
    if (window.Oeuvres) window.Oeuvres.init({ getIndex: () => state.index });
    // Expose current lesson id for oeuvres.js
    window.AppCurrentLessonId = () => state.currentLessonId;
    renderToc();
    updateProgressBar();
    await renderLesson();
    startReadingTracker();

    // Map button
    const mapBtn = $("#map-toggle");
    if (mapBtn) mapBtn.addEventListener("click", () => {
      if (window.QuestMap) window.QuestMap.toggle();
    });
    const mapClose = $("#quest-map-close");
    if (mapClose) mapClose.addEventListener("click", () => {
      if (window.QuestMap) window.QuestMap.close();
    });

    window.addEventListener("hashchange", renderLesson);
  }

  document.addEventListener("DOMContentLoaded", main);
})();
