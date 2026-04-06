# 004: Google Cloud API 設定（Maps Embed + Places Autocomplete）

> 優先度: **最高（ブロッカー）**
> 依存: ドメイン・DNS設定(006) が完了するとリファラー制限を設定可能
> 依存される: 環境変数設定(007)、地図埋め込み、住所自動補完

## 参照

- `docs/要件定義書.md` セクション 16.1（Google Cloud Console 設定）
- `docs/要件定義書.md` セクション 16.2（Maps Embed）
- `docs/要件定義書.md` セクション 16.3（Places Autocomplete）
- `docs/要件定義書.md` セクション 5.4（住所自動補完フロー）

## やること

### プロジェクト & API 有効化

- [x] Google Cloud Console でプロジェクトを作成（または既存を使用）
- [x] Maps Embed API を有効化（式場地図の埋め込み用）
- [x] Places API (New) を有効化（住所オートコンプリート用）

### API キー作成 & 制限

- [x] API キーを1つ作成（両 API で共用）
- [x] API キーの制限を設定:
  - HTTP リファラー制限: 開発用 `http://localhost:3000/*`
  - API 制限: Maps Embed API, Places API (New) の2つのみ許可
- [x] `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` を控える

### 本番リファラー追加（006 完了後）

- [x] HTTP リファラー制限に `https://yosuke-kiddy.com/*` を追加

### 動作確認

- [ ] テスト: Maps Embed URL をブラウザで直接開いて地図が表示されるか確認
