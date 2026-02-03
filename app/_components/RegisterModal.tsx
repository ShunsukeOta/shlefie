"use client";

import { useEffect, useMemo, useState } from "react";
import { useLibrary } from "./LibraryProvider";

type RegisterModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function RegisterModal({ isOpen, onClose }: RegisterModalProps) {
  const { addBook } = useLibrary();
  const [visible, setVisible] = useState(false);
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

  const isValid = useMemo(() => title.trim().length > 0, [title]);

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
        className={`modal-card relative w-full max-w-[420px] rounded-2xl bg-white px-4 pb-4 pt-4 shadow-[0_20px_60px_rgba(0,0,0,0.25)] ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="mb-3 flex items-center justify-between">
          <strong className="text-[13px] text-[#222]">登録</strong>
          <button
            type="button"
            className="text-[11px] text-[#6b6b6b]"
            onClick={() => setVisible(false)}
          >
            閉じる
          </button>
        </div>

        <div className="grid gap-2 text-[12px]">
          <div className="grid gap-1">
            <label className="text-[10px] text-[#6b6b6b]">タイトル</label>
            <div className="flex items-center gap-2">
              <input
                className="w-full rounded border border-[#e6e6e6] px-2.5 py-2"
                placeholder="例）ノルウェイの森"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
              <button
                type="button"
                aria-label="バーコード読み込み"
                className="grid h-9 w-9 aspect-square place-items-center rounded-full border border-[#e6e6e6] text-[#6b6b6b]"
                title="バーコード読み込み"
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
          </div>
          <div className="grid gap-1">
            <label className="text-[10px] text-[#6b6b6b]">著者</label>
            <input
              className="w-full rounded border border-[#e6e6e6] px-2.5 py-2"
              placeholder="例）村上 春樹"
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="grid gap-1">
              <label className="text-[10px] text-[#6b6b6b]">種別</label>
              <select
                className="w-full rounded border border-[#e6e6e6] px-2.5 py-2"
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
              <label className="text-[10px] text-[#6b6b6b]">進捗</label>
              <select
                className="w-full rounded border border-[#e6e6e6] px-2.5 py-2"
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
          <div className="grid grid-cols-2 gap-2">
            <div className="grid gap-1">
              <label className="text-[10px] text-[#6b6b6b]">出版社</label>
              <input
                className="w-full rounded border border-[#e6e6e6] px-2.5 py-2"
                placeholder="例）講談社"
                value={publisher}
                onChange={(event) => setPublisher(event.target.value)}
              />
            </div>
            <div className="grid gap-1">
              <label className="text-[10px] text-[#6b6b6b]">発行年</label>
              <input
                className="w-full rounded border border-[#e6e6e6] px-2.5 py-2"
                placeholder="例）2024"
                value={year}
                onChange={(event) => setYear(event.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="grid gap-1">
              <label className="text-[10px] text-[#6b6b6b]">巻数</label>
              <input
                className="w-full rounded border border-[#e6e6e6] px-2.5 py-2"
                placeholder="例）1"
                value={volume}
                onChange={(event) => setVolume(event.target.value)}
              />
            </div>
            <div className="grid gap-1">
              <label className="text-[10px] text-[#6b6b6b]">タグ</label>
              <input
                className="w-full rounded border border-[#e6e6e6] px-2.5 py-2"
                placeholder="例）文学, 長編"
                value={tags}
                onChange={(event) => setTags(event.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-1">
            <label className="text-[10px] text-[#6b6b6b]">
              サムネイルURL
            </label>
            <input
              className="w-full rounded border border-[#e6e6e6] px-2.5 py-2"
              placeholder="https://..."
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
            />
          </div>
          <div className="grid gap-1">
            <label className="text-[10px] text-[#6b6b6b]">メモ</label>
            <textarea
              className="min-h-[72px] w-full rounded border border-[#e6e6e6] px-2.5 py-2"
              placeholder="感想やメモ"
              value={memo}
              onChange={(event) => setMemo(event.target.value)}
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            className="rounded-full border border-[#e6e6e6] px-3 py-1.5 text-[11px] text-[#6b6b6b]"
            onClick={() => setVisible(false)}
          >
            キャンセル
          </button>
          <button
            type="button"
            className={`rounded-full border px-3 py-1.5 text-[11px] ${
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
