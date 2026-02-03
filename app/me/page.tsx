import Link from "next/link";
import BottomNav from "../_components/BottomNav";
import TopBar from "../_components/TopBar";

export default function MePage() {
  return (
    <div className="min-h-screen pb-[84px]">
      <TopBar
        title="マイページ"
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
          <div className="grid grid-cols-[1fr_auto] gap-2 text-[11px]">
            <span>登録冊数</span>
            <strong>128</strong>
          </div>
          <div className="my-2 h-px bg-[#e6e6e6]" />
          <div className="grid grid-cols-[1fr_auto] gap-2 text-[11px]">
            <span>読了率</span>
            <strong>42%</strong>
          </div>
        </section>

        <h2 className="mt-3 text-[12px] font-semibold">サマリー</h2>
        <section className="mt-2 grid gap-2">
          {[
            { label: "1週間", value: "+6冊" },
            { label: "1か月", value: "+24冊" },
            { label: "1年", value: "+180冊" },
          ].map((item) => (
            <div
              key={item.label}
              className="grid gap-2 rounded border border-[#e6e6e6] bg-white p-2.5"
            >
              <div className="grid grid-cols-[1fr_auto] gap-2 text-[11px]">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
              <div className="h-9 rounded bg-[repeating-linear-gradient(90deg,#e0e0e0_0,#e0e0e0_8px,#cfcfcf_8px,#cfcfcf_12px)]" />
            </div>
          ))}
        </section>

        <h2 className="mt-3 text-[12px] font-semibold">最近のログ</h2>
        <section className="mt-2 grid gap-2">
          <div className="grid gap-1.5 rounded border border-[#e6e6e6] bg-white p-2.5">
            <span className="text-[11px] text-[#6b6b6b]">読了</span>
            <strong className="text-[11px]">本のタイトル B</strong>
            <span className="text-[11px] text-[#6b6b6b]">2時間前</span>
          </div>
          <div className="grid gap-1.5 rounded border border-[#e6e6e6] bg-white p-2.5">
            <span className="text-[11px] text-[#6b6b6b]">積読</span>
            <strong className="text-[11px]">本のタイトル A</strong>
            <span className="text-[11px] text-[#6b6b6b]">昨日</span>
          </div>
        </section>
      </main>
      <BottomNav active="me" />
    </div>
  );
}
