# 010: バックエンドライブラリ（Notion / R2 / Discord / Auth）

> 優先度: 最高 | 依存: 001

## 参照

- `docs/要件定義書.md` セクション 5（API ルート仕様）、セクション 6（データスキーマ）
- `docs/要件定義書.md` セクション 9（セキュリティ）

## やること

### lib/notion.ts

- [ ] Notion API クライアント初期化（`@notionhq/client`）
- [ ] `createGuestbookEntry()` — フォームデータを Notion DB に書き込み
  - ご芳名（Title）
  - 参列のご希望（Multi-select）
  - 郵便番号、住所、関係、あだ名（Rich text）
  - メッセージ（Rich text — 2000文字制限のため分割処理）
  - 写真URL（Rich text — 改行区切り）
  - 送信日（Date — ISO 8601）
- [ ] `fetchAllMessages()` — 全メッセージを送信日降順で取得
  - ページネーション対応（`start_cursor`）
- [ ] 環境変数: `NOTION_API_KEY`, `NOTION_DATABASE_ID`

### lib/r2.ts

- [ ] Cloudflare R2 クライアント初期化（`@aws-sdk/client-s3` S3互換）
- [ ] `uploadPhoto(file: Buffer, filename: string)` — R2 にアップロード
  - ファイル名にタイムスタンプ + ランダム文字列付与（衝突防止）
  - Content-Type 設定
  - パブリック URL を返却
- [ ] 環境変数: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`

### lib/discord.ts

- [ ] `sendNotification(data)` — Discord Webhook でフォーム送信通知
  - フォーマット: 「📩 新しいご記帳がありました」+ 名前/参列/住所/関係/あだ名/メッセージ/写真枚数 + Notionリンク
- [ ] 環境変数: `DISCORD_WEBHOOK_URL`

### lib/auth.ts

- [ ] `verifyAdminPassword(password: string)` — 環境変数と照合
- [ ] `createSessionToken()` — セッショントークン生成
- [ ] `verifySessionToken(token: string)` — トークン検証
- [ ] Cookie 設定: HttpOnly, Secure, SameSite=Strict
- [ ] 環境変数: `ADMIN_PASSWORD`
