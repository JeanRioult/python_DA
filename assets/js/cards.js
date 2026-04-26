/* Collectible flashcards — MTG-inspired frame, procedural art, deck modes.
   Public API:
     window.Cards.init()
     window.Cards.openForChapter(chapterRef, lessonEntry, mode = "library")
     window.Cards.refreshAvailability(chapterRef) -> Promise<{count}>
     window.Cards.close()
*/
(function () {
  "use strict";

  const CONTENT_ROOT = "content";

  // Chapter color identity (MTG-style "mana" identity)
  const CHAPTER_THEMES = {
    "chapter-01-apprendre-a-apprendre":      { hue:  48, glyph: "✦", type: "Discipline" },
    "chapter-02-qu-est-ce-qu-une-donnee":    { hue: 215, glyph: "◈", type: "Donnée" },
    "chapter-03-logique-raisonnement":       { hue: 270, glyph: "✶", type: "Logique" },
    "chapter-04-mathematiques-fondamentales":{ hue:   8, glyph: "✺", type: "Mathématiques" },
    "chapter-05-premiers-pas-python":        { hue: 145, glyph: "❋", type: "Python" },
    "chapter-06-controle-du-flux":           { hue:  28, glyph: "❖", type: "Algorithme" },
    "chapter-07-tableurs":                   { hue: 175, glyph: "▦", type: "Tableur" },
    "chapter-08-ecrire-argumenter":          { hue: 320, glyph: "✎", type: "Rhétorique" },
    "chapter-09-methode-scientifique":       { hue: 195, glyph: "⚛", type: "Science" },
  };
  const TYPE_EN = {
    "Discipline":"Discipline","Donnée":"Data","Logique":"Logic","Mathématiques":"Mathematics",
    "Python":"Python","Algorithme":"Algorithm","Tableur":"Spreadsheet","Rhétorique":"Rhetoric","Science":"Science",
  };
  const DEFAULT_THEME = { hue: 215, glyph: "◆", type: "Concept" };

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function localized(obj, fb = "") {
    if (!obj || typeof obj !== "object") return fb;
    const lang = window.I18N.current;
    return obj[lang] || obj.fr || obj.en || fb;
  }

  // Tiny seeded PRNG (Mulberry32) so card art is deterministic per id.
  function strHash(str) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }
  function mulberry32(seed) {
    let s = seed >>> 0;
    return function () {
      s = (s + 0x6D2B79F5) >>> 0;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // ----- Procedural SVG art -----
  // Five styles, picked by hash. Uses card hue (light variants).
  const ART_STYLES = ["constellation", "rings", "triangulated", "hexgrid", "waves"];

  function svgArt(card, theme) {
    const seed = strHash(card.id || "x");
    const rand = mulberry32(seed);
    const style = ART_STYLES[Math.floor(rand() * ART_STYLES.length)];
    const w = 200, h = 130;
    const hue = theme.hue;
    const stroke = `hsl(${hue}, 55%, 22%)`;
    const fillA  = `hsl(${hue}, 50%, 38%)`;
    const fillB  = `hsl(${hue}, 60%, 60%)`;
    const accent = `hsl(${hue}, 70%, 75%)`;

    let body = "";
    if (style === "constellation") {
      const n = 7 + Math.floor(rand() * 5);
      const pts = [];
      for (let i = 0; i < n; i++) pts.push([rand() * w, rand() * h]);
      // edges between near pairs
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i][0] - pts[j][0], dy = pts[i][1] - pts[j][1];
          if (Math.sqrt(dx*dx + dy*dy) < 60) {
            body += `<line x1="${pts[i][0]}" y1="${pts[i][1]}" x2="${pts[j][0]}" y2="${pts[j][1]}" stroke="${stroke}" stroke-opacity="0.35" stroke-width="0.8"/>`;
          }
        }
      }
      pts.forEach((p, i) => {
        const r = 1.5 + (i % 3) * 1.2;
        body += `<circle cx="${p[0]}" cy="${p[1]}" r="${r}" fill="${i === 0 ? accent : fillA}" />`;
      });
      body += `<circle cx="${pts[0][0]}" cy="${pts[0][1]}" r="6" fill="none" stroke="${accent}" stroke-opacity="0.5"/>`;
    } else if (style === "rings") {
      const cx = 60 + rand() * 80, cy = 40 + rand() * 50;
      for (let i = 6; i >= 1; i--) {
        const r = 8 + i * 9;
        body += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${stroke}" stroke-opacity="${0.15 + i * 0.06}" stroke-width="${i % 2 ? 0.7 : 1.2}"/>`;
      }
      body += `<circle cx="${cx}" cy="${cy}" r="6" fill="${accent}"/>`;
      body += `<circle cx="${cx + 25}" cy="${cy - 15}" r="2.5" fill="${fillB}"/>`;
    } else if (style === "triangulated") {
      // Random triangle mosaic
      for (let i = 0; i < 9; i++) {
        const x = rand() * w, y = rand() * h;
        const s = 18 + rand() * 26;
        const a = rand() * Math.PI * 2;
        const p = [
          [x, y],
          [x + Math.cos(a) * s, y + Math.sin(a) * s],
          [x + Math.cos(a + 2.1) * s, y + Math.sin(a + 2.1) * s],
        ];
        const f = i === 0 ? accent : (rand() > 0.5 ? fillA : fillB);
        body += `<polygon points="${p.map(p=>p.join(",")).join(" ")}" fill="${f}" fill-opacity="${0.3 + rand() * 0.5}" stroke="${stroke}" stroke-opacity="0.3" stroke-width="0.6"/>`;
      }
    } else if (style === "hexgrid") {
      const r = 11;
      const dx = r * Math.sqrt(3);
      const dy = r * 1.5;
      const star = 1 + Math.floor(rand() * 6);
      let n = 0;
      for (let row = 0; row * dy < h + 10; row++) {
        for (let col = 0; col * dx < w + 10; col++) {
          const cx = col * dx + (row % 2 ? dx / 2 : 0) + 6;
          const cy = row * dy + 8;
          const pts = [];
          for (let k = 0; k < 6; k++) {
            const a = Math.PI / 6 + k * Math.PI / 3;
            pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
          }
          const isStar = (n === star);
          const fill = isStar ? accent : (rand() > 0.65 ? fillB : "transparent");
          body += `<polygon points="${pts.map(p=>p.join(",")).join(" ")}" fill="${fill}" fill-opacity="${isStar ? 0.95 : 0.45}" stroke="${stroke}" stroke-opacity="0.4" stroke-width="0.7"/>`;
          n++;
        }
      }
    } else if (style === "waves") {
      for (let layer = 0; layer < 5; layer++) {
        const yMid = 30 + layer * 18;
        const amp = 8 + rand() * 8;
        const freq = 0.04 + rand() * 0.02;
        const phase = rand() * Math.PI * 2;
        let d = `M 0 ${yMid + Math.sin(phase) * amp}`;
        for (let x = 2; x <= w; x += 4) {
          d += ` L ${x} ${yMid + Math.sin(phase + x * freq) * amp}`;
        }
        d += ` L ${w} ${h} L 0 ${h} Z`;
        const f = layer === 2 ? accent : (layer % 2 ? fillA : fillB);
        body += `<path d="${d}" fill="${f}" fill-opacity="${0.18 + layer * 0.07}"/>`;
      }
    }

    // Decorative corner glyph
    body += `<text x="${w - 12}" y="${h - 8}" font-size="14" fill="${stroke}" fill-opacity="0.35" text-anchor="end">${theme.glyph}</text>`;

    return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
  }

  // ----- Card rendering -----
  function themeFor(chapterId) {
    return CHAPTER_THEMES[chapterId] || DEFAULT_THEME;
  }
  function typeText(theme) {
    return window.I18N.current === "en" ? (TYPE_EN[theme.type] || theme.type) : theme.type;
  }
  function masteryStars(level, max = 5) {
    let out = "";
    for (let i = 0; i < max; i++) {
      out += i < level
        ? `<span class="star-on">★</span>`
        : `<span class="star-off">★</span>`;
    }
    return out;
  }
  function bodyText(side) {
    // Render markdown if it looks like markdown, else plain text.
    const raw = String(side || "");
    if (window.marked && /[*_`#[]/.test(raw)) {
      return window.marked.parseInline(raw);
    }
    return escapeHtml(raw);
  }
  function makeCardHtml(card, chapterRef, side, opts = {}) {
    const theme = themeFor(chapterRef.chapter);
    const sideText = side === "back"
      ? localized(card.back, "")
      : localized(card.front, "");
    const collector = card.id || "—";
    const chNum = (collector.match(/c(\d+)/i) || [])[1] || "?";
    const cardNum = (collector.match(/f(\d+)/i) || [])[1] || "?";
    const mastery = window.Progress.getCardState(card.id).level || 0;
    const sizeClass = opts.large ? "mtg-card--large" : (opts.mini ? "mtg-card--mini" : "");
    const foil = mastery >= 4 ? "mtg-card--foil" : "";
    const titleSrc = card.title
      ? localized(card.title, "")
      : (side === "back" ? "Réponse" : (theme.type));
    const title = (window.I18N.current === "en" && side === "back") ? "Answer" : titleSrc;
    return `
      <div class="mtg-card ${sizeClass} ${foil}" data-card-id="${escapeHtml(card.id || "")}"
           data-side="${side}"
           data-mastery="${mastery}"
           style="--c-hue:${theme.hue};">
        <div class="mtg-frame">
          <div class="mtg-title-bar">
            <span class="mtg-title">${escapeHtml(title)}</span>
            <span class="mtg-pip" aria-hidden="true">${theme.glyph}</span>
          </div>
          <div class="mtg-art">${svgArt(card, theme)}</div>
          <div class="mtg-type">
            <span class="glyph">${theme.glyph}</span>
            <span>${escapeHtml(typeText(theme))} · Ch.${chNum}</span>
          </div>
          <div class="mtg-text">${bodyText(sideText)}</div>
          <div class="mtg-footer">
            <span class="mtg-collector">DA · ${escapeHtml(collector)}</span>
            <span class="mtg-mastery" title="Maîtrise ${mastery}/5">${masteryStars(mastery)}</span>
          </div>
        </div>
      </div>
    `;
  }
  function makeFacedownHtml(theme = DEFAULT_THEME, extraClass = "") {
    return `
      <div class="mtg-card mtg-card--facedown ${extraClass}" aria-hidden="true">
        <div class="mtg-frame">
          <span class="mtg-back-glyph">${theme.glyph}</span>
        </div>
      </div>
    `;
  }
  function makeFlipperHtml(card, chapterRef, flipped) {
    const label = window.I18N.current === "en"
      ? "Card. Press Space or Enter to flip."
      : "Carte. Appuie sur Espace ou Entrée pour retourner.";
    return `
      <div class="mtg-card-flipper" data-flipped="${flipped ? "true" : "false"}"
           data-card-id="${escapeHtml(card.id || "")}"
           role="button" tabindex="0"
           aria-pressed="${flipped ? "true" : "false"}"
           aria-label="${label}">
        <div class="mtg-card-flipper-inner">
          ${makeCardHtml(card, chapterRef, "front", { large: true })}
          <div class="mtg-card--back-face" style="position:absolute;inset:0;">
            ${makeCardHtml(card, chapterRef, "back", { large: true })}
          </div>
        </div>
      </div>
    `;
  }

  // ----- Module state -----
  const M = {
    chapterRef: null,
    chapterTitle: "",
    cards: [],            // active deck (chapter or cross-chapter for daily)
    libraryCards: [],     // the chapter's own deck (for restoring after daily)
    libraryChapterRef: null,
    libraryChapterTitle: "",
    mode: "library",      // "library" | "inspect" | "practice" | "daily"
    inspectIdx: 0,
    inspectFlipped: false,
    // Practice
    queue: [],            // ordered card indices for the session
    qIdx: 0,
    flipped: false,
    streak: 0,
    sessionKnew: 0,
    sessionMissed: 0,
  };

  async function loadFlashcardsFor(ref) {
    if (!ref) return null;
    const url = `${CONTENT_ROOT}/${ref.semester}/${ref.chapter}/flashcards.json`;
    try {
      const r = await fetch(url);
      if (!r.ok) return null;
      return await r.json();
    } catch (_) { return null; }
  }

  async function refreshAvailability(ref) {
    const data = await loadFlashcardsFor(ref);
    return { count: data?.cards?.length || 0 };
  }

  async function openForChapter(ref, lessonEntry, mode = "library") {
    const data = await loadFlashcardsFor(ref);
    if (!data || !data.cards || !data.cards.length) return false;
    M.chapterRef = ref;
    M.cards = data.cards;
    M.libraryCards = data.cards;
    M.libraryChapterRef = ref;
    M.libraryChapterTitle = lessonEntry ? localized(lessonEntry.chapterTitle, "") : "";
    M.chapterTitle = M.libraryChapterTitle;
    M.mode = mode;
    M.inspectIdx = 0;
    M.inspectFlipped = false;
    setMode(mode);
    showPanel();
    return true;
  }

  function showPanel() {
    const panel = $("#flashcards");
    if (!panel) return;
    panel.removeAttribute("hidden");
  }
  function close() {
    const panel = $("#flashcards");
    if (panel) panel.setAttribute("hidden", "");
  }

  function setMode(mode) {
    M.mode = mode;
    $$("#flashcards .cards-tab[data-mode]").forEach(b => {
      b.setAttribute("aria-selected", b.dataset.mode === mode ? "true" : "false");
    });
    // Switching out of daily restores the chapter deck.
    if (mode !== "daily" && M.libraryCards.length) {
      M.cards = M.libraryCards;
      M.chapterRef = M.libraryChapterRef;
      M.chapterTitle = M.libraryChapterTitle;
    }
    if (mode === "library") renderLibrary();
    else if (mode === "inspect") renderInspect();
    else if (mode === "practice") startPractice();
    else if (mode === "daily") startDaily();
    updateChrome();
  }

  function updateChrome() {
    const label = $("#cards-chapter-label");
    const stats = $("#cards-stats");
    if (label) label.textContent = M.chapterTitle || "";
    if (stats) {
      const total = M.cards.length;
      const mastered = M.cards.filter(c => (window.Progress.getCardState(c.id).level || 0) >= 4).length;
      const seen = M.cards.filter(c => (window.Progress.getCardState(c.id).seen || 0) > 0).length;
      stats.textContent = `${seen}/${total} vues · ${mastered} maîtrisée${mastered > 1 ? "s" : ""}`;
    }
  }

  // ----- Library mode -----
  function renderLibrary() {
    const view = $("#cards-view");
    if (!view) return;
    const html = `
      <div class="cards-grid">
        ${M.cards.map((c, i) => `
          <a href="#" class="cards-grid-item" data-idx="${i}" aria-label="Inspecter la carte">
            ${makeCardHtml(c, M.chapterRef, "front", { mini: true })}
          </a>
        `).join("")}
      </div>
    `;
    view.innerHTML = html;
    view.querySelectorAll(".cards-grid-item").forEach(a => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        M.inspectIdx = parseInt(a.dataset.idx, 10) || 0;
        M.inspectFlipped = false;
        setMode("inspect");
      });
    });
  }

  // ----- Inspect mode -----
  function renderInspect() {
    const view = $("#cards-view");
    if (!view) return;
    const card = M.cards[M.inspectIdx];
    if (!card) { setMode("library"); return; }
    view.innerHTML = `
      <div class="cards-stage">
        <button class="cards-nav cards-nav-prev" aria-label="Carte précédente" ${M.inspectIdx === 0 ? "disabled" : ""}>←</button>
        <div class="cards-stage-center">
          ${makeFlipperHtml(card, M.chapterRef, M.inspectFlipped)}
        </div>
        <button class="cards-nav cards-nav-next" aria-label="Carte suivante" ${M.inspectIdx === M.cards.length - 1 ? "disabled" : ""}>→</button>
      </div>
      <div class="cards-controls">
        <button class="pill-btn cards-back-to-lib">← Collection</button>
        <button class="cta-flip">${M.inspectFlipped ? "Cacher la réponse" : "Montrer la réponse"}</button>
        <button class="cta-practice">Lancer une pratique</button>
      </div>
      <p class="practice-hud" style="margin:0;">Carte ${M.inspectIdx + 1} / ${M.cards.length}</p>
    `;
    const flipper = view.querySelector(".mtg-card-flipper");
    const flipBtn = view.querySelector(".cta-flip");
    const flip = () => {
      M.inspectFlipped = !M.inspectFlipped;
      flipper.dataset.flipped = M.inspectFlipped ? "true" : "false";
      flipper.setAttribute("aria-pressed", M.inspectFlipped ? "true" : "false");
      flipBtn.textContent = M.inspectFlipped
        ? (window.I18N.current === "en" ? "Hide answer" : "Cacher la réponse")
        : (window.I18N.current === "en" ? "Show answer" : "Montrer la réponse");
    };
    flipper.addEventListener("click", flip);
    flipper.addEventListener("keydown", (e) => {
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); flip(); }
      else if (e.key === "ArrowLeft") {
        if (M.inspectIdx > 0) { M.inspectIdx--; M.inspectFlipped = false; renderInspect(); }
      } else if (e.key === "ArrowRight") {
        if (M.inspectIdx < M.cards.length - 1) { M.inspectIdx++; M.inspectFlipped = false; renderInspect(); }
      }
    });
    flipBtn.addEventListener("click", flip);
    flipper.focus();
    view.querySelector(".cards-nav-prev").addEventListener("click", () => {
      if (M.inspectIdx > 0) { M.inspectIdx--; M.inspectFlipped = false; renderInspect(); }
    });
    view.querySelector(".cards-nav-next").addEventListener("click", () => {
      if (M.inspectIdx < M.cards.length - 1) { M.inspectIdx++; M.inspectFlipped = false; renderInspect(); }
    });
    view.querySelector(".cards-back-to-lib").addEventListener("click", () => setMode("library"));
    view.querySelector(".cta-practice").addEventListener("click", () => setMode("practice"));
  }

  // ----- Practice mode -----
  function buildQueue() {
    // Weight cards by (5 - mastery + 1) so unknown cards come up more.
    const weighted = M.cards.map((c, idx) => {
      const lvl = window.Progress.getCardState(c.id).level || 0;
      return { idx, w: 6 - lvl };
    });
    // Weighted shuffle
    const out = [];
    const pool = weighted.slice();
    while (pool.length) {
      const total = pool.reduce((s, x) => s + x.w, 0);
      let pick = Math.random() * total;
      for (let i = 0; i < pool.length; i++) {
        pick -= pool[i].w;
        if (pick <= 0) {
          out.push(pool[i].idx);
          pool.splice(i, 1);
          break;
        }
      }
    }
    return out;
  }

  function startPractice() {
    M.queue = buildQueue();
    M.qIdx = 0;
    M.flipped = false;
    M.streak = 0;
    M.sessionKnew = 0;
    M.sessionMissed = 0;
    renderPractice();
  }

  function renderPractice() {
    const view = $("#cards-view");
    if (!view) return;
    if (M.qIdx >= M.queue.length) return renderSummary();
    const card = M.cards[M.queue[M.qIdx]];
    if (!card) return renderSummary();

    const remaining = M.queue.length - M.qIdx - 1;
    const back1 = remaining >= 1 ? makeFacedownHtml(themeFor(M.chapterRef.chapter), "deck-back-1") : "";
    const back2 = remaining >= 2 ? makeFacedownHtml(themeFor(M.chapterRef.chapter), "deck-back-2") : "";
    const back3 = remaining >= 3 ? makeFacedownHtml(themeFor(M.chapterRef.chapter), "deck-back-3") : "";

    view.innerHTML = `
      <div class="practice-hud">
        <span class="hud-progress">Carte ${M.qIdx + 1} / ${M.queue.length}</span>
        <span class="hud-streak">Série : <strong>${M.streak}</strong></span>
        <span class="hud-score">✓ ${M.sessionKnew} · ✗ ${M.sessionMissed}</span>
      </div>
      <div class="cards-stage">
        <span></span>
        <div class="cards-stage-center">
          <div class="deck-stack">
            ${back3}${back2}${back1}
            ${makeFlipperHtml(card, M.chapterRef, M.flipped)}
          </div>
        </div>
        <span></span>
      </div>
      <div class="cards-controls">
        <button class="pill-btn cards-back-to-lib">← Collection</button>
        <button class="cta-flip" ${M.flipped ? "hidden" : ""}>Montrer la réponse</button>
      </div>
      <div class="cards-rate" ${M.flipped ? "" : "hidden"}>
        <button class="rate rate-bad">À revoir</button>
        <button class="rate rate-good">Je savais !</button>
      </div>
    `;
    wirePracticeCard(view);
  }

  // Shared: wire up the practice/daily flipper + rate buttons + focus.
  function wirePracticeCard(view) {
    const flipper = view.querySelector(".mtg-card-flipper");
    if (!flipper) return;
    flipper.classList.add("animate-draw");
    const flipBtn = view.querySelector(".cta-flip");
    const reveal = () => {
      M.flipped = true;
      flipper.dataset.flipped = "true";
      flipper.setAttribute("aria-pressed", "true");
      const ctrls = view.querySelector(".cards-controls .cta-flip");
      if (ctrls) ctrls.hidden = true;
      const rateRow = view.querySelector(".cards-rate");
      if (rateRow) rateRow.hidden = false;
      const goodBtn = view.querySelector(".rate-good");
      if (goodBtn) goodBtn.focus();
    };
    flipper.addEventListener("click", () => { if (!M.flipped) reveal(); });
    flipper.addEventListener("keydown", (e) => {
      if ((e.key === " " || e.key === "Enter") && !M.flipped) {
        e.preventDefault(); reveal();
      }
    });
    if (flipBtn) flipBtn.addEventListener("click", reveal);
    view.querySelector(".cards-back-to-lib").addEventListener("click", () => setMode("library"));
    const rateBad = view.querySelector(".rate-bad");
    const rateGood = view.querySelector(".rate-good");
    if (rateBad) rateBad.addEventListener("click", () => rate(false));
    if (rateGood) rateGood.addEventListener("click", () => rate(true));

    view.tabIndex = -1;
    flipper.focus();
  }
  function practiceKeys(e) {
    if (M.mode !== "practice" && M.mode !== "daily") return;
    const panel = $("#flashcards");
    if (!panel || panel.hasAttribute("hidden")) return;
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      const flipper = $("#cards-view .mtg-card-flipper");
      if (flipper && flipper.dataset.flipped !== "true") {
        flipper.click();
      }
    } else if ((e.key === "1" || e.key === "j") && M.flipped) {
      rate(false);
    } else if ((e.key === "2" || e.key === "k") && M.flipped) {
      rate(true);
    }
  }
  function rate(knewIt) {
    const card = M.cards[M.queue[M.qIdx]];
    if (!card) return;
    const before = window.Progress.getCardState(card.id);
    const after = window.Progress.rateCard(card.id, knewIt);
    if (window.Game) {
      if (knewIt) {
        window.Game.award(5, "card-knew");
        if ((before.level || 0) < 5 && after.level === 5) {
          window.Game.award(25, "card-mastered");
        }
      }
      window.Game.recordActivity();
      M.bestStreak = Math.max(M.bestStreak || 0, M.streak + (knewIt ? 1 : 0));
      window.Game.checkAchievements({ bestStreak: M.bestStreak });
    }
    if (knewIt) {
      M.streak += 1;
      M.sessionKnew += 1;
    } else {
      M.streak = 0;
      M.sessionMissed += 1;
      // Re-insert this card a few cards later so it comes back.
      const reinsertAt = Math.min(M.queue.length, M.qIdx + 4);
      M.queue.splice(reinsertAt, 0, M.queue[M.qIdx]);
    }
    M.qIdx += 1;
    M.flipped = false;
    updateChrome();
    if (M.mode === "daily") renderDaily();
    else renderPractice();
  }

  function renderSummary() {
    const view = $("#cards-view");
    if (!view) return;
    const total = M.sessionKnew + M.sessionMissed || 1;
    const pct = Math.round((M.sessionKnew / total) * 100);
    const grade = pct >= 90 ? "🏆" : pct >= 70 ? "🥈" : pct >= 50 ? "🥉" : "🌱";
    view.innerHTML = `
      <div class="practice-summary">
        <h3>Session terminée</h3>
        <div class="grade">${grade}</div>
        <p class="stats">${M.sessionKnew} sues · ${M.sessionMissed} à revoir · meilleure série ${M.streak}</p>
        <div class="cards-controls" style="justify-content:center;">
          <button class="pill-btn cards-back-to-lib">← Collection</button>
          <button class="cta-practice">Rejouer</button>
        </div>
      </div>
    `;
    view.querySelector(".cards-back-to-lib").addEventListener("click", () => setMode("library"));
    view.querySelector(".cta-practice").addEventListener("click", () => startPractice());
  }

  // ----- Daily review (cross-chapter SR) -----

  // Cache of all chapters' cards so we don't refetch each open.
  const dailyCache = { byChapter: {}, all: [] };

  async function loadAllCards(getChapters) {
    if (dailyCache.all.length) return dailyCache.all;
    const chapters = getChapters ? getChapters() : [];
    const seen = new Set();
    const refs = chapters.filter(r => {
      const k = `${r.semester}/${r.chapter}`;
      if (seen.has(k)) return false;
      seen.add(k); return true;
    });
    const all = [];
    await Promise.all(refs.map(async ref => {
      const data = await loadFlashcardsFor(ref);
      if (data && data.cards) {
        const tagged = data.cards.map(c => ({ ...c, _ref: ref }));
        dailyCache.byChapter[`${ref.semester}/${ref.chapter}`] = tagged;
        all.push(...tagged);
      }
    }));
    dailyCache.all = all;
    return all;
  }

  function dueCardsFromList(cards, now = new Date()) {
    return cards.filter(c => window.Progress.isCardDue(c.id, now));
  }

  async function refreshDueCount(getChapters) {
    const all = await loadAllCards(getChapters);
    const due = dueCardsFromList(all);
    const tag = $("#cards-daily-count");
    if (tag) {
      tag.textContent = String(due.length);
      tag.hidden = due.length === 0;
    }
    return due.length;
  }

  let dailyChapterRef = null;     // for the currently-rated card during daily

  async function startDaily() {
    const view = $("#cards-view");
    if (!view) return;
    view.innerHTML = `<p class="loading">Préparation de la révision…</p>`;
    const all = await loadAllCards(() =>
      (window.AppIndex || []).map(e => ({ semester: e.semester, chapter: e.chapter }))
    );
    const due = dueCardsFromList(all);
    if (!due.length) {
      view.innerHTML = `
        <div class="practice-summary">
          <h3>Tout est à jour</h3>
          <div class="grade">🌿</div>
          <p class="stats">Aucune carte n'est due pour révision aujourd'hui. Reviens demain.</p>
          <div class="cards-controls" style="justify-content:center;">
            <button class="pill-btn cards-back-to-lib">← Collection</button>
          </div>
        </div>
      `;
      view.querySelector(".cards-back-to-lib").addEventListener("click", () => setMode("library"));
      return;
    }
    // Use a synthetic deck: cards is the due list, queue is shuffled indices.
    M.cards = due;
    M.queue = [];
    const idxs = due.map((_, i) => i);
    while (idxs.length) {
      const j = Math.floor(Math.random() * idxs.length);
      M.queue.push(idxs[j]);
      idxs.splice(j, 1);
    }
    M.qIdx = 0;
    M.flipped = false;
    M.streak = 0;
    M.sessionKnew = 0;
    M.sessionMissed = 0;
    M.bestStreak = 0;
    renderDaily();
  }

  function renderDaily() {
    if (M.qIdx >= M.queue.length) return renderDailySummary();
    const card = M.cards[M.queue[M.qIdx]];
    if (!card) return renderDailySummary();
    M.chapterRef = card._ref;  // theme follows the card's home chapter
    M.chapterTitle = "Révision quotidienne";
    renderPracticeFor(card, true);
  }

  function renderDailySummary() {
    const view = $("#cards-view");
    if (!view) return;
    view.innerHTML = `
      <div class="practice-summary">
        <h3>Révision terminée</h3>
        <div class="grade">⭐</div>
        <p class="stats">${M.sessionKnew} sues · ${M.sessionMissed} à revoir · meilleure série ${M.bestStreak || 0}</p>
        <div class="cards-controls" style="justify-content:center;">
          <button class="pill-btn cards-back-to-lib">← Collection</button>
        </div>
      </div>
    `;
    view.querySelector(".cards-back-to-lib").addEventListener("click", () => setMode("library"));
  }

  // Reuse practice rendering, parameterised by "isDaily" so the back button
  // returns to library and the deck-back stack reads from M.queue length.
  function renderPracticeFor(card, isDaily) {
    const view = $("#cards-view");
    if (!view) return;
    const remaining = M.queue.length - M.qIdx - 1;
    const back1 = remaining >= 1 ? makeFacedownHtml(themeFor(M.chapterRef.chapter), "deck-back-1") : "";
    const back2 = remaining >= 2 ? makeFacedownHtml(themeFor(M.chapterRef.chapter), "deck-back-2") : "";
    const back3 = remaining >= 3 ? makeFacedownHtml(themeFor(M.chapterRef.chapter), "deck-back-3") : "";
    view.innerHTML = `
      <div class="practice-hud">
        <span class="hud-progress">Carte ${M.qIdx + 1} / ${M.queue.length}</span>
        <span class="hud-streak">Série : <strong>${M.streak}</strong></span>
        <span class="hud-score">✓ ${M.sessionKnew} · ✗ ${M.sessionMissed}</span>
      </div>
      <div class="cards-stage">
        <span></span>
        <div class="cards-stage-center">
          <div class="deck-stack">
            ${back3}${back2}${back1}
            ${makeFlipperHtml(card, M.chapterRef, M.flipped)}
          </div>
        </div>
        <span></span>
      </div>
      <div class="cards-controls">
        <button class="pill-btn cards-back-to-lib">← Collection</button>
        <button class="cta-flip" ${M.flipped ? "hidden" : ""}>Montrer la réponse</button>
      </div>
      <div class="cards-rate" ${M.flipped ? "" : "hidden"}>
        <button class="rate rate-bad">À revoir</button>
        <button class="rate rate-good">Je savais !</button>
      </div>
    `;
    wirePracticeCard(view);
  }

  // ----- Print sheet -----

  function printDeck() {
    if (!M.cards || !M.cards.length) return;
    // Render all cards into a hidden container, add a body class so print CSS
    // shows just that container, then call print() and clean up.
    let host = document.getElementById("cards-print-host");
    if (!host) {
      host = document.createElement("div");
      host.id = "cards-print-host";
      document.body.appendChild(host);
    }
    const ref = M.chapterRef;
    host.innerHTML = `
      <div class="print-sheet">
        ${M.cards.map(c => `
          <div class="print-cell">${makeCardHtml(c, c._ref || ref, "front")}</div>
          <div class="print-cell">${makeCardHtml(c, c._ref || ref, "back")}</div>
        `).join("")}
      </div>
    `;
    document.body.classList.add("print-mode");
    const after = () => {
      document.body.classList.remove("print-mode");
      window.removeEventListener("afterprint", after);
    };
    window.addEventListener("afterprint", after);
    window.print();
  }

  // ----- Init -----
  function init() {
    // Tab switching
    $$("#flashcards .cards-tab[data-mode]").forEach(btn => {
      btn.addEventListener("click", () => setMode(btn.dataset.mode));
    });
    const closeBtn = $("#cards-close");
    if (closeBtn) closeBtn.addEventListener("click", close);
    const printBtn = $("#cards-print");
    if (printBtn) printBtn.addEventListener("click", (e) => { e.preventDefault(); printDeck(); });
    document.addEventListener("keydown", practiceKeys);
  }

  window.Cards = {
    init,
    openForChapter,
    refreshAvailability,
    refreshDueCount,
    close,
    setMode: (m) => setMode(m),
  };
})();
