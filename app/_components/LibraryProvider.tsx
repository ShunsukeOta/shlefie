"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

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
  }) => void;
  updateBook: (id: string, input: Partial<Book>) => void;
  removeBook: (id: string) => void;
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
        SHELFIE DUMMY
      </text>
    </svg>`
  )}`;

const seedBooks: Book[] = [
  {
    id: "bk-1",
    title: "吾輩は猫である",
    author: "夏目 漱石",
    status: "未読",
    statusKey: "unread",
    imageUrl: "https://picsum.photos/seed/shelfie-1/360/480",
    fallbackCover: makeCover("吾輩は猫である", "夏目 漱石", "#2c2f5a"),
    updatedAt: "2026-02-02",
  },
  {
    id: "bk-2",
    title: "人間失格",
    author: "太宰 治",
    status: "積読",
    statusKey: "stack",
    imageUrl: "https://picsum.photos/seed/shelfie-2/360/480",
    fallbackCover: makeCover("人間失格", "太宰 治", "#1e3d5a"),
    updatedAt: "2026-01-25",
  },
  {
    id: "bk-3",
    title: "羅生門",
    author: "芥川 龍之介",
    status: "読書中",
    statusKey: "reading",
    imageUrl: "https://picsum.photos/seed/shelfie-3/360/480",
    fallbackCover: makeCover("羅生門", "芥川 龍之介", "#7a3b1e"),
    updatedAt: "2026-02-01",
  },
  {
    id: "bk-4",
    title: "ノルウェイの森",
    author: "村上 春樹",
    status: "読了",
    statusKey: "done",
    imageUrl: "https://picsum.photos/seed/shelfie-4/360/480",
    fallbackCover: makeCover("ノルウェイの森", "村上 春樹", "#1f4b3a"),
    updatedAt: "2026-01-20",
  },
  {
    id: "bk-5",
    title: "雪国",
    author: "川端 康成",
    status: "読了",
    statusKey: "done",
    imageUrl: "https://picsum.photos/seed/shelfie-5/360/480",
    fallbackCover: makeCover("雪国", "川端 康成", "#2e2e2e"),
    updatedAt: "2026-01-18",
  },
  {
    id: "bk-6",
    title: "こころ",
    author: "夏目 漱石",
    status: "未読",
    statusKey: "unread",
    imageUrl: "https://picsum.photos/seed/shelfie-6/360/480",
    fallbackCover: makeCover("こころ", "夏目 漱石", "#3c2a4d"),
    updatedAt: "2026-02-03",
  },
  {
    id: "bk-7",
    title: "海辺のカフカ",
    author: "村上 春樹",
    status: "積読",
    statusKey: "stack",
    imageUrl: "https://picsum.photos/seed/shelfie-7/360/480",
    fallbackCover: makeCover("海辺のカフカ", "村上 春樹", "#184a4a"),
    updatedAt: "2026-01-30",
  },
  {
    id: "bk-8",
    title: "重力ピエロ",
    author: "伊坂 幸太郎",
    status: "読書中",
    statusKey: "reading",
    imageUrl: "https://picsum.photos/seed/shelfie-8/360/480",
    fallbackCover: makeCover("重力ピエロ", "伊坂 幸太郎", "#6a3b2b"),
    updatedAt: "2026-01-27",
  },
  {
    id: "bk-9",
    title: "容疑者Xの献身",
    author: "東野 圭吾",
    status: "読了",
    statusKey: "done",
    updatedAt: "2026-01-16",
    fallbackCover: makeCover("容疑者Xの献身", "東野 圭吾", "#2f8a4a"),
  },
  {
    id: "bk-10",
    title: "コンビニ人間",
    author: "村田 沙耶香",
    status: "未読",
    statusKey: "unread",
    updatedAt: "2026-01-15",
    fallbackCover: makeCover("コンビニ人間", "村田 沙耶香", "#8c8c8c"),
  },
];

const seedLogs: LogItem[] = [
  {
    id: "log-1",
    title: "ノルウェイの森",
    status: "読了",
    statusKey: "done",
    time: "2時間前",
    imageUrl: "https://picsum.photos/seed/shelfie-log-1/360/480",
    message: "ノルウェイの森を「読了」に変更しました。",
  },
  {
    id: "log-2",
    title: "人間失格",
    status: "積読",
    statusKey: "stack",
    time: "昨日",
    imageUrl: "https://picsum.photos/seed/shelfie-log-2/360/480",
    message: "人間失格を本棚に登録しました。",
  },
  {
    id: "log-3",
    title: "羅生門",
    status: "読書中",
    statusKey: "reading",
    time: "2日前",
    imageUrl: "https://picsum.photos/seed/shelfie-log-3/360/480",
    message: "羅生門を本棚から削除しました。",
  },
];

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
  const [books, setBooks] = useState<Book[]>(seedBooks);
  const [logs, setLogs] = useState<LogItem[]>(seedLogs);
  const fallbackColors = ["#2c2f5a", "#1e3d5a", "#7a3b1e", "#1f4b3a", "#3c2a4d"];

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedBooks = window.localStorage.getItem("shelfie_books");
    const storedLogs = window.localStorage.getItem("shelfie_logs");
    if (storedBooks) {
      try {
        setBooks(JSON.parse(storedBooks));
      } catch (_) {}
    }
    if (storedLogs) {
      try {
        setLogs(JSON.parse(storedLogs));
      } catch (_) {}
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("shelfie_books", JSON.stringify(books));
    window.localStorage.setItem("shelfie_logs", JSON.stringify(logs));
  }, [books, logs]);

  const addBook: LibraryContextValue["addBook"] = (input) => {
    const now = new Date();
    const date = now.toISOString().slice(0, 10);
    const statusKey = input.statusKey ?? "unread";
    const status =
      statusKey === "unread"
        ? "未読"
        : statusKey === "stack"
          ? "積読"
          : statusKey === "reading"
            ? "読書中"
            : "読了";
    const title = input.title.trim();
    if (!title) {
      return;
    }
    const author = input.author ?? "";
    const fallbackCover =
      input.fallbackCover ||
      (!input.imageUrl
        ? makeCover(
            title,
            author,
            fallbackColors[now.getTime() % fallbackColors.length]
          )
        : undefined);
    const newBook: Book = {
      id: `bk-${now.getTime()}`,
      title,
      author,
      status,
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
    };

    setBooks((current) => [newBook, ...current]);
    setLogs((current) => [
      {
        id: `log-${now.getTime()}`,
        title,
        status,
        statusKey,
        time: "たった今",
        imageUrl: input.imageUrl,
        message: `${title}を本棚に登録しました。`,
      },
      ...current,
    ]);
  };

  const updateBook: LibraryContextValue["updateBook"] = (id, input) => {
    setBooks((current) => {
      let prevStatusKey: BookStatusKey | undefined;
      let prevTitle = "";
      const next = current.map((book) => {
        if (book.id !== id) return book;
        prevStatusKey = book.statusKey;
        prevTitle = book.title;
        const nextStatusKey = input.statusKey ?? book.statusKey;
        return {
          ...book,
          ...input,
          title: input.title ?? book.title,
          author: input.author ?? book.author,
          statusKey: nextStatusKey,
          status:
            nextStatusKey === "unread"
              ? "未読"
              : nextStatusKey === "stack"
                ? "積読"
                : nextStatusKey === "reading"
                  ? "読書中"
                  : "読了",
        };
      });

      if (input.statusKey && input.statusKey !== prevStatusKey) {
        const status =
          input.statusKey === "unread"
            ? "未読"
            : input.statusKey === "stack"
              ? "積読"
              : input.statusKey === "reading"
                ? "読書中"
                : "読了";
        setLogs((currentLogs) => [
          {
            id: `log-${Date.now()}`,
            title: input.title ?? prevTitle ?? "本",
            status,
            statusKey: input.statusKey,
            time: "たった今",
            message: `${input.title ?? prevTitle ?? "本"}を「${status}」に変更しました。`,
          },
          ...currentLogs,
        ]);
      }

      return next;
    });
  };

  const removeBook: LibraryContextValue["removeBook"] = (id) => {
    setBooks((current) => {
      const target = current.find((book) => book.id === id);
      if (target) {
        setLogs((logs) => [
          {
            id: `log-${Date.now()}`,
            title: target.title,
            status: target.status,
            statusKey: target.statusKey,
            time: "たった今",
            imageUrl: target.imageUrl,
            message: `${target.title}を本棚から削除しました。`,
          },
          ...logs,
        ]);
      }
      return current.filter((book) => book.id !== id);
    });
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
