# ✅ TODO アプリケーション - README（日本語）

## 🖥️ 開発環境に必要なツール

このプロジェクトを実行するには、以下のツールが PC にインストールされている必要があります：

| ツール名        | 推奨バージョン | 用途                         |
| --------------- | -------------- | ---------------------------- |
| Node.js         | 18.x 以上      | フロント・バックエンドの起動 |
| npm             | Node.js に付属 | パッケージ管理               |
| PostgreSQL      | 13.x 以上      | データベース                 |
| pgAdmin（任意） | 最新           | GUI で DB 作成・確認に便利   |

---

## 🔐 PostgreSQL & JWT の準備

### 1. PostgreSQL データベース作成

ターミナルまたは `pgAdmin` で以下を実行：

```sql
CREATE DATABASE todo_app_db;
CREATE USER todo_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE todo_app_db TO todo_user;
```

### 2. `.env` ファイル作成（`backend/.env`）

```env
DATABASE_URL="postgresql://todo_user:your_password@localhost:5432/todo_app_db"
JWT_SECRET="your_super_secret_jwt_token"
```

---

## 📝 プロジェクト概要

このアプリケーションは、ユーザーがタスク（ToDo）を作成・編集・管理できるフルスタック Web アプリケーションです。

- フロントエンド：React（Vite + TypeScript + Tailwind + DaisyUI）
- バックエンド：Express（TypeScript + Prisma）
- データベース：PostgreSQL

---

## 🚀 使用技術スタック

| カテゴリ       | 技術                                           |
| -------------- | ---------------------------------------------- |
| フロントエンド | React, TypeScript, Vite, Tailwind CSS, DaisyUI |
| バックエンド   | Express, TypeScript, Prisma                    |
| データベース   | PostgreSQL                                     |
| その他ツール   | Axios, React Router DOM                        |

---

## 📦 実装機能一覧

### 🔐 認証機能

- ユーザー登録（メール & パスワード）
- ログイン（JWT 認証）
- 24 時間トークン有効期限

### ✅ ToDo 機能

- タスク作成・編集・削除
- ステータス切替（完了/未完了）
- タグの付与（複数可）
- ステータス・タグによるフィルタ
- ページネーション（最大 100 件/ページ）
- 期限順ソート
- 期限切れのタスクは赤背景で強調表示
- インラインで完了チェック切り替え

### 🏷️ タグ管理機能

- タグの作成・編集・削除
- タグ一覧表示
- Todo 作成画面から直接タグ追加可能

---

## 🗂 ページ構成

| パス              | 内容                   |
| ----------------- | ---------------------- |
| `/todos`          | ToDo 一覧ページ        |
| `/todos/new`      | ToDo 新規作成ページ    |
| `/todos/:id/edit` | ToDo 編集ページ        |
| `/tags`           | タグ一覧ページ         |
| `/tags/new`       | タグ作成ページ         |
| `/tags/:id/edit`  | タグ編集ページ         |
| `/login`          | ログインページ         |
| `/register`       | 新規ユーザー登録ページ |

---

## ⚙️ セットアップ手順

### 1. リポジトリをクローン

```bash
git clone https://github.com/muradtheOZ/todo.git
cd todo
```

### 2. バックエンド設定

```bash
cd backend
npm install
```

`.env` ファイルを作成し、以下を設定：

```env
DATABASE_URL="postgresql://todo_user:your_password@localhost:5432/todo_app_db"
JWT_SECRET="your_super_secret_jwt_token"
```

#### マイグレーション実行：

```bash
npx prisma migrate dev --name init
npx prisma generate
```

#### サーバー起動：

```bash
npm run dev
```

### 3. フロントエンド設定

```bash
cd ../frontend
npm install
npm run dev
```

アクセス先: [http://localhost:5173](http://localhost:5173)

---

## ✅ 動作確認の手順

以下の手順でアプリケーションの基本機能が動作することを確認できます：

1. ブラウザで `http://localhost:5173` にアクセス
2. 「新規登録」ページでユーザーアカウントを作成
3. ログイン後、ToDo 一覧が表示されることを確認
4. 「+ New Todo」でタスクを作成し、一覧に表示されることを確認
5. 状態変更チェックボックスで完了状態を切り替えられることを確認
6. 「Tags」ボタンからタグ一覧を開き、新しいタグを作成
7. タグ選択によるフィルタ機能が正しく動作することを確認

---

## 🧪 開発用便利コマンド

| コマンド            | 説明                            |
| ------------------- | ------------------------------- |
| `npm run dev`       | 開発サーバー起動                |
| `npm run build`     | 本番ビルド                      |
| `npx prisma studio` | Prisma Studio（GUI で DB 確認） |

---

## ✅ 補足・注意点

- 各ユーザーごとの ToDo は最大 1000 件まで対応可能です。
- クライアント側で状態とタグを併用したフィルタが可能です。
- 期限切れ ToDo は一覧で背景色を変更して表示されます。
- 本番用には `.env.production` を用意するのが推奨されます。

---

## 📮 ライセンス

MIT © Murad
