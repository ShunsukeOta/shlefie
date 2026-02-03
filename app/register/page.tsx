import Link from "next/link";
import BottomNav from "../_components/BottomNav";
import TopBar from "../_components/TopBar";

export default function RegisterPage() {
  return (
    <div className="min-h-screen pb-[84px]">
      <TopBar
        title="登録"
        rightSlot={
          <Link
            className="grid h-7 w-7 place-items-center rounded border border-[#e6e6e6] bg-white text-[#222]"
            href="/settings"
            aria-label="設定"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3.2" />
              <path d="M19.4 12a7.4 7.4 0 0 0-.09-1.12l2.02-1.57-2-3.46-2.46 1a7.73 7.73 0 0 0-1.94-1.12L14.6 3h-4l-.33 2.73c-.7.3-1.35.7-1.94 1.12l-2.46-1-2 3.46 2.02 1.57A7.4 7.4 0 0 0 5 12c0 .38.03.75.09 1.12L3.07 14.7l2 3.46 2.46-1c.59.43 1.24.82 1.94 1.12L10.6 21h4l.33-2.73c.7-.3 1.35-.7 1.94-1.12l2.46 1 2-3.46-2.02-1.57c.06-.37.09-.74.09-1.12Z" />
            </svg>
          </Link>
        }
      />
      <main className="mx-auto max-w-[480px] px-4 pb-7">
        <section className="rounded border border-[#e6e6e6] bg-white p-3">
          <div className="grid gap-2">
            <div>
              <label className="text-[11px] text-[#6b6b6b]">検索</label>
              <input
                className="w-full rounded border border-[#e6e6e6] bg-white px-2.5 py-2 text-[12px]"
                placeholder="本の名前 / 著者で検索"
              />
            </div>
            <div className="grid grid-cols-[38px_1fr_auto] items-center gap-2.5 border-b border-dashed border-[#e6e6e6] py-2">
              <div className="h-[52px] w-[38px] rounded bg-[linear-gradient(180deg,#ededed,#d7d7d7)]" />
              <div>
                <p className="text-[11px] font-semibold">候補タイトル A</p>
                <p className="text-[10px] text-[#6b6b6b]">著者名</p>
                <span className="inline-flex rounded border border-[#e6e6e6] px-1.5 py-1 text-[10px] text-[#6b6b6b]">
                  2008年 / 全3巻
                </span>
              </div>
              <button className="rounded-full border border-[#e6e6e6] bg-[#222] px-2 py-1 text-[11px] text-[#f9f9f9]">
                追加
              </button>
            </div>
            <div className="grid grid-cols-[38px_1fr_auto] items-center gap-2.5 py-2">
              <div className="h-[52px] w-[38px] rounded bg-[linear-gradient(180deg,#ededed,#d7d7d7)]" />
              <div>
                <p className="text-[11px] font-semibold">候補タイトル B</p>
                <p className="text-[10px] text-[#6b6b6b]">著者名</p>
                <span className="inline-flex rounded border border-[#e6e6e6] px-1.5 py-1 text-[10px] text-[#6b6b6b]">
                  2016年 / 全1巻
                </span>
              </div>
              <button className="rounded-full border border-[#e6e6e6] px-2 py-1 text-[11px] text-[#222]">
                追加
              </button>
            </div>
          </div>
        </section>

        <h2 className="mt-3 text-[12px] font-semibold">自動入力フィールド</h2>
        <section className="mt-2 grid gap-2 rounded border border-[#e6e6e6] bg-white p-3">
          <input
            className="w-full rounded border border-[#e6e6e6] bg-white px-2.5 py-2 text-[12px]"
            placeholder="タイトル"
          />
          <input
            className="w-full rounded border border-[#e6e6e6] bg-white px-2.5 py-2 text-[12px]"
            placeholder="著者"
          />
          <input
            className="w-full rounded border border-[#e6e6e6] bg-white px-2.5 py-2 text-[12px]"
            placeholder="発行年"
          />
          <input
            className="w-full rounded border border-[#e6e6e6] bg-white px-2.5 py-2 text-[12px]"
            placeholder="巻数"
          />
        </section>
      </main>
      <BottomNav active="register" />
    </div>
  );
}
