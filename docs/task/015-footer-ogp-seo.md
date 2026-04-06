# 015: フッター + OGP / SEO / メタ情報

> 優先度: 中 | 依存: 001

## 参照

- `docs/要件定義書.md` セクション 4.6（フッター）、セクション 10（SEO / OGP）
- `docs/デザインガイドライン.md` セクション 3（タイポグラフィ — フッター 12px）

## やること

### Footer コンポーネント

- [ ] シンプルなコピーライト表示
- [ ] Hiragino Mincho W3 / 12px
- [ ] 上部に IchimatsuDivider

### OGP メタ情報

- [ ] `app/layout.tsx` の metadata に OGP 設定
  - `og:title`: 「伊藤陽介 通夜・告別式のご案内」
  - `og:description`: 適切な説明文
  - `og:image`: `public/og-image.png`
  - `og:type`: website
  - `twitter:card`: summary_large_image
- [ ] favicon 設定

### SEO 対応

- [ ] `robots.txt` — 検索エンジンのインデックスを制御（プライベートサイトのため noindex 推奨）
- [ ] `sitemap.xml` は不要（単ページ + noindex）
- [ ] canonical URL 設定
