"use client";

import { doc, getDocs, query, setDoc, where, collection, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged, type User } from "firebase/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TopBar from "../_components/TopBar";
import { auth, db } from "../_lib/firebase";

export default function AccountSetupPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      if (!nextUser) {
        router.push("/login");
      } else if (nextUser.displayName) {
        setName(nextUser.displayName);
      }
    });
    return () => unsub();
  }, [router]);

  const handleSubmit = async () => {
    if (!user) return;
    const trimmedName = name.trim();
    const trimmedHandle = handle.trim();
    const idPattern = /^[A-Za-z0-9_]{4,16}$/;

    if (!trimmedName) {
      setError("名前を入力してください。");
      return;
    }
    if (!idPattern.test(trimmedHandle)) {
      setError("IDは4〜16文字の英数字と_のみ使用できます。");
      return;
    }

    setBusy(true);
    setError("");
    try {
      const q = query(collection(db, "users"), where("handle", "==", trimmedHandle));
      const snapshot = await getDocs(q);
      const exists = snapshot.docs.some((docSnap) => docSnap.id !== user.uid);
      if (exists) {
        setError("このIDは既に使用されています。");
        return;
      }
      await setDoc(
        doc(db, "users", user.uid),
        {
          displayName: trimmedName,
          handle: trimmedHandle,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      router.push("/me");
    } catch (err) {
      setError("登録に失敗しました。時間をおいて再度お試しください。");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <TopBar title="アカウント登録" />
      <main className="scroll-pane mx-auto w-full max-w-[480px] flex-1 overflow-y-auto px-4 pt-3 pb-[84px] hide-scrollbar">
        <section className="grid gap-3 rounded border border-[#e6e6e6] bg-white p-4 text-[14px]">
          <p className="text-[12px] text-[#6b6b6b]">
            初回ログインのため、アカウント登録を行ってください。
          </p>
          <div className="grid gap-1">
            <span className="text-[12px] text-[#6b6b6b]">名前</span>
            <input
              className="w-full rounded border border-[#e6e6e6] bg-white px-2.5 py-2 text-[16px]"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="表示名"
            />
          </div>
          <div className="grid gap-1">
            <span className="text-[12px] text-[#6b6b6b]">ID</span>
            <input
              className="w-full rounded border border-[#e6e6e6] bg-white px-2.5 py-2 text-[16px]"
              value={handle}
              onChange={(event) => setHandle(event.target.value)}
              placeholder="4〜16文字（英数字と_）"
            />
          </div>
          {error && <p className="text-[12px] text-[#b04a4a]">{error}</p>}
          <button
            type="button"
            className="rounded-full border border-[#222] bg-[#222] px-3 py-2 text-[14px] text-[#f9f9f9]"
            onClick={handleSubmit}
            disabled={busy}
          >
            アカウント登録
          </button>
        </section>
      </main>
    </div>
  );
}
