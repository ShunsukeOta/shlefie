"use client";

import { useEffect, useState } from "react";

export default function PwaDebugBadge() {
  const [mode, setMode] = useState("unknown");

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-expect-error iOS Safari
      window.navigator.standalone === true;
    setMode(isStandalone ? "standalone" : "browser");
  }, []);

  return (
    <div className="fixed right-3 top-3 z-[60] rounded-full bg-[#222] px-2 py-1 text-[10px] text-[#f9f9f9]">
      PWA: {mode}
    </div>
  );
}
