# 004: About セクション

> 優先度: 高 | 依存: 001, 002
> ステータス: ✅ 完了

## 参照

- `docs/要件定義書.md` セクション 4.2（About セクション）
- `docs/デザインガイドライン.md` セクション 6（セクション見出し）、セクション 8（アニメーション）
- `assets/sample/petit-pas.png` — 写真コラージュ（散らし配置）参考

## やること

### About コンポーネント

- [x] SectionHeading: `ABOUT` / `陽介について`
- [x] 追悼テキスト表示（Klee One Regular / 16px / line-height 2.0 — 喪主の紹介文として温かみのあるフォント）
- [x] 3枚の写真を petit-pas スタイルで散らし配置
  - 写真の角度・位置を CSS transform rotate で設定（-1.5deg, 1.2deg, -0.8deg）
  - 幅・マージンをずらして重なり合うコラージュ感を演出
  - `next/image` で最適化（fill, quality=80, sizes指定）
- [x] FadeInOnScroll でスクロール時にフェードイン（見出し: fade, テキスト: slide-up delay 100ms, 写真: slide-up delay 200ms）
- [x] 写真プレースホルダー対応（`onError` でライトグレー + カメラアイコン SVG にフォールバック）
- [x] スマートフォン版のみ（縦並びレイアウト）
