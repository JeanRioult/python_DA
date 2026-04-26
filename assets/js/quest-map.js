/* Quest map: roguelike-style SVG view of the curriculum.
   Semesters → chapters (nodes) → lessons (pips inside each node).

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

  // Chapter color hues (mirror cards.js so it stays cohesive).
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

  function buildTree() {
    const idx = Q.indexProvider ? Q.indexProvider() : [];
    const tree = new Map();
    for (const e of idx) {
      if (!tree.has(e.semester)) {
        tree.set(e.semester, {
          id: e.semester,
          number: e.semesterNumber,
          title: e.semesterTitle,
          chapters: new Map(),
        });
      }
      const sem = tree.get(e.semester);
      if (!sem.chapters.has(e.chapter)) {
        sem.chapters.set(e.chapter, {
          id: e.chapter,
          number: e.chapterNumber,
          title: e.chapterTitle,
          lessons: [],
        });
      }
      sem.chapters.get(e.chapter).lessons.push(e);
    }
    return tree;
  }

  function chapterStatus(chapter) {
    const total = chapter.lessons.length;
    const done = chapter.lessons.filter(e =>
      window.Progress.isCompleted(`${e.semester}/${e.chapter}/${e.lesson}`)
    ).length;
    const reading = chapter.lessons.reduce((s, e) =>
      s + window.Progress.getReading(`${e.semester}/${e.chapter}/${e.lesson}`), 0) / Math.max(1, total);
    return { total, done, ratio: done / Math.max(1, total), reading };
  }

  function render() {
    const view = $("#quest-map-view");
    const legend = $("#quest-map-legend");
    if (!view) return;
    const tree = buildTree();

    // Layout: each semester is a horizontal row; chapters spaced along it.
    const semesters = Array.from(tree.values());
    const W = 1000;            // viewBox width
    const ROW_H = 200;
    const PADX = 70;
    const H = Math.max(420, semesters.length * ROW_H + 100);

    let nodes = "";
    let edges = "";
    let labels = "";

    semesters.forEach((sem, sIdx) => {
      const y = 80 + sIdx * ROW_H;
      const chapters = Array.from(sem.chapters.values());
      const usable = W - PADX * 2;
      const dx = chapters.length > 1 ? usable / (chapters.length - 1) : 0;

      // Semester label
      labels += `<text x="${PADX}" y="${y - 50}" class="qm-sem-label">${escapeHtml((window.I18N?.t?.("semester") || "Semestre") + " " + (sem.number || ""))}</text>`;
      labels += `<text x="${PADX}" y="${y - 32}" class="qm-sem-title">${escapeHtml(localized(sem.title, sem.id))}</text>`;

      // Edges + nodes
      let prev = null;
      chapters.forEach((ch, cIdx) => {
        const cx = PADX + dx * cIdx;
        const cy = y;
        const status = chapterStatus(ch);
        const hue = HUES[ch.id] != null ? HUES[ch.id] : 215;
        const stateClass =
          status.done === status.total ? "qm-node--done"
          : status.done > 0 ? "qm-node--in-progress"
          : status.reading > 0 ? "qm-node--seen"
          : "qm-node--locked";

        // Edge
        if (prev) {
          edges += `<path d="M ${prev.cx} ${prev.cy} C ${prev.cx + dx/2} ${prev.cy}, ${cx - dx/2} ${cy}, ${cx} ${cy}" class="qm-edge" />`;
        }
        prev = { cx, cy };

        // Node (group is clickable)
        const firstLessonId = ch.lessons[0]
          ? `${ch.lessons[0].semester}/${ch.lessons[0].chapter}/${ch.lessons[0].lesson}`
          : null;

        // Lesson pips around the node
        const pipR = 4;
        const ringR = 38;
        let pips = "";
        ch.lessons.forEach((e, li) => {
          const total = ch.lessons.length;
          const ang = -Math.PI / 2 + (li / Math.max(1, total)) * Math.PI * 2;
          const px = cx + Math.cos(ang) * ringR;
          const py = cy + Math.sin(ang) * ringR;
          const id = `${e.semester}/${e.chapter}/${e.lesson}`;
          const isDone = window.Progress.isCompleted(id);
          const reading = window.Progress.getReading(id);
          const cls = isDone ? "qm-pip qm-pip--done" : reading > 0 ? "qm-pip qm-pip--seen" : "qm-pip";
          pips += `<circle cx="${px}" cy="${py}" r="${pipR}" class="${cls}" data-lesson="${escapeHtml(id)}"><title>${escapeHtml(localized(e.title, e.lesson))}</title></circle>`;
        });

        nodes += `
          <g class="qm-node ${stateClass}" data-chapter="${escapeHtml(ch.id)}" data-lesson="${escapeHtml(firstLessonId || "")}" style="--qm-hue:${hue};">
            <circle cx="${cx}" cy="${cy}" r="28" class="qm-node-shape"/>
            <text x="${cx}" y="${cy + 5}" class="qm-node-label" text-anchor="middle">Ch.${ch.number ?? cIdx + 1}</text>
            ${pips}
            <text x="${cx}" y="${cy + 60}" class="qm-node-title" text-anchor="middle">${escapeHtml(truncate(localized(ch.title, ch.id), 26))}</text>
            <text x="${cx}" y="${cy + 76}" class="qm-node-progress" text-anchor="middle">${status.done}/${status.total}</text>
          </g>
        `;
      });
    });

    view.innerHTML = `
      <svg viewBox="0 0 ${W} ${H}" class="qm-svg" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="qm-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="${W}" height="${H}" fill="url(#qm-grid)"/>
        <g class="qm-edges">${edges}</g>
        <g class="qm-labels">${labels}</g>
        <g class="qm-nodes">${nodes}</g>
      </svg>
    `;
    if (legend) {
      legend.textContent =
        "🌑 verrouillé · 👁 entamé · ⚙ en cours · ✓ terminé — clique un chapitre pour y aller";
    }

    // Events
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

  function escapeHtml(s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function truncate(s, n) {
    s = String(s || "");
    return s.length > n ? s.slice(0, n - 1) + "…" : s;
  }

  function open() {
    render();
    const panel = $("#quest-map");
    if (panel) panel.removeAttribute("hidden");
    if (window.PanelLock) window.PanelLock.lock();
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
