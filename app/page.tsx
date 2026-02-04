"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import BottomNav from "./_components/BottomNav";
import TopBar from "./_components/TopBar";
import { Book, useLibrary } from "./_components/LibraryProvider";

const formatDateJp = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) {
    return value;
  }
  return `${year}年${month}月${day}日`;
};

export default function Home() {
  const [layout, setLayout] = useState<"grid-2" | "grid-3" | "grid-4" | "list">(
    "grid-2"
  );
  const [statusFilter, setStatusFilter] = useState<
    "all" | "unread" | "stack" | "reading" | "done"
  >("all");
  const [sortBy, setSortBy] = useState<"recent" | "title" | "author">("recent");
  const [activeSheet, setActiveSheet] = useState<null | "status" | "sort">(null);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [activeBook, setActiveBook] = useState<Book | null>(null);
  const [bookVisible, setBookVisible] = useState(false);
  const [isBookEditing, setIsBookEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    author: "",
    statusKey: "unread",
    category: "",
    publisher: "",
    year: "",
    volume: "",
    tags: "",
    memo: "",
    imageUrl: "",
  });

  const statusOptions = [
    { value: "all", label: "すべて" },
    { value: "unread", label: "未読" },
    { value: "stack", label: "積読" },
    { value: "reading", label: "読書中" },
    { value: "done", label: "読了" },
  ] as const;

  const sortOptions = [
    { value: "recent", label: "最近" },
    { value: "title", label: "タイトル" },
    { value: "author", label: "著者" },
  ] as const;

  const { books, updateBook, removeBook } = useLibrary();

  const displayValue = (value?: string) =>
    value && value.trim().length > 0 ? value : "-";

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

  useEffect(() => {
    document.body.classList.add("no-scroll");
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, []);

  useEffect(() => {
    if (activeSheet) {
      const frame = requestAnimationFrame(() => setSheetVisible(true));
      return () => cancelAnimationFrame(frame);
    }
    return undefined;
  }, [activeSheet]);

  useEffect(() => {
    if (!activeSheet && sheetVisible) {
      setSheetVisible(false);
    }
  }, [activeSheet, sheetVisible]);

  useEffect(() => {
    if (!sheetVisible && activeSheet) {
      const timer = window.setTimeout(() => {
        setActiveSheet(null);
      }, 300);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [sheetVisible, activeSheet]);

  useEffect(() => {
    if (activeBook) {
      setIsBookEditing(false);
      setEditForm({
        title: activeBook.title ?? "",
        author: activeBook.author ?? "",
        statusKey: activeBook.statusKey ?? "unread",
        category: activeBook.category ?? "",
        publisher: activeBook.publisher ?? "",
        year: activeBook.year ?? "",
        volume: activeBook.volume ?? "",
        tags: activeBook.tags ?? "",
        memo: activeBook.memo ?? "",
        imageUrl: activeBook.imageUrl ?? "",
      });
      const frame = requestAnimationFrame(() => setBookVisible(true));
      return () => cancelAnimationFrame(frame);
    }
    return undefined;
  }, [activeBook]);

  useEffect(() => {
    if (!bookVisible && activeBook) {
      const timer = window.setTimeout(() => {
        setActiveBook(null);
      }, 300);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [bookVisible, activeBook]);


  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <TopBar title="" />
      <main className="mx-auto flex w-full max-w-[480px] flex-1 flex-col overflow-hidden px-4 pt-3 pb-0 text-left">
        <section className="grid gap-2.5 pb-3">
          <div className="grid grid-cols-3 gap-2">
            <div className="grid">
              <div className="inline-flex w-full items-center justify-center gap-1 rounded-full bg-[#f1f1f1] p-1">
                {[
              {
                key: "grid-2",
                label: "2列グリッド",
                icon: (
                  <>
                    <rect x="5" y="6" width="6" height="6" rx="1.2" />
                    <rect x="13" y="6" width="6" height="6" rx="1.2" />
                    <rect x="5" y="13" width="6" height="6" rx="1.2" />
                    <rect x="13" y="13" width="6" height="6" rx="1.2" />
                  </>
                ),
              },
              {
                key: "grid-3",
                label: "3列グリッド",
                icon: (
                  <>
                    <rect x="4" y="6" width="4.5" height="4.5" rx="1" />
                    <rect x="9.75" y="6" width="4.5" height="4.5" rx="1" />
                    <rect x="15.5" y="6" width="4.5" height="4.5" rx="1" />
                    <rect x="4" y="13.5" width="4.5" height="4.5" rx="1" />
                    <rect x="9.75" y="13.5" width="4.5" height="4.5" rx="1" />
                    <rect x="15.5" y="13.5" width="4.5" height="4.5" rx="1" />
                  </>
                ),
              },
              {
                key: "grid-4",
                label: "4列グリッド",
                icon: (
                  <>
                    <rect x="4" y="6" width="3.25" height="3.25" rx="0.9" />
                    <rect x="8.9" y="6" width="3.25" height="3.25" rx="0.9" />
                    <rect x="13.8" y="6" width="3.25" height="3.25" rx="0.9" />
                    <rect x="18.7" y="6" width="3.25" height="3.25" rx="0.9" />
                    <rect x="4" y="12.75" width="3.25" height="3.25" rx="0.9" />
                    <rect x="8.9" y="12.75" width="3.25" height="3.25" rx="0.9" />
                    <rect x="13.8" y="12.75" width="3.25" height="3.25" rx="0.9" />
                    <rect x="18.7" y="12.75" width="3.25" height="3.25" rx="0.9" />
                  </>
                ),
              },
              {
                key: "list",
                label: "リスト",
                icon: (
                  <>
                    <rect x="6" y="6.5" width="12" height="2.4" rx="1.2" />
                    <rect x="6" y="11" width="12" height="2.4" rx="1.2" />
                    <rect x="6" y="15.5" width="12" height="2.4" rx="1.2" />
                  </>
                ),
              },
                ].map((item) => (
                  <button
                    key={item.key}
                    aria-pressed={layout === item.key}
                    aria-label={item.label}
                    title={item.label}
                    className={`grid h-7 w-9 place-items-center rounded-full transition-colors ${
                      layout === item.key
                        ? "bg-white text-[#222]"
                        : "text-[#8b8b8b]"
                    }`}
                    onClick={() =>
                      setLayout(
                        item.key as "grid-2" | "grid-3" | "grid-4" | "list"
                      )
                    }
                  >
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="h-4 w-4 fill-current"
                    >
                      {item.icon}
                    </svg>
                  </button>
                ))}
              </div>
            </div>
            <div className="grid">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-2 rounded border border-[#e6e6e6] bg-white px-2.5 py-2 text-[12px] text-[#222]"
                onClick={() => {
                  setActiveSheet("status");
                  setSheetVisible(true);
                }}
              >
                <span className="inline-flex items-center gap-1.5">
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-3.5 w-3.5 fill-current"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 5h6l8 8a2 2 0 0 1 0 2.8l-4.2 4.2a2 2 0 0 1-2.8 0l-8-8V7a2 2 0 0 1 2-2Zm1.8 2.2a1.3 1.3 0 1 0 0 2.6a1.3 1.3 0 0 0 0-2.6Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    {statusOptions.find(
                      (option) => option.value === statusFilter
                    )?.label ?? "すべて"}
                  </span>
                </span>
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </div>
            <div className="grid">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-2 rounded border border-[#e6e6e6] bg-white px-2.5 py-2 text-[12px] text-[#222]"
                onClick={() => {
                  setActiveSheet("sort");
                  setSheetVisible(true);
                }}
              >
                <span className="inline-flex items-center gap-1.5">
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M10 6h10" />
                    <path d="M8 12h12" />
                    <path d="M6 18h14" />
                  </svg>
                  <span>
                    {sortOptions.find((option) => option.value === sortBy)
                      ?.label ?? "最近"}
                  </span>
                </span>
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        <div className="relative flex-1 min-h-0">
          <div className="shelf-scroll hide-scrollbar h-full pb-[84px]">
          <section
            className={`grid ${
              layout === "list" ? "grid-cols-1 gap-0" : "grid-cols-2 gap-2.5"
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
                key={book.id}
                className={`grid overflow-hidden rounded-none ${
                  layout === "list"
                    ? "grid-cols-[68px_1fr_auto] items-center gap-3 border-b border-[#e6e6e6] bg-transparent py-1.5"
                    : "border border-[#e6e6e6] bg-white"
                }`}
              >
                <div
                  className={`relative w-full ${
                    layout === "list" ? "w-[68px]" : ""
                  }`}
                >
                <button
                  type="button"
                  className="absolute inset-0 z-10"
                  aria-label={`${book.title} を開く`}
                  onClick={() => {
                    setActiveBook(book);
                    setBookVisible(true);
                  }}
                />
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-[linear-gradient(180deg,#eeeeee,#d9d9d9)]">
                  {book.imageUrl ? (
                    <img
                      src={book.imageUrl}
                      alt={`${book.title} カバー`}
                      className="absolute inset-0 block h-full w-full object-cover"
                    />
                  ) : book.fallbackCover ? (
                    <img
                      src={book.fallbackCover}
                      alt={`${book.title} ダミーカバー`}
                      className="absolute inset-0 block h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-[linear-gradient(180deg,#eeeeee,#d9d9d9)]" />
                  )}
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black/45 to-transparent" />
                </div>
                {layout === "grid-4" ? (
                  <span
                    className={`absolute left-1.5 top-1.5 h-[8px] w-[8px] rounded-full ${
                      book.statusKey === "unread"
                        ? "bg-[#8c8c8c]"
                        : book.statusKey === "stack"
                          ? "bg-[#2f5fbf]"
                          : book.statusKey === "reading"
                            ? "bg-[#c36a1e]"
                            : "bg-[#2f8a4a]"
                    }`}
                  />
                ) : (
                  <span
                    className={`absolute left-1.5 top-1.5 flex items-center justify-center rounded-[2px] px-1.5 py-[2px] text-[10px] leading-none text-white ${
                      book.statusKey === "unread"
                        ? "bg-[#8c8c8c]"
                        : book.statusKey === "stack"
                          ? "bg-[#2f5fbf]"
                          : book.statusKey === "reading"
                            ? "bg-[#c36a1e]"
                            : "bg-[#2f8a4a]"
                    }`}
                  >
                    {book.status}
                  </span>
                )}
              </div>
              <button
                type="button"
                className={`grid gap-1 ${
                  layout === "grid-4"
                    ? "hidden"
                    : layout === "list"
                      ? "px-2.5 py-0 text-left"
                      : "px-2.5 py-2 text-left"
                }`}
                onClick={() => {
                  setActiveBook(book);
                  setBookVisible(true);
                }}
              >
                <p className="text-[11px] font-semibold">{book.title}</p>
                <p className="text-[10px] text-[#6b6b6b]">{book.author}</p>
              </button>
              </article>
            ))}
          </section>
          </div>
        </div>
        {activeBook && (
          <div className="fixed inset-0 z-20 flex items-center justify-center px-4">
            <button
              type="button"
              className={`modal-backdrop absolute inset-0 bg-black/25 ${
                bookVisible ? "opacity-100" : "opacity-0"
              }`}
              aria-label="閉じる"
              onClick={() => setBookVisible(false)}
            />
            <div
              className={`modal-card relative w-full max-w-[360px] overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.25)] ${
                bookVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="grid grid-cols-[112px_1fr] gap-3 p-4">
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md border border-[#e6e6e6]">
                  {activeBook.imageUrl ? (
                    <img
                      src={activeBook.imageUrl}
                      alt={`${activeBook.title} カバー`}
                      className="absolute inset-0 block h-full w-full object-cover"
                    />
                  ) : activeBook.fallbackCover ? (
                    <img
                      src={activeBook.fallbackCover}
                      alt={`${activeBook.title} ダミーカバー`}
                      className="absolute inset-0 block h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-[linear-gradient(180deg,#eeeeee,#d9d9d9)]" />
                  )}
                </div>
                <div className="grid content-start gap-1 text-left">
                  <div className="flex items-start justify-between gap-2">
                    {isBookEditing ? (
                      <input
                        className="w-full rounded border border-[#e6e6e6] px-2 py-1 text-[12px]"
                        value={editForm.title}
                        onChange={(event) =>
                          setEditForm((current) => ({
                            ...current,
                            title: event.target.value,
                          }))
                        }
                      />
                    ) : (
                      <p className="text-[12px] font-semibold">
                        {activeBook.title}
                      </p>
                    )}
                    <button
                      type="button"
                      className="grid h-7 w-7 place-items-center text-[#6b6b6b]"
                      aria-label="編集"
                      onClick={() => setIsBookEditing((current) => !current)}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="h-[18px] w-[18px]"
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
                  </div>
                  {isBookEditing ? (
                    <div className="grid gap-2 text-[10px]">
                      <input
                        className="w-full rounded border border-[#e6e6e6] px-2 py-1 text-[10px]"
                        placeholder="著者"
                        value={editForm.author}
                        onChange={(event) =>
                          setEditForm((current) => ({
                            ...current,
                            author: event.target.value,
                          }))
                        }
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          className="w-full rounded border border-[#e6e6e6] px-2 py-1"
                          value={editForm.statusKey}
                          onChange={(event) =>
                            setEditForm((current) => ({
                              ...current,
                              statusKey: event.target.value,
                            }))
                          }
                        >
                          <option value="unread">未読</option>
                          <option value="stack">積読</option>
                          <option value="reading">読書中</option>
                          <option value="done">読了</option>
                        </select>
                        <input
                          className="w-full rounded border border-[#e6e6e6] px-2 py-1"
                          placeholder="種別"
                          value={editForm.category}
                          onChange={(event) =>
                            setEditForm((current) => ({
                              ...current,
                              category: event.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          className="w-full rounded border border-[#e6e6e6] px-2 py-1"
                          placeholder="出版社"
                          value={editForm.publisher}
                          onChange={(event) =>
                            setEditForm((current) => ({
                              ...current,
                              publisher: event.target.value,
                            }))
                          }
                        />
                        <input
                          className="w-full rounded border border-[#e6e6e6] px-2 py-1"
                          placeholder="発行年"
                          value={editForm.year}
                          onChange={(event) =>
                            setEditForm((current) => ({
                              ...current,
                              year: event.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          className="w-full rounded border border-[#e6e6e6] px-2 py-1"
                          placeholder="巻数"
                          value={editForm.volume}
                          onChange={(event) =>
                            setEditForm((current) => ({
                              ...current,
                              volume: event.target.value,
                            }))
                          }
                        />
                        <input
                          className="w-full rounded border border-[#e6e6e6] px-2 py-1"
                          placeholder="タグ"
                          value={editForm.tags}
                          onChange={(event) =>
                            setEditForm((current) => ({
                              ...current,
                              tags: event.target.value,
                            }))
                          }
                        />
                      </div>
                      <input
                        className="w-full rounded border border-[#e6e6e6] px-2 py-1"
                        placeholder="サムネイルURL"
                        value={editForm.imageUrl}
                        onChange={(event) =>
                          setEditForm((current) => ({
                            ...current,
                            imageUrl: event.target.value,
                          }))
                        }
                      />
                      <textarea
                        className="min-h-[64px] w-full rounded border border-[#e6e6e6] px-2 py-1"
                        placeholder="メモ"
                        value={editForm.memo}
                        onChange={(event) =>
                          setEditForm((current) => ({
                            ...current,
                            memo: event.target.value,
                          }))
                        }
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          className="rounded-full border border-[#e6e6e6] px-3 py-1 text-[10px] text-[#6b6b6b]"
                          onClick={() => setIsBookEditing(false)}
                        >
                          キャンセル
                        </button>
                        <button
                          type="button"
                          className="rounded-full border border-[#c94b4b] px-3 py-1 text-[10px] text-[#c94b4b]"
                          onClick={() => {
                            if (!activeBook) return;
                            removeBook(activeBook.id);
                            setIsBookEditing(false);
                            setBookVisible(false);
                            setActiveBook(null);
                          }}
                        >
                          削除
                        </button>
                        <button
                          type="button"
                          className="rounded-full border border-[#222] bg-[#222] px-3 py-1 text-[10px] text-[#f9f9f9]"
                          onClick={() => {
                            if (!activeBook) return;
                            updateBook(activeBook.id, {
                              title: editForm.title.trim() || activeBook.title,
                              author: editForm.author,
                              statusKey: editForm.statusKey as
                                | "unread"
                                | "stack"
                                | "reading"
                                | "done",
                              category: editForm.category,
                              publisher: editForm.publisher,
                              year: editForm.year,
                              volume: editForm.volume,
                              tags: editForm.tags,
                              memo: editForm.memo,
                              imageUrl: editForm.imageUrl || undefined,
                            });
                            setIsBookEditing(false);
                          }}
                        >
                          保存
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-[10px] text-[#6b6b6b]">
                        {activeBook.author}
                      </p>
                      <dl className="mt-3 grid text-[10px]">
                        {[
                          { label: "進捗", value: activeBook.status },
                          {
                            label: "更新日",
                            value: formatDateJp(activeBook.updatedAt),
                          },
                          {
                            label: "種別",
                            value: displayValue(activeBook.category),
                          },
                          {
                            label: "出版社",
                            value: displayValue(activeBook.publisher),
                          },
                          { label: "発行年", value: displayValue(activeBook.year) },
                          { label: "巻数", value: displayValue(activeBook.volume) },
                          { label: "タグ", value: displayValue(activeBook.tags) },
                          { label: "メモ", value: displayValue(activeBook.memo) },
                        ].map((row, index, all) => (
                          <div
                            key={row.label}
                            className={`grid grid-cols-[40px_1fr] items-center gap-2 py-2 ${
                              index !== all.length - 1
                                ? "border-b border-[#e6e6e6]"
                                : ""
                            }`}
                          >
                            <dt className="text-[#8b8b8b]">{row.label}</dt>
                            <dd className="text-[#222]">{row.value}</dd>
                          </div>
                        ))}
                      </dl>
                    </>
                  )}
                </div>
              </div>
              <button
                type="button"
                className="w-full border-t border-[#e6e6e6] py-2 text-[11px] text-[#6b6b6b]"
                onClick={() => setBookVisible(false)}
              >
                閉じる
              </button>
            </div>
          </div>
        )}
        {activeSheet && (
          <div className="fixed inset-0 z-20 flex items-center justify-center px-4">
            <button
              type="button"
              className={`modal-backdrop absolute inset-0 bg-black/25 ${
                sheetVisible ? "opacity-100" : "opacity-0"
              }`}
              aria-label="閉じる"
              onClick={() => setSheetVisible(false)}
            />
            <div
              className={`modal-card relative w-full max-w-[360px] rounded-2xl bg-white px-4 pb-5 pt-4 shadow-[0_20px_60px_rgba(0,0,0,0.25)] ${
                sheetVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="mb-3 flex items-center justify-between">
                <strong className="text-[13px] text-[#222]">
                  {activeSheet === "status" ? "進捗" : "並び順"}
                </strong>
                <button
                  type="button"
                  className="text-[11px] text-[#6b6b6b]"
                  onClick={() => setSheetVisible(false)}
                >
                  閉じる
                </button>
              </div>
              <div className="grid gap-2">
                {(activeSheet === "status" ? statusOptions : sortOptions).map(
                  (option) => {
                    const selected =
                      activeSheet === "status"
                        ? option.value === statusFilter
                        : option.value === sortBy;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        className={`flex items-center justify-between rounded-xl border px-3 py-2 text-[12px] ${
                          selected
                            ? "border-[#222] bg-[#222] text-[#f9f9f9]"
                            : "border-[#e6e6e6] bg-white text-[#222]"
                        }`}
                        onClick={() => {
                          if (activeSheet === "status") {
                            setStatusFilter(
                              option.value as
                                | "all"
                                | "unread"
                                | "stack"
                                | "reading"
                                | "done"
                            );
                          } else {
                            setSortBy(
                              option.value as "recent" | "title" | "author"
                            );
                          }
                          setSheetVisible(false);
                        }}
                      >
                        <span>{option.label}</span>
                        {selected && (
                          <span className="text-[10px]">選択中</span>
                        )}
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        )}
      </main>
      <BottomNav active="shelf" />
    </div>
  );
}
