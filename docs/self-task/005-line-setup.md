# 005: LINE 友達追加リンク & QR コード準備

> 優先度: **高**
> 依存: なし
> 依存される: 環境変数設定(007)、フォーム送信完了画面

## 参照

- `docs/要件定義書.md` セクション 5.3（送信後の表示分岐 — LINE QR 表示条件）
- `docs/要件定義書.md` セクション 11（環境変数 `NEXT_PUBLIC_LINE_*`）

## やること

### LINE 情報取得

- [x] 喪主の LINE アカウントまたは LINE 公式アカウントの友達追加 URL を取得
- [x] `NEXT_PUBLIC_LINE_ADD_FRIEND_URL` を控える

### QR コード画像

- [x] LINE 友達追加用 QR コード画像を生成・保存
- [x] QR コード画像を `public/` に配置（例: `public/line-qr.png`）
- [x] `NEXT_PUBLIC_LINE_QR_IMAGE_PATH` を控える
