"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type NetworkContextValue = {
  isOnline: boolean;
  requireOnline: () => boolean;
};

const NetworkContext = createContext<NetworkContextValue | null>(null);

export function useNetworkStatus() {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error("useNetworkStatus must be used within NetworkStatusProvider");
  }
  return context;
}

export default function NetworkStatusProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const updateStatus = () => setIsOnline(navigator.onLine);
    updateStatus();
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);
    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, []);

  const value = useMemo(
    () => ({
      isOnline,
      requireOnline: () => {
        if (navigator.onLine) {
          return true;
        }
        window.alert("オフラインです。通信環境を確認してください。");
        return false;
      },
    }),
    [isOnline]
  );

  return (
    <NetworkContext.Provider value={value}>
      {!isOnline && (
        <div className="fixed inset-x-0 top-0 z-50 bg-[#222] px-4 py-2 text-center text-[11px] text-[#f9f9f9]">
          オフラインです。通信環境を確認してください。
        </div>
      )}
      {children}
    </NetworkContext.Provider>
  );
}
