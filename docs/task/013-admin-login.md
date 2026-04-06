# 013: 管理画面ログイン（API + ページ）

> 優先度: 高 | 依存: 010

## 参照

- `docs/要件定義書.md` セクション 5.3（POST /api/admin/login）
- `docs/要件定義書.md` セクション 7（管理画面）
- `docs/デザインガイドライン.md` セクション 5（フォーム入力スタイル）

## やること

### app/api/admin/login/route.ts

- [ ] `POST` ハンドラ
  - Body: `{ "password": "string" }`
  - `lib/auth.ts` の `verifyAdminPassword()` で照合
  - 成功: セッションCookie設定 + 200
  - 失敗: 401 Unauthorized

### app/admin/login/page.tsx

- [ ] パスワード入力フォーム
  - パスワードフィールド（type="password"）
  - ログインボタン（Primary）
- [ ] エラー表示（パスワード不一致時）
- [ ] ログイン済みの場合は `/admin` にリダイレクト
- [ ] ミニマルデザイン（中央配置）
