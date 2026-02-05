"use client";

import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  documentId,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import BottomNav from "../_components/BottomNav";
import TopBar from "../_components/TopBar";
import { auth, db } from "../_lib/firebase";

type UserResult = {
  id: string;
  displayName: string;
  handle: string;
  photoURL?: string;
  bio?: string;
};

type TimelineLog = {
  id: string;
  title: string;
  status?: string;
  statusKey?: "unread" | "stack" | "reading" | "done";
  message: string;
  imageUrl?: string;
  createdAt?: number;
  actorName?: string;
  actorHandle?: string;
  actorPhotoURL?: string;
  likeCount?: number;
  likedBy?: Record<string, boolean>;
  ownerUid?: string;
};

const chunk = <T,>(items: T[], size: number) => {
  const result: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    result.push(items.slice(i, i + size));
  }
  return result;
};

const formatRelativeTime = (createdAt?: number) => {
  if (!createdAt) return "";
  const diff = Date.now() - createdAt;
  if (diff < 60_000) return "たった今";
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 60) return `${minutes}分前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}時間前`;
  const days = Math.floor(hours / 24);
  return `${days}日前`;
};

const makeLogCover = (title: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="480" viewBox="0 0 360 480">
      <rect width="360" height="480" fill="#222222"/>
      <rect x="28" y="28" width="304" height="424" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
      <text x="40" y="90" fill="#ffffff" font-size="28" font-family="ui-sans-serif, system-ui" font-weight="700">
        ${title}
      </text>
      <text x="40" y="430" fill="rgba(255,255,255,0.6)" font-size="12" font-family="ui-sans-serif, system-ui" letter-spacing="2">
        SHELFIE
      </text>
    </svg>`
  )}`;

const getInitial = (handle: string, name: string) => {
  const base = handle.replace(/^@/, "").trim() || name.trim() || "S";
  return base.slice(0, 1).toUpperCase();
};

export default function TimelinePage() {
  const [user, setUser] = useState<User | null>(null);
  const [queryText, setQueryText] = useState("");
  const [results, setResults] = useState<UserResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");
  const [followMap, setFollowMap] = useState<Record<string, boolean>>({});
  const [followBusy, setFollowBusy] = useState<Record<string, boolean>>({});
  const [searchOpen, setSearchOpen] = useState(false);
  const [followIds, setFollowIds] = useState<string[]>([]);
  const [timelineLogs, setTimelineLogs] = useState<TimelineLog[]>([]);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0);
  const [followProfiles, setFollowProfiles] = useState<Record<
    string,
    { displayName: string; handle: string; photoURL?: string }
  >>({});
  const [likeBusy, setLikeBusy] = useState<Record<string, boolean>>({});

  const normalizedQuery = useMemo(() => queryText.trim().toLowerCase(), [queryText]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) {
      setFollowMap({});
      return undefined;
    }
    const ref = collection(db, "users", user.uid, "follows");
    const q = query(ref, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const next: Record<string, boolean> = {};
      const ids: string[] = [];
      snapshot.forEach((docSnap) => {
        next[docSnap.id] = true;
        ids.push(docSnap.id);
      });
      setFollowMap(next);
      setFollowIds(ids);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (followIds.length === 0) {
      setFollowProfiles({});
      return;
    }
    let alive = true;
    const run = async () => {
      const chunks = chunk(followIds, 10);
      const profiles: Record<
        string,
        { displayName: string; handle: string; photoURL?: string }
      > = {};
      for (const block of chunks) {
        const q = query(
          collection(db, "users"),
          where(documentId(), "in", block)
        );
        const snapshot = await getDocs(q);
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as {
            displayName?: string;
            handle?: string;
            photoURL?: string;
          };
          profiles[docSnap.id] = {
            displayName: data.displayName ?? "ユーザー",
            handle: data.handle ? `@${data.handle.replace(/^@/, "")}` : "",
            photoURL: data.photoURL,
          };
        });
      }
      if (!alive) return;
      setFollowProfiles(profiles);
    };
    run();
    return () => {
      alive = false;
    };
  }, [followIds]);

  useEffect(() => {
    if (!user || followIds.length === 0) {
      setTimelineLogs([]);
      return;
    }
    let alive = true;
    const run = async () => {
      setTimelineLoading(true);
      try {
        const batches = chunk(followIds, 10);
        const perUserLimit = Math.max(3, Math.ceil(30 / followIds.length));
        const logs: TimelineLog[] = [];
        for (const batch of batches) {
          await Promise.all(
            batch.map(async (uid) => {
              const q = query(
                collection(db, "users", uid, "logs"),
                orderBy("createdAt", "desc"),
                limit(perUserLimit)
              );
              const snapshot = await getDocs(q);
              snapshot.forEach((docSnap) => {
                const data = docSnap.data() as TimelineLog;
                const profile = followProfiles[uid];
                logs.push({
                  id: docSnap.id,
                  title: data.title ?? "",
                  status: data.status,
                  statusKey: data.statusKey,
                  message: data.message ?? "",
                  imageUrl: data.imageUrl,
                  createdAt:
                    typeof data.createdAt === "number" ? data.createdAt : undefined,
                  actorName: profile?.displayName ?? "",
                  actorHandle: profile?.handle ?? "",
                  actorPhotoURL: profile?.photoURL,
                  likeCount: data.likeCount ?? 0,
                  likedBy: data.likedBy ?? {},
                  ownerUid: uid,
                });
              });
            })
          );
        }
        if (!alive) return;
        const sorted = logs
          .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
          .slice(0, 30);
        setTimelineLogs(sorted);
      } finally {
        if (alive) {
          setTimelineLoading(false);
        }
      }
    };
    run();
    return () => {
      alive = false;
    };
  }, [user, followIds, followProfiles, refreshTick]);

  const handleLikeToggle = async (log: TimelineLog) => {
    if (!user) return;
    const likeKey = `${log.ownerUid ?? "unknown"}-${log.id}`;
    if (likeBusy[likeKey]) return;
    setLikeBusy((current) => ({ ...current, [likeKey]: true }));
    const alreadyLiked = !!log.likedBy?.[user.uid];
    const nextLiked = !alreadyLiked;
    const nextCount = Math.max(0, (log.likeCount ?? 0) + (alreadyLiked ? -1 : 1));
    setTimelineLogs((current) =>
      current.map((item) =>
        item.id === log.id && item.ownerUid === log.ownerUid
          ? {
              ...item,
              likeCount: nextCount,
              likedBy: {
                ...(item.likedBy ?? {}),
                [user.uid]: nextLiked,
              },
            }
          : item
      )
    );
    try {
      if (!log.ownerUid) return;
      const logRef = doc(db, "users", log.ownerUid, "logs", log.id);
      await setDoc(
        logRef,
        {
          likeCount: nextCount,
          likedBy: {
            ...(log.likedBy ?? {}),
            [user.uid]: nextLiked,
          },
        },
        { merge: true }
      );
    } finally {
      setLikeBusy((current) => ({ ...current, [likeKey]: false }));
    }
  };

  const handleFollowToggle = async (target: UserResult) => {
    if (!user) return;
    if (followBusy[target.id]) return;
    const isFollowing = !!followMap[target.id];
    if (isFollowing) {
      const ok = window.confirm("フォローを解除しますか？");
      if (!ok) return;
    }
    setFollowBusy((current) => ({ ...current, [target.id]: true }));
    try {
      const followRef = doc(db, "users", user.uid, "follows", target.id);
      const followerRef = doc(db, "users", target.id, "followers", user.uid);
      if (isFollowing) {
        await deleteDoc(followRef);
        await deleteDoc(followerRef);
      } else {
        await setDoc(
          followRef,
          {
            targetUid: target.id,
            createdAt: serverTimestamp(),
          },
          { merge: true }
        );
        await setDoc(
          followerRef,
          {
            followerUid: user.uid,
            createdAt: serverTimestamp(),
          },
          { merge: true }
        );
      }
    } finally {
      setFollowBusy((current) => ({ ...current, [target.id]: false }));
    }
  };

  useEffect(() => {
    if (!normalizedQuery) {
      setResults([]);
      setError("");
      return;
    }
    if (normalizedQuery.length < 2) {
      setResults([]);
      setError("2文字以上で検索できます。");
      return;
    }

    const timer = window.setTimeout(async () => {
      setIsSearching(true);
      setError("");
      try {
        const q = query(collection(db, "users"), orderBy("handle"), limit(200));
        const snapshot = await getDocs(q);
        const currentUid = user?.uid ?? auth.currentUser?.uid;
        const mapped = snapshot.docs
          .map((docSnap) => {
            const data = docSnap.data() as {
              displayName?: string;
              handle?: string;
              photoURL?: string;
              bio?: string;
            };
            const handle = data.handle ? `@${data.handle.replace(/^@/, "")}` : "";
            const displayName = data.displayName ?? "ユーザー";
            return {
              id: docSnap.id,
              displayName,
              handle,
              photoURL: data.photoURL,
              bio: data.bio ?? "",
            };
          })
          .filter((item) => item.id !== currentUid)
          .filter((item) => {
            const handleMatch = item.handle.toLowerCase().includes(normalizedQuery);
            const nameMatch = item.displayName.toLowerCase().includes(normalizedQuery);
            return handleMatch || nameMatch;
          });
        setResults(mapped);
        if (mapped.length === 0) {
          setError("一致するユーザーがいません。");
        }
      } catch (err) {
        setError("検索に失敗しました。");
      } finally {
        setIsSearching(false);
      }
    }, 400);
    return () => window.clearTimeout(timer);
  }, [normalizedQuery, user]);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <TopBar
        title="タイムライン"
        rightSlot={
          <button
            type="button"
            className="grid h-9 w-9 place-items-center text-white"
            aria-label="ユーザー検索"
            onClick={() => setSearchOpen(true)}
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </button>
        }
      />
      <main className="scroll-pane mx-auto w-full max-w-[480px] flex-1 overflow-y-auto px-4 pb-[84px] text-left hide-scrollbar">
        <section className="border-[#e6e6e6] bg-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[14px] font-semibold">フォロー中のログ</h2>
            <button
              type="button"
              className="inline-flex items-center gap-1 text-[12px] text-[#6b6b6b]"
              onClick={() => setRefreshTick((value) => value + 1)}
              disabled={timelineLoading}
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
                <path d="M20 12a8 8 0 1 1-2.3-5.6" />
                <path d="M20 4v6h-6" />
              </svg>
              <span>{timelineLoading ? "更新中..." : "更新"}</span>
            </button>
          </div>
          <p className="mt-2 text-[12px] text-[#6b6b6b]">
            ここにフォローしている人の読書ログがまとまって表示されます。
          </p>
          {timelineLoading ? (
            <div className="mt-4 rounded bg-[#f7f7f7] px-3 py-12 text-center text-[12px] text-[#8b8b8b]">
              読み込み中...
            </div>
          ) : timelineLogs.length === 0 ? (
            <div className="mt-4 rounded bg-[#f7f7f7] px-3 py-12 text-center text-[12px] text-[#8b8b8b]">
              フォロー中のユーザーのログがここに表示されます。
            </div>
          ) : (
            <section className="mt-4 grid gap-0">
              {timelineLogs.map((log) => {
                const logFallback = makeLogCover(log.title || "Book");
                return (
                  <div
                    key={`${log.id}-${log.createdAt ?? 0}`}
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
                          <img
                            src={logFallback}
                            alt={`${log.title} ダミーカバー`}
                            className="h-full w-full object-cover"
                          />
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
                      <div className="flex items-center gap-1 text-[10px] text-[#6b6b6b]">
                        {log.actorPhotoURL ? (
                          <img
                            src={log.actorPhotoURL}
                            alt={log.actorName}
                            className="h-4 w-4 rounded-full object-cover"
                          />
                        ) : (
                          <span className="grid h-4 w-4 place-items-center rounded-full bg-[#222] text-[9px] text-white">
                            {getInitial(log.actorHandle ?? "", log.actorName ?? "")}
                          </span>
                        )}
                        <span className="truncate">
                          {log.actorName || "ユーザー"}
                        </span>
                      </div>
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
                        {formatRelativeTime(log.createdAt)}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="grid items-center justify-center gap-1 text-[#6b6b6b]"
                      onClick={() => handleLikeToggle(log)}
                      disabled={!user}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="h-5 w-5"
                        fill={log.likedBy?.[user?.uid ?? ""] ? "#e25b5b" : "none"}
                        stroke={log.likedBy?.[user?.uid ?? ""] ? "#e25b5b" : "currentColor"}
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 20s-7-4.4-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.6-7 9-7 9Z" />
                      </svg>
                      <span className="text-[10px]">{log.likeCount ?? 0}</span>
                    </button>
                  </div>
                );
              })}
            </section>
          )}
        </section>
      </main>
      {searchOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center px-4">
          <button
            type="button"
            className="modal-backdrop absolute inset-0 bg-black/25"
            aria-label="閉じる"
            onClick={() => setSearchOpen(false)}
          />
          <div className="relative w-full max-w-[440px] rounded-2xl bg-white px-4 pb-5 pt-4 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
            <div className="mb-2 flex items-center justify-between">
              <strong className="text-[16px] text-[#222]">ID検索</strong>
              <button
                type="button"
                className="grid h-8 w-8 place-items-center text-[#6b6b6b]"
                onClick={() => setSearchOpen(false)}
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
            <p className="text-[12px] text-[#6b6b6b]">
              フォローしたいユーザーのIDを検索してください。
            </p>
            <div className="mt-3 flex items-center gap-2 rounded border border-[#e6e6e6] bg-white px-3 py-2">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-4 w-4 text-[#6b6b6b]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                className="w-full bg-transparent text-[14px] text-[#222] outline-none placeholder:text-[#b0b0b0]"
                placeholder="IDを入力（例: shelfie_user）"
                value={queryText}
                onChange={(event) => setQueryText(event.target.value)}
              />
            </div>
            {isSearching && (
              <p className="mt-2 text-[12px] text-[#6b6b6b]">検索中...</p>
            )}
            {error && <p className="mt-2 text-[12px] text-[#b04a4a]">{error}</p>}
            {results.length > 0 && (
              <div className="mt-3 grid gap-2">
                {results.map((resultUser) => (
                  <div
                    key={resultUser.id}
                    className="flex items-center justify-between rounded border border-[#e6e6e6] bg-white px-3 py-2"
                  >
                    <div className="flex items-center gap-3">
                      {resultUser.photoURL ? (
                        <img
                          src={resultUser.photoURL}
                          alt={resultUser.displayName}
                          className="h-9 w-9 rounded-full object-cover"
                        />
                      ) : (
                        <div className="grid h-9 w-9 place-items-center rounded-full bg-[#222] text-[12px] font-semibold text-white">
                          {getInitial(resultUser.handle, resultUser.displayName)}
                        </div>
                      )}
                      <div className="grid gap-0.5">
                        <span className="text-[13px] font-semibold text-[#222]">
                          {resultUser.displayName}
                        </span>
                        <span className="text-[11px] text-[#6b6b6b]">
                          {resultUser.handle || "ID未設定"}
                        </span>
                        <span className="max-w-[200px] truncate text-[11px] text-[#6b6b6b]">
                          {resultUser.bio || "自己紹介文が未設定です。"}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`rounded-full border px-3 py-1 text-[12px] ${
                        followMap[resultUser.id]
                          ? "border-[#222] bg-[#222] text-white"
                          : "border-[#222] text-[#222]"
                      }`}
                      onClick={() => handleFollowToggle(resultUser)}
                      disabled={followBusy[resultUser.id]}
                    >
                      {followMap[resultUser.id] ? "フォロー中" : "フォロー"}
                    </button>
                  </div>
                ))}
              </div>
            )}
            {results.length === 0 && !error && !isSearching && normalizedQuery.length >= 2 && (
              <div className="mt-4 rounded bg-[#f7f7f7] px-3 py-8 text-center text-[12px] text-[#8b8b8b]">
                該当するユーザーが表示されます。
              </div>
            )}
          </div>
        </div>
      )}
      <BottomNav active="timeline" />
    </div>
  );
}
