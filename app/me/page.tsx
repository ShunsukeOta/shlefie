"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import BottomNav from "../_components/BottomNav";
import TopBar from "../_components/TopBar";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useLibrary } from "../_components/LibraryProvider";
import { auth } from "../_lib/firebase";
import { db } from "../_lib/firebase";

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

export default function MePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [logoutBusy, setLogoutBusy] = useState(false);
  const [saveBusy, setSaveBusy] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveToast, setSaveToast] = useState(false);
  const [displayName, setDisplayName] = useState("shelfie user");
  const [savedDisplayName, setSavedDisplayName] = useState("shelfie user");
  const [handle, setHandle] = useState("@shelfie_user");
  const [profileText, setProfileText] = useState(
    ""
  );
  const [savedProfileText, setSavedProfileText] = useState(
    ""
  );
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [followCount, setFollowCount] = useState(0);
  const [followerCount, setFollowerCount] = useState(0);
  const handleInitial = (handle.replace(/^@/, "").trim().slice(0, 1) ||
    displayName.trim().slice(0, 1) ||
    "S"
  ).toUpperCase();
  const { logs: recentLogs, books } = useLibrary();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      if (!nextUser) return;
      try {
        const snap = await getDoc(doc(db, "users", nextUser.uid));
        const data = snap.data() as
          | { displayName?: string; handle?: string; photoURL?: string; bio?: string }
          | undefined;
        if (data?.displayName) {
          setDisplayName(data.displayName);
          setSavedDisplayName(data.displayName);
        } else if (nextUser.displayName) {
          setDisplayName(nextUser.displayName);
          setSavedDisplayName(nextUser.displayName);
        }
        if (data?.bio) {
          setProfileText(data.bio);
          setSavedProfileText(data.bio);
        }
        if (data?.handle) {
          setHandle(data.handle.startsWith("@") ? data.handle : `@${data.handle}`);
        }
        if (data?.photoURL) {
          setProfileImage(data.photoURL);
        } else if (nextUser.photoURL) {
          setProfileImage(nextUser.photoURL);
        } else {
          setProfileImage(null);
        }
      } catch {
        if (nextUser.displayName) {
          setDisplayName(nextUser.displayName);
          setSavedDisplayName(nextUser.displayName);
        }
        setProfileText(savedProfileText);
        if (nextUser.photoURL) {
          setProfileImage(nextUser.photoURL);
        } else {
          setProfileImage(null);
        }
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return undefined;
    const followsRef = collection(db, "users", user.uid, "follows");
    const followersRef = collection(db, "users", user.uid, "followers");
    const unsubFollows = onSnapshot(followsRef, (snapshot) => {
      setFollowCount(snapshot.size);
    });
    const unsubFollowers = onSnapshot(followersRef, (snapshot) => {
      setFollowerCount(snapshot.size);
    });
    return () => {
      unsubFollows();
      unsubFollowers();
    };
  }, [user]);

  const handleLogout = async () => {
    setLogoutBusy(true);
    try {
      await signOut(auth);
    } finally {
      setLogoutBusy(false);
      setShowLogout(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    const nextName = displayName.trim();
    const nextBio = profileText.trim();
    setSaveBusy(true);
    setSaveError("");
    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          displayName: nextName || "ユーザー",
          bio: nextBio,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      setSavedDisplayName(nextName || "ユーザー");
      setSavedProfileText(nextBio);
      setIsEditing(false);
      setSaveToast(true);
    } catch {
      setSaveError("保存に失敗しました。時間をおいて再度お試しください。");
    } finally {
      setSaveBusy(false);
    }
  };

  useEffect(() => {
    if (!saveToast) return;
    const timer = window.setTimeout(() => setSaveToast(false), 2000);
    return () => window.clearTimeout(timer);
  }, [saveToast]);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <TopBar
        title="マイページ"
        rightSlot={
          <div className="flex items-center gap-1">
            <Link
              href="/settings"
              aria-label="設定"
              className="grid h-9 w-9 place-items-center text-white"
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
                <path d="M12 8.5a3.5 3.5 0 1 0 0 7a3.5 3.5 0 0 0 0-7Z" />
                <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.9 2.9l-.1-.1a1.7 1.7 0 0 0-1.9-.3a1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5a1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.9-2.9l.1-.1a1.7 1.7 0 0 0 .3-1.9a1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1a1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.9-2.9l.1.1a1.7 1.7 0 0 0 1.9.3h.1A1.7 1.7 0 0 0 10 3.1V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5h.1a1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.9 2.9l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
              </svg>
            </Link>
            <button
              type="button"
              aria-label="ログアウト"
              className="grid h-9 w-9 place-items-center text-white"
              onClick={() => setShowLogout(true)}
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 12h10" />
                <path d="m15 8 4 4-4 4" />
                <path d="M4 5h6" />
                <path d="M4 19h6" />
                <path d="M4 5v14" />
              </svg>
            </button>
          </div>
        }
      />
      <main className="scroll-pane mx-auto w-full max-w-[480px] flex-1 overflow-y-auto pb-[84px] hide-scrollbar">
        <section className="overflow-hidden bg-white">
            <div className="relative h-32 bg-[linear-gradient(135deg,#222222,#4b4b4b)]">
              {isEditing && (
                <button
                  type="button"
                  className="absolute right-3 top-3 rounded-full border border-white/30 px-4 py-2 text-[12px] text-white"
                >
                  画像を変更
                </button>
              )}
            </div>
          <div className="grid gap-2 p-3 pt-3">
            <div className="flex items-start justify-between">
              <div className="-mt-14 relative z-10">
                <div className="relative h-22 w-22 rounded-full border-2 border-white bg-[#f3f3f3]">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt={displayName}
                      className="h-full w-full rounded-full object-cover"
                      onError={() => setProfileImage(null)}
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center rounded-full bg-[linear-gradient(135deg,#eeeeee,#d8d8d8)] text-[18px] font-semibold leading-none text-[#6b6b6b]">
                      <span className="whitespace-nowrap">{handleInitial}</span>
                    </div>
                  )}
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
                className="inline-flex items-center gap-1.5 rounded-full border border-[#e6e6e6] px-4 py-2 text-[12px] text-[#6b6b6b]"
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
                  className="w-full rounded border border-[#e6e6e6] px-2.5 py-2 text-[16px]"
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  placeholder="表示名"
                />
                <textarea
                  className="min-h-[96px] w-full rounded border border-[#e6e6e6] px-2.5 py-2 text-[16px]"
                  value={profileText}
                  onChange={(event) => setProfileText(event.target.value)}
                  placeholder="プロフィール文を入力"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="rounded-full border border-[#e6e6e6] px-4 py-2 text-[14px] text-[#6b6b6b]"
                    onClick={() => {
                      setDisplayName(savedDisplayName);
                      setProfileText(savedProfileText);
                      setSaveError("");
                      setIsEditing(false);
                    }}
                  >
                    キャンセル
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-[#222] bg-[#222] px-4 py-2 text-[14px] text-[#f9f9f9]"
                    onClick={handleSaveProfile}
                    disabled={saveBusy}
                  >
                    保存
                  </button>
                </div>
                {saveError && (
                  <p className="text-[12px] text-[#b04a4a]">{saveError}</p>
                )}
              </div>
            ) : (
              <div className="grid gap-1 text-left">
                <p className="text-[14px] font-semibold">{displayName}</p>
                <p className="text-[12px] text-[#6b6b6b]">{handle}</p>
                <p className="mt-1 text-[12px] text-[#222]">{profileText}</p>
              </div>
            )}
            <div className="mt-2 grid grid-cols-3 gap-2 text-[12px]">
              <Link
                href="/connections?tab=following"
                className="rounded bg-[#222] px-2 py-2 text-center text-white"
                aria-label="フォロー一覧"
              >
                <div className="font-semibold text-[14px]">{followCount}</div>
                <div className="text-[#d9d9d9]">フォロー</div>
              </Link>
              <Link
                href="/connections?tab=followers"
                className="rounded bg-[#222] px-2 py-2 text-center text-white"
                aria-label="フォロワー一覧"
              >
                <div className="font-semibold text-[14px]">{followerCount}</div>
                <div className="text-[#d9d9d9]">フォロワー</div>
              </Link>
              <div className="rounded bg-[#222] px-2 py-2 text-center text-white">
                <div className="font-semibold text-[14px]">{books.length}</div>
                <div className="text-[#d9d9d9]">総shelf</div>
              </div>
            </div>
            <div className="mt-3">
              <h2 className="text-[14px] font-semibold">最近のログ</h2>
              <section className="mt-2 grid gap-0">
                {recentLogs.length === 0 ? (
                  <div className="rounded border border-[#e6e6e6] bg-white px-3 py-8 text-center text-[12px] text-[#8b8b8b]">
                    ここに最近のログが表示されます。
                  </div>
                ) : (
                  recentLogs.map((log) => {
                    const logFallback =
                      log.fallbackCover || makeLogCover(log.title || "Book");
                    return (
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
                    );
                  })
                )}
              </section>
            </div>
          </div>
        </section>
        {showLogout && (
          <div className="fixed inset-0 z-20 flex items-center justify-center px-4">
            <button
              type="button"
              className="modal-backdrop absolute inset-0 bg-black/25"
              aria-label="閉じる"
              onClick={() => setShowLogout(false)}
            />
            <div className="relative w-full max-w-[320px] rounded-2xl bg-white p-4 text-[14px] shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
              <p className="text-[16px] font-semibold">ログアウトしますか？</p>
              <p className="mt-1 text-[12px] text-[#6b6b6b]">
                保存内容はこの端末とアカウントに残ります。
              </p>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  className="rounded-full border border-[#e6e6e6] px-3 py-2 text-[14px] text-[#222]"
                  onClick={() => setShowLogout(false)}
                  disabled={logoutBusy}
                >
                  キャンセル
                </button>
                <button
                  type="button"
                  className="rounded-full border border-[#222] bg-[#222] px-3 py-2 text-[14px] text-[#f9f9f9]"
                  onClick={handleLogout}
                  disabled={logoutBusy}
                >
                  ログアウト
                </button>
              </div>
            </div>
          </div>
        )}
        </main>
        {saveToast && (
          <div className="fixed top-[72px] left-1/2 z-30 -translate-x-1/2 rounded-full bg-[#222] px-4 py-2 text-[12px] text-[#f9f9f9] shadow-[0_8px_20px_rgba(0,0,0,0.2)]">
            保存しました
          </div>
        )}
      <BottomNav active="me" />
    </div>
  );
}
