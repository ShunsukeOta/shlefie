"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLibrary } from "./LibraryProvider";
import { useNetworkStatus } from "./NetworkStatusProvider";

type RegisterModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function RegisterModal({ isOpen, onClose }: RegisterModalProps) {
  const { addBook } = useLibrary();
  const { requireOnline } = useNetworkStatus();
  const [visible, setVisible] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [searchResults, setSearchResults] = useState<
    {
      id: string;
      title: string;
      author: string;
      publisher?: string;
      year?: string;
      category?: string;
      imageUrl?: string;
    }[]
  >([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("小説");
  const [statusKey, setStatusKey] = useState("unread");
  const [publisher, setPublisher] = useState("");
  const [year, setYear] = useState("");
  const [volume, setVolume] = useState("");
  const [tags, setTags] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [memo, setMemo] = useState("");
  const [suppressSearch, setSuppressSearch] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const searchCache = useRef(new Map<string, typeof searchResults>());

  const isValid = useMemo(() => title.trim().length > 0, [title]);

  useEffect(() => {
    if (suppressSearch) {
      setSuppressSearch(false);
      return;
    }
    const trimmed = title.trim();
    if (!trimmed) {
      setSearchResults([]);
      setSearchError("");
      return;
    }
    if (trimmed.length < 2) {
      setSearchResults([]);
      setSearchError("2文字以上で検索できます。");
      return;
    }
    if (isComposing) {
      return;
    }
    const timer = window.setTimeout(() => {
      runSearch(trimmed);
    }, 500);
    return () => window.clearTimeout(timer);
  }, [title, isComposing]);

  const runSearch = async (query: string) => {
    if (!requireOnline()) return;
    const trimmed = query.trim();
    if (!trimmed) return;
    if (trimmed.length < 2) return;
    const cached = searchCache.current.get(trimmed);
    if (cached) {
      setSearchError("");
      setSearchResults(cached);
      return;
    }
    setIsSearching(true);
    setSearchError("");
    setSearchResults([]);

    try {
      const url =
        "/api/search/google?q=" + encodeURIComponent(trimmed) + "&_=" + Date.now();
      const resp = await fetch(url, { cache: "no-store" });
      const data = await resp.json();
      if (data && data.error) {
        setSearchError(data.error.message || "検索に失敗しました。");
        return;
      }
      const items = Array.isArray(data.items) ? data.items : [];
      const normalizedQuery = query.trim().toLowerCase();
      const mapped = items.map((item: any) => {
        const info = item.volumeInfo || {};
        return {
          id: item.id ?? crypto.randomUUID(),
          title: info.title ?? "タイトル不明",
          author: Array.isArray(info.authors)
            ? info.authors.join(" / ")
            : "",
          publisher: info.publisher,
          year: info.publishedDate
            ? String(info.publishedDate).slice(0, 4)
            : undefined,
          category:
            Array.isArray(info.categories) && info.categories[0]
              ? info.categories[0]
              : undefined,
          imageUrl: info.imageLinks?.thumbnail,
        };
      }) as typeof searchResults;
      mapped.sort((a: (typeof searchResults)[number], b: (typeof searchResults)[number]) => {
        const aTitle = a.title.toLowerCase();
        const bTitle = b.title.toLowerCase();
        const aExact = aTitle === normalizedQuery;
        const bExact = bTitle === normalizedQuery;
        if (aExact !== bExact) return aExact ? -1 : 1;
        const aIncludes = aTitle.includes(normalizedQuery);
        const bIncludes = bTitle.includes(normalizedQuery);
        if (aIncludes !== bIncludes) return aIncludes ? -1 : 1;
        return 0;
      });
      if (mapped.length > 0) {
        searchCache.current.set(trimmed, mapped);
      }
      setSearchResults(mapped);
      if (mapped.length === 0) {
        setSearchError("検索結果がありません。");
      }
    } catch (error) {
      setSearchError("検索に失敗しました。通信環境を確認してください。");
    } finally {
      setIsSearching(false);
    }
  };

  const applyResult = (result: {
    title: string;
    author: string;
    publisher?: string;
    year?: string;
    category?: string;
    imageUrl?: string;
  }) => {
    setSuppressSearch(true);
    setTitle(result.title);
    setAuthor(result.author);
    if (result.category) setCategory(result.category);
    setPublisher(result.publisher ?? "");
    setYear(result.year ?? "");
    setImageUrl(result.imageUrl ?? "");
    setSearchResults([]);
    setSearchError("");
  };

  useEffect(() => {
    if (isOpen) {
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }
    setVisible(false);
    return undefined;
  }, [isOpen]);

  useEffect(() => {
    if (!visible && isOpen) {
      const timer = window.setTimeout(() => {
        onClose();
      }, 300);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [visible, isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center px-4">
      <button
        type="button"
        className={`modal-backdrop absolute inset-0 bg-black/25 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        aria-label="閉じる"
        onClick={() => setVisible(false)}
      />
      <div
        className={`modal-card relative w-full max-w-[440px] overflow-hidden rounded-2xl bg-white shadow-[0_24px_70px_rgba(0,0,0,0.18)] ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        style={{ maxHeight: "84vh" }}
      >
        <div className="flex items-center justify-between px-4 pt-4">
          <div>
            <strong className="text-[16px] text-[#222]">登録</strong>
          </div>
          <button
            type="button"
            className="grid h-8 w-8 place-items-center text-[#6b6b6b]"
            onClick={() => setVisible(false)}
            aria-label="閉じる"
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
              <path d="M6 6l12 12" />
              <path d="M18 6l-12 12" />
            </svg>
          </button>
        </div>

        <div
          className="grid gap-3 overflow-y-auto px-4 pb-4 pt-3 text-[14px]"
          style={{ maxHeight: "72vh" }}
        >
          <div className="grid gap-1">
            <label className="text-[14px] text-[#6b6b6b]">タイトル</label>
            <div className="flex items-center gap-2 rounded-xl border border-[#f6f6f6] bg-white px-3 py-2">
              <input
                className="w-full bg-transparent text-[16px] text-[#222] outline-none placeholder:text-[#b0b0b0] focus:outline-none focus:ring-0"
                placeholder="例）ノルウェイの森"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={(event) => {
                  setIsComposing(false);
                  setTitle(event.currentTarget.value);
                }}
              />
              <button
                type="button"
                aria-label="バーコード読み込み"
                className="grid h-8 w-8 aspect-square place-items-center rounded-full border border-[#f6f6f6] text-[#6b6b6b]"
                title="バーコード読み込み"
                onClick={() => {
                  if (!requireOnline()) return;
                  window.alert("バーコード読み込みは準備中です。");
                }}
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
                  <path d="M4 6v12" />
                  <path d="M7 6v12" />
                  <path d="M10 6v12" />
                  <path d="M14 6v12" />
                  <path d="M17 6v12" />
                  <path d="M20 6v12" />
                </svg>
              </button>
            </div>
            {isSearching && (
              <span className="text-[14px] text-[#6b6b6b]">検索中...</span>
            )}
            {searchError && (
              <span className="text-[14px] text-[#b04a4a]">{searchError}</span>
            )}
            {searchResults.length > 0 && (
              <div className="grid gap-2 rounded-xl border border-[#f6f6f6] bg-white p-2">
                {searchResults.map((result) => (
                  <button
                    key={result.id}
                    type="button"
                    className="grid grid-cols-[40px_1fr] items-center gap-2 rounded-lg px-2 py-2 text-left hover:bg-[#f7f7f7]"
                    onClick={() => applyResult(result)}
                  >
                    <div className="aspect-[3/4] w-[40px] overflow-hidden rounded border border-[#f6f6f6] bg-[#f3f3f3]">
                      {result.imageUrl ? (
                        <img
                          src={result.imageUrl}
                          alt={result.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-[linear-gradient(180deg,#eeeeee,#d9d9d9)]" />
                      )}
                    </div>
                    <div className="grid gap-0.5">
                      <span className="text-[14px] font-semibold">
                        {result.title}
                      </span>
                      <span className="text-[14px] text-[#6b6b6b]">
                        {result.author || "著者不明"}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="grid gap-1">
            <label className="text-[12px] text-[#6b6b6b]">著者</label>
            <input
              className="w-full rounded-xl border border-[#f6f6f6] px-3 py-2 text-[16px] placeholder:text-[#b0b0b0] focus:outline-none focus:ring-0 focus:border-[#dcdcdc]"
              placeholder="例）村上 春樹"
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1">
              <label className="text-[12px] text-[#6b6b6b]">種別</label>
              <select
                className="w-full rounded-xl border border-[#f6f6f6] px-3 py-2 text-[16px] focus:outline-none focus:ring-0 focus:border-[#dcdcdc]"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option value="小説">小説</option>
                <option value="漫画">漫画</option>
                <option value="エッセイ">エッセイ</option>
                <option value="ビジネス">ビジネス</option>
                <option value="その他">その他</option>
              </select>
            </div>
            <div className="grid gap-1">
              <label className="text-[12px] text-[#6b6b6b]">進捗</label>
              <select
                className="w-full rounded-xl border border-[#f6f6f6] px-3 py-2 text-[16px] focus:outline-none focus:ring-0 focus:border-[#dcdcdc]"
                value={statusKey}
                onChange={(event) => setStatusKey(event.target.value)}
              >
                <option value="unread">未読</option>
                <option value="stack">積読</option>
                <option value="reading">読書中</option>
                <option value="done">読了</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1">
              <label className="text-[12px] text-[#6b6b6b]">出版社</label>
              <input
                className="w-full rounded-xl border border-[#f6f6f6] px-3 py-2 text-[16px] placeholder:text-[#b0b0b0] focus:outline-none focus:ring-0 focus:border-[#dcdcdc]"
                placeholder="例）講談社"
                value={publisher}
                onChange={(event) => setPublisher(event.target.value)}
              />
            </div>
            <div className="grid gap-1">
              <label className="text-[12px] text-[#6b6b6b]">発行年</label>
              <input
                className="w-full rounded-xl border border-[#f6f6f6] px-3 py-2 text-[16px] placeholder:text-[#b0b0b0] focus:outline-none focus:ring-0 focus:border-[#dcdcdc]"
                placeholder="例）2024"
                value={year}
                onChange={(event) => setYear(event.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1">
              <label className="text-[12px] text-[#6b6b6b]">巻数</label>
              <input
                className="w-full rounded-xl border border-[#f6f6f6] px-3 py-2 text-[16px] placeholder:text-[#b0b0b0] focus:outline-none focus:ring-0 focus:border-[#dcdcdc]"
                placeholder="例）1"
                value={volume}
                onChange={(event) => setVolume(event.target.value)}
              />
            </div>
            <div className="grid gap-1">
              <label className="text-[12px] text-[#6b6b6b]">タグ</label>
              <input
                className="w-full rounded-xl border border-[#f6f6f6] px-3 py-2 text-[16px] placeholder:text-[#b0b0b0] focus:outline-none focus:ring-0 focus:border-[#dcdcdc]"
                placeholder="例）文学, 長編"
                value={tags}
                onChange={(event) => setTags(event.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-1">
            <label className="text-[12px] text-[#6b6b6b]">メモ</label>
            <textarea
              className="min-h-[88px] w-full rounded-xl border border-[#f6f6f6] px-3 py-2 text-[16px] placeholder:text-[#b0b0b0] focus:outline-none focus:ring-0 focus:border-[#dcdcdc]"
              placeholder="感想やメモ"
              value={memo}
              onChange={(event) => setMemo(event.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-[#f2f2f2] px-4 py-4">
          <button
            type="button"
            className="rounded-full border border-[#f6f6f6] px-3 py-1.5 text-[14px] text-[#6b6b6b]"
            onClick={() => setVisible(false)}
          >
            キャンセル
          </button>
          <button
            type="button"
            className={`rounded-full border px-4 py-1.5 text-[14px] ${
              isValid
                ? "border-[#222] bg-[#222] text-[#f9f9f9]"
                : "border-[#e0e0e0] bg-[#f3f3f3] text-[#9b9b9b]"
            }`}
            disabled={!isValid}
            onClick={() => {
              if (!isValid) return;
              addBook({
                title,
                author,
                statusKey: statusKey as "unread" | "stack" | "reading" | "done",
                imageUrl: imageUrl.trim() || undefined,
                category: category.trim() || undefined,
                publisher: publisher.trim() || undefined,
                year: year.trim() || undefined,
                volume: volume.trim() || undefined,
                tags: tags.trim() || undefined,
                memo: memo.trim() || undefined,
              });
              setTitle("");
              setAuthor("");
              setCategory("小説");
              setStatusKey("unread");
              setPublisher("");
              setYear("");
              setVolume("");
              setTags("");
              setImageUrl("");
              setMemo("");
              setVisible(false);
            }}
          >
            登録
          </button>
        </div>
      </div>
    </div>
  );
}
