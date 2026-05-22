import { useLayoutEffect } from "react";

/*
  Custom hook to lazily load Fabric.js (if not already loaded)
  and expose it via callback once available.
*/
export default function useFabricLib(onLoaded) {

  useLayoutEffect(() => {

    // If Fabric is already available globally, use it immediately
    if (window.fabric) {
      onLoaded(window.fabric);
      return;
    }

    // If Fabric is already being loaded elsewhere, reuse the same promise
    if (window._fabricLoadingPromise) {
      window._fabricLoadingPromise.then(onLoaded);
      return;
    }

    // Create a shared loading promise so multiple components don't reload script
    window._fabricLoadingPromise = new Promise((resolve, reject) => {

      // Check if script tag already exists in DOM
      const existing = Array.from(document.head.querySelectorAll("script")).find(
        s => s.src && s.src.includes("fabric.min.js")
      );

      // If script exists, attach listeners instead of adding again
      if (existing) {
        existing.addEventListener("load", () => {
          resolve(window.fabric);
          onLoaded(window.fabric);
        });
        existing.addEventListener("error", reject);
        return;
      }

      // Otherwise inject Fabric.js from CDN
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.1/fabric.min.js";

      // Resolve once library is loaded
      s.onload = () => {
        resolve(window.fabric);
        onLoaded(window.fabric);
      };

      // Fail-safe if script fails to load
      s.onerror = reject;

      document.head.appendChild(s);
    });

  }, [onLoaded]);
}