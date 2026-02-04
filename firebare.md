# Firestore 設計書（シンプル版 / 拡張を見据えた構成）

この設計は **最初はシンプルに動かし、後で拡張できる** ことを前提にしています。  
タイムラインは「フォロー中の人のログを時系列で表示する」前提です。

---

## コレクション構成

### 1. users
```
users/{uid}
```
- `uid`: Firebase Auth のユーザーID
- `displayName`: 表示名
- `handle`: ユーザーの@ハンドル
- `photoURL`: プロフィール画像URL
- `bio`: 自己紹介
- `createdAt`: 作成日時（Timestamp）

---

### 2. books（ユーザーごとの本棚）
```
users/{uid}/books/{bookId}
```
- `title`: タイトル
- `author`: 著者名
- `statusKey`: 読書ステータス（`unread` / `stack` / `reading` / `done`）
- `tags`: タグ（配列 or 文字列）
- `memo`: メモ
- `imageUrl`: カバーURL
- `category`: 種別（小説 / 漫画 / etc）
- `publisher`: 出版社
- `year`: 発行年
- `volume`: 巻数
- `updatedAt`: 更新日時（Timestamp）

**用途**  
ユーザー本人の本棚の正情報。

---

### 3. logs（ユーザーごとの行動ログ）
```
users/{uid}/logs/{logId}
```
- `bookId`: 対象書籍ID
- `title`: 書籍タイトル（検索/表示用に複製）
- `author`: 著者名（表示用に複製）
- `imageUrl`: カバーURL（表示用に複製）
- `action`: 行動種別（`add` / `update` / `remove` / `status`）
- `statusKey`: ステータス（必要時）
- `createdAt`: ログ作成日時（Timestamp）

**用途**  
タイムラインや最近のログ表示に使う。  
本棚の状態と独立して残る「履歴」データ。

---

### 4. follows（フォロー関係）
```
users/{uid}/follows/{followUid}
```
- `createdAt`: フォロー日時（Timestamp）

**用途**  
タイムラインで取得する対象ユーザーを決める。

---

## タイムラインの作り方（シンプル版）

1. `users/{uid}/follows` でフォロー中の `uid` を取得  
2. 取得した `uid` の `users/{uid}/logs` を時系列で集約  
3. クライアントで merge & sort

**注意**  
Firestore の `in` クエリは最大10件なので、  
フォロー数が増えると拡張が必要。

---

## 将来の拡張案（スケール設計）

### 拡張案A：タイムライン専用コレクション
```
users/{uid}/timeline/{logId}
```
- `actorUid`: 投稿者
- `bookId`
- `title`
- `action`
- `createdAt`

**メリット**  
フォロー数が増えても1クエリで取得できる。  
Cloud Functions でフォロー先ログを複製する運用。

---

## 公開/非公開設定で考えるキー

### users/{uid} に追加する想定
- `isShelfPublic`: 本棚公開
- `isFollowPublic`: フォロー公開
- `isFollowerPublic`: フォロワー公開

**用途**  
Firestore Rules でアクセス制御に利用。

---

## 次に用意すべきもの

- Firestore Security Rules  
- Firebase Auth の方式（Email / Google / 匿名）  
- タイムライン拡張の方針

---

以上が **シンプルかつ拡張可能な初期設計**です。  
この内容をベースに、ルールや実装フローを追加していけます。
