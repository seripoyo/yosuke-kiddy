# 008: 住所オートコンプリート（zipcloud + Google Places）

> 優先度: 高 | 依存: 007
> ステータス: ✅ 完了

## 参照

- `docs/要件定義書.md` セクション 4.5.4（住所オートコンプリートフロー）
- `docs/デザインガイドライン.md` セクション 5（フォーム入力スタイル）

## やること

### AddressAutocomplete コンポーネント

- [x] **郵便番号 → 町名自動入力**（zipcloud API）
  - 7桁入力完了で自動トリガー
  - `https://zipcloud.ibsnet.co.jp/api/search?zipcode=XXX` を呼び出し
  - 結果: 「東京都足立区千住仲町」等を住所フィールドに自動セット
  - エラー時: 「郵便番号から住所を取得できませんでした」表示

- [x] **町名 → 番地候補表示**（Google Places Autocomplete）
  - zipcloud 結果セット後に住所フィールドにフォーカス → Places Autocomplete が発動
  - `componentRestrictions: { country: 'jp' }`, `types: ['address']` で日本国内住所に限定
  - ユーザーが候補を選択 → `formatted_address` から「日本、」プレフィクスと郵便番号を除去して住所フィールドに反映
  - API キー: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

- [x] **建物名・部屋番号**（任意入力フィールド）
  - 番地選択後に手動入力可能な追加フィールド

- [x] Google Places API 未設定時のフォールバック（手動入力のみ — スクリプトを読み込まないだけ）
- [x] `@types/google.maps` 型定義インストール済み
