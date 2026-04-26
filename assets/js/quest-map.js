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

    // Layout in viewBox coordinates. Width fixed (480) for portrait phones;
    // chapters alternate left/right along a sinusoidal trail. Bottom = start,
    // top = end (so finishing the journey climbs).
    const W = 480;
    const SPACING = 210;
    const TOP_PAD = 110;       // for the "Sommet" cartouche
    const BOTTOM_PAD = 200;    // room for ch.1's two-line title + the "Départ" cartouche
    const H = TOP_PAD + chapters.length * SPACING + BOTTOM_PAD;

    const positions = chapters.map((ch, i) => {
      const yFromBottom = BOTTOM_PAD + i * SPACING;
      const y = H - yFromBottom;
      const sway = Math.sin((i / Math.max(1, chapters.length - 1)) * Math.PI * 2.2 + 0.4);
      const x = W / 2 + sway * (W * 0.32);
      return { ch, x, y };
    });

    // Smooth winding trail (Catmull-Rom-ish via cubic Béziers).
    let trailD = "";
    if (positions.length) {
      trailD = `M ${positions[0].x} ${positions[0].y}`;
      for (let i = 1; i < positions.length; i++) {
        const p0 = positions[i - 1];
        const p1 = positions[i];
        const c1y = (p0.y + p1.y) / 2;
        trailD += ` C ${p0.x} ${c1y}, ${p1.x} ${c1y}, ${p1.x} ${p1.y}`;
      }
    }

    // ---- Lesson pips around each sigil ----
    let pips = "";
    positions.forEach(p => {
      const total = p.ch.lessons.length;
      p.ch.lessons.forEach((e, li) => {
        const ang = -Math.PI / 2 + (li / Math.max(1, total)) * Math.PI * 2;
        const r = 50;
        const x = p.x + Math.cos(ang) * r;
        const y = p.y + Math.sin(ang) * r;
        const id = `${e.semester}/${e.chapter}/${e.lesson}`;
        const isDone = window.Progress.isCompleted(id);
        const reading = window.Progress.getReading(id);
        const cls = isDone ? "qm-pip qm-pip--done"
                  : reading > 0 ? "qm-pip qm-pip--seen"
                  : "qm-pip";
        // Done pips render as a small 5-pointed star; the rest stay as discs.
        if (isDone) {
          pips += `<path class="${cls}" d="${starPath(x, y, 4.6, 1.8, 5)}" data-lesson="${escapeHtml(id)}"><title>${escapeHtml(localized(e.title, e.lesson))}</title></path>`;
        } else {
          pips += `<circle cx="${x}" cy="${y}" r="3.6" class="${cls}" data-lesson="${escapeHtml(id)}"><title>${escapeHtml(localized(e.title, e.lesson))}</title></circle>`;
        }
      });
    });

    // ---- Semester dividers + sigils ----
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

      if (ch.semester !== prevSemester) {
        prevSemester = ch.semester;
        const semY = p.y + 110;
        const semTitle = localized(ch.semesterTitle, ch.semester);
        const semLabel = (window.I18N && window.I18N.t && window.I18N.t("semester")) || "Semestre";
        // Italic engraved label flanked by two scrollwork lines + a center ornament.
        semBands += `
          <g class="qm-sem-band">
            <line x1="40"  y1="${semY}" x2="${W / 2 - 90}" y2="${semY}"
                  stroke="url(#qm-gold)" stroke-width="0.8" stroke-opacity="0.55"/>
            <line x1="${W / 2 + 90}" y1="${semY}" x2="${W - 40}" y2="${semY}"
                  stroke="url(#qm-gold)" stroke-width="0.8" stroke-opacity="0.55"/>
            <text x="${W / 2 - 96}" y="${semY + 4}" class="qm-sem-orn" text-anchor="middle">❦</text>
            <text x="${W / 2 + 96}" y="${semY + 4}" class="qm-sem-orn" text-anchor="middle">❦</text>
            <text x="${W / 2}" y="${semY - 6}" class="qm-sem-label" text-anchor="middle">${escapeHtml(semLabel + " " + (ch.semesterNumber || ""))}</text>
            <text x="${W / 2}" y="${semY + 14}" class="qm-sem-title" text-anchor="middle">${escapeHtml(semTitle)}</text>
          </g>
        `;
      }

      const maitre = (window.Compagnonnage && window.Compagnonnage.maitres && window.Compagnonnage.maitres[ch.id]) || null;
      const subTitle = maitre
        ? `${escapeHtml(localized(maitre.name, ""))} · ${escapeHtml(maitre.ville)}`
        : `${status.done}/${status.total}`;

      const titleLines = wrapLines(`Ch.${ch.number ?? i + 1} — ${localized(ch.title, ch.id)}`, 22, 2);
      const titleSvg = titleLines.map((line, li) =>
        `<tspan x="${p.x}" dy="${li === 0 ? 0 : 13}">${escapeHtml(line)}</tspan>`
      ).join("");
      const extraY = (titleLines.length - 1) * 13;

      // Status pip in the upper-right of the sigil:
      //   done       → 5-point gold star
      //   in-progress → small filled disc
      //   seen       → small open ring
      //   locked     → tiny padlock-like glyph
      let cornerPip = "";
      const px = p.x + 24, py = p.y - 26;
      if (status.cls === "qm-node--done") {
        cornerPip = `<path d="${starPath(px, py, 6, 2.4, 5)}" fill="url(#qm-gold)" stroke="rgba(80,50,15,0.6)" stroke-width="0.6"/>`;
      } else if (status.cls === "qm-node--in-progress") {
        cornerPip = `<circle cx="${px}" cy="${py}" r="4" fill="hsl(${hue} 80% 65%)" stroke="rgba(80,50,15,0.6)" stroke-width="0.6"/>`;
      } else if (status.cls === "qm-node--seen") {
        cornerPip = `<circle cx="${px}" cy="${py}" r="4" fill="none" stroke="hsl(${hue} 65% 55%)" stroke-width="1.2"/>`;
      } else {
        cornerPip = `<text x="${px}" y="${py + 3}" font-size="9" text-anchor="middle" fill="rgba(80,50,15,0.45)">⛓</text>`;
      }

      // Three-ring medallion: outer gold ring, mid hue, inner darker hue, glyph.
      sigils += `
        <g class="qm-node ${status.cls}" data-lesson="${escapeHtml(firstLessonId)}"
           style="--qm-hue:${hue};" filter="url(#qm-shadow)">
          <title>${escapeHtml(localized(ch.title, ch.id))}${maitre ? ` — ${escapeHtml(localized(maitre.name, ""))}` : ""}</title>
          <!-- Outer gold rim -->
          <circle cx="${p.x}" cy="${p.y}" r="38" fill="url(#qm-gold)" stroke="rgba(80,50,15,0.7)" stroke-width="1"/>
          <!-- Mid ring (chapter-tinted) -->
          <circle cx="${p.x}" cy="${p.y}" r="32" class="qm-node-shape"/>
          <!-- Inner disc (deeper chapter color) -->
          <circle cx="${p.x}" cy="${p.y}" r="24" class="qm-node-inner"/>
          <!-- Hairline ring for craftsmanship -->
          <circle cx="${p.x}" cy="${p.y}" r="32" fill="none" stroke="rgba(255,240,220,0.35)" stroke-width="0.5"/>
          <text x="${p.x}" y="${p.y + 9}" class="qm-node-glyph" text-anchor="middle">${glyph}</text>
          ${cornerPip}
          <text class="qm-node-title" text-anchor="middle" y="${p.y + 60}">${titleSvg}</text>
          <text x="${p.x}" y="${p.y + 77 + extraY}" class="qm-node-subtitle" text-anchor="middle">${subTitle}</text>
          <text x="${p.x}" y="${p.y + 91 + extraY}" class="qm-node-progress" text-anchor="middle">${status.done}/${status.total}</text>
        </g>
      `;
    });

    // ---- Cartouches for Départ / Sommet (ribbon shape with scroll ends) ----
    const cartoucheTop = cartouche({ cx: W / 2, cy: 50, w: 260, h: 56,
      title: "⛰ Sommet",
      sub:   "— Maître analyste —" });
    const cartoucheBottom = cartouche({ cx: W / 2, cy: H - 50, w: 280, h: 56,
      title: "★ Départ",
      sub:   "— ton aventure commence ici —" });

    // ---- Compass rose (top-right corner) ----
    const compass = compassRose(W - 56, 92, 32);

    view.innerHTML = `
      <svg viewBox="0 0 ${W} ${H}" class="qm-svg" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
        <defs>
          ${defsBlock(W, H)}
        </defs>

        <!-- Parchment base + grain + vignette -->
        <rect width="${W}" height="${H}" fill="#e7d8b6"/>
        <rect width="${W}" height="${H}" fill="url(#qm-grain-coarse)" opacity="0.65"/>
        <rect width="${W}" height="${H}" fill="url(#qm-grain-fine)" opacity="0.5"/>
        <rect width="${W}" height="${H}" fill="url(#qm-vignette)"/>

        <!-- Edge frame (ornate inner border) -->
        <rect x="14" y="14" width="${W - 28}" height="${H - 28}" rx="6" ry="6"
              fill="none" stroke="url(#qm-gold)" stroke-width="1.4" stroke-opacity="0.65"/>
        <rect x="20" y="20" width="${W - 40}" height="${H - 40}" rx="4" ry="4"
              fill="none" stroke="rgba(80,50,15,0.35)" stroke-width="0.6" stroke-dasharray="2 4"/>

        ${semBands}

        <!-- Trail: double stroke for an embossed gold-inlay look -->
        ${trailD ? `
          <path d="${trailD}" fill="none" stroke="url(#qm-gold)"
                stroke-width="6" stroke-opacity="0.9" stroke-linecap="round"/>
          <path d="${trailD}" fill="none" stroke="rgba(80,50,15,0.85)"
                stroke-width="2" stroke-linecap="round" stroke-dasharray="3 7"/>
        ` : ""}

        <g class="qm-pips">${pips}</g>
        <g class="qm-nodes">${sigils}</g>

        ${cartoucheBottom}
        ${cartoucheTop}
        ${compass}
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

  // ----- SVG helpers (kept short, no DOM dependencies) -----

  // <defs> block: gold gradient, paper grain, vignette, drop shadow.
  function defsBlock() {
    return `
      <linearGradient id="qm-gold" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stop-color="#ffe7a5"/>
        <stop offset="45%"  stop-color="#e1ad3b"/>
        <stop offset="100%" stop-color="#7a5a18"/>
      </linearGradient>
      <linearGradient id="qm-cartouche" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stop-color="#f0dba5"/>
        <stop offset="100%" stop-color="#c89c4a"/>
      </linearGradient>
      <pattern id="qm-grain-coarse" width="220" height="220" patternUnits="userSpaceOnUse">
        <rect width="220" height="220" fill="transparent"/>
        <circle cx="40"  cy="60"  r="0.9" fill="rgba(60,40,15,0.22)"/>
        <circle cx="120" cy="40"  r="0.7" fill="rgba(60,40,15,0.18)"/>
        <circle cx="80"  cy="130" r="1.1" fill="rgba(60,40,15,0.18)"/>
        <circle cx="155" cy="160" r="0.6" fill="rgba(60,40,15,0.20)"/>
        <circle cx="20"  cy="180" r="0.6" fill="rgba(60,40,15,0.18)"/>
        <circle cx="195" cy="20"  r="0.5" fill="rgba(60,40,15,0.15)"/>
      </pattern>
      <pattern id="qm-grain-fine" width="60" height="60" patternUnits="userSpaceOnUse">
        <rect width="60" height="60" fill="transparent"/>
        <circle cx="13" cy="22" r="0.4" fill="rgba(60,40,15,0.14)"/>
        <circle cx="48" cy="11" r="0.3" fill="rgba(60,40,15,0.12)"/>
        <circle cx="32" cy="48" r="0.3" fill="rgba(60,40,15,0.13)"/>
        <circle cx="6"  cy="55" r="0.4" fill="rgba(60,40,15,0.10)"/>
      </pattern>
      <radialGradient id="qm-vignette" cx="50%" cy="50%" r="65%">
        <stop offset="55%"  stop-color="rgba(0,0,0,0)"/>
        <stop offset="100%" stop-color="rgba(60,30,10,0.5)"/>
      </radialGradient>
      <filter id="qm-shadow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="rgba(0,0,0,0.45)"/>
      </filter>
    `;
  }

  // Star path helper: returns an SVG path "d" string for a centered star.
  function starPath(cx, cy, ro, ri, points = 5) {
    const step = Math.PI / points;
    let d = "";
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? ro : ri;
      const a = -Math.PI / 2 + i * step;
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      d += (i === 0 ? "M " : " L ") + x.toFixed(2) + " " + y.toFixed(2);
    }
    return d + " Z";
  }

  // Ribbon-style cartouche with scrolled ends (used for Départ / Sommet).
  function cartouche({ cx, cy, w, h, title, sub }) {
    const x = cx - w / 2, y = cy - h / 2;
    const e = h * 0.55;            // scroll-end depth
    const path =
      `M ${x + e} ${y} ` +
      `L ${x + w - e} ${y} ` +
      `L ${x + w} ${y + h / 2} ` +
      `L ${x + w - e} ${y + h} ` +
      `L ${x + e} ${y + h} ` +
      `L ${x} ${y + h / 2} Z`;
    const innerPad = e * 0.55;
    return `
      <g class="qm-cartouche">
        <path d="${path}" fill="url(#qm-cartouche)" stroke="url(#qm-gold)" stroke-width="2" filter="url(#qm-shadow)"/>
        <path d="${path}" fill="none" stroke="rgba(80,50,15,0.5)" stroke-width="0.7" transform="translate(0 0)"/>
        <!-- Inner rule -->
        <rect x="${x + innerPad}" y="${y + 4}" width="${w - 2 * innerPad}" height="${h - 8}"
              rx="3" ry="3" fill="none" stroke="rgba(80,50,15,0.45)" stroke-width="0.5"/>
        <text x="${cx}" y="${cy - 4}" class="qm-banner-title" text-anchor="middle">${escapeHtml(title)}</text>
        <text x="${cx}" y="${cy + 13}" class="qm-banner-sub" text-anchor="middle">${escapeHtml(sub)}</text>
      </g>
    `;
  }

  // 8-point compass rose with N/S/E/W ticks.
  function compassRose(cx, cy, r) {
    const long = r;
    const short = r * 0.45;
    // Eight rays as filled "kite" diamonds, alternating long/short.
    let rays = "";
    for (let i = 0; i < 8; i++) {
      const len = i % 2 === 0 ? long : short;
      const a = -Math.PI / 2 + i * Math.PI / 4;
      const tipX = cx + Math.cos(a) * len;
      const tipY = cy + Math.sin(a) * len;
      const sideA = a + Math.PI / 2;
      const sx = cx + Math.cos(sideA) * (len * 0.18);
      const sy = cy + Math.sin(sideA) * (len * 0.18);
      const sx2 = cx - Math.cos(sideA) * (len * 0.18);
      const sy2 = cy - Math.sin(sideA) * (len * 0.18);
      rays += `<path d="M ${cx} ${cy} L ${sx} ${sy} L ${tipX.toFixed(2)} ${tipY.toFixed(2)} L ${sx2} ${sy2} Z"
                     fill="${i % 2 === 0 ? "url(#qm-gold)" : "rgba(80,50,15,0.85)"}"
                     stroke="rgba(80,50,15,0.6)" stroke-width="0.5"/>`;
    }
    return `
      <g class="qm-compass" transform="translate(0 0)">
        <circle cx="${cx}" cy="${cy}" r="${r + 4}" fill="rgba(231,216,182,0.85)"
                stroke="url(#qm-gold)" stroke-width="1.2"/>
        ${rays}
        <circle cx="${cx}" cy="${cy}" r="2.5" fill="rgba(80,50,15,0.85)"/>
        <text x="${cx}" y="${cy - r - 6}" class="qm-compass-letter" text-anchor="middle">N</text>
        <text x="${cx}" y="${cy + r + 12}" class="qm-compass-letter" text-anchor="middle">S</text>
        <text x="${cx + r + 8}" y="${cy + 3}" class="qm-compass-letter" text-anchor="middle">E</text>
        <text x="${cx - r - 8}" y="${cy + 3}" class="qm-compass-letter" text-anchor="middle">O</text>
      </g>
    `;
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
