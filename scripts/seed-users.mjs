import { readFile } from "node:fs/promises";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const args = process.argv.slice(2);
const serviceAccountPath = args[0];

if (!serviceAccountPath) {
  console.error("Usage: node scripts/seed-users.mjs <path-to-service-account.json>");
  process.exit(1);
}

const raw = await readFile(serviceAccountPath, "utf8");
const serviceAccount = JSON.parse(raw);

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

const users = [
  { displayName: "テスト太郎", handle: "test_taro", bio: "テスト用ユーザー" },
  { displayName: "テスト花子", handle: "test_hanako", bio: "サンプルプロフィール" },
  { displayName: "サンプル次郎", handle: "sample_jiro", bio: "読書メモ好き" },
  { displayName: "デモ美", handle: "demo_mi", bio: "テストデータ" },
  { displayName: "検証五郎", handle: "verify_goro", bio: "検証アカウント" },
];

const now = Date.now();

await Promise.all(
  users.map((user) =>
    db
      .collection("users")
      .doc(`test_${user.handle}`)
      .set(
        {
          displayName: user.displayName,
          handle: user.handle,
          photoURL: "",
          bio: user.bio,
          createdAt: now,
          updatedAt: now,
          isTest: true,
        },
        { merge: true }
      )
  )
);

console.log("Seeded", users.length, "users.");
