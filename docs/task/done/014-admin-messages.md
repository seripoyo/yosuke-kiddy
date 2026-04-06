# 014: 管理画面メッセージ一覧 + 印刷 — DONE

> 優先度: 高 | 依存: 010, 013

## 参照

- `docs/要件定義書.md` セクション 5.2（GET /api/admin/messages）、セクション 7（管理画面仕様）
- `docs/デザインガイドライン.md` セクション 5.5（管理画面メッセージカード）

## やること

### app/api/admin/messages/route.ts

- [x] `GET` ハンドラ
  - Cookie `admin_session` で認証チェック
  - `lib/notion.ts` の `fetchAllMessages()` で全メッセージ取得
  - 未認証: 401
  - dev環境ではモックデータを返す

### app/admin/page.tsx

- [x] 認証チェック（未ログインは `/admin/login` にリダイレクト）
- [x] メッセージ一覧の取得・表示

### MessageCard コンポーネント

- [x] カードスタイル: BG `#FAFAFA` / 2px radius / 24px padding / 1px border / シャドウなし
- [x] 表示項目: 名前、関係、あだ名、メッセージ、写真サムネイル、参列希望タグ、送信日時
- [x] カード間ギャップ: 16px

### MessageList コンポーネント

- [x] メッセージカードのリスト表示
- [x] 送信日降順ソート（Notion API側）
- [x] ローディング状態表示
- [x] エラー表示

### 印刷最適化

- [x] `@media print` CSS
  - ヘッダー/UI要素を非表示（`print:hidden`）
  - `break-inside: avoid` でカードの途中改ページ防止
  - ブラウザの印刷機能で直接印刷可能
- [x] 印刷ボタン（`window.print()`）

### 備考

- Notion DBのインテグレーション共有が必要（Notion側の設定画面で「Yosuke-kiddy」インテグレーションを追加）
- dev環境ではモックデータが自動的に返される
