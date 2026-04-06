# 010: バックエンドライブラリ（Notion / R2 / Discord / Auth）

> 優先度: 最高 | 依存: 001 | ステータス: ✅ 完了

## 参照

- `docs/要件定義書.md` セクション 5（API ルート仕様）、セクション 6（データスキーマ）
- `docs/要件定義書.md` セクション 9（セキュリティ）

## やること

### lib/notion.ts

- [x] Notion API クライアント初期化（`@notionhq/client` v5）
- [x] `createGuestbookEntry()` — フォームデータを Notion DB に書き込み
  - ご芳名（Title）
  - 参列のご希望（Multi-select）
  - 郵便番号、住所、関係、あだ名（Rich text）
  - メッセージ（Rich text — 2000文字制限のため分割処理）
  - 写真URL（Rich text — 改行区切り）
  - 送信日（Date — ISO 8601）
- [x] `fetchAllMessages()` — 全メッセージを送信日降順で取得
  - ページネーション対応（`start_cursor`）— v5 では `dataSources.query` を使用
- [x] 環境変数: `NOTION_API_KEY`, `NOTION_DATABASE_ID`

### lib/r2.ts

- [x] Cloudflare R2 クライアント初期化（`@aws-sdk/client-s3` S3互換）
- [x] `uploadPhoto(file: Buffer, filename: string)` — R2 にアップロード
  - ファイル名にタイムスタンプ + ランダム文字列付与（衝突防止）
  - Content-Type 設定
  - パブリック URL を返却
- [x] 環境変数: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`

### lib/discord.ts

- [x] `sendNotification(data)` — Discord Webhook でフォーム送信通知
  - フォーマット: 「📩 新しいご記帳がありました」+ 名前/参列/住所/関係/あだ名/メッセージ/写真枚数 + Notionリンク
  - 長文メッセージは200文字で切り詰め
  - ベストエフォート（失敗してもthrowしない）
- [x] 環境変数: `DISCORD_WEBHOOK_URL`

### lib/auth.ts

- [x] `verifyAdminPassword(password: string)` — 環境変数と照合（timing-safe comparison）
- [x] `createSessionToken()` — HMAC-SHA256 セッショントークン生成
- [x] `verifySessionToken(token: string)` — トークン検証 + 24時間有効期限チェック
- [x] Cookie 設定: HttpOnly, Secure, SameSite=Strict（`setSessionCookie` / `isAuthenticated` / `clearSessionCookie`）
- [x] 環境変数: `ADMIN_PASSWORD`

### テスト

- [x] auth: パスワード検証、トークン生成・検証・改ざん検知・期限切れ（8テスト）
- [x] discord: 通知送信、未設定時スキップ、エラーハンドリング、長文切り詰め（4テスト）
- [x] notion: splitRichText ヘルパー（2テスト）

## 実装ファイル

- `src/lib/notion.ts` — Notion API ラッパー
- `src/lib/r2.ts` — Cloudflare R2 アップロード
- `src/lib/discord.ts` — Discord Webhook 通知
- `src/lib/auth.ts` — 管理画面認証
- `src/lib/__tests__/auth.test.ts` — auth テスト
- `src/lib/__tests__/discord.test.ts` — discord テスト
- `src/lib/__tests__/notion.test.ts` — notion テスト
- `package.json` — vitest 追加
