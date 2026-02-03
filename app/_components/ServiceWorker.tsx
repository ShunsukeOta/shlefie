"use client";

import { useEffect } from "react";

export default function ServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
    if (window.matchMedia("(display-mode: standalone)").matches) {
      document.body.classList.add("pwa");
    }
  }, []);

  return null;
}
