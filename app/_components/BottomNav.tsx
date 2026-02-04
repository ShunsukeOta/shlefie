"use client";

import Link from "next/link";
import { useRegisterModal } from "./RegisterModalProvider";

type NavItem = {
  href: string;
  label: string;
  key: "shelf" | "timeline" | "summary" | "me";
  icon: React.ReactNode;
};

type BottomNavProps = {
  active: "shelf" | "timeline" | "summary" | "me";
};

export default function BottomNav({ active }: BottomNavProps) {
  const { openRegister } = useRegisterModal();
  const items: NavItem[] = [
    {
      key: "shelf",
      href: "/",
      label: "本棚",
      icon: (
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-full w-full fill-current"
        >
          <rect x="4" y="4" width="4" height="16" rx="1.5" />
          <rect x="10" y="4" width="4" height="16" rx="1.5" />
          <rect x="16" y="4" width="4" height="16" rx="1.5" />
        </svg>
      ),
    },
    {
      key: "timeline",
      href: "/timeline",
      label: "タイムライン",
      icon: (
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-full w-full fill-current"
        >
          <circle cx="6" cy="6.5" r="2" />
          <circle cx="6" cy="12" r="2" />
          <circle cx="6" cy="17.5" r="2" />
          <rect x="10" y="5.5" width="9" height="2" rx="1" />
          <rect x="10" y="11" width="9" height="2" rx="1" />
          <rect x="10" y="16.5" width="9" height="2" rx="1" />
        </svg>
      ),
    },
    {
      key: "summary",
      href: "/summary",
      label: "まとめ",
      icon: (
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-full w-full fill-current"
        >
          <rect x="5" y="6" width="14" height="2" rx="1" />
          <rect x="5" y="11" width="10" height="2" rx="1" />
          <rect x="5" y="16" width="12" height="2" rx="1" />
        </svg>
      ),
    },
    {
      key: "me",
      href: "/me",
      label: "マイページ",
      icon: (
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-full w-full fill-current"
        >
          <circle cx="12" cy="8" r="3.5" />
          <rect x="5" y="14" width="14" height="6" rx="3" />
        </svg>
      ),
    },
  ];

  const ordered = [
    items.find((item) => item.key === "shelf"),
    items.find((item) => item.key === "timeline"),
    "register",
    items.find((item) => item.key === "summary"),
    items.find((item) => item.key === "me"),
  ] as const;

  return (
    <div className="fixed bottom-6 left-1/2 z-10 w-[min(92vw,420px)] -translate-x-1/2">
      <nav className="grid h-18 grid-cols-5 items-center gap-2 rounded-full border border-[#e6e6e6] bg-white px-2 py-2">
        {ordered.map((entry) => {
          if (entry === "register") {
            return (
              <button
                key="register"
                type="button"
                aria-label="登録"
                className="grid h-full w-full place-items-center rounded-full border border-[#e6e6e6] bg-[#334455] text-[#f9f9f9] shadow-[0_8px_20px_rgba(0,0,0,0.2)] transition-colors duration-300 hover:bg-[#2a3949]"
                onClick={openRegister}
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-7 w-7 fill-current"
                >
                  <rect x="10.5" y="5.5" width="3" height="13" rx="1.5" />
                  <rect x="5.5" y="10.5" width="13" height="3" rx="1.5" />
                </svg>
              </button>
            );
          }

          if (!entry) return null;

          const isActive = active === entry.key;
          const iconSize = "h-7 w-7";

          return (
            <Link
              key={entry.key}
              className={`flex h-full w-full items-center justify-center rounded-full px-2 py-2 text-[11px] transition-colors duration-300 ${
                isActive ? "bg-[#222] text-[#f9f9f9]" : "text-[#6b6b6b]"
              }`}
              href={entry.href}
              aria-label={entry.label}
            >
              <span className={`inline-flex items-center justify-center ${iconSize}`}>
                {entry.icon}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
