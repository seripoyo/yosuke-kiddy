# 014: 管理画面メッセージ一覧 + 印刷

> 優先度: 高 | 依存: 010, 013

## 参照

- `docs/要件定義書.md` セクション 5.2（GET /api/admin/messages）、セクション 7（管理画面仕様）
- `docs/デザインガイドライン.md` セクション 5.5（管理画面メッセージカード）

## やること

### app/api/admin/messages/route.ts

- [ ] `GET` ハンドラ
  - Cookie `admin_token` で認証チェック
  - `lib/notion.ts` の `fetchAllMessages()` で全メッセージ取得
  - ページネーション対応（`?cursor=xxx`）
  - 未認証: 401

### app/admin/page.tsx

- [ ] 認証チェック（未ログインは `/admin/login` にリダイレクト）
- [ ] メッセージ一覧の取得・表示

### MessageCard コンポーネント

- [ ] カードスタイル: BG `#FAFAFA` / 2px radius / 24px padding / 1px border `#E5E5E5` / シャドウなし
- [ ] 表示項目: 名前、関係、あだ名、メッセージ、写真サムネイル
- [ ] カード間ギャップ: 16px

### MessageList コンポーネント

- [ ] メッセージカードのリスト表示
- [ ] 送信日降順ソート
- [ ] ローディング状態表示

### 印刷最適化

- [ ] `@media print` CSS
  - ヘッダー/フッター/UI要素を非表示
  - `break-inside: avoid` でカードの途中改ページ防止
  - ブラウザの印刷機能で直接印刷可能
- [ ] 印刷ボタン（`window.print()`）
