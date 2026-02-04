"use client";

import Link from "next/link";
import { useState } from "react";
import BottomNav from "../_components/BottomNav";
import TopBar from "../_components/TopBar";
import { useLibrary } from "../_components/LibraryProvider";

export default function MePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState("shelfie user");
  const [handle, setHandle] = useState("@shelfie_user");
  const [profileText, setProfileText] = useState(
    "最近は日本文学を読み直しています。気になる本があれば教えてください。"
  );
  const { logs: recentLogs, books } = useLibrary();

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <TopBar title="" />
      <main className="scroll-pane mx-auto w-full max-w-[480px] flex-1 overflow-y-auto pb-[84px] hide-scrollbar">
        <section className="overflow-hidden bg-white">
          <div className="relative h-32 bg-[linear-gradient(135deg,#222222,#4b4b4b)]">
            {isEditing && (
              <button
                type="button"
                className="absolute right-3 top-3 rounded-full border border-white/30 px-2 py-1 text-[10px] text-white"
              >
                画像を変更
              </button>
            )}
          </div>
          <div className="grid gap-2 p-3 pt-3">
            <div className="flex items-start justify-between">
              <div className="-mt-14 relative z-10">
                <div className="relative h-22 w-22 rounded-full border-2 border-white bg-[#f3f3f3]">
                  <div className="h-full w-full rounded-full bg-[linear-gradient(135deg,#eeeeee,#d8d8d8)]" />
                  {isEditing && (
                    <button
                      type="button"
                      className="absolute inset-0 grid place-items-center rounded-full bg-black/45 text-white"
                      aria-label="プロフィール画像を変更"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5Z" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-full border border-[#e6e6e6] px-3 py-2 text-[12px] text-[#6b6b6b]"
                aria-label="編集"
                onClick={() => setIsEditing((current) => !current)}
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5Z" />
                </svg>
                <span>プロフィールを編集</span>
              </button>
            </div>
            {isEditing ? (
              <div className="grid gap-2">
                <input
                  className="w-full rounded border border-[#e6e6e6] px-2.5 py-2 text-[12px]"
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  placeholder="表示名"
                />
                <textarea
                  className="min-h-[96px] w-full rounded border border-[#e6e6e6] px-2.5 py-2 text-[12px]"
                  value={profileText}
                  onChange={(event) => setProfileText(event.target.value)}
                  placeholder="プロフィール文を入力"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="rounded-full border border-[#e6e6e6] px-3 py-1.5 text-[11px] text-[#6b6b6b]"
                    onClick={() => setIsEditing(false)}
                  >
                    キャンセル
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-[#222] bg-[#222] px-3 py-1.5 text-[11px] text-[#f9f9f9]"
                    onClick={() => setIsEditing(false)}
                  >
                    保存
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid gap-1 text-left">
                <p className="text-[14px] font-semibold">{displayName}</p>
                <p className="text-[12px] text-[#6b6b6b]">{handle}</p>
                <p className="mt-1 text-[12px] text-[#222]">{profileText}</p>
              </div>
            )}
            <div className="mt-2 grid grid-cols-3 gap-2 text-[12px]">
              {[
                { label: "フォロー", value: "0" },
                { label: "フォロワー", value: "0" },
                { label: "総shelf", value: `${books.length}` },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded bg-[#222] px-2 py-2 text-center text-white"
                >
                  <div className="font-semibold text-[14px]">{item.value}</div>
                  <div className="text-[#d9d9d9]">{item.label}</div>
                </div>
              ))}
            </div>
            <div className="mt-3">
              <Link
                className="flex items-center justify-between rounded border border-[#e6e6e6] bg-white px-3 py-3 text-[14px] text-[#222]"
                href="/settings"
                aria-label="設定"
              >
                <span>設定</span>
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
                  <path d="m9 6 6 6-6 6" />
                </svg>
              </Link>
            </div>
            <div className="mt-3">
              <h2 className="text-[14px] font-semibold">最近のログ</h2>
              <section className="mt-2 grid gap-0">
                {recentLogs.map((log) => (
                  <div
                    key={log.id}
                    className="grid grid-cols-[56px_1fr_auto] items-center gap-3 border-b border-[#e6e6e6] py-2"
                  >
                    <div className="relative">
                      <div className="aspect-[3/4] w-[56px] overflow-hidden bg-[linear-gradient(180deg,#eeeeee,#d9d9d9)]">
                        {log.imageUrl ? (
                          <img
                            src={log.imageUrl}
                            alt={`${log.title} カバー`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-[linear-gradient(180deg,#eeeeee,#d9d9d9)]" />
                        )}
                      </div>
                      <span
                        className={`absolute left-1 top-1 rounded-[2px] px-1 py-[2px] text-[9px] leading-none text-white ${
                          log.statusKey === "unread"
                            ? "bg-[#8c8c8c]"
                            : log.statusKey === "stack"
                              ? "bg-[#2f5fbf]"
                              : log.statusKey === "reading"
                                ? "bg-[#c36a1e]"
                                : "bg-[#2f8a4a]"
                        }`}
                      >
                        {log.status}
                      </span>
                    </div>
                    <div className="grid gap-0.5 text-left">
                      <p className="text-[12px] text-[#222]">
                        <strong className="font-semibold">{log.title}</strong>
                        {log.message?.includes("本棚から削除しました。")
                          ? "を本棚から削除しました。"
                          : log.message?.includes("本棚に登録しました。")
                            ? "を本棚に登録しました。"
                            : log.status
                              ? `を「${log.status}」に変更しました。`
                              : "を本棚に登録しました。"}
                      </p>
                      <span className="text-[10px] text-[#6b6b6b]">
                        {log.time}
                      </span>
                    </div>
                  </div>
                ))}
              </section>
            </div>
          </div>
        </section>
      </main>
      <BottomNav active="me" />
    </div>
  );
}
