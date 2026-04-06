# 003: Hero セクション

> 優先度: 高 | 依存: 001, 002
> ステータス: ✅ 完了

## 参��

- `docs/要件定義書.md` セクション 4.1（Hero セクション）
- `docs/デザインガイドライン.md` セ��ション 3（タ���ポグラフィ — Hero ���書き）
- `assets/sample/dianism.png` — フルワイド写真 + ミニマルテキスト参考
- `assets/sample/ULTRA.png` — 温かみのある写真表現参考

## やること

### Hero コンポーネント

- [x] フルワイド（100vw）のヒーロー写真表示（`100svh` でモバイルアドレスバー対応）
- [x] `next/image` で最適���（priority, fill, quality=85 設定）
- [x] 写真の上に縦書きテキストをオーバ���レイ
  - `writing-mode: vertical-rl` で縦書き
  - 「伊藤 陽介」（Klee One SemiBold 24px, letter-spacing 0.1em）
  - 生没年: 1988.11.17 — 2026.04.03（Cormorant Garamond 14px）
- [x] テキスト位置: 画面中央配置、名前と日付を2カラムで自然に配置
- [x] スマートフォン版のみ（レスポンシブ不要）
- [x] 写真のプレースホルダー対応（`onError` でフォールバック: ライトグレー + カメラアイコン）
