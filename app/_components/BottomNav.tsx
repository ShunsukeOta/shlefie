import Link from "next/link";

type NavItem = {
  href: string;
  label: string;
  key: "shelf" | "register" | "me";
  icon: JSX.Element;
};

type BottomNavProps = {
  active: "shelf" | "register" | "me";
};

export default function BottomNav({ active }: BottomNavProps) {
  const items: NavItem[] = [
    {
      key: "shelf",
      href: "/",
      label: "本棚",
      icon: (
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-4 w-4 fill-current"
        >
          <rect x="4" y="4" width="4" height="16" rx="1.5" />
          <rect x="10" y="4" width="4" height="16" rx="1.5" />
          <rect x="16" y="4" width="4" height="16" rx="1.5" />
        </svg>
      ),
    },
    {
      key: "register",
      href: "/register",
      label: "登録",
      icon: (
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-4 w-4 fill-current"
        >
          <rect x="4" y="5" width="16" height="14" rx="2" />
          <rect x="7" y="8" width="10" height="2" />
          <rect x="7" y="12" width="6" height="2" />
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
          className="h-4 w-4 fill-current"
        >
          <circle cx="12" cy="8" r="3.5" />
          <rect x="5" y="14" width="14" height="6" rx="3" />
        </svg>
      ),
    },
  ];

  return (
    <nav className="fixed bottom-3 left-1/2 z-10 flex w-[min(92vw,420px)] -translate-x-1/2 justify-between gap-3 rounded-full border border-[#e6e6e6] bg-white px-2.5 py-1.5">
      {items.map((item) => (
        <Link
          key={item.key}
          className={`flex flex-1 flex-col items-center justify-center gap-1 rounded-full px-2 py-1.5 text-[11px] ${
            active === item.key ? "bg-[#222] text-[#f9f9f9]" : "text-[#6b6b6b]"
          }`}
          href={item.href}
        >
          <span className="inline-flex h-4 w-4 items-center justify-center">
            {item.icon}
          </span>
          <span className="text-[10px]">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
