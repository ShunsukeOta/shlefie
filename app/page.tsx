"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import BottomNav from "./_components/BottomNav";
import TopBar from "./_components/TopBar";

export default function Home() {
  const [layout, setLayout] = useState<"grid-2" | "grid-3" | "grid-4" | "list">(
    "grid-2"
  );
  const [statusFilter, setStatusFilter] = useState<
    "all" | "want" | "stack" | "reading" | "done"
  >("all");
  const [sortBy, setSortBy] = useState<"recent" | "title" | "author">("recent");

  const books = useMemo(
    () => [
      {
        title: "本のタイトル A",
        author: "著者名",
        status: "欲しい",
        statusKey: "want",
        updatedAt: "2026-02-02",
      },
      {
        title: "本のタイトル B",
        author: "著者名",
        status: "積読",
        statusKey: "stack",
        updatedAt: "2026-01-25",
      },
      {
        title: "本のタイトル C",
        author: "著者名",
        status: "読書中",
        statusKey: "reading",
        updatedAt: "2026-02-01",
      },
      {
        title: "本のタイトル D",
        author: "著者名",
        status: "読了",
        statusKey: "done",
        updatedAt: "2026-01-20",
      },
      {
        title: "本のタイトル E",
        author: "著者名",
        status: "読了",
        statusKey: "done",
        updatedAt: "2026-01-18",
      },
      {
        title: "本のタイトル F",
        author: "著者名",
        status: "欲しい",
        statusKey: "want",
        updatedAt: "2026-02-03",
      },
    ],
    []
  );

  const filteredBooks = useMemo(() => {
    const base =
      statusFilter === "all"
        ? books
        : books.filter((book) => book.statusKey === statusFilter);

    if (sortBy === "recent") {
      return [...base].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
    }
    if (sortBy === "title") {
      return [...base].sort((a, b) => a.title.localeCompare(b.title));
    }
    return [...base].sort((a, b) => a.author.localeCompare(b.author));
  }, [books, statusFilter, sortBy]);

  return (
    <div className="min-h-screen pb-[84px]">
      <TopBar
        title="本棚"
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
        <section className="grid gap-2.5 pb-3">
          <div className="inline-flex overflow-hidden rounded border border-[#dedede] bg-white">
            {[
              { key: "grid-2", label: "2列" },
              { key: "grid-3", label: "3列" },
              { key: "grid-4", label: "4列" },
              { key: "list", label: "リスト" },
            ].map((item) => (
              <button
                key={item.key}
                className={`px-2 py-1 text-[11px] ${
                  layout === item.key ? "bg-[#222] text-[#f9f9f9]" : "text-[#6b6b6b]"
                }`}
                onClick={() =>
                  setLayout(item.key as "grid-2" | "grid-3" | "grid-4" | "list")
                }
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <select
              className="w-full rounded border border-[#e6e6e6] bg-white px-2.5 py-2 text-[12px] text-[#222]"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as
                    | "all"
                    | "want"
                    | "stack"
                    | "reading"
                    | "done"
                )
              }
            >
              <option value="all">進捗: すべて</option>
              <option value="want">進捗: 欲しい</option>
              <option value="stack">進捗: 積読</option>
              <option value="reading">進捗: 読書中</option>
              <option value="done">進捗: 読了</option>
            </select>
            <select
              className="w-full rounded border border-[#e6e6e6] bg-white px-2.5 py-2 text-[12px] text-[#222]"
              value={sortBy}
              onChange={(event) =>
                setSortBy(
                  event.target.value as "recent" | "title" | "author"
                )
              }
            >
              <option value="recent">並び順: 最近</option>
              <option value="title">並び順: タイトル</option>
              <option value="author">並び順: 著者</option>
            </select>
          </div>
        </section>

        <section
          className={`grid gap-2.5 ${
            layout === "list" ? "grid-cols-1" : "grid-cols-2"
          }`}
          style={
            layout === "grid-3"
              ? { gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }
              : layout === "grid-4"
                ? { gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }
                : undefined
          }
        >
          {filteredBooks.map((book) => (
            <article
              key={book.title}
              className={`grid gap-1.5 overflow-hidden rounded border border-[#e6e6e6] bg-white ${
                layout === "list" ? "grid-cols-[64px_1fr_auto] items-center gap-2.5" : ""
              }`}
            >
              <div
                className={`relative ${
                  layout === "list" ? "w-16" : ""
                }`}
              >
                <div className="aspect-[3/4] w-full bg-[linear-gradient(180deg,#eeeeee,#d9d9d9)]" />
                <span
                  className={`absolute left-1.5 top-1.5 rounded-[2px] px-1.5 py-[2px] text-[10px] text-white ${
                    book.statusKey === "want"
                      ? "bg-[#3a3a3a]"
                      : book.statusKey === "stack"
                        ? "bg-[#5a5a5a]"
                        : book.statusKey === "reading"
                          ? "bg-[#2f3a42]"
                          : "bg-[#2e2e2e]"
                  }`}
                >
                  {book.status}
                </span>
              </div>
              <div className="grid gap-0.5 px-2 pb-2 pt-1.5">
                <p className="text-[11px] font-semibold">{book.title}</p>
                <p className="text-[10px] text-[#6b6b6b]">{book.author}</p>
              </div>
            </article>
          ))}
        </section>
      </main>
      <BottomNav active="shelf" />
    </div>
  );
}
