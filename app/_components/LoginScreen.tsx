"use client";

import { GoogleAuthProvider, signInWithPopup, type User } from "firebase/auth";
import { doc, getDoc, getDocFromServer, serverTimestamp, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { auth, db } from "../_lib/firebase";

type LoginScreenProps = {
  onLoggedIn?: (user: User) => void;
};

export default function LoginScreen({ onLoggedIn }: LoginScreenProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const ensureUserDoc = async (user: User) => {
    const userRef = doc(db, "users", user.uid);
    let snap;
    try {
      snap = await getDocFromServer(userRef);
    } catch {
      snap = await getDoc(userRef);
    }
    const data = snap.data() as
      | { displayName?: string; photoURL?: string; bio?: string; createdAt?: unknown }
      | undefined;

    const payload: {
      displayName?: string;
      photoURL?: string;
      bio?: string;
      createdAt?: ReturnType<typeof serverTimestamp>;
    } = {};

    if (!data?.displayName) {
      payload.displayName = user.displayName ?? "ユーザー";
    }
    if (!data?.photoURL) {
      payload.photoURL = user.photoURL ?? "";
    }
    if (data?.bio === undefined) {
      payload.bio = "";
    }
    if (!data?.createdAt) {
      payload.createdAt = serverTimestamp();
    }

    if (Object.keys(payload).length === 0) {
      return;
    }

    await setDoc(userRef, payload, { merge: true });
  };

  const checkNeedsSetup = async (user: User) => {
    const userRef = doc(db, "users", user.uid);
    let snap;
    try {
      snap = await getDocFromServer(userRef);
    } catch {
      snap = await getDoc(userRef);
    }
    const data = snap.data() as { handle?: string } | undefined;
    const handle = typeof data?.handle === "string" ? data.handle.trim() : "";
    return !handle;
  };

  const handleLogin = async (redirectToSetup: boolean) => {
    setError("");
    setBusy(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await ensureUserDoc(result.user);
      onLoggedIn?.(result.user);

      const needsSetup = await checkNeedsSetup(result.user);
      if (needsSetup) {
        router.push("/account-setup");
        return;
      }
      if (redirectToSetup) {
        router.push("/account-setup");
      }
    } catch (err) {
      setError("ログインに失敗しました。時間をおいて再度お試しください。");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-full w-full max-w-[480px] items-center px-4 py-6">
      <section className="grid w-full gap-4 rounded border-[#e6e6e6] bg-white px-5 py-20 text-center text-[14px]">
        <div className="grid gap-2">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#222] text-white">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-6 w-6 fill-current"
            >
              <rect x="4" y="3.5" width="4" height="17" rx="1.5" />
              <rect x="10" y="3.5" width="4" height="17" rx="1.5" />
              <rect x="16" y="3.5" width="4" height="17" rx="1.5" />
            </svg>
          </div>
          <h1 className="text-[18px] font-semibold">Shelfie</h1>
        </div>
        <button
          type="button"
          className="rounded-full border border-[#222] bg-[#222] px-4 py-3 text-[14px] text-[#f9f9f9]"
          onClick={() => handleLogin(false)}
          disabled={busy}
        >
          ログイン
        </button>
        <button
          type="button"
          className="rounded-full border border-[#e6e6e6] px-4 py-3 text-[14px] text-[#222]"
          onClick={() => handleLogin(true)}
          disabled={busy}
        >
          アカウント登録
        </button>
        {error && <p className="text-[12px] text-[#b04a4a]">{error}</p>}
      </section>
    </div>
  );
}
