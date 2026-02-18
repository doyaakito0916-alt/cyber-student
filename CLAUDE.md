# CYBER_STUDENT 再開発プロンプト

> このファイルを新しいプロジェクトの `CLAUDE.md` としてコピーして使ってください。
> Claude Code がプロジェクト全体のコンテキストを理解し、一貫した開発ができるようになります。

---

## プロジェクト概要

サイバーパンク風デジタル学生ポートフォリオアプリ「CYBER_STUDENT」を開発する。
ユーザーが自分のプロフィール・実績タグ・能力ステータスを管理し、デジタルIDカード風に表示・共有できるWebアプリ。

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | Next.js (App Router) + React + TypeScript |
| スタイリング | Tailwind CSS + tailwindcss-animate |
| UIコンポーネント | Radix UI (@radix-ui/*) |
| 認証 | Supabase Auth (Google OAuth) |
| データベース | Supabase (PostgreSQL) |
| フォーム | React Hook Form + Zod |
| チャート | Recharts + カスタムSVGレーダーチャート |
| その他 | qrcode.react, lucide-react, sonner, date-fns |
| デプロイ | Vercel |

## Bashコマンド

- `npm run dev`: 開発サーバー起動
- `npm run build`: プロダクションビルド
- `npm run typecheck`: TypeScript型チェック
- `npm run lint`: ESLintチェック

## コードスタイル規約

- ES modules（import/export）を使用。CommonJS（require）は禁止
- importは分割構文で記述（例: `import { useState, useEffect } from "react"`）
- ファイル名はkebab-case（例: `digital-id-card.tsx`）
- コンポーネントはfunctional component + hooks
- Server Component / Client Component（`"use client"`）を明確に分離する
- `cn()` ユーティリティでクラス名を結合する（clsx + tailwind-merge）
- 型定義は `types/index.ts` に集約
- パスエイリアスは `@/*` を使用

## ワークフロー

- コード変更後は必ず `npm run typecheck` を実行すること
- テストは単体で実行する（全体実行は避ける）
- IMPORTANT: データベース接続にはconnection poolを使用すること
- YOU MUST: APIレスポンスは必ずエラーハンドリングを含めること

---

## データベース設計（Supabase）

### profiles テーブル

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  avatar_url TEXT,
  level INTEGER NOT NULL DEFAULT 1,
  exp INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### my_tags テーブル（実績タグ）

```sql
CREATE TABLE my_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  date TEXT NOT NULL,  -- YYYY.MM.DD形式
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### RLSポリシー

- ユーザーは自分のprofileのみ閲覧・更新可能
- ユーザーは自分のtagsのみ挿入・削除可能
- 公開プロフィールは誰でも閲覧可能（共有リンク用）
- 新規ユーザー登録時にprofileを自動作成するトリガーを設定

### 環境変数（.env.local）

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## TypeScript 型定義

```typescript
type TagRarity = "common" | "rare" | "epic" | "legendary"
type VisibilityType = "public" | "limited"

interface Profile {
  id: string
  name: string
  avatar_url: string | null
  level: number
  exp: number
}

interface MyTag {
  id?: string
  name: string
  rarity: TagRarity
  date: string // YYYY.MM.DD
}

interface StatData {
  label: string
  value: number
  maxValue: number
}
```

---

## ディレクトリ構成

```
app/
├── page.tsx                    # メインダッシュボード
├── layout.tsx                  # ルートレイアウト（メタデータ・フォント）
├── global.css                  # グローバルスタイル（サイバーパンクテーマ）
├── auth/
│   ├── callback/route.ts       # Google OAuthコールバック
│   └── auth-code-error/page.tsx
└── profile/
    └── [id]/page.tsx           # 公開プロフィールページ

components/
├── ui/
│   └── tabs.tsx                # Radix UIベースのタブ
├── login-screen.tsx            # ログイン画面
├── auth-ui.tsx                 # 認証ボタン・ユーザー表示
├── digital-id-card.tsx         # メインプロフィールカード
├── profile-edit-modal.tsx      # プロフィール編集モーダル
├── hexagon-radar-chart.tsx     # カスタムレーダーチャート（SVG）
└── achievement-badge.tsx       # 実績バッジ

hooks/
└── use-profile.ts              # プロフィールデータ取得hook

lib/
├── supabase/
│   ├── client.ts               # ブラウザ用Supabaseクライアント
│   ├── server.ts               # サーバー用Supabaseクライアント
│   └── middleware.ts           # 認証ミドルウェア
└── utils.ts                    # cn()等のユーティリティ

types/
└── index.ts                    # 共有型定義
```

---

## 画面・機能仕様

### 1. ログイン画面（login-screen.tsx）

- サイバーパンク風の全画面ログインページ
- Google OAuth認証ボタン
- 機能紹介（実績、プロフィール、共有）のショーケース
- ダークテーマ + ネオンアクセント

### 2. メインダッシュボード（app/page.tsx）

2タブ構成：

#### ID CARDタブ
- **デジタルIDカード**: アバター（イニシャルフォールバック）、ニックネーム、@ID、レベル＆EXPバー
- **MY TAGセクション**: ユーザーの実績タグ一覧（rarity別カラーリング）
  - common: 灰色系
  - rare: 青色系
  - epic: 紫色系
  - legendary: 金色系（グロー付き）
- **MY TRENDセクション**: 4つのミニグラフ
  - 歩数（棒グラフ）
  - 睡眠時間（棒グラフ）
  - 模試スコア（折れ線グラフ）
  - 立ち時間（棒グラフ）
- **編集ボタン**: プロフィール編集モーダルを開く
- **共有ボタン**: QRコード付きの共有ダイアログ
- **公開/限定切り替えトグル**

#### STATUSタブ
- **六角形レーダーチャート**: 6つの能力値を表示
  - 知力 / 体力 / 創造力 / 協調性 / 技術力 / 精神力
- **クイックステータスカード**: ランク、達成率、アクティブ日数

### 3. プロフィール編集モーダル（profile-edit-modal.tsx）

- React Hook Form + Zod でバリデーション
- 名前入力フィールド
- @IDフィールド（読み取り専用）
- タグ管理: 追加（名前 + rarity選択）/ 削除
- 保存時にSupabaseへ反映

### 4. 公開プロフィールページ（profile/[id]/page.tsx）

- 動的ルートでプロフィールID指定
- 読み取り専用のIDカード＆ステータス表示
- プロフィールが見つからない場合のエラーハンドリング

### 5. 認証フロー

- Google OAuth → Supabase Auth
- コールバックハンドラ（認可コード → セッション交換）
- エラーページ（認証失敗時）
- ログアウト機能

---

## デザインシステム

### カラーパレット（OKLCH）

```css
--neon-blue: oklch(0.7 0.2 250);
--neon-pink: oklch(0.65 0.22 330);
--neon-cyan: oklch(0.75 0.15 200);
```

- ダークモード固定（ライトモードなし）
- 背景: 暗いグレー/黒系
- アクセント: ネオンブルー、ネオンピンク、ネオンシアン
- グロー効果（box-shadow / text-shadow）

### フォント

- 見出し: **Orbitron**（サイバーパンク感）
- 本文: **Geist**（モダン・可読性）
- 等幅: Geist Mono

### アニメーション

- CRTスキャンライン効果（`animate-scan`）
- 背景グリッドパターン
- コーナー装飾ボーダー

### レスポンシブ

- モバイルファースト（iPhone 12: 390×844px 最適化）
- ダークテーマ固定

---

## 開発順序（推奨）

以下の順序で段階的に開発すること：

### Phase 1: 基盤セットアップ
1. Next.js + TypeScript プロジェクト初期化
2. Tailwind CSS + Radix UI セットアップ
3. Supabaseクライアント設定（client.ts / server.ts / middleware.ts）
4. 型定義ファイル作成（types/index.ts）
5. ユーティリティ関数（lib/utils.ts）
6. グローバルCSS（サイバーパンクテーマ）
7. ルートレイアウト（フォント・メタデータ）

### Phase 2: 認証
1. Google OAuth認証フロー
2. コールバックハンドラ
3. auth-ui コンポーネント
4. ログイン画面
5. エラーページ

### Phase 3: データ層
1. Supabaseマイグレーション（profiles + my_tags + RLS + triggers）
2. useProfile カスタムhook

### Phase 4: メイン画面
1. タブコンポーネント
2. デジタルIDカード
3. MY TAGセクション
4. MY TRENDセクション（Rechartsミニグラフ）
5. 六角形レーダーチャート（カスタムSVG）
6. ステータスカード

### Phase 5: 編集・共有
1. プロフィール編集モーダル（React Hook Form + Zod）
2. タグ追加・削除機能
3. QRコード共有ダイアログ
4. 公開/限定切り替え

### Phase 6: 公開プロフィール
1. 動的ルート profile/[id]
2. 読み取り専用表示
3. エラーハンドリング

---

## UI言語

- 全てのUI文言は**日本語**で記述する
- 日付フォーマット: YYYY.MM.DD（ドット区切り）

---

## 注意事項

- Supabase clientはSSRライブラリ（@supabase/ssr）を使用してcookie管理すること
- Server ComponentとClient Componentを適切に分離すること
- レーダーチャートはRechartsではなくカスタムSVGで実装する（六角形デザイン）
- タグの更新は「全削除→全挿入」戦略で実装する
- 現状トレンドデータはモックデータ（将来的にAPI連携予定）
- ステータス値もハードコード（将来的にDB連携予定）
