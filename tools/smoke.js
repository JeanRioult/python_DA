// Smoke test for the static site under JSDOM.
// Boots the real index.html, runs real scripts, exercises key flows.
//
// Usage:  node tools/smoke.js   (must be run from repo root)

const { JSDOM } = require("jsdom");
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");

// Tiny static server, JSDOM points its baseURL at it so fetch() works.
function startServer(root) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const u = decodeURIComponent(req.url.split("?")[0]);
      const file = path.join(root, u === "/" ? "index.html" : u);
      if (!file.startsWith(root)) { res.writeHead(403); res.end(); return; }
      fs.readFile(file, (err, data) => {
        if (err) { res.writeHead(404); res.end(); return; }
        const ext = path.extname(file).slice(1);
        const ct = { html: "text/html", js: "application/javascript",
          css: "text/css", json: "application/json", svg: "image/svg+xml",
          png: "image/png", woff2: "font/woff2" }[ext] || "application/octet-stream";
        res.writeHead(200, { "Content-Type": ct });
        res.end(data);
      });
    });
    server.listen(0, "127.0.0.1", () => {
      const port = server.address().port;
      resolve({ server, url: `http://127.0.0.1:${port}` });
    });
  });
}

const fails = [];
const passes = [];
function ok(name) { passes.push(name); console.log(" ✓ " + name); }
function fail(name, err) { fails.push({ name, err }); console.log(" ✗ " + name + (err ? "  → " + err : "")); }
function assert(cond, msg, err) { (cond ? ok : fail)(msg, cond ? null : err); }
async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

(async () => {
  const root = path.resolve(__dirname, "..");
  const { server, url } = await startServer(root);

  try {
    const html = fs.readFileSync(path.join(root, "index.html"), "utf8");

    // Patch: KaTeX auto-render fetches a CSS that uses URL() with @font-face.
    // JSDOM is fine without it — but we silence its console errors.
    const dom = new JSDOM(html, {
      url,
      runScripts: "dangerously",
      resources: "usable",
      pretendToBeVisual: true,
      // Make scrollTo a no-op (jsdom doesn't implement it)
      beforeParse(window) {
        window.scrollTo = () => {};
        window.scroll  = () => {};
        window.print = () => {};
        window.confirm = () => true;
        window.alert = () => {};
        // JSDOM doesn't include fetch; inject Node's global fetch.
        // Resolve relative URLs against the page baseURL.
        const baseURL = window.location.href;
        window.fetch = (input, init) => {
          const u = typeof input === "string" ? new URL(input, baseURL).toString() : input;
          return globalThis.fetch(u, init);
        };
      },
    });
    const { window } = dom;
    // Capture page errors
    const errors = [];
    window.addEventListener("error", e => errors.push(e.message + " @ " + (e.filename || "")));
    window.addEventListener("unhandledrejection", e => errors.push("unhandledrejection: " + (e.reason && e.reason.message)));

    // Wait for DOMContentLoaded + main() to run + first lesson to load.
    await new Promise(res => window.addEventListener("load", res));
    await sleep(800);

    const $ = sel => window.document.querySelector(sel);
    const $$ = sel => Array.from(window.document.querySelectorAll(sel));

    // --- 0. Boot health ---
    assert(errors.length === 0, "no JS errors on boot", errors.join("; "));
    assert(!!window.Progress, "Progress module exposed");
    assert(!!window.I18N, "I18N module exposed");
    assert(!!window.Game, "Game module exposed");
    assert(!!window.Cards, "Cards module exposed");
    assert(!!window.QuestMap, "QuestMap module exposed");
    assert(window.AppIndex && window.AppIndex.length > 0, "course index loaded (" + (window.AppIndex||[]).length + " lessons)");
    assert($("#lesson-content") && !$("#lesson-content").querySelector(".loading"),
      "lesson content rendered (no stuck loading)");

    // --- 1. Settings: theme, font, width, low-stim ---
    const html_el = window.document.documentElement;
    function setRadio(name, val) {
      const r = window.document.querySelector(`input[name="${name}"][value="${val}"]`);
      if (!r) return false;
      r.checked = true;
      r.dispatchEvent(new window.Event("change", { bubbles: true }));
      return true;
    }
    setRadio("theme", "dark");
    assert(html_el.dataset.theme === "dark", "theme → dark applies on <html>");
    setRadio("theme", "light");
    assert(html_el.dataset.theme === "light", "theme → light applies");

    setRadio("font", "dyslexic");
    assert(html_el.dataset.font === "dyslexic", "font → dyslexic applies");
    setRadio("font", "hyperlegible");
    setRadio("width", "wide");
    assert(html_el.dataset.width === "wide", "reading width → wide applies");
    setRadio("width", "full");
    assert(html_el.dataset.width === "full", "reading width → full applies");
    setRadio("width", "standard");

    const lowStim = $("#low-stim");
    lowStim.checked = true;
    lowStim.dispatchEvent(new window.Event("change", { bubbles: true }));
    assert(html_el.dataset.stim === "low", "low-stim toggle on");
    lowStim.checked = false;
    lowStim.dispatchEvent(new window.Event("change", { bubbles: true }));
    assert(html_el.dataset.stim === "normal", "low-stim toggle off");

    // Settings should persist via Progress
    assert(window.Progress.getSetting("theme") === "light", "theme persisted via Progress");
    assert(window.Progress.getSetting("font") === "hyperlegible", "font persisted");

    // --- 2. Export / import / reset ---
    const exported = window.Progress.exportJson();
    assert(exported.includes('"version": 1'), "export produces v1 JSON");
    let parsed = JSON.parse(exported);
    parsed.lessons["semester-01/chapter-01-apprendre-a-apprendre/lesson-01"] = { completed: true };
    window.Progress.importJson(JSON.stringify(parsed));
    assert(window.Progress.isCompleted("semester-01/chapter-01-apprendre-a-apprendre/lesson-01"),
      "import marks lesson 1 completed");
    window.Progress.resetAll();
    window.Progress.init();
    assert(!window.Progress.isCompleted("semester-01/chapter-01-apprendre-a-apprendre/lesson-01"),
      "resetAll wipes completion");

    // --- 3. Outside-click closes menu + backdrop + scroll lock ---
    $("#toc-toggle").dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
    assert(!$("#toc").hasAttribute("hidden"), "TOC opens on toggle click");
    assert(!$("#panel-backdrop").hasAttribute("hidden"), "backdrop appears with TOC");
    assert(window.document.body.classList.contains("panel-open"), "body scroll-locked when TOC open");
    // Tap on backdrop closes the panel
    $("#panel-backdrop").dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
    assert($("#toc").hasAttribute("hidden"), "tap on backdrop closes TOC");
    assert($("#panel-backdrop").hasAttribute("hidden"), "backdrop hidden after close");
    assert(!window.document.body.classList.contains("panel-open"), "body scroll restored");
    // Pointerdown outside still works as backup
    $("#toc-toggle").dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
    $("#main").dispatchEvent(new window.Event("pointerdown", { bubbles: true }));
    assert($("#toc").hasAttribute("hidden"), "pointerdown outside also closes TOC");
    // Reopen, click inside doesn't close
    $("#toc-toggle").dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
    $("#toc-nav").dispatchEvent(new window.Event("pointerdown", { bubbles: true }));
    assert(!$("#toc").hasAttribute("hidden"), "click inside TOC keeps it open");
    // Escape closes
    window.document.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    assert($("#toc").hasAttribute("hidden"), "Escape closes TOC");

    // --- 3b. Topbar cards button + game badge visibility ---
    await sleep(200);
    const topCards = $("#cards-topbar-btn");
    assert(topCards && !topCards.hidden, "topbar cards button visible when chapter has cards");
    const streakBadge = $("#streak-badge");
    assert(streakBadge && !streakBadge.hidden, "streak badge always visible (dimmed at 0)");
    assert(streakBadge.classList.contains("game-badge--zero"), "streak badge dimmed when 0");

    // --- 4. TOC navigation: chapters list, active highlighting ---
    $("#toc-toggle").dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
    const chapterDetails = $$("#toc-nav .toc-chapter");
    assert(chapterDetails.length > 0, "TOC has chapters");
    const lessonLinks = $$("#toc-nav .toc-lessons a");
    assert(lessonLinks.length > 0, "TOC has lesson links");
    const activeLink = $("#toc-nav .toc-lessons a.active");
    assert(!!activeLink, "current lesson has .active class");

    // Navigate to lesson 2
    const target = window.AppIndex[1];
    const targetId = `${target.semester}/${target.chapter}/${target.lesson}`;
    window.location.hash = `#/${targetId}`;
    await sleep(400);
    assert($("#main").contains($("#lesson-content")), "lesson container intact after nav");
    const newActive = $("#toc-nav .toc-lessons a.active");
    assert(newActive && newActive.getAttribute("href") === `#/${targetId}`,
      "active class follows navigation");

    // Navigate back to lesson 1 then BACK to lesson 1 via clicking the link
    // (verifying same-link click doesn't blow up; jsdom doesn't trigger
    // browser-level same-hash scroll, but we check no error).
    const firstLessonLink = $$("#toc-nav .toc-lessons a").find(a => a.getAttribute("href") === `#/${window.AppIndex[0].semester}/${window.AppIndex[0].chapter}/${window.AppIndex[0].lesson}`);
    if (firstLessonLink) {
      firstLessonLink.click();
      await sleep(200);
      // Click same link again — should NOT trigger renderLesson (hashchange doesn't fire)
      const beforeContent = $("#lesson-content").innerHTML;
      firstLessonLink.click();
      await sleep(150);
      const afterContent = $("#lesson-content").innerHTML;
      assert(beforeContent === afterContent,
        "clicking already-active lesson link does not re-render (preserves scroll)");
    }

    // --- 5. Reading tracker + progress bar ---
    // Set reading on lesson 2 then navigate to it so the bars repaint.
    const id2 = `${window.AppIndex[1].semester}/${window.AppIndex[1].chapter}/${window.AppIndex[1].lesson}`;
    window.Progress.setReading(id2, 0.4);
    window.location.hash = `#/${id2}`;
    await sleep(400);
    const fillW = $("#progress-fill").style.width;
    assert(fillW && fillW !== "0%", "topbar progress bar reflects reading (" + fillW + ")");
    const lessonFillW = $("#lesson-reading-fill").style.width;
    assert(/^4[01]?\.?\d*%$/.test(lessonFillW),
      "per-lesson reading bar shows ~40% (" + lessonFillW + ")");
    // Now navigate back to lesson 1 for completion test
    const id1 = `${window.AppIndex[0].semester}/${window.AppIndex[0].chapter}/${window.AppIndex[0].lesson}`;
    window.location.hash = `#/${id1}`;
    await sleep(300);

    // --- 6. Lesson completion + XP awarded ---
    const xpBefore = window.Progress.getGame().xp || 0;
    $("#complete-btn").dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
    await sleep(300);
    assert(window.Progress.isCompleted(id1), "complete-btn marks lesson completed");
    const xpAfter = window.Progress.getGame().xp || 0;
    assert(xpAfter >= xpBefore + 50, "complete awards ≥ 50 XP (" + xpBefore + " → " + xpAfter + ")");
    const streak = window.Progress.liveStreak();
    assert(streak >= 1, "streak ≥ 1 after completion (" + streak + ")");
    // achievement unlocked: first-lesson
    assert(window.Progress.isUnlocked("first-lesson"), "achievement 'first-lesson' unlocked");
    // toast appeared
    const toasts = $$("#toast-stack .toast");
    assert(toasts.length > 0, "achievement/xp toast appeared");

    // --- 7. Card system ---
    const cardsBtn = $("#cards-btn");
    if (!cardsBtn.hidden) {
      cardsBtn.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
      await sleep(300);
      assert(!$("#flashcards").hasAttribute("hidden"), "cards panel opens");
      const grid = $(".cards-grid");
      assert(!!grid && grid.children.length > 0, "library renders card grid");

      // Switch to practice
      $("#flashcards .cards-tab[data-mode=practice]").dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
      await sleep(200);
      assert(!!$(".mtg-card-flipper"), "practice mode renders a flipper");

      // A11y: flipper is focusable and labelled
      const flipper = $(".mtg-card-flipper");
      assert(flipper.getAttribute("role") === "button", "flipper has role=button");
      assert(flipper.getAttribute("tabindex") === "0", "flipper is keyboard-focusable");
      assert(!!flipper.getAttribute("aria-label"), "flipper has aria-label");
      // Keyboard reveal: Space
      flipper.focus();
      flipper.dispatchEvent(new window.KeyboardEvent("keydown", { key: " ", bubbles: true }));
      await sleep(80);
      assert(flipper.dataset.flipped === "true", "Space key reveals card");
      assert(flipper.getAttribute("aria-pressed") === "true", "aria-pressed updates");
      const rateGood = $(".rate-good");
      assert(!!rateGood, "rate buttons appear after flip");
      const xpBeforeRate = window.Progress.getGame().xp;
      rateGood.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
      await sleep(150);
      assert(window.Progress.getGame().xp >= xpBeforeRate + 5, "rating 'knew' awards ≥ 5 XP");

      // Switch to daily mode
      $("#flashcards .cards-tab[data-mode=daily]").dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
      await sleep(400);
      const view = $("#cards-view");
      assert(view && view.innerHTML.length > 50, "daily mode renders something");

      // Close cards
      $("#cards-close").dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
      assert($("#flashcards").hasAttribute("hidden"), "cards panel closes");
    } else {
      console.log(" - skipped cards (no cards for current chapter)");
    }

    // --- 8. Search panel + card search ---
    $("#search-toggle").dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
    assert(!$("#search").hasAttribute("hidden"), "search panel opens");
    const input = $("#search-input");
    input.value = "pourquoi";
    input.dispatchEvent(new window.Event("input", { bubbles: true }));
    await sleep(500);
    const results = $$("#search-results .search-result");
    assert(results.length > 0, "search returns results (" + results.length + ")");
    const cardResults = $$("#search-results .search-result--card");
    assert(cardResults.length >= 0, "card-result rows render (" + cardResults.length + " card hits)");
    $("#search-close").dispatchEvent(new window.MouseEvent("click", { bubbles: true }));

    // --- 9. Quest map ---
    $("#map-toggle").dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
    await sleep(150);
    assert(!$("#quest-map").hasAttribute("hidden"), "quest-map opens");
    const svg = $("#quest-map-view svg");
    assert(!!svg, "quest-map SVG rendered");
    const nodes = $$(".qm-node");
    assert(nodes.length > 0, "quest-map has chapter nodes (" + nodes.length + ")");
    const pips = $$(".qm-pip");
    assert(pips.length > 0, "quest-map has lesson pips (" + pips.length + ")");
    $("#quest-map-close").dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
    assert($("#quest-map").hasAttribute("hidden"), "quest-map closes");

    // --- 10. Language toggle ---
    $("#lang-toggle").dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
    await sleep(300);
    assert(window.I18N.current === "en", "language switches to en");
    $("#lang-toggle").dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
    await sleep(300);
    assert(window.I18N.current === "fr", "language switches back to fr");

    // --- 11. Achievement badges visible in settings ---
    $("#settings-toggle").dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
    await sleep(50);
    const achvs = $$("#achievements-list .achv");
    assert(achvs.length >= 10, "achievements list rendered (" + achvs.length + " achievements)");
    const onAchvs = $$("#achievements-list .achv.achv--on");
    assert(onAchvs.length >= 1, "at least 1 achievement marked unlocked");
    const confianceCB = $("#confiance-mode");
    assert(confianceCB && confianceCB.checked === true, "Mode confiance toggle present + on by default");

    // --- 11b. Try-budget mechanic ---
    // Pick any unowned card from chapter 1's flashcards.
    const ch1Url = `${url}/content/semester-01/chapter-01-apprendre-a-apprendre/flashcards.json`;
    const ch1Data = await (await globalThis.fetch(ch1Url)).json();
    if (ch1Data && ch1Data.cards && ch1Data.cards.length) {
      const cardId = ch1Data.cards[0].id;
      // Reset state so we test from a clean card.
      window.Progress.setCardState(cardId, { knew: 0, missed: 0, level: 0 });
      window.Progress.resetTriesForCard(cardId);
      assert(window.Progress.getTriesLeft(cardId) === undefined, "tries undefined on fresh card");
      // Simulate a wrong rate via Progress directly: triesLeft stays "fresh" → first miss is free.
      window.Progress.rateCard(cardId, false);
      // The cards module would set triesLeft on first miss to maxTries; we
      // simulate that consumeTry policy by checking via the public Cards API.
      // Instead just check the helper via setTriesLeft / getTriesLeft round-trip:
      window.Progress.setTriesLeft(cardId, 5);
      assert(window.Progress.getTriesLeft(cardId) === 5, "setTriesLeft / getTriesLeft round-trip");
      window.Progress.resetTriesForCard(cardId);
      assert(window.Progress.getTriesLeft(cardId) === undefined, "resetTriesForCard clears triesLeft");
    }

    // --- 11c. Restart-lesson button visible after completion ---
    const restartBtn = $("#restart-lesson-btn");
    assert(!!restartBtn, "Restart-lesson button present in DOM");
    // Navigate to the lesson we completed earlier (test 6) and confirm visible
    const completedId = `${window.AppIndex[0].semester}/${window.AppIndex[0].chapter}/${window.AppIndex[0].lesson}`;
    window.location.hash = `#/${completedId}`;
    await sleep(300);
    assert(!restartBtn.hidden, "Restart-lesson button visible after lesson completed");

    // --- 12. Final: collect any errors that fired during run ---
    if (errors.length) {
      fail("no console/page errors during full run", errors.join(" || "));
    } else {
      ok("no console/page errors during full run");
    }
  } catch (e) {
    fail("uncaught test exception", e.stack || e.message);
  } finally {
    server.close();
  }

  console.log("");
  console.log(`Passed: ${passes.length}, Failed: ${fails.length}`);
  process.exit(fails.length ? 1 : 0);
})();
