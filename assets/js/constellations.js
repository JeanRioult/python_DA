/* Voies (constellations) — long-running cross-chapter quests.
   A voie is a list of card ids; completing it (every member at level 5)
   awards a unique "marque fondatrice" (mythic) belonging to no chapter.

   Public API:
     window.Voies.init()
     window.Voies.checkProgress()    -> awards new mythics if any voie just completed
     window.Voies.renderStrip(rootEl)
     window.Voies.openPanel()
*/
(function () {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);

  const V = {
    data: null,
  };

  function localized(obj, fb = "") {
    if (!obj || typeof obj !== "object") return fb;
    const lang = (window.I18N && window.I18N.current) || "fr";
    return obj[lang] || obj.fr || obj.en || fb;
  }

  async function loadData() {
    if (V.data) return V.data;
    try {
      const r = await fetch("assets/data/constellations.json");
      if (!r.ok) return null;
      V.data = await r.json();
    } catch (_) { V.data = null; }
    return V.data;
  }

  function memberMastered(id) {
    const c = window.Progress.getCardState(id);
    return (c.level || 0) >= 5;
  }

  function progressFor(voie) {
    const total = voie.members.length;
    const done = voie.members.filter(memberMastered).length;
    return { total, done, ratio: total ? done / total : 0, complete: done === total && total > 0 };
  }

  function isMarqueOwned(marqueId) {
    const owned = (window.Progress._data && window.Progress._data.marquesFondatrices) || {};
    return !!owned[marqueId];
  }

  function awardMarque(voie) {
    if (!window.Progress._data.marquesFondatrices) {
      window.Progress._data.marquesFondatrices = {};
    }
    window.Progress._data.marquesFondatrices[voie.reward.marqueId] = {
      voieId: voie.id,
      title: voie.reward.title,
      flavor: voie.reward.flavor,
      hue: voie.hue,
      icon: voie.icon,
      at: new Date().toISOString(),
    };
    // Persist via setSetting (which calls save).
    window.Progress.setSetting("__marques_persist", Date.now());
  }

  // Called whenever a card's mastery changes. Awards any newly-completed voie.
  async function checkProgress() {
    const data = await loadData();
    if (!data || !data.voies) return [];
    const newly = [];
    for (const v of data.voies) {
      const p = progressFor(v);
      if (p.complete && !isMarqueOwned(v.reward.marqueId)) {
        awardMarque(v);
        newly.push(v);
      }
    }
    if (newly.length && window.Game) {
      for (const v of newly) {
        window.Game.toast(
          `Voie achevée : ${localized(v.name)}`,
          { icon: v.icon, kind: "achv", sub: localized(v.reward.title) }
        );
        window.Game.award(500, "voie");
      }
    }
    return newly;
  }

  // ----- Strip in achievements panel -----

  async function renderStrip(rootEl) {
    const data = await loadData();
    if (!data || !data.voies) return;
    const root = rootEl || $("#voies-strip");
    if (!root) return;
    root.innerHTML = data.voies.map(v => {
      const p = progressFor(v);
      const owned = isMarqueOwned(v.reward.marqueId);
      const pct = Math.round(p.ratio * 100);
      return `
        <div class="voie ${p.complete ? "voie--complete" : ""} ${owned ? "voie--owned" : ""}"
             data-voie-id="${v.id}" style="--voie-hue:${v.hue};">
          <div class="voie-head">
            <span class="voie-icon">${v.icon}</span>
            <span class="voie-name">${escapeHtml(localized(v.name))}</span>
            <span class="voie-progress">${p.done}/${p.total}</span>
          </div>
          <div class="voie-flavor">${escapeHtml(localized(v.flavor))}</div>
          <div class="voie-bar">
            <div class="voie-bar-fill" style="width:${pct}%"></div>
          </div>
          ${owned ? `
            <div class="voie-reward">
              ✦ <em>${escapeHtml(localized(v.reward.title))}</em> obtenue
            </div>
          ` : ""}
        </div>
      `;
    }).join("");
  }

  function escapeHtml(s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function init() { /* nothing eager — loadData() is lazy */ }

  window.Voies = {
    init,
    checkProgress,
    renderStrip,
    progressFor,
    isMarqueOwned,
    loadData,
  };
})();
