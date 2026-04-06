# 002: Cloudflare R2 バケットセットアップ

> 優先度: **最高（ブロッカー）**
> 依存: なし
> 依存される: 環境変数設定(007)、写真アップロードAPI開発

## 参照

- `docs/要件定義書.md` セクション 6.3（Cloudflare R2 バケット構造）
- `docs/要件定義書.md` セクション 15.4（Cloudflare R2の事前準備）

## やること

### バケット作成

- [x] Cloudflare ダッシュボードでバケット `yosuke-kiddy` を作成

### API トークン発行

- [x] R2 API Token を発行（Object Read & Write 権限）
- [x] `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY` を控える

### パブリックアクセス設定

- [x] パブリックアクセスを有効化
  - カスタムドメイン or `r2.dev` サブドメインを設定
- [x] `R2_PUBLIC_URL` を控える
- [x] リスト表示が無効化されていることを確認（セキュリティ要件）

### 動作確認

- [x] テスト: API Token でファイルアップロード → パブリックURLでアクセスできるか確認
