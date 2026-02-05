"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  documentId,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { useSearchParams } from "next/navigation";
import BottomNav from "../_components/BottomNav";
import TopBar from "../_components/TopBar";
import { auth, db } from "../_lib/firebase";

type UserRow = {
  id: string;
  displayName: string;
  handle: string;
  photoURL?: string;
  bio?: string;
};

const chunk = <T,>(items: T[], size: number) => {
  const result: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    result.push(items.slice(i, i + size));
  }
  return result;
};

const getInitial = (handle: string, name: string) => {
  const base = handle.replace(/^@/, "").trim() || name.trim() || "S";
  return base.slice(0, 1).toUpperCase();
};

export default function ConnectionsPage() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const activeTab = tabParam === "followers" ? "followers" : "following";
  const activeCollection = activeTab === "followers" ? "followers" : "follows";

  const [user, setUser] = useState<User | null>(null);
  const [ids, setIds] = useState<string[]>([]);
  const [rows, setRows] = useState<UserRow[]>([]);
  const [followMap, setFollowMap] = useState<Record<string, boolean>>({});
  const [busyMap, setBusyMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) {
      setIds([]);
      return undefined;
    }
    const ref = collection(db, "users", user.uid, activeCollection);
    const q = query(ref, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setIds(snapshot.docs.map((docSnap) => docSnap.id));
    });
    return () => unsubscribe();
  }, [user, activeCollection]);

  useEffect(() => {
    if (!user) {
      setFollowMap({});
      return undefined;
    }
    const ref = collection(db, "users", user.uid, "follows");
    const q = query(ref, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const next: Record<string, boolean> = {};
      snapshot.forEach((docSnap) => {
        next[docSnap.id] = true;
      });
      setFollowMap(next);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (ids.length === 0) {
      setRows([]);
      return;
    }
    let alive = true;
    const run = async () => {
      const chunks = chunk(ids, 10);
      const results: UserRow[] = [];
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
            bio?: string;
          };
          const handle = data.handle ? `@${data.handle.replace(/^@/, "")}` : "";
          results.push({
            id: docSnap.id,
            displayName: data.displayName ?? "ユーザー",
            handle,
            photoURL: data.photoURL,
            bio: data.bio ?? "",
          });
        });
      }
      if (!alive) return;
      const ordered = ids
        .map((id) => results.find((row) => row.id === id))
        .filter(Boolean) as UserRow[];
      setRows(ordered);
    };
    run();
    return () => {
      alive = false;
    };
  }, [ids]);

  const handleToggle = async (target: UserRow) => {
    if (!user) return;
    if (busyMap[target.id]) return;
    const isFollowing = !!followMap[target.id];
    if (isFollowing) {
      const ok = window.confirm("フォローを解除しますか？");
      if (!ok) return;
    }
    setBusyMap((current) => ({ ...current, [target.id]: true }));
    try {
      const followRef = doc(db, "users", user.uid, "follows", target.id);
      const followerRef = doc(db, "users", target.id, "followers", user.uid);
      if (isFollowing) {
        await deleteDoc(followRef);
        await deleteDoc(followerRef);
      } else {
        await setDoc(
          followRef,
          { targetUid: target.id, createdAt: serverTimestamp() },
          { merge: true }
        );
        await setDoc(
          followerRef,
          { followerUid: user.uid, createdAt: serverTimestamp() },
          { merge: true }
        );
      }
    } finally {
      setBusyMap((current) => ({ ...current, [target.id]: false }));
    }
  };

  const emptyLabel = useMemo(
    () =>
      activeTab === "followers"
        ? "フォロワーがここに表示されます。"
        : "フォロー中のユーザーがここに表示されます。",
    [activeTab]
  );

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <TopBar
        title="つながり"
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
      <main className="scroll-pane mx-auto w-full max-w-[480px] flex-1 overflow-y-auto px-4 pt-3 pb-[84px] text-left hide-scrollbar">
        <div className="flex items-center gap-2">
          <Link
            href="/connections?tab=following"
            className={`rounded-full px-3 py-2 text-[12px] ${
              activeTab === "following"
                ? "bg-[#222] text-white"
                : "bg-[#f1f1f1] text-[#6b6b6b]"
            }`}
          >
            フォロー
          </Link>
          <Link
            href="/connections?tab=followers"
            className={`rounded-full px-3 py-2 text-[12px] ${
              activeTab === "followers"
                ? "bg-[#222] text-white"
                : "bg-[#f1f1f1] text-[#6b6b6b]"
            }`}
          >
            フォロワー
          </Link>
        </div>

        <section className="mt-3 grid gap-2">
          {rows.length === 0 ? (
            <div className="rounded bg-[#f7f7f7] px-3 py-10 text-center text-[12px] text-[#8b8b8b]">
              {emptyLabel}
            </div>
          ) : (
            rows.map((row) => {
              const isFollowing = !!followMap[row.id];
              return (
                <div
                  key={row.id}
                  className="flex items-center justify-between rounded border border-[#e6e6e6] bg-white px-3 py-2"
                >
                  <div className="flex items-center gap-3">
                    {row.photoURL ? (
                      <img
                        src={row.photoURL}
                        alt={row.displayName}
                        className="h-9 w-9 rounded-full object-cover"
                      />
                    ) : (
                      <div className="grid h-9 w-9 place-items-center rounded-full bg-[#222] text-[12px] font-semibold text-white">
                        {getInitial(row.handle, row.displayName)}
                      </div>
                    )}
                    <div className="grid gap-0.5">
                      <span className="text-[13px] font-semibold text-[#222]">
                        {row.displayName}
                      </span>
                      <span className="text-[11px] text-[#6b6b6b]">
                        {row.handle || "ID未設定"}
                      </span>
                      <span className="max-w-[200px] truncate text-[11px] text-[#6b6b6b]">
                        {row.bio || "自己紹介文が未設定です。"}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={`rounded-full border px-3 py-1 text-[12px] ${
                      isFollowing
                        ? "border-[#222] bg-[#222] text-white"
                        : "border-[#222] text-[#222]"
                    }`}
                    onClick={() => handleToggle(row)}
                    disabled={busyMap[row.id]}
                  >
                    {isFollowing ? "フォロー中" : "フォロー"}
                  </button>
                </div>
              );
            })
          )}
        </section>
      </main>
      <BottomNav active="me" />
    </div>
  );
}
