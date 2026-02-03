import Link from "next/link";
import TopBar from "../_components/TopBar";

export default function SettingsPage() {
  return (
    <div className="min-h-screen pb-[84px]">
      <TopBar
        title="設定"
        rightSlot={
          <Link
            className="grid h-9 w-9 place-items-center text-[#222]"
            href="/"
            aria-label="戻る"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-5 w-5 fill-current"
            >
              <path d="M15.5 5.5 9 12l6.5 6.5-1.5 1.5L6 12l8-8 1.5 1.5Z" />
            </svg>
          </Link>
        }
      />
      <main className="mx-auto max-w-[480px] px-4 pb-7">
        <section className="grid gap-2 rounded border border-[#e6e6e6] bg-white p-3 text-[11px]">
          <div className="grid grid-cols-[1fr_auto] items-center gap-2">
            <span>エクスポート</span>
            <button className="rounded-full border border-[#e6e6e6] bg-[#222] px-2 py-1 text-[11px] text-[#f9f9f9]">
              JSON
            </button>
          </div>
          <div className="grid grid-cols-[1fr_auto] items-center gap-2">
            <span>インポート</span>
            <button className="rounded-full border border-[#e6e6e6] px-2 py-1 text-[11px] text-[#222]">
              CSV
            </button>
          </div>
        </section>

        <h2 className="mt-3 text-[12px] font-semibold">プロフィール</h2>
        <section className="mt-2 grid gap-2 rounded border border-[#e6e6e6] bg-white p-3">
          <input
            className="w-full rounded border border-[#e6e6e6] bg-white px-2.5 py-2 text-[12px]"
            placeholder="プロフィール画像 URL"
          />
          <input
            className="w-full rounded border border-[#e6e6e6] bg-white px-2.5 py-2 text-[12px]"
            placeholder="プロフィール文"
          />
          <input
            className="w-full rounded border border-[#e6e6e6] bg-white px-2.5 py-2 text-[12px]"
            placeholder="フォロー / フォロワー (将来対応)"
          />
        </section>

        <h2 className="mt-3 text-[12px] font-semibold">公開設定</h2>
        <section className="mt-2 grid gap-2 rounded border border-[#e6e6e6] bg-white p-3 text-[11px]">
          <div className="grid grid-cols-[1fr_auto] items-center gap-2">
            <span>本棚公開</span>
            <button className="rounded-full border border-[#e6e6e6] bg-[#222] px-2 py-1 text-[11px] text-[#f9f9f9]">
              公開
            </button>
          </div>
          <div className="grid grid-cols-[1fr_auto] items-center gap-2">
            <span>shelf共有</span>
            <button className="rounded-full border border-[#e6e6e6] px-2 py-1 text-[11px] text-[#222]">
              共有
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
