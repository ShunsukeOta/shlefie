import type { ReactNode } from "react";

type TopBarProps = {
  title: string;
  rightSlot?: ReactNode;
};

export default function TopBar({ title, rightSlot }: TopBarProps) {
  return (
    <header className="mx-auto flex w-full max-w-[480px] items-center justify-between px-4 pb-2 pt-4">
      <div className="text-[15px] font-semibold tracking-[0.02em]">{title}</div>
      {rightSlot ?? <span />}
    </header>
  );
}
