# 001: プロジェクト初期化（Next.js + Tailwind + フォント + ベースレイアウト）

> 優先度: 最高 | 依存: なし
> ステータス: ✅ 完了

## 参照

- `docs/要件定義書.md` セクション 3（技術スタック）
- `docs/デザインガイドライン.md` セクション 2（カラーパレット）、セクション 3（タイポグラフィ）、セクション 4（スペーシング）
- `assets/sample/COMP.png` — 全体レイアウト参考

## やること

### Next.js プロジェクト作成

- [x] `npx create-next-app@latest` で App Router 構成を作成
- [x] TypeScript, Tailwind CSS, ESLint を有効化
- [x] `next.config.ts` の基本設定（画像最適化、セキュリティヘッダー等）

### Tailwind 設定

- [x] `globals.css` の `@theme inline` にデザインガイドラインのカラーパレットを定義
  - base: `#F0F0F0`, text: `#484848`, sub: `#636363`, accent: `#C2185B`, pressed: `#a06a8c` 等
- [x] スペーシングスケール（4px 刻み: space-1〜space-30）を定義
- [x] フォントファミリー設定（Hiragino Mincho ProN, Klee One, Cormorant Garamond）
- [x] コンテンツ max-width（800px）、フォーム max-width（600px）のユーティリティ

### フォント読み込み

- [x] Cormorant Garamond を Google Fonts から `display=swap` で読み込み（next/font/google）
- [x] Klee One を Google Fonts から `display=swap` で読み込み（next/font/google）
- [x] Hiragino Mincho ProN はシステムフォント指定（フォールバック: Yu Mincho）

### ベースレイアウト

- [x] `app/layout.tsx` — html lang="ja", メタデータ, フォント読み込み
- [x] グローバル CSS — `env(safe-area-inset-*)` 対応、左右パディング 20px
- [x] `prefers-reduced-motion: reduce` のグローバル対応
- [x] ダークモード無効化（ライトモード固定: `color-scheme: light only`）

### 環境変数テンプレート

- [x] `.env.local.example` を作成（全必要変数をコメント付きで列挙）
- [x] `.gitignore` に `.env.local` を追加（create-next-app デフォルトで含まれていた）
