import { useLayoutEffect } from "react";

export default function useFabricLib(onLoaded) {
  useLayoutEffect(() => {
    if (window.fabric) {
      onLoaded(window.fabric);
      return;
    }

    if (window._fabricLoadingPromise) {
      window._fabricLoadingPromise.then(onLoaded);
      return;
    }

    window._fabricLoadingPromise = new Promise((resolve, reject) => {
      const existing = Array.from(document.head.querySelectorAll("script")).find(
        s => s.src && s.src.includes("fabric.min.js")
      );
      if (existing) {
        existing.addEventListener("load", () => {
          resolve(window.fabric);
          onLoaded(window.fabric);
        });
        existing.addEventListener("error", reject);
        return;
      }

      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.1/fabric.min.js";
      s.onload = () => {
        resolve(window.fabric);
        onLoaded(window.fabric);
      };
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }, [onLoaded]);
}
