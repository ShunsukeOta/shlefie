"use client";

import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { useEffect, useState } from "react";
import TopBar from "../_components/TopBar";
import LoginScreen from "../_components/LoginScreen";
import { auth } from "../_lib/firebase";

export default function LoginPage() {
  const [user, setUser] = useState<User | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
    });
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    setError("");
    setBusy(true);
    try {
      await signOut(auth);
    } catch (err) {
      setError("ログアウトに失敗しました。");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <TopBar title="ログイン" />
      <main className="scroll-pane mx-auto w-full max-w-[480px] flex-1 overflow-y-auto px-4 pt-3 pb-[84px] hide-scrollbar">
        {!user && <LoginScreen />}
        {user && (
          <section className="grid gap-3 rounded border border-[#e6e6e6] bg-white p-4 text-[14px]">
            <div className="grid gap-1">
              <h1 className="text-[16px] font-semibold">ログイン済み</h1>
              <p className="text-[12px] text-[#6b6b6b]">
                右上の戻るから戻ってください。
              </p>
            </div>
            <div className="grid gap-1 rounded border border-[#e6e6e6] px-3 py-2">
              <span className="text-[12px] text-[#6b6b6b]">ログイン中</span>
              <span className="text-[14px] font-semibold">
                {user.displayName ?? "ユーザー"}
              </span>
              <span className="text-[12px] text-[#6b6b6b]">{user.email ?? ""}</span>
            </div>
            <button
              type="button"
              className="rounded-full border border-[#e6e6e6] px-3 py-2 text-[14px] text-[#222]"
              onClick={handleLogout}
              disabled={busy}
            >
              ログアウト
            </button>
            {error && <p className="text-[12px] text-[#b04a4a]">{error}</p>}
          </section>
        )}
      </main>
    </div>
  );
}
