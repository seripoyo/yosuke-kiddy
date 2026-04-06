# 009: Vercel プロジェクトセットアップ

> 優先度: **高**
> 依存: なし（先にプロジェクト作成だけしておける）
> 依存される: ドメイン・DNS 設定(006)、環境変数の Vercel 反映(007)

## 参照

- `docs/要件定義書.md` セクション 3（技術スタック — Vercel ホスティング）
- `docs/要件定義書.md` セクション 15.6（ドメイン・DNS設定）

## やること

### GitHub リポジトリ

- [ ] GitHub リポジトリ `yosuke-kiddy` を作成（Private 推奨）

### Vercel プロジェクト作成

- [ ] Vercel にプロジェクトを作成し、GitHub リポジトリと連携
- [ ] Framework Preset: Next.js を選択
- [ ] Root Directory: `.`（デフォルト）を確認
- [ ] Production ブランチを `main` に設定

### 環境変数（007 完了後）

- [ ] Environment Variables を設定

### 動作確認

- [ ] テストデプロイを実行して正常にビルド・デプロイされることを確認
