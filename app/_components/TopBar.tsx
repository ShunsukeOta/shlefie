import type { ReactNode } from "react";

type TopBarProps = {
  title?: string;
  rightSlot?: ReactNode;
};

export default function TopBar({ title, rightSlot }: TopBarProps) {
  return (
    <header
      className="w-full text-white flex-shrink-0"
      style={{ backgroundColor: "#000000", paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="mx-auto flex w-full max-w-[480px] items-center justify-between px-4 py-4 text-white">
        <div className="flex items-center gap-2 text-[15px] font-medium tracking-[0.02em]">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-6 w-6 fill-current"
          >
            <rect x="4" y="3" width="4" height="18" rx="1.5" />
            <rect x="10" y="3" width="4" height="18" rx="1.5" />
            <rect x="16" y="3" width="4" height="18" rx="1.5" />
          </svg>
          <span>Shelfie</span>
          {title ? <span className="text-[11px] text-white/70">{title}</span> : null}
        </div>
        {rightSlot ?? <span />}
      </div>
    </header>
  );
}
