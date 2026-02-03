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
            className="grid h-7 w-7 place-items-center rounded border border-[#e6e6e6] bg-white"
            href="/settings"
            aria-label="設定"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-4 w-4 fill-current"
            >
              <path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm9 3.5-.91.52a7.7 7.7 0 0 1-.2 1.03l.7.78-2.12 2.12-.78-.7c-.34.1-.68.17-1.03.2l-.52.91h-3l-.52-.91c-.35-.03-.7-.1-1.03-.2l-.78.7-2.12-2.12.7-.78c-.1-.34-.17-.68-.2-1.03L3 12l.91-.52c.03-.35.1-.7.2-1.03l-.7-.78 2.12-2.12.78.7c.34-.1.68-.17 1.03-.2L9 5h3l.52.91c.35.03.7.1 1.03.2l.78-.7 2.12 2.12-.7.78c.1.34.17.68.2 1.03L21 12Z" />
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
