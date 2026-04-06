# 011: POST /api/submit（フォーム送信 API）

> 優先度: 最高 | 依存: 007, 010

## 参照

- `docs/要件定義書.md` セクション 5.1（POST /api/submit 仕様）
- `docs/要件定義書.md` セクション 9（セキュリティ — レートリミット）

## やること

### app/api/submit/route.ts

- [ ] `POST` ハンドラ実装
- [ ] リクエストボディのサーバーサイドバリデーション
  - ご芳名: 必須
  - 参列希望: 1つ以上
  - 郵便番号・住所: 条件付き必須
- [ ] 写真アップロード処理
  - FormData から写真ファイルを取得
  - `lib/r2.ts` で R2 にアップロード → パブリック URL 取得
- [ ] Notion DB 書き込み
  - `lib/notion.ts` の `createGuestbookEntry()` 呼び出し
- [ ] Discord 通知
  - `lib/discord.ts` の `sendNotification()` 呼び出し
- [ ] レスポンス
  - 成功: `{ success: true, showLineQR: boolean }`（自宅焼香選択時に `true`）
  - エラー: 400（バリデーションエラー）/ 500（サーバーエラー）

### セキュリティ

- [ ] レートリミット: 1リクエスト/IP/分（推奨）
- [ ] 入力サニタイズ（XSS防止）
- [ ] ファイルタイプ検証（サーバーサイド）
- [ ] フォームクローズ時は 403 返却
