# 003: Discord Webhook 発行

> 優先度: **高**
> ステータス: **✅ 完了**
> 依存: なし
> 依存される: 環境変数設定(007)、フォーム送信API開発

## 参照

- `docs/要件定義書.md` セクション 6.2（Discord Webhook通知フォーマット）
- `docs/要件定義書.md` セクション 15.5（Discord Webhookの事前準備）

## やること

### Webhook 作成

- [x] 通知を受け取りたい Discord サーバー・チャンネルを決定
- [x] チャンネル設定 → 連携サービス → Webhook → 新しいウェブフック を作成
- [x] Webhook 名を設定（例: 「ご記帳通知」）
- [x] `DISCORD_WEBHOOK_URL` を控える

### 動作確認

- [x] テスト: curl 等で Webhook URL にテストメッセージを送信して通知が届くか確認
