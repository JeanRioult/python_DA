/* Gamification: XP, streak, achievements, toast notifications.

   Public API:
     window.Game.init({ getIndex })  -> wires badges + listens for activity
     window.Game.award(amount, reason)
     window.Game.recordActivity()    -> bumps streak if first activity today
     window.Game.checkAchievements({ context })
     window.Game.toast(text, options) -> {icon, kind: "xp"|"streak"|"achv"|"info"}
     window.Game.renderAchievementsList(rootEl)
*/
(function () {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);

  // Achievement registry. Each `check(ctx)` returns true to unlock.
  // ctx: { lessons, completedCount, cardStates, sessionPerfectN, lastReadingMinutes,
  //        chapterMastered, semesterCompleted, ... }
  const ACHIEVEMENTS = [
    {
      id: "first-lesson",
      title: { fr: "Premier pas",            en: "First step" },
      desc:  { fr: "Termine ta première leçon.", en: "Finish your first lesson." },
      icon: "🌱",
      check: (c) => c.completedCount >= 1,
    },
    {
      id: "lessons-10",
      title: { fr: "Dix leçons",             en: "Ten lessons" },
      desc:  { fr: "Termine 10 leçons.",     en: "Finish 10 lessons." },
      icon: "📘",
      check: (c) => c.completedCount >= 10,
    },
    {
      id: "lessons-25",
      title: { fr: "Lecteur assidu",         en: "Devoted reader" },
      desc:  { fr: "Termine 25 leçons.",     en: "Finish 25 lessons." },
      icon: "📚",
      check: (c) => c.completedCount >= 25,
    },
    {
      id: "lessons-50",
      title: { fr: "Mi-chemin",              en: "Halfway" },
      desc:  { fr: "Termine 50 leçons.",     en: "Finish 50 lessons." },
      icon: "🏔",
      check: (c) => c.completedCount >= 50,
    },
    {
      id: "first-card-mastered",
      title: { fr: "Première maîtrise",      en: "First mastery" },
      desc:  { fr: "Atteins 5★ sur une carte.", en: "Reach 5★ on a card." },
      icon: "⭐",
      check: (c) => Object.values(c.cardStates).some(s => (s.level || 0) >= 5),
    },
    {
      id: "cards-mastered-10",
      title: { fr: "Collectionneur",         en: "Collector" },
      desc:  { fr: "10 cartes à 5★.",        en: "10 cards at 5★." },
      icon: "🎴",
      check: (c) => Object.values(c.cardStates).filter(s => (s.level || 0) >= 5).length >= 10,
    },
    {
      id: "cards-mastered-50",
      title: { fr: "Chasseur de cartes",     en: "Card hunter" },
      desc:  { fr: "50 cartes à 5★.",        en: "50 cards at 5★." },
      icon: "🏅",
      check: (c) => Object.values(c.cardStates).filter(s => (s.level || 0) >= 5).length >= 50,
    },
    {
      id: "cards-mastered-100",
      title: { fr: "Centurion",              en: "Centurion" },
      desc:  { fr: "100 cartes à 5★.",       en: "100 cards at 5★." },
      icon: "🏆",
      check: (c) => Object.values(c.cardStates).filter(s => (s.level || 0) >= 5).length >= 100,
    },
    {
      id: "streak-3",
      title: { fr: "Allumage",               en: "Kindling" },
      desc:  { fr: "Série de 3 jours.",      en: "3-day streak." },
      icon: "🔥",
      check: (c) => c.streakDays >= 3,
    },
    {
      id: "streak-7",
      title: { fr: "Une semaine",            en: "A full week" },
      desc:  { fr: "Série de 7 jours.",      en: "7-day streak." },
      icon: "🔥",
      check: (c) => c.streakDays >= 7,
    },
    {
      id: "streak-30",
      title: { fr: "Brûlot",                 en: "Wildfire" },
      desc:  { fr: "Série de 30 jours.",     en: "30-day streak." },
      icon: "🌋",
      check: (c) => c.streakDays >= 30,
    },
    {
      id: "chapter-clear",
      title: { fr: "Chapitre bouclé",        en: "Chapter cleared" },
      desc:  { fr: "Termine toutes les leçons d'un chapitre.", en: "Complete every lesson in a chapter." },
      icon: "🗝",
      check: (c) => Object.values(c.chaptersDone || {}).some(v => v),
    },
    {
      id: "practice-perfect-10",
      title: { fr: "Sans-faute",             en: "Flawless" },
      desc:  { fr: "10 cartes d'affilée sans erreur.", en: "10 cards in a row, no miss." },
      icon: "💎",
      check: (c) => (c.bestStreak || 0) >= 10,
    },
    {
      id: "marathon",
      title: { fr: "Marathon",               en: "Marathon" },
      desc:  { fr: "Lis 30 minutes en continu.", en: "Read 30 minutes straight." },
      icon: "🏃",
      check: (c) => (c.lastReadingMinutes || 0) >= 30,
    },
    {
      id: "night-owl",
      title: { fr: "Hibou",                  en: "Night owl" },
      desc:  { fr: "Étudie après minuit.",   en: "Study after midnight." },
      icon: "🦉",
      check: (c) => { const h = new Date().getHours(); return h >= 0 && h < 4; },
    },
    {
      id: "early-bird",
      title: { fr: "Lève-tôt",               en: "Early bird" },
      desc:  { fr: "Étudie avant 7 h.",      en: "Study before 7 a.m." },
      icon: "🐦",
      check: (c) => { const h = new Date().getHours(); return h >= 5 && h < 7; },
    },
  ];

  // XP → rank thresholds. Compagnonnage titles by default; the file
  // assets/data/compagnonnage.json may override at runtime via setRanks().
  let RANKS = [
    { min:     0, fr: "Aspirant",           en: "Aspirant" },
    { min:   100, fr: "Postulant",          en: "Postulant" },
    { min:   300, fr: "Affilié",            en: "Affiliate" },
    { min:   700, fr: "Compagnon-reçu",     en: "Received Companion" },
    { min:  1500, fr: "Compagnon-fini",     en: "Finished Companion" },
    { min:  3000, fr: "Compagnon-passant",  en: "Passing Companion" },
    { min:  6000, fr: "Maître",             en: "Master" },
    { min: 12000, fr: "Maître-fondateur",   en: "Founder Master" },
    { min: 25000, fr: "Légende du Tour",    en: "Legend of the Tour" },
  ];
  function setRanks(arr) { if (Array.isArray(arr) && arr.length) RANKS = arr; }
  function rankFor(xp) {
    let r = RANKS[0];
    for (const tier of RANKS) if (xp >= tier.min) r = tier;
    return r;
  }
  function nextRank(xp) {
    return RANKS.find(r => r.min > xp) || null;
  }

  const G = {
    indexProvider: null,
    achvCtx: { sessionBest: 0 },
    lastRankIdx: -1,
  };

  function localized(obj, fb = "") {
    if (!obj || typeof obj !== "object") return fb;
    const lang = (window.I18N && window.I18N.current) || "fr";
    return obj[lang] || obj.fr || obj.en || fb;
  }

  function buildContext(extra = {}) {
    const idx = G.indexProvider ? G.indexProvider() : [];
    const cardStates = (window.Progress._data && window.Progress._data.cards) || {};
    const completedCount = idx.filter(e => window.Progress.isCompleted(`${e.semester}/${e.chapter}/${e.lesson}`)).length;

    // Per-chapter complete map
    const byChapter = new Map();
    for (const e of idx) {
      const k = `${e.semester}/${e.chapter}`;
      if (!byChapter.has(k)) byChapter.set(k, []);
      byChapter.get(k).push(e);
    }
    const chaptersDone = {};
    for (const [k, lessons] of byChapter) {
      chaptersDone[k] = lessons.length > 0 && lessons.every(
        e => window.Progress.isCompleted(`${e.semester}/${e.chapter}/${e.lesson}`)
      );
    }

    return {
      completedCount,
      cardStates,
      streakDays: window.Progress.liveStreak(),
      chaptersDone,
      ...extra,
    };
  }

  function checkAchievements(extra = {}) {
    const ctx = buildContext(extra);
    const newly = [];
    for (const a of ACHIEVEMENTS) {
      if (window.Progress.isUnlocked(a.id)) continue;
      try {
        if (a.check(ctx)) {
          if (window.Progress.unlock(a.id)) {
            newly.push(a);
          }
        }
      } catch (_) { /* tolerate per-rule errors */ }
    }
    for (const a of newly) {
      toast(`${localized(a.title)}`, { icon: a.icon, kind: "achv", sub: localized(a.desc) });
      // Reward XP per achievement
      addXp(50, "achievement");
    }
    if (newly.length) {
      renderBadges();
      renderAchievementsList();
      if (window.Voies) window.Voies.renderStrip();
    }
    return newly;
  }

  function addXp(n, reason) {
    const before = window.Progress.getGame().xp || 0;
    const xp = window.Progress.addXp(n);
    const beforeRank = rankFor(before);
    const afterRank  = rankFor(xp);
    renderBadges();
    if (n > 0 && reason !== "silent") {
      toast(`+${n} XP`, { icon: "✦", kind: "xp" });
    }
    if (afterRank.min > beforeRank.min) {
      const titleFr = afterRank.fr;
      const titleEn = afterRank.en;
      const t = (window.I18N && window.I18N.current === "en")
        ? `Rank up: ${titleEn}`
        : `Nouveau rang : ${titleFr}`;
      toast(t, { icon: "🏵", kind: "achv", sub: `+${n} XP` });
    }
    return xp;
  }

  function recordActivity() {
    const before = window.Progress.liveStreak();
    const g = window.Progress.recordActivity();
    const after = window.Progress.liveStreak();
    if (after > before) {
      toast(localized({ fr: `Série : ${after} jour${after > 1 ? "s" : ""}`, en: `Streak: ${after} day${after > 1 ? "s" : ""}` }),
            { icon: "🔥", kind: "streak" });
    }
    renderBadges();
    checkAchievements();
    return g;
  }

  function renderBadges() {
    const xpEl = $("#xp-badge");
    const streakEl = $("#streak-badge");
    const rankEl = $("#rank-badge");
    const g = window.Progress.getGame();
    const xp = g.xp || 0;
    if (xpEl) {
      xpEl.querySelector(".badge-value").textContent = String(xp);
      const next = nextRank(xp);
      xpEl.title = next
        ? `${xp} XP — ${next.min - xp} jusqu'au rang « ${next.fr} »`
        : `${xp} XP — rang maximal atteint`;
    }
    if (rankEl) {
      const r = rankFor(xp);
      rankEl.querySelector(".badge-value").textContent =
        (window.I18N && window.I18N.current === "en") ? r.en : r.fr;
      rankEl.title = `Rang actuel — ${r.fr}`;
    }
    const s = window.Progress.liveStreak();
    if (streakEl) {
      streakEl.querySelector(".badge-value").textContent = String(s);
      streakEl.hidden = false;
      streakEl.classList.toggle("game-badge--zero", s === 0);
    }
  }

  function toast(text, opts = {}) {
    const stack = $("#toast-stack");
    if (!stack) return;
    const t = document.createElement("div");
    t.className = `toast toast--${opts.kind || "info"}`;
    t.innerHTML = `
      <span class="toast-icon" aria-hidden="true">${opts.icon || "✦"}</span>
      <span class="toast-body">
        <span class="toast-text"></span>
        ${opts.sub ? `<span class="toast-sub"></span>` : ""}
      </span>
    `;
    t.querySelector(".toast-text").textContent = text;
    if (opts.sub) t.querySelector(".toast-sub").textContent = opts.sub;
    stack.appendChild(t);
    // Auto-dismiss
    setTimeout(() => { t.classList.add("toast-out"); }, opts.kind === "achv" ? 4500 : 2500);
    setTimeout(() => { t.remove(); }, opts.kind === "achv" ? 5000 : 3000);
  }

  function renderAchievementsList(rootEl) {
    const root = rootEl || $("#achievements-list");
    if (!root) return;
    const xp = (window.Progress.getGame().xp) || 0;
    const cur = rankFor(xp);
    const next = nextRank(xp);
    const lang = (window.I18N && window.I18N.current) || "fr";
    const tName = (r) => (lang === "en" ? r.en : r.fr);

    // Rank ladder (compact)
    const ladder = `
      <div class="rank-summary">
        <div class="rank-summary-cur">
          <span class="rank-icon">🏵</span>
          <span class="rank-name">${tName(cur)}</span>
          <span class="rank-xp">${xp} XP</span>
        </div>
        ${next ? `
          <div class="rank-summary-next">
            <div class="rank-bar">
              <div class="rank-bar-fill" style="width:${Math.min(100, Math.round((xp - cur.min) / (next.min - cur.min) * 100))}%"></div>
            </div>
            <div class="rank-summary-hint">${next.min - xp} XP jusqu'à <strong>${tName(next)}</strong></div>
          </div>` : `<div class="rank-summary-hint">Rang maximal atteint ✨</div>`
        }
        <details class="rank-ladder-details">
          <summary>Voir tous les rangs</summary>
          <ol class="rank-ladder">
            ${RANKS.map(r => `
              <li class="${xp >= r.min ? "on" : "off"}">
                <span class="rank-name">${tName(r)}</span>
                <span class="rank-min">${r.min} XP</span>
              </li>`).join("")}
          </ol>
        </details>
      </div>
    `;

    const achvs = ACHIEVEMENTS.map(a => {
      const unlocked = window.Progress.isUnlocked(a.id);
      return `
        <div class="achv ${unlocked ? "achv--on" : "achv--off"}" title="${unlocked ? "Débloqué" : "Verrouillé"}">
          <span class="achv-icon">${a.icon}</span>
          <span class="achv-text">
            <span class="achv-title">${localized(a.title)}</span>
            <span class="achv-desc">${localized(a.desc)}</span>
          </span>
        </div>
      `;
    }).join("");
    root.innerHTML = ladder + achvs;
  }

  function init({ getIndex } = {}) {
    G.indexProvider = getIndex || (() => []);
    renderBadges();
    renderAchievementsList();
    if (window.Voies) window.Voies.renderStrip();
  }

  window.Game = {
    init,
    award: addXp,
    recordActivity,
    checkAchievements,
    toast,
    renderBadges,
    renderAchievementsList,
    setRanks,
    ACHIEVEMENTS,
  };
})();
