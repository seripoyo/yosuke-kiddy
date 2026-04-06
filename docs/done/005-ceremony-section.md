# 005: 式のご案内セクション（Ceremony + Google Maps）

> 優先度: 高 | 依存: 001, 002
> ステータス: ✅ 完了

## 参照

- `docs/要件定義書.md` セクション 4.3（式のご案内）
- `docs/デザインガイドライン.md` セクション 6（セクション見出し）
- `assets/sample/COMP.png` — 地図埋め込み + 情報レイアウト参考

## やること

### Ceremony コンポーネント

- [x] SectionHeading: `CEREMONY` / `式のご案内`
- [x] 通夜情報の表示
  - 日時: 2026年4月8日（水）18:00 - 20:30（要件定義書準拠）
  - 会場: 稲垣葬儀社 稲垣ホール
  - 住所: 〒120-0036 東京都足立区千住仲町19-3
  - アクセス: JR常磐線 北千住駅から徒歩4分
- [x] 告別式情報の表示
  - 日時: 2026年4月9日（木）12:00 - 13:00（要件定義書準拠）
  - 同会場
- [x] FadeInOnScroll 適用（見出し: fade, 通夜: slide-up 100ms, 告別式: slide-up 200ms, 地図: slide-up 300ms）

### GoogleMap コンポーネント

- [x] Google Maps Embed API でのiframe埋め込み
- [x] API キーは環境変数 `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` から取得
- [x] 幅100%, 高さ 300px
- [x] 「地図を開く」ボタン（Secondary ボタン）→ Google Maps アプリで開く
- [x] API キー未設定時のフォールバック表示（地図アイコン + 「地図を読み込めません」）
