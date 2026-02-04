"use client";

import { onAuthStateChanged, type User } from "firebase/auth";
import { doc, getDoc, getDocFromServer } from "firebase/firestore";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth, db } from "../_lib/firebase";
import LoginScreen from "./LoginScreen";

type AuthGateProps = {
  children: React.ReactNode;
};

export default function AuthGate({ children }: AuthGateProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      if (!nextUser) {
        setChecking(false);
        return;
      }
      const userRef = doc(db, "users", nextUser.uid);
      let snap;
      try {
        snap = await getDocFromServer(userRef);
      } catch {
        snap = await getDoc(userRef);
      }
      const data = snap.data() as { handle?: string } | undefined;
      const handle = typeof data?.handle === "string" ? data.handle.trim() : "";
      if (!handle && pathname !== "/account-setup") {
        router.push("/account-setup");
        return;
      }
      setChecking(false);
    });
    return () => unsub();
  }, [pathname, router]);

  if (checking) {
    return null;
  }

  if (!user) {
    return <LoginScreen />;
  }

  return <>{children}</>;
}
