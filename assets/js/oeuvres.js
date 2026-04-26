/* Œuvres de compagnon — chapter-end synthesis exercises.
   Public API:
     window.Oeuvres.init({ getIndex })
     window.Oeuvres.refreshAvailability()  -> updates the lesson-footer button
     window.Oeuvres.openForCurrentChapter()
*/
(function () {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const O = {
    indexProvider: null,
    data: null,           // loaded oeuvres.json
    currentChapter: null, // set by refreshAvailability
  };

  function localized(obj, fb = "") {
    if (!obj || typeof obj !== "object") return fb;
    const lang = (window.I18N && window.I18N.current) || "fr";
    return obj[lang] || obj.fr || obj.en || fb;
  }

  async function loadData() {
    if (O.data) return O.data;
    try {
      const r = await fetch("assets/data/oeuvres.json");
      if (!r.ok) return null;
      O.data = await r.json();
    } catch (_) { O.data = null; }
    return O.data;
  }

  // Eligibility: chapter completely finished + ≥80 % of its cards owned.
  // Cards data comes from the chapter's flashcards.json.
  async function isEligible(chapterRef) {
    if (!chapterRef) return false;
    const idx = O.indexProvider ? O.indexProvider() : [];
    const lessons = idx.filter(e =>
      e.semester === chapterRef.semester && e.chapter === chapterRef.chapter);
    const allDone = lessons.length > 0 && lessons.every(e =>
      window.Progress.isCompleted(`${e.semester}/${e.chapter}/${e.lesson}`));
    if (!allDone) return false;

    // 80 % of cards owned
    try {
      const r = await fetch(`content/${chapterRef.semester}/${chapterRef.chapter}/flashcards.json`);
      if (!r.ok) return allDone; // no cards → just need lessons done
      const data = await r.json();
      const cards = data.cards || [];
      if (!cards.length) return allDone;
      const owned = cards.filter(c =>
        (window.Progress.getCardState(c.id).knew || 0) > 0).length;
      return (owned / cards.length) >= 0.8;
    } catch (_) {
      return allDone;
    }
  }

  function isCompleted(chapterRef) {
    if (!chapterRef) return false;
    const oeuvres = (window.Progress._data && window.Progress._data.oeuvres) || {};
    return !!oeuvres[chapterRef.chapter];
  }

  function markCompleted(chapterRef, grade) {
    if (!chapterRef) return;
    if (!window.Progress._data.oeuvres) window.Progress._data.oeuvres = {};
    window.Progress._data.oeuvres[chapterRef.chapter] = {
      grade,
      at: new Date().toISOString(),
    };
    window.Progress.setSetting("__oeuvres_persist", Date.now());
    // Force a save via existing public API path — setSetting saves.
  }

  // Show / hide / re-label the "Œuvre de compagnon" button in the lesson
  // footer, based on the current chapter's eligibility.
  async function refreshAvailability() {
    const btn = $("#oeuvre-btn");
    if (!btn) return;
    const cur = window.AppCurrentLessonId
      ? window.AppCurrentLessonId()
      : null;
    if (!cur) { btn.hidden = true; return; }
    const parts = cur.split("/");
    const ref = { semester: parts[0], chapter: parts[1] };
    O.currentChapter = ref;
    const data = await loadData();
    if (!data || !data.oeuvres || !data.oeuvres[ref.chapter]) { btn.hidden = true; return; }
    const eligible = await isEligible(ref);
    const done = isCompleted(ref);
    btn.hidden = false;
    if (done) {
      btn.textContent = "✦ Œuvre rendue ✓";
      btn.disabled = true;
      btn.classList.add("oeuvre-done");
    } else if (eligible) {
      btn.textContent = "✦ Présenter ton œuvre au maître";
      btn.disabled = false;
      btn.classList.remove("oeuvre-done");
      btn.classList.add("oeuvre-ready");
    } else {
      btn.textContent = "✦ Œuvre verrouillée — termine le chapitre & 80 % des marques";
      btn.disabled = true;
      btn.classList.remove("oeuvre-done", "oeuvre-ready");
    }
  }

  // ----- Modal panel -----

  function ensurePanel() {
    let p = $("#oeuvre-panel");
    if (p) return p;
    p = document.createElement("aside");
    p.id = "oeuvre-panel";
    p.className = "oeuvre-panel";
    p.setAttribute("aria-label", "Œuvre de compagnon");
    p.hidden = true;
    p.innerHTML = `
      <div class="oeuvre-shell">
        <header class="oeuvre-bar">
          <h2>Œuvre de compagnon</h2>
          <button id="oeuvre-close" class="icon-btn" aria-label="Fermer">
            <span aria-hidden="true">×</span>
          </button>
        </header>
        <div class="oeuvre-view"></div>
      </div>
    `;
    document.body.appendChild(p);
    p.querySelector("#oeuvre-close").addEventListener("click", close);
    return p;
  }

  async function openForCurrentChapter() {
    const ref = O.currentChapter;
    if (!ref) return;
    const data = await loadData();
    if (!data || !data.oeuvres || !data.oeuvres[ref.chapter]) return;
    const oeuvre = data.oeuvres[ref.chapter];
    const maitre = (window.Compagnonnage && window.Compagnonnage.maitres &&
                    window.Compagnonnage.maitres[ref.chapter]) || null;
    const panel = ensurePanel();
    const view = panel.querySelector(".oeuvre-view");

    const promptHtml = window.marked
      ? window.marked.parse(localized(oeuvre.prompt, ""))
      : `<p>${localized(oeuvre.prompt, "")}</p>`;

    view.innerHTML = `
      <div class="oeuvre-head">
        ${maitre ? `<p class="oeuvre-maitre">À toi, futur compagnon. — ${escapeHtml(localized(maitre.name, ""))}, ${escapeHtml(maitre.ville)}</p>` : ""}
        <h3 class="oeuvre-title">${escapeHtml(localized(oeuvre.title, ""))}</h3>
      </div>
      <div class="oeuvre-prompt">${promptHtml}</div>
      <hr>
      <div class="oeuvre-grade">
        <p class="oeuvre-grade-q">As-tu rendu une œuvre dont tu es satisfait ?</p>
        <p class="oeuvre-grade-h">Sois honnête. Personne ne corrige à ta place — c'est l'honnêteté envers toi-même qui te fait progresser.</p>
        <div class="oeuvre-grade-row">
          <button class="rate rate-bad"  data-grade="incomplete">Pas encore</button>
          <button class="rate"           data-grade="rough">J'ai essayé, c'est imparfait</button>
          <button class="rate rate-good" data-grade="solid">Oui, je tiens debout</button>
        </div>
      </div>
    `;
    panel.removeAttribute("hidden");
    if (window.PanelLock) window.PanelLock.lock();

    view.querySelectorAll(".rate").forEach(b => {
      b.addEventListener("click", () => {
        const grade = b.dataset.grade;
        if (grade === "incomplete") { close(); return; }
        // Mark + reward
        markCompleted(ref, grade);
        const xp = grade === "solid" ? oeuvre.rewardXp : Math.round(oeuvre.rewardXp * 0.6);
        if (window.Game) {
          window.Game.award(xp, "oeuvre");
          window.Game.toast(
            grade === "solid" ? "Œuvre acceptée — marques dorées !" : "Œuvre rendue — bon courage pour la suivante.",
            { icon: "✦", kind: "achv", sub: `+${xp} XP` }
          );
          window.Game.checkAchievements();
        }
        // Make every owned card in this chapter foil-grade by bumping mastery to 5
        // for cards already owned (they've earned it by passing the synthèse).
        applyChapterGoldenSeal(ref);
        close();
        // Rerender card / progress UI so the gold takes effect immediately.
        if (window.Cards && typeof window.Cards.setMode === "function") {
          // no-op: Cards will refresh next time it's opened
        }
        refreshAvailability();
      });
    });
  }

  async function applyChapterGoldenSeal(ref) {
    try {
      const r = await fetch(`content/${ref.semester}/${ref.chapter}/flashcards.json`);
      if (!r.ok) return;
      const data = await r.json();
      for (const c of (data.cards || [])) {
        const cs = window.Progress.getCardState(c.id);
        if ((cs.knew || 0) > 0) {
          // Owned card — promote mastery to 5 (foil)
          window.Progress.setCardState(c.id, { level: 5 });
        }
      }
    } catch (_) { /* tolerate offline */ }
  }

  function close() {
    const p = $("#oeuvre-panel");
    if (p) p.setAttribute("hidden", "");
    if (window.PanelLock) window.PanelLock.unlock();
  }

  function escapeHtml(s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function init({ getIndex } = {}) {
    O.indexProvider = getIndex || (() => []);
  }

  window.Oeuvres = {
    init,
    refreshAvailability,
    openForCurrentChapter,
    isEligible,
    isCompleted,
  };
})();
