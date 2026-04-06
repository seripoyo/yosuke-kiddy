# 006: ドメイン・DNS 設定

> 優先度: **高**（公開前に必須）
> 依存: Vercel プロジェクトセットアップ(009)
> 依存される: Google API リファラー制限の本番設定(004)

## 参照

- `docs/要件定義書.md` セクション 15.6（ドメイン・DNS設定）

## やること

### Vercel ドメイン設定

- [x] Vercel プロジェクト Settings → Domains で `yosuke-kiddy.com` を追加

### Cloudflare DNS 設定

- [x] Cloudflare DNS に CNAME レコードを追加:
  - タイプ: `CNAME` / 名前: `@` / ターゲット: `cname.vercel-dns.com`
  - プロキシ: **オフ（DNS のみ・グレー雲）** ← 重要

### SSL & 動作確認

- [x] SSL 証明書が Vercel 側で自動発行されることを確認
- [x] `https://yosuke-kiddy.com` にアクセスして正常表示を確認
- [x] www サブドメインのリダイレクト設定（必要に応じて）
