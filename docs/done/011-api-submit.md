# 011: POST /api/submit（フォーム送信 API）

> 優先度: 最高 | 依存: 007, 010 | ステータス: ✅ 完了

## 参照

- `docs/要件定義書.md` セクション 5.1（POST /api/submit 仕様）
- `docs/要件定義書.md` セクション 9（セキュリティ — レートリミット）

## やること

### app/api/submit/route.ts

- [x] `POST` ハンドラ実装
- [x] リクエストボディのサーバーサイドバリデーション
  - ご芳名: 必須
  - 参列希望: 1つ以上（有効なキーのみ許可）
  - 郵便番号・住所: 条件付き必須（式参列系選択時）
- [x] 写真アップロード処理
  - FormData から写真ファイルを取得
  - `lib/r2.ts` で R2 にアップロード → パブリック URL 取得
  - R2 未設定時はスキップ（開発環境対応）
- [x] Notion DB 書き込み
  - `lib/notion.ts` の `createGuestbookEntry()` 呼び出し
  - Notion 未設定時はコンソールにフォームデータをログ出力（開発環境対応）
- [x] Discord 通知
  - `lib/discord.ts` の `sendNotification()` 呼び出し
  - Discord 未設定時はスキップ
- [x] レスポンス
  - 成功: `{ success: true, showLineQR: boolean }`（自宅焼香選択時に `true`）
  - エラー: 400（バリデーション）/ 403（フォームクローズ）/ 429（レート制限）/ 500（サーバーエラー）

### セキュリティ

- [x] レートリミット: 1リクエスト/IP/分（開発環境では無効）
- [x] 入力サニタイズ（HTMLタグ除去）
- [x] ファイルタイプ検証（サーバーサイド: jpeg/png/webp のみ）
- [x] フォームクローズ時は 403 返却

## 実装ファイル

- `src/app/api/submit/route.ts` — POST ハンドラ（新規作成）
- `src/lib/__tests__/submit-api.test.ts` — 統合テスト（dev server 起動時のみ実行）
