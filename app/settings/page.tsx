"use client";

import Link from "next/link";
import { useState } from "react";
import TopBar from "../_components/TopBar";

export default function SettingsPage() {
  const [isShelfPublic, setIsShelfPublic] = useState(true);
  const [isFollowPublic, setIsFollowPublic] = useState(false);
  const [isFollowerPublic, setIsFollowerPublic] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText("https://shelfie.app/u/shelfie_user");
    } catch {
      // ignore copy errors
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <TopBar
        title="設定"
        rightSlot={
          <Link
            className="grid h-9 w-9 place-items-center text-white"
            href="/me"
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
      <main className="scroll-pane mx-auto w-full max-w-[480px] flex-1 overflow-y-auto px-4 pt-3 pb-[84px] hide-scrollbar">
        <h2 className="text-[14px] font-semibold">公開設定</h2>
        <section className="mt-2 grid gap-0 divide-y divide-[#e6e6e6] rounded border border-[#e6e6e6] bg-white p-3 text-[12px]">
          <div className="grid grid-cols-[1fr_auto] items-center gap-2 py-2">
            <span>本棚公開</span>
            <button
              type="button"
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isShelfPublic ? "bg-[#222]" : "bg-[#e6e6e6]"
              }`}
              aria-pressed={isShelfPublic}
              aria-label="本棚公開を切り替え"
              onClick={() => setIsShelfPublic((current) => !current)}
            >
              <span className="sr-only">本棚公開</span>
              <span
                className={`absolute left-[2px] h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  isShelfPublic ? "translate-x-[22px]" : "translate-x-0"
                }`}
              />
            </button>
          </div>
          <div className="grid grid-cols-[1fr_auto] items-center gap-2 py-2">
            <span>フォロー公開</span>
            <button
              type="button"
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isFollowPublic ? "bg-[#222]" : "bg-[#e6e6e6]"
              }`}
              aria-pressed={isFollowPublic}
              aria-label="フォロー公開を切り替え"
              onClick={() => setIsFollowPublic((current) => !current)}
            >
              <span className="sr-only">フォロー公開</span>
              <span
                className={`absolute left-[2px] h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  isFollowPublic ? "translate-x-[22px]" : "translate-x-0"
                }`}
              />
            </button>
          </div>
          <div className="grid grid-cols-[1fr_auto] items-center gap-2 py-2">
            <span>フォロワー公開</span>
            <button
              type="button"
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isFollowerPublic ? "bg-[#222]" : "bg-[#e6e6e6]"
              }`}
              aria-pressed={isFollowerPublic}
              aria-label="フォロワー公開を切り替え"
              onClick={() => setIsFollowerPublic((current) => !current)}
            >
              <span className="sr-only">フォロワー公開</span>
              <span
                className={`absolute left-[2px] h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  isFollowerPublic ? "translate-x-[22px]" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </section>

        <h2 className="mt-3 text-[14px] font-semibold">表示設定</h2>
        <section className="mt-2 grid gap-0 divide-y divide-[#e6e6e6] rounded border border-[#e6e6e6] bg-white p-3 text-[12px]">
          <div className="grid grid-cols-[1fr_auto] items-center gap-2 py-2">
            <span>表示テーマ</span>
            <select className="rounded-[2px] border border-[#e6e6e6] bg-white px-2 py-1 text-[12px] text-[#222]">
              <option value="light">ライト</option>
              <option value="dark">ダーク</option>
            </select>
          </div>
          <div className="grid grid-cols-[1fr_auto] items-center gap-2 py-2">
            <span>本棚の並び順</span>
            <select className="rounded-[2px] border border-[#e6e6e6] bg-white px-2 py-1 text-[12px] text-[#222]">
              <option value="recent">最近</option>
              <option value="title">タイトル</option>
              <option value="author">著者</option>
            </select>
          </div>
          <div className="grid grid-cols-[1fr_auto] items-center gap-2 py-2">
            <span>本棚の表示</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="グリッド3"
                className="grid h-8 w-8 place-items-center rounded-[2px] border border-[#e6e6e6] bg-white text-[#222]"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-5 w-5 fill-current"
                >
                  <rect x="4" y="6" width="4.5" height="4.5" rx="1" />
                  <rect x="9.75" y="6" width="4.5" height="4.5" rx="1" />
                  <rect x="15.5" y="6" width="4.5" height="4.5" rx="1" />
                  <rect x="4" y="13.5" width="4.5" height="4.5" rx="1" />
                  <rect x="9.75" y="13.5" width="4.5" height="4.5" rx="1" />
                  <rect x="15.5" y="13.5" width="4.5" height="4.5" rx="1" />
                </svg>
              </button>
              <button
                type="button"
                aria-label="グリッド4"
                className="grid h-8 w-8 place-items-center rounded-[2px] border border-[#222] bg-[#222] text-[#f9f9f9]"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-5 w-5 fill-current"
                >
                  <rect x="4" y="6" width="3.25" height="3.25" rx="0.9" />
                  <rect x="8.9" y="6" width="3.25" height="3.25" rx="0.9" />
                  <rect x="13.8" y="6" width="3.25" height="3.25" rx="0.9" />
                  <rect x="18.7" y="6" width="3.25" height="3.25" rx="0.9" />
                  <rect x="4" y="12.75" width="3.25" height="3.25" rx="0.9" />
                  <rect x="8.9" y="12.75" width="3.25" height="3.25" rx="0.9" />
                  <rect x="13.8" y="12.75" width="3.25" height="3.25" rx="0.9" />
                  <rect x="18.7" y="12.75" width="3.25" height="3.25" rx="0.9" />
                </svg>
              </button>
              <button
                type="button"
                aria-label="リスト"
                className="grid h-8 w-8 place-items-center rounded-[2px] border border-[#e6e6e6] bg-white text-[#222]"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-5 w-5 fill-current"
                >
                  <rect x="6" y="6.5" width="12" height="2.4" rx="1.2" />
                  <rect x="6" y="11" width="12" height="2.4" rx="1.2" />
                  <rect x="6" y="15.5" width="12" height="2.4" rx="1.2" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        <h2 className="mt-3 text-[14px] font-semibold">データ管理</h2>
        <section className="mt-2 grid gap-0 divide-y divide-[#e6e6e6] rounded border border-[#e6e6e6] bg-white p-3 text-[12px]">
          <div className="grid grid-cols-[1fr_auto] items-center gap-2 py-2">
            <span>エクスポート</span>
            <button
              type="button"
              aria-label="エクスポート"
              className="grid h-8 w-8 place-items-center rounded-[2px] border border-[#e6e6e6] text-[#222]"
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
                <path d="M12 3v12" />
                <path d="m7 10 5 5 5-5" />
                <path d="M4 21h16" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-[1fr_auto] items-center gap-2 py-2">
            <span>インポート</span>
            <button
              type="button"
              aria-label="インポート"
              className="grid h-8 w-8 place-items-center rounded-[2px] border border-[#e6e6e6] text-[#222]"
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
                <path d="M12 21V9" />
                <path d="m7 14 5-5 5 5" />
                <path d="M4 3h16" />
              </svg>
            </button>
          </div>
        </section>

        <h2 className="mt-3 text-[14px] font-semibold">本棚共有</h2>
        <section className="mt-2 grid gap-2 rounded border border-[#e6e6e6] bg-white p-3 text-[12px]">
          <div className="flex items-center justify-between gap-2 rounded border border-[#e6e6e6] bg-white px-3 py-2">
            <span className="truncate">https://shelfie.app/u/shelfie_user</span>
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-[2px] border border-[#e6e6e6] px-2 py-1 text-[12px] text-[#222]"
            >
              コピー
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
