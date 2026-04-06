# 002: 共通UIコンポーネント（SectionHeading / IchimatsuDivider / FadeIn / Buttons）

> 優先度: 最高 | 依存: 001
> ステータス: ✅ 完了

## 参照

- `docs/デザインガイドライン.md` セクション 5（ボタンデザイン）、セクション 6（セクション見出し）、セクション 7（市松模様ディバイダー）、セクション 8（アニメーション）
- `assets/sample/petit-pas.png` — ボタン・見出しスタイル参考
- `assets/sample/dianism.png` — ミニマルレイアウト参考

## やること

### SectionHeading コンポーネント

- [x] 2行構成: 英語タイトル（Cormorant Garamond 400 / 14px / uppercase / `#6B6B6B`）+ 日本語タイトル（Hiragino Mincho W6 / 20px / `#1A1A1A`）
- [x] 英語↔日本語間のギャップ: 8px
- [x] 見出し↔コンテンツ間のギャップ: 48px
- [x] Props: `enTitle: string`, `jpTitle: string`

### IchimatsuDivider コンポーネント

- [x] 2×2 チェッカーボード（マゼンタ + 白）
- [x] セルサイズ 4px、全体高さ 4px（1セル分の高さ）
- [x] マゼンタ色 `#C2185B` opacity 0.05
- [x] 1ページ最大 2〜3 箇所で使用

### FadeInOnScroll コンポーネント

- [x] Intersection Observer ベースのスクロールトリガー
- [x] フェードイン: opacity 0→1, 600ms ease-out
- [x] スライドアップ: translateY(20px→0) + opacity, 600ms
- [x] Props: `variant: 'fade' | 'slide-up'`, `delay?: number`
- [x] `prefers-reduced-motion: reduce` 時はアニメーション無効

### Button コンポーネント（3種）

- [x] **Primary**: BG `#a06a8c` opacity 0.15 / Border 1px `#a06a8c` / Text `#484848` / 右三角 `▶`
  - タップ時: BG `#a06a8c`（ソリッド）/ Text `#FFFFFF` / ボーダーアニメーション
- [x] **Secondary**: BG transparent / Border 1px `#484848` / Text `#484848` / 右三角 `▶`
  - タップ時: BG `#484848` opacity 0.08 / ボーダーアニメーション
- [x] **Ghost**: BG transparent / Border なし / Text `#636363` / 下線 1px
  - タップ時: Text `#484848` / 下線 2px
- [x] 共通: height 48px, padding-x 28px, radius 2px, font 14px letter-spacing 0.05em
- [x] ボーダーアニメーション: SVG rect + stroke-dashoffset / 400ms ease-in-out（pointerUp で逆再生）
- [x] Disabled: opacity 0.35, cursor not-allowed, アニメーション無効
- [x] Focus ring: `#a06a8c` 2px outline + 2px offset
- [x] `prefers-reduced-motion: reduce` 対応
- [x] Props: `variant: 'primary' | 'secondary' | 'ghost'`, `disabled?: boolean`, `children`, `onClick` + 全ButtonHTMLAttributes
