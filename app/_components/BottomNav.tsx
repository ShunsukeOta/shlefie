"use client";

import Link from "next/link";
import { useRegisterModal } from "./RegisterModalProvider";

type NavItem = {
  href: string;
  label: string;
  key: "shelf" | "summary" | "me";
  icon: React.ReactNode;
};

type BottomNavProps = {
  active: "shelf" | "summary" | "me";
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
          className="h-6 w-6 fill-current"
        >
          <rect x="4" y="4" width="4" height="16" rx="1.5" />
          <rect x="10" y="4" width="4" height="16" rx="1.5" />
          <rect x="16" y="4" width="4" height="16" rx="1.5" />
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
          className="h-5 w-5 fill-current"
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
          className="h-5 w-5 fill-current"
        >
          <circle cx="12" cy="8" r="3.5" />
          <rect x="5" y="14" width="14" height="6" rx="3" />
        </svg>
      ),
    },
  ];

  return (
    <div className="fixed bottom-3 left-1/2 z-10 flex w-[min(92vw,420px)] -translate-x-1/2 items-center gap-2">
      <nav className="flex h-16 flex-1 justify-between gap-3 rounded-full border border-[#e6e6e6] bg-white px-1.5 py-1">
        {items.map((item) => (
          <Link
            key={item.key}
            className={`flex flex-1 flex-col items-center justify-center gap-1 rounded-full px-2 py-1.5 text-[11px] transition-colors duration-300 ${
              active === item.key ? "bg-[#222] text-[#f9f9f9]" : "text-[#6b6b6b]"
            }`}
            href={item.href}
          >
            <span className="inline-flex h-6 w-6 items-center justify-center">
              {item.icon}
            </span>
            <span className="text-[10px]">{item.label}</span>
          </Link>
        ))}
      </nav>
      <button
        type="button"
        aria-label="登録"
        className="grid h-16 w-16 place-items-center rounded-full bg-[#1f3c78] text-[#f9f9f9] shadow-[0_8px_20px_rgba(0,0,0,0.2)] transition-colors duration-300 hover:bg-[#23468a]"
        onClick={openRegister}
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-6 w-6 fill-current"
        >
          <rect x="10.5" y="5.5" width="3" height="13" rx="1.5" />
          <rect x="5.5" y="10.5" width="13" height="3" rx="1.5" />
        </svg>
      </button>
    </div>
  );
}
