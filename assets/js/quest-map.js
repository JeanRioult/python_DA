/* Quest map — vertical, bottom-to-top journey on a parchment.
   Each semester is a section; chapters are sigils on a winding path.
   Click a sigil (or a small lesson dot along the path) to jump there.

   Public API:
     window.QuestMap.init({ getIndex })
     window.QuestMap.open() / close() / toggle()
*/
(function () {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);

  const Q = {
    indexProvider: null,
  };

  function localized(obj, fb = "") {
    if (!obj || typeof obj !== "object") return fb;
    const lang = (window.I18N && window.I18N.current) || "fr";
    return obj[lang] || obj.fr || obj.en || fb;
  }

  // Mirror cards.js theme so the map feels coherent.
  const HUES = {
    "chapter-01-apprendre-a-apprendre":      48,
    "chapter-02-qu-est-ce-qu-une-donnee":    215,
    "chapter-03-logique-raisonnement":       270,
    "chapter-04-mathematiques-fondamentales":  8,
    "chapter-05-premiers-pas-python":        145,
    "chapter-06-controle-du-flux":            28,
    "chapter-07-tableurs":                   175,
    "chapter-08-ecrire-argumenter":          320,
    "chapter-09-methode-scientifique":       195,
  };
  const GLYPHS = {
    "chapter-01-apprendre-a-apprendre":      "✦",
    "chapter-02-qu-est-ce-qu-une-donnee":    "◈",
    "chapter-03-logique-raisonnement":       "✶",
    "chapter-04-mathematiques-fondamentales":"✺",
    "chapter-05-premiers-pas-python":        "❋",
    "chapter-06-controle-du-flux":           "❖",
    "chapter-07-tableurs":                   "▦",
    "chapter-08-ecrire-argumenter":          "✎",
    "chapter-09-methode-scientifique":       "⚛",
  };

  function buildChain() {
    // Flat list of chapters in course order, each with its lessons.
    const idx = Q.indexProvider ? Q.indexProvider() : [];
    const chapters = [];
    const seen = new Set();
    for (const e of idx) {
      const k = `${e.semester}/${e.chapter}`;
      if (!seen.has(k)) {
        seen.add(k);
        chapters.push({
          key: k,
          id: e.chapter,
          number: e.chapterNumber,
          title: e.chapterTitle,
          semester: e.semester,
          semesterNumber: e.semesterNumber,
          semesterTitle: e.semesterTitle,
          lessons: [],
        });
      }
      chapters[chapters.length - 1].lessons.push(e);
    }
    return chapters;
  }

  function chapterStatus(ch) {
    const total = ch.lessons.length;
    const done = ch.lessons.filter(e =>
      window.Progress.isCompleted(`${e.semester}/${e.chapter}/${e.lesson}`)
    ).length;
    const reading = ch.lessons.reduce((s, e) =>
      s + window.Progress.getReading(`${e.semester}/${e.chapter}/${e.lesson}`), 0) / Math.max(1, total);
    let cls = "qm-node--locked";
    if (done === total && total > 0) cls = "qm-node--done";
    else if (done > 0) cls = "qm-node--in-progress";
    else if (reading > 0) cls = "qm-node--seen";
    return { total, done, reading, cls };
  }

  function escapeHtml(s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  // Greedy word-wrap to at most `maxLines` lines of ≤ ~`maxLen` chars each.
  // Lines aren't padded; we simply prefer breaking at spaces. If a single
  // word is longer than maxLen we let it overflow rather than mangle it.
  function wrapLines(text, maxLen = 22, maxLines = 2) {
    const words = String(text || "").split(/\s+/).filter(Boolean);
    const lines = [];
    let cur = "";
    for (const w of words) {
      if (!cur) { cur = w; continue; }
      if ((cur + " " + w).length <= maxLen) {
        cur += " " + w;
      } else {
        lines.push(cur);
        cur = w;
        if (lines.length === maxLines - 1) {
          // Rest goes onto the last line, even if longer.
          cur = w;
          // Append remaining words to the last line.
        }
      }
    }
    if (cur) lines.push(cur);
    if (lines.length > maxLines) {
      const tail = lines.slice(maxLines - 1).join(" ");
      return lines.slice(0, maxLines - 1).concat([tail]);
    }
    return lines;
  }

  function render() {
    const view = $("#quest-map-view");
    const legend = $("#quest-map-legend");
    if (!view) return;
    const chapters = buildChain();

    // Layout in viewBox coordinates.
    // Width is fixed (480) to keep aspect on phones; nodes alternate left/right
    // along a sinusoidal path. Bottom = start, top = end (so finishing climbs).
    const W = 480;
    const SPACING = 210;       // vertical pixels per chapter (room for 2-line titles)
    const TOP_PAD = 110;       // for the "Sommet" banner
    const BOTTOM_PAD = 200;    // room for ch.1's 2-line title + the "Départ" banner
    const H = TOP_PAD + chapters.length * SPACING + BOTTOM_PAD;

    // Position each chapter; flip Y so chapter 1 sits at the BOTTOM.
    const positions = chapters.map((ch, i) => {
      const yFromBottom = BOTTOM_PAD + i * SPACING;
      const y = H - yFromBottom;
      const sway = Math.sin((i / Math.max(1, chapters.length - 1)) * Math.PI * 2.2 + 0.4);
      const x = W / 2 + sway * (W * 0.32);
      return { ch, x, y };
    });

    // The winding trail (Catmull-Rom-ish smoothing via cubic Béziers).
    let path = "";
    if (positions.length) {
      path = `M ${positions[0].x} ${positions[0].y}`;
      for (let i = 1; i < positions.length; i++) {
        const p0 = positions[i - 1];
        const p1 = positions[i];
        const c1x = p0.x;
        const c1y = (p0.y + p1.y) / 2;
        const c2x = p1.x;
        const c2y = c1y;
        path += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p1.x} ${p1.y}`;
      }
    }

    // Lesson pips along the trail edges (small dots between chapter nodes,
    // representing lessons inside the chapter you're walking through).
    let pips = "";
    positions.forEach((p, i) => {
      const total = p.ch.lessons.length;
      // Distribute pips on a small ring around each chapter sigil.
      p.ch.lessons.forEach((e, li) => {
        const ang = -Math.PI / 2 + (li / Math.max(1, total)) * Math.PI * 2;
        const r = 38;
        const x = p.x + Math.cos(ang) * r;
        const y = p.y + Math.sin(ang) * r;
        const id = `${e.semester}/${e.chapter}/${e.lesson}`;
        const isDone = window.Progress.isCompleted(id);
        const reading = window.Progress.getReading(id);
        const cls = isDone ? "qm-pip qm-pip--done" : reading > 0 ? "qm-pip qm-pip--seen" : "qm-pip";
        pips += `<circle cx="${x}" cy="${y}" r="3.6" class="${cls}" data-lesson="${escapeHtml(id)}"><title>${escapeHtml(localized(e.title, e.lesson))}</title></circle>`;
      });
    });

    // Chapter sigils (clickable groups).
    let sigils = "";
    let semBands = "";
    let prevSemester = null;
    positions.forEach((p, i) => {
      const ch = p.ch;
      const status = chapterStatus(ch);
      const hue = HUES[ch.id] != null ? HUES[ch.id] : 215;
      const glyph = GLYPHS[ch.id] || "◆";
      const firstLessonId = ch.lessons[0]
        ? `${ch.lessons[0].semester}/${ch.lessons[0].chapter}/${ch.lessons[0].lesson}`
        : "";

      // Semester divider band
      if (ch.semester !== prevSemester) {
        prevSemester = ch.semester;
        const semY = p.y + 80;
        const semTitle = localized(ch.semesterTitle, ch.semester);
        const semLabel = (window.I18N && window.I18N.t && window.I18N.t("semester")) || "Semestre";
        semBands +=
          `<g class="qm-sem-band">` +
          `<line x1="40" y1="${semY}" x2="${W - 40}" y2="${semY}" stroke="rgba(120,90,40,0.35)" stroke-width="1" stroke-dasharray="4 5"/>` +
          `<text x="${W / 2}" y="${semY - 8}" class="qm-sem-label" text-anchor="middle">${escapeHtml(semLabel + " " + (ch.semesterNumber || ""))}</text>` +
          `<text x="${W / 2}" y="${semY + 18}" class="qm-sem-title" text-anchor="middle">${escapeHtml(semTitle)}</text>` +
          `</g>`;
      }

      const maitre = (window.Compagnonnage && window.Compagnonnage.maitres && window.Compagnonnage.maitres[ch.id]) || null;
      const subTitle = maitre
        ? `${escapeHtml(localized(maitre.name, ""))} · ${escapeHtml(maitre.ville)}`
        : `${status.done}/${status.total}`;

      // Word-wrap the chapter title (max 2 lines, ~22 chars each) so long
      // names like "Mathématiques fondamentales" are readable.
      const titleLines = wrapLines(`Ch.${ch.number ?? i + 1} — ${localized(ch.title, ch.id)}`, 22, 2);
      const titleSvg = titleLines.map((line, li) =>
        `<tspan x="${p.x}" dy="${li === 0 ? 0 : 13}">${escapeHtml(line)}</tspan>`
      ).join("");
      // After title, push subtitle + progress down by the extra line if any.
      const extraY = (titleLines.length - 1) * 13;

      sigils += `
        <g class="qm-node ${status.cls}" data-lesson="${escapeHtml(firstLessonId)}" style="--qm-hue:${hue};">
          <title>${escapeHtml(localized(ch.title, ch.id))}${maitre ? ` — ${escapeHtml(localized(maitre.name, ""))}` : ""}</title>
          <circle cx="${p.x}" cy="${p.y}" r="34" class="qm-node-shape"/>
          <circle cx="${p.x}" cy="${p.y}" r="26" class="qm-node-inner"/>
          <text x="${p.x}" y="${p.y + 8}" class="qm-node-glyph" text-anchor="middle">${glyph}</text>
          <text class="qm-node-title" text-anchor="middle" y="${p.y + 56}">${titleSvg}</text>
          <text x="${p.x}" y="${p.y + 73 + extraY}" class="qm-node-subtitle" text-anchor="middle">${subTitle}</text>
          <text x="${p.x}" y="${p.y + 87 + extraY}" class="qm-node-progress" text-anchor="middle">${status.done}/${status.total}</text>
        </g>
      `;
    });

    // Start / Summit banners — anchored to the SVG edges (not to the first/last
    // chapter) so they never overlap the chapter text underneath them.
    const topBanner = `
      <g class="qm-banner">
        <text x="${W / 2}" y="40" class="qm-banner-title" text-anchor="middle">⛰ Sommet</text>
        <text x="${W / 2}" y="60" class="qm-banner-sub" text-anchor="middle">— Maître analyste —</text>
      </g>
    `;
    const bottomBanner = `
      <g class="qm-banner">
        <text x="${W / 2}" y="${H - 36}" class="qm-banner-title" text-anchor="middle">★ Départ</text>
        <text x="${W / 2}" y="${H - 18}" class="qm-banner-sub" text-anchor="middle">— ton aventure commence ici —</text>
      </g>
    `;

    view.innerHTML = `
      <svg viewBox="0 0 ${W} ${H}" class="qm-svg" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="qm-paper" width="180" height="180" patternUnits="userSpaceOnUse">
            <rect width="180" height="180" fill="#e7d8b6"/>
            <circle cx="40" cy="60" r="0.8" fill="rgba(60,40,15,0.2)"/>
            <circle cx="120" cy="40" r="0.8" fill="rgba(60,40,15,0.18)"/>
            <circle cx="80" cy="130" r="1" fill="rgba(60,40,15,0.16)"/>
            <circle cx="155" cy="160" r="0.6" fill="rgba(60,40,15,0.2)"/>
            <circle cx="20" cy="160" r="0.6" fill="rgba(60,40,15,0.18)"/>
          </pattern>
          <radialGradient id="qm-vignette" cx="50%" cy="50%" r="65%">
            <stop offset="60%" stop-color="rgba(0,0,0,0)"/>
            <stop offset="100%" stop-color="rgba(70,40,15,0.45)"/>
          </radialGradient>
          <filter id="qm-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.35)"/>
          </filter>
        </defs>
        <rect width="${W}" height="${H}" fill="url(#qm-paper)"/>
        <rect width="${W}" height="${H}" fill="url(#qm-vignette)"/>
        ${semBands}
        ${path ? `<path d="${path}" fill="none" stroke="rgba(80,50,15,0.55)" stroke-width="3" stroke-dasharray="6 6" stroke-linecap="round"/>` : ""}
        <g class="qm-pips">${pips}</g>
        <g class="qm-nodes" filter="url(#qm-shadow)">${sigils}</g>
        ${bottomBanner}
        ${topBanner}
      </svg>
    `;
    if (legend) {
      legend.textContent = "Du Départ ↑ vers le Sommet — touche un sceau pour y aller";
    }

    view.querySelectorAll(".qm-node").forEach(g => {
      g.addEventListener("click", () => {
        const id = g.dataset.lesson;
        if (id) { location.hash = `#/${id}`; close(); }
      });
    });
    view.querySelectorAll(".qm-pip").forEach(p => {
      p.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = p.getAttribute("data-lesson");
        if (id) { location.hash = `#/${id}`; close(); }
      });
    });
  }

  function open() {
    render();
    const panel = $("#quest-map");
    if (panel) panel.removeAttribute("hidden");
    if (window.PanelLock) window.PanelLock.lock();
    // Auto-scroll to the bottom (start of the journey) so the user sees
    // where they are now, and can scroll up to discover the path ahead.
    requestAnimationFrame(() => {
      const view = $("#quest-map-view");
      if (view) view.scrollTop = view.scrollHeight;
    });
  }
  function close() {
    const panel = $("#quest-map");
    if (panel) panel.setAttribute("hidden", "");
    if (window.PanelLock) window.PanelLock.unlock();
  }
  function toggle() {
    const panel = $("#quest-map");
    if (!panel) return;
    if (panel.hasAttribute("hidden")) open();
    else close();
  }

  function init({ getIndex } = {}) {
    Q.indexProvider = getIndex || (() => []);
  }

  window.QuestMap = { init, open, close, toggle };
})();
