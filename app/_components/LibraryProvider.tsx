"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../_lib/firebase";

export type BookStatusKey = "unread" | "stack" | "reading" | "done";

export type Book = {
  id: string;
  title: string;
  author: string;
  status: string;
  statusKey: BookStatusKey;
  updatedAt: string;
  imageUrl?: string;
  fallbackCover?: string;
  category?: string;
  publisher?: string;
  year?: string;
  volume?: string;
  tags?: string;
  memo?: string;
};

export type LogItem = {
  id: string;
  title: string;
  status?: string;
  statusKey?: BookStatusKey;
  time: string;
  imageUrl?: string;
  message: string;
  createdAt?: number;
};

type BookDoc = {
  title?: string;
  author?: string;
  statusKey?: BookStatusKey;
  updatedAt?: string;
  imageUrl?: string;
  fallbackCover?: string;
  category?: string;
  publisher?: string;
  year?: string;
  volume?: string;
  tags?: string;
  memo?: string;
  createdAt?: number;
};

type LogDoc = {
  title?: string;
  status?: string;
  statusKey?: BookStatusKey;
  time?: string;
  imageUrl?: string;
  message?: string;
  createdAt?: number;
};

type LibraryContextValue = {
  books: Book[];
  logs: LogItem[];
  addBook: (input: {
    title: string;
    author?: string;
    statusKey?: BookStatusKey;
    imageUrl?: string;
    fallbackCover?: string;
    category?: string;
    publisher?: string;
    year?: string;
    volume?: string;
    tags?: string;
    memo?: string;
  }) => Promise<void>;
  updateBook: (id: string, input: Partial<Book>) => Promise<void>;
  removeBook: (id: string) => Promise<void>;
};

const LibraryContext = createContext<LibraryContextValue | null>(null);

const makeCover = (title: string, author: string, color: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="480" viewBox="0 0 360 480">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${color}" />
          <stop offset="1" stop-color="#111111" />
        </linearGradient>
      </defs>
      <rect width="360" height="480" fill="url(#g)"/>
      <rect x="28" y="28" width="304" height="424" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="2"/>
      <text x="40" y="90" fill="#ffffff" font-size="28" font-family="ui-sans-serif, system-ui" font-weight="700">
        ${title}
      </text>
      <text x="40" y="130" fill="rgba(255,255,255,0.8)" font-size="16" font-family="ui-sans-serif, system-ui">
        ${author}
      </text>
      <text x="40" y="430" fill="rgba(255,255,255,0.6)" font-size="12" font-family="ui-sans-serif, system-ui" letter-spacing="2">
        SHELFIE
      </text>
    </svg>`
  )}`;

const fallbackColors = ["#2c2f5a", "#1e3d5a", "#7a3b1e", "#1f4b3a", "#3c2a4d"];

const statusLabel = (key: BookStatusKey) =>
  key === "unread"
    ? "未読"
    : key === "stack"
      ? "積読"
      : key === "reading"
        ? "読書中"
        : "読了";

const hashString = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
};

const stripUndefined = <T extends Record<string, unknown>>(value: T) =>
  Object.fromEntries(
    Object.entries(value).filter(([, item]) => item !== undefined)
  ) as Partial<T>;

const formatRelativeTime = (createdAt?: number, fallback?: string) => {
  if (!createdAt) return fallback ?? "";
  const diff = Date.now() - createdAt;
  if (diff < 60_000) return "たった今";
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 60) return `${minutes}分前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}時間前`;
  const days = Math.floor(hours / 24);
  return `${days}日前`;
};

export function useLibrary() {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error("useLibrary must be used within LibraryProvider");
  }
  return context;
}

type LibraryProviderProps = {
  children: React.ReactNode;
};

export default function LibraryProvider({ children }: LibraryProviderProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [logDocs, setLogDocs] = useState<LogItem[]>([]);
  const [uid, setUid] = useState<string | null>(null);
  const [timeTick, setTimeTick] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUid(user?.uid ?? null);
      if (!user) {
        setBooks([]);
        setLogDocs([]);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeTick((tick) => tick + 1);
    }, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!uid) return undefined;
    const ref = collection(db, "users", uid, "books");
    const q = query(ref, orderBy("updatedAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const next = snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as BookDoc;
        const statusKey = data.statusKey ?? "unread";
        const title = data.title ?? "タイトル不明";
        const author = data.author ?? "";
        const imageUrl = data.imageUrl;
        const fallbackCover =
          data.fallbackCover ||
          (!imageUrl
            ? makeCover(
                title,
                author,
                fallbackColors[hashString(docSnap.id) % fallbackColors.length]
              )
            : undefined);
        return {
          id: docSnap.id,
          title,
          author,
          statusKey,
          status: statusLabel(statusKey),
          updatedAt: data.updatedAt ?? "",
          imageUrl,
          fallbackCover,
          category: data.category,
          publisher: data.publisher,
          year: data.year,
          volume: data.volume,
          tags: data.tags,
          memo: data.memo,
        } as Book;
      });
      setBooks(next);
    });
    return () => unsubscribe();
  }, [uid]);

  useEffect(() => {
    if (!uid) return undefined;
    const ref = collection(db, "users", uid, "logs");
    const q = query(ref, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const next = snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as LogDoc;
        const createdAt =
          typeof data.createdAt === "number" ? data.createdAt : undefined;
        return {
          id: docSnap.id,
          title: data.title ?? "",
          status: data.status,
          statusKey: data.statusKey,
          time: data.time ?? "",
          imageUrl: data.imageUrl,
          message: data.message ?? "",
          createdAt,
        };
      });
      setLogDocs(next);
    });
    return () => unsubscribe();
  }, [uid]);

  const logs = useMemo(
    () =>
      logDocs.map((log) => ({
        ...log,
        time: formatRelativeTime(log.createdAt, log.time),
      })),
    [logDocs, timeTick]
  );

  const addBook: LibraryContextValue["addBook"] = async (input) => {
    if (!uid) return;
    const now = new Date();
    const date = now.toISOString().slice(0, 10);
    const statusKey = input.statusKey ?? "unread";
    const title = input.title.trim();
    if (!title) {
      return;
    }
    const author = input.author?.trim() ?? "";
    const fallbackCover =
      input.fallbackCover ||
      (!input.imageUrl
        ? makeCover(
            title,
            author,
            fallbackColors[now.getTime() % fallbackColors.length]
          )
        : undefined);

    try {
      await addDoc(
        collection(db, "users", uid, "books"),
        stripUndefined<BookDoc>({
          title,
          author,
          statusKey,
          updatedAt: date,
          imageUrl: input.imageUrl,
          fallbackCover,
          category: input.category,
          publisher: input.publisher,
          year: input.year,
          volume: input.volume,
          tags: input.tags,
          memo: input.memo,
          createdAt: now.getTime(),
        })
      );
      await addDoc(
        collection(db, "users", uid, "logs"),
        stripUndefined<LogDoc>({
          title,
          status: statusLabel(statusKey),
          statusKey,
          imageUrl: input.imageUrl,
          message: `${title}を本棚に登録しました。`,
          createdAt: now.getTime(),
        })
      );
    } catch (error) {
      console.error("Failed to add book:", error);
    }
  };

  const updateBook: LibraryContextValue["updateBook"] = async (id, input) => {
    if (!uid) return;
    const now = new Date();
    const date = now.toISOString().slice(0, 10);
    const target = books.find((book) => book.id === id);
    const nextStatusKey = input.statusKey ?? target?.statusKey ?? "unread";

    try {
      await updateDoc(
        doc(db, "users", uid, "books", id),
        stripUndefined<BookDoc>({
          title: input.title,
          author: input.author,
          statusKey: nextStatusKey,
          updatedAt: date,
          imageUrl: input.imageUrl,
          fallbackCover: input.fallbackCover,
          category: input.category,
          publisher: input.publisher,
          year: input.year,
          volume: input.volume,
          tags: input.tags,
          memo: input.memo,
        })
      );

      if (input.statusKey && input.statusKey !== target?.statusKey) {
        const status = statusLabel(input.statusKey);
        await addDoc(
          collection(db, "users", uid, "logs"),
          stripUndefined<LogDoc>({
            title: input.title ?? target?.title ?? "本",
            status,
            statusKey: input.statusKey,
            message: `${input.title ?? target?.title ?? "本"}を「${status}」に変更しました。`,
            createdAt: now.getTime(),
          })
        );
      }
    } catch (error) {
      console.error("Failed to update book:", error);
    }
  };

  const removeBook: LibraryContextValue["removeBook"] = async (id) => {
    if (!uid) return;
    const target = books.find((book) => book.id === id);
    try {
      await deleteDoc(doc(db, "users", uid, "books", id));
      if (target) {
        await addDoc(
          collection(db, "users", uid, "logs"),
          stripUndefined<LogDoc>({
            title: target.title,
            status: target.status,
            statusKey: target.statusKey,
            imageUrl: target.imageUrl,
            message: `${target.title}を本棚から削除しました。`,
            createdAt: Date.now(),
          })
        );
      }
    } catch (error) {
      console.error("Failed to remove book:", error);
    }
  };

  const value = useMemo(
    () => ({ books, logs, addBook, updateBook, removeBook }),
    [books, logs]
  );

  return (
    <LibraryContext.Provider value={value}>
      {children}
    </LibraryContext.Provider>
  );
}
