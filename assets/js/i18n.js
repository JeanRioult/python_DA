/* Language toggle and UI strings.
   Minimal i18n: two languages (fr, en), per-key strings for chrome UI.
   Lesson bodies are loaded from separate .fr.md / .en.md files. */

(function () {
  "use strict";

  const STRINGS = {
    fr: {
      brand: "Python DA",
      toc: "Sommaire",
      settings: "Paramètres",
      search: "Rechercher",
      semester: "Semestre",
      theme: "Thème",
      themeLight: "Clair",
      themeDark: "Sombre",
      font: "Police",
      fontHyperlegible: "Atkinson Hyperlegible",
      fontDyslexic: "OpenDyslexic",
      fontSystem: "Système",
      width: "Largeur de lecture",
      widthStandard: "Standard (68 car.)",
      widthWide: "Large (90 car.)",
      widthFull: "Pleine largeur",
      stimLegend: "Mode faible stimulation",
      stimLabel: "Activer (TDAH)",
      progress: "Progression",
      export: "Exporter",
      import: "Importer",
      reset: "Tout réinitialiser",
      resetConfirm: "Réinitialiser toute ta progression ? Cette action est irréversible.",
      complete: "Terminer et continuer",
      completed: "✓ Leçon terminée",
      completeHint: "Appuie uniquement quand tu as vraiment fait les exercices.",
      flashcardsLegend: "Flashcards",
      cardsBtn: (n) => `🗂 Cartes (${n})`,
      cardsReviewBtn: "Réviser les cartes de ce chapitre",
      cardsCountHint: (n) => `Ce chapitre contient ${n} carte${n > 1 ? "s" : ""} à réviser.`,
      cardsNoneHint: "Ce chapitre n'a pas encore de flashcards.",
      cardReveal: "Montrer la réponse",
      cardHide: "Cacher la réponse",
      cardTapHint: "Clique sur la carte pour retourner.",
      loading: "Chargement…",
      notFound: "Leçon introuvable. Vérifie que le fichier existe.",
      skipToMain: "Aller au contenu principal",
      estMinutes: (n) => `≈ ${n} minutes`,
      searchPlaceholder: "Rechercher dans le cours…",
      searchPrompt: "Tape au moins un mot. Raccourci : / ou Ctrl/⌘+K.",
      searchNoResults: "Aucun résultat.",
      searchCount: (n) => `${n} résultat${n > 1 ? "s" : ""}`,
      closeLabel: "Fermer",
    },
    en: {
      brand: "Python DA",
      toc: "Contents",
      settings: "Settings",
      search: "Search",
      semester: "Semester",
      theme: "Theme",
      themeLight: "Light",
      themeDark: "Dark",
      font: "Font",
      fontHyperlegible: "Atkinson Hyperlegible",
      fontDyslexic: "OpenDyslexic",
      fontSystem: "System",
      width: "Reading width",
      widthStandard: "Standard (68 chars)",
      widthWide: "Wide (90 chars)",
      widthFull: "Full width",
      stimLegend: "Low-stimulation mode",
      stimLabel: "Enable (ADHD)",
      progress: "Progress",
      export: "Export",
      import: "Import",
      reset: "Reset everything",
      resetConfirm: "Reset all your progress? This cannot be undone.",
      complete: "Finish & continue",
      completed: "✓ Lesson finished",
      completeHint: "Only press this once you have actually done the exercises.",
      flashcardsLegend: "Flashcards",
      cardsBtn: (n) => `🗂 Cards (${n})`,
      cardsReviewBtn: "Review this chapter's cards",
      cardsCountHint: (n) => `This chapter has ${n} card${n > 1 ? "s" : ""} to review.`,
      cardsNoneHint: "This chapter has no flashcards yet.",
      cardReveal: "Show answer",
      cardHide: "Hide answer",
      cardTapHint: "Tap the card to flip.",
      loading: "Loading…",
      notFound: "Lesson not found. Check the file exists.",
      skipToMain: "Skip to main content",
      estMinutes: (n) => `≈ ${n} minutes`,
      searchPlaceholder: "Search the course…",
      searchPrompt: "Type at least one word. Shortcut: / or Ctrl/⌘+K.",
      searchNoResults: "No results.",
      searchCount: (n) => `${n} result${n > 1 ? "s" : ""}`,
      closeLabel: "Close",
    },
  };

  const I18N = {
    current: "fr",
    set(lang) {
      if (!STRINGS[lang]) return;
      this.current = lang;
      document.documentElement.lang = lang;
      localStorage.setItem("pyda.lang", lang);
      this.applyChrome();
    },
    t(key, ...args) {
      const s = STRINGS[this.current][key];
      return typeof s === "function" ? s(...args) : s;
    },
    applyChrome() {
      const q = (sel) => document.querySelector(sel);
      const setText = (sel, val) => { const el = q(sel); if (el) el.textContent = val; };

      setText(".skip-link", this.t("skipToMain"));
      setText(".brand", this.t("brand"));

      const tocBtn = q("#toc-toggle");
      if (tocBtn) tocBtn.setAttribute("aria-label", this.t("toc"));
      setText("#toc h2", this.t("toc"));

      const searchBtn = q("#search-toggle");
      if (searchBtn) searchBtn.setAttribute("aria-label", this.t("search"));
      setText("#search h2", this.t("search"));
      const searchInput = q("#search-input");
      if (searchInput) searchInput.placeholder = this.t("searchPlaceholder");
      const searchClose = q("#search-close");
      if (searchClose) searchClose.setAttribute("aria-label", this.t("closeLabel"));

      const setBtn = q("#settings-toggle");
      if (setBtn) setBtn.setAttribute("aria-label", this.t("settings"));
      setText("#settings h2", this.t("settings"));

      const langBtn = q("#lang-toggle");
      if (langBtn) {
        langBtn.textContent = this.current.toUpperCase();
        langBtn.dataset.current = this.current;
      }

      const fieldsets = document.querySelectorAll("#settings fieldset legend");
      const fsLabels = [
        this.t("theme"),
        this.t("font"),
        this.t("width"),
        this.t("stimLegend"),
        this.t("flashcardsLegend"),
        this.t("progress"),
      ];
      fieldsets.forEach((fs, i) => {
        if (fsLabels[i]) fs.textContent = fsLabels[i];
      });

      const labels = document.querySelectorAll("#settings label");
      const labelTexts = [
        this.t("themeLight"),
        this.t("themeDark"),
        this.t("fontHyperlegible"),
        this.t("fontDyslexic"),
        this.t("fontSystem"),
        this.t("widthStandard"),
        this.t("widthWide"),
        this.t("widthFull"),
        this.t("stimLabel"),
      ];
      labels.forEach((lab, i) => {
        const input = lab.querySelector("input");
        if (!input || !labelTexts[i]) return;
        lab.innerHTML = "";
        lab.appendChild(input);
        lab.appendChild(document.createTextNode(" " + labelTexts[i]));
      });

      setText("#progress-export", this.t("export"));
      setText("#progress-import", this.t("import"));
      setText("#progress-reset", this.t("reset"));
      setText(".cta-hint", this.t("completeHint"));
      setText("#cards-review", this.t("cardsReviewBtn"));

      const cta = q("#complete-btn");
      if (cta && !cta.classList.contains("done")) cta.textContent = this.t("complete");
      else if (cta) cta.textContent = this.t("completed");

      // Re-render search prompt if visible
      const empty = q("#search-empty");
      if (empty && !empty.hidden) empty.textContent = this.t("searchPrompt");
    },
    init() {
      const stored = localStorage.getItem("pyda.lang");
      this.set(stored || "fr");
    },
  };

  window.I18N = I18N;
})();
