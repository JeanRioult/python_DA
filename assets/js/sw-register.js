// Service worker registration.
// Loads after the app so registration never blocks initial render.

(function () {
  "use strict";

  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("sw.js", { scope: "./" })
      .then((reg) => {
        // When a new SW is installed, prompt the user (silently, via console for now)
        // to reload so they pick up updates. Silent because MVP — can become a banner later.
        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          if (!newWorker) return;
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              console.info(
                "[PyDA] A new version is available. Close the app or reload to apply."
              );
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
