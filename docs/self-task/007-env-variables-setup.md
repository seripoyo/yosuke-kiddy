# 007: 環境変数の設定（.env.local）

> 優先度: **最高（ブロッカー）**
> 依存: Notion DB(001), R2(002), Discord(003), Google API(004), LINE(005)
> 依存される: 全ての結合テスト

## 参照

- `docs/要件定義書.md` セクション 11（環境変数一覧）

## やること

### ローカル環境変数ファイル作成

- [ ] プロジェクトルートに `.env.local` を作成（`.env.example` を雛形として使用）
- [ ] `.env.local` が `.gitignore` に含まれていることを確認

### Notion 関連

- [ ] `NOTION_API_KEY` — Notion Integration の API キー
- [ ] `NOTION_DATABASE_ID` — Notion データベースの ID

### Cloudflare R2 関連

- [ ] `R2_ACCOUNT_ID` — Cloudflare アカウント ID
- [ ] `R2_ACCESS_KEY_ID` — R2 API Token のアクセスキー
- [ ] `R2_SECRET_ACCESS_KEY` — R2 API Token のシークレットキー
- [ ] `R2_BUCKET_NAME=yosuke-kiddy`
- [ ] `R2_PUBLIC_URL` — R2 パブリック URL

### Discord 関連

- [ ] `DISCORD_WEBHOOK_URL` — Discord Webhook URL

### Google Maps 関連

- [ ] `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` — Google Maps API キー

### LINE 関連

- [ ] `NEXT_PUBLIC_LINE_ADD_FRIEND_URL` — LINE 友達追加 URL
- [ ] `NEXT_PUBLIC_LINE_QR_IMAGE_PATH` — LINE QR 画像パス

### その他

- [ ] `ADMIN_PASSWORD` — 管理画面パスワード（任意の文字列を設定）
- [ ] `NEXT_PUBLIC_SITE_URL=https://yosuke-kiddy.com`

### Vercel 環境変数

- [ ] Vercel にも同じ環境変数を設定（Settings → Environment Variables）
