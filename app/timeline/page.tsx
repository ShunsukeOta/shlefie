"use client";

import BottomNav from "../_components/BottomNav";
import TopBar from "../_components/TopBar";

export default function TimelinePage() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <TopBar title="" />
      <main className="scroll-pane mx-auto w-full max-w-[480px] flex-1 overflow-y-auto px-4 pt-3 pb-[84px] text-left hide-scrollbar">
        <section className="rounded border border-[#e6e6e6] bg-white p-4">
          <h2 className="text-[14px] font-semibold">フォロー中のログ</h2>
          <p className="mt-2 text-[12px] text-[#6b6b6b]">
            ここにフォローしている人の読書ログがまとまって表示されます。
          </p>
          <div className="mt-4 rounded bg-[#f7f7f7] px-3 py-12 text-center text-[12px] text-[#8b8b8b]">
            準備中
          </div>
        </section>
      </main>
      <BottomNav active="timeline" />
    </div>
  );
}
