# 001: Notion データベース & Integration セットアップ

> 優先度: **最高（ブロッカー）**
> ステータス: **✅ 完了**
> 依存: なし
> 依存される: 環境変数設定(007)、フォーム送信API開発、管理画面開発

## 参照

- `docs/要件定義書.md` セクション 6.1（Notion Database プロパティ）
- `docs/要件定義書.md` セクション 15.3（Notion DBの事前準備）

## やること

### Notion データベース作成

- [x] Notion ワークスペースにて新規データベースを作成
- [x] 要件定義書 6.1 に準拠したプロパティを設定:
  - [x] ご芳名 (Title)
  - [x] 参列のご希望 (Multi-select) — 5つの選択肢を登録
  - [x] 郵便番号 (Rich text)
  - [x] ご住所 (Rich text)
  - [x] 写真添付 (Rich text)
  - [x] 陽介から呼ばれていたあだ名 (Rich text)
  - [x] 陽介とのご関係 (Rich text)
  - [x] 陽介へのメッセージ (Rich text)
  - [x] 写真URL (Rich text)
  - [x] 送信日 (Date)

### Integration 設定

- [x] Notion Integration を作成し、API キーを取得
- [x] データベースに Integration を接続（共有設定）
- [x] データベース ID を控える

### 動作確認

- [x] テスト: Notion API でページ作成が可能か手動確認
