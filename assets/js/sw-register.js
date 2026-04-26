// Service worker registration.
// Loads after the app so registration never blocks initial render.

(function () {
  "use strict";

  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker
      // updateViaCache: "none" tells the browser to always fetch sw.js from
      // the network (skipping the HTTP cache), so deployed updates are
      // detected immediately on next page load.
      .register("sw.js", { scope: "./", updateViaCache: "none" })
      .then((reg) => {
        // Force an update check on every page load.
        try { reg.update(); } catch (_) {}
        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          if (!newWorker) return;
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              // New SW is ready; tell it to take over immediately.
              try { newWorker.postMessage("SKIP_WAITING"); } catch (_) {}
              console.info("[PyDA] Update installed — activating now.");
            }
          });
        });
      })
      .catch((err) => {
        console.warn("[PyDA] Service worker registration failed:", err);
      });

    // Reload once when the controller changes (new SW activates).
    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
  });
})();
