# 006: ドメイン・DNS 設定

> 優先度: **高**（公開前に必須）
> ステータス: **✅ 完了**
> 依存: Vercel プロジェクトセットアップ(009)
> 依存される: Google API リファラー制限の本番設定(004)

## 参照

- `docs/要件定義書.md` セクション 15.6（ドメイン・DNS設定）

## やること

### Vercel ドメイン設定

- [ ] Vercel プロジェクト Settings → Domains で `yosuke-kiddy.com` を追加

### Cloudflare DNS 設定

- [x] R2 カスタムドメインを `yosuke-kiddy.com` → `r2.yosuke-kiddy.com` に変更
- [x] Cloudflare DNS にレコードを設定:
  - `@` → A レコード `216.198.79.1`（プロキシOFF） ※Vercel新IP範囲
  - `r2` → R2カスタムドメイン用（自動設定）
- [x] `.env.local` の `R2_PUBLIC_URL` を `https://r2.yosuke-kiddy.com` に更新

### SSL & 動作確認

- [x] SSL 証明書が Vercel 側で自動発行されることを確認（HSTS有効）
- [ ] `https://yosuke-kiddy.com` にアクセスして正常表示を確認（デプロイ後）
- [ ] www サブドメイン設定:
  - Cloudflare DNS に `www` CNAME → `cname.vercel-dns.com`（プロキシOFF）を追加
  - Vercel で `yosuke-kiddy.com` をPrimary、`www` からリダイレクトに設定
