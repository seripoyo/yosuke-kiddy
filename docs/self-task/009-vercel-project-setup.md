# 009: Vercel プロジェクトセットアップ

> 優先度: **高**
> 依存: なし（先にプロジェクト作成だけしておける）
> 依存される: ドメイン・DNS 設定(006)、環境変数の Vercel 反映(007)

## 参照

- `docs/要件定義書.md` セクション 3（技術スタック — Vercel ホスティング）
- `docs/要件定義書.md` セクション 15.6（ドメイン・DNS設定）

## やること

### 1. GitHub リポジトリ

- [x] GitHub リポジトリ `yosuke-kiddy` を作成（Private 推奨）

### 2. Vercel プロジェクト作成

- [x] Vercel にプロジェクトを作成し、GitHub リポジトリと連携

### 3. ビルド設定の確認

以下の手順で設定を確認・変更します。

1. [Vercel ダッシュボード](https://vercel.com/dashboard) を開く
2. プロジェクト `yosuke-kiddy` をクリック
3. 上部メニューの **Settings** をクリック
4. 左メニューの **General** をクリック
5. 以下を確認:

- [x] **Framework Preset** が `Next.js` になっているか確認
  - なっていない場合 → ドロップダウンから `Next.js` を選択して **Save**
- [x] **Root Directory** が空欄（= プロジェクトルート `.`）になっているか確認
  - 特に変更不要。空欄のままでOK
- [x] **Production Branch** のセクションで `main` になっているか確認
  - 左メニュー **Git** → **Production Branch** で確認できる
  - `main` でなければ `main` に変更して **Save**

### 4. 環境変数の設定

`.env.local` と同じ環境変数を Vercel にも設定します（Vercel上で動くときに必要）。

1. プロジェクトの **Settings** → 左メニュー **Environment Variables** をクリック
2. 以下の変数を **1つずつ** 追加する:
   - **Key** に変数名、**Value** に値を入力
   - **Environment** は 3つ全て（Production / Preview / Development）にチェックを入れる
   - **Add** ボタンを押す

| Key | 値の取得元 | 注意 |
|-----|----------|------|
| `NOTION_API_KEY` | .env.local の値をコピー | |
| `NOTION_DATABASE_ID` | .env.local の値をコピー | |
| `DISCORD_WEBHOOK_URL` | .env.local の値をコピー | |
| `R2_ACCOUNT_ID` | .env.local の値をコピー | |
| `R2_ACCESS_KEY_ID` | .env.local の値をコピー | |
| `R2_SECRET_ACCESS_KEY` | .env.local の値をコピー | |
| `R2_BUCKET_NAME` | `yosuke-kiddy` | |
| `R2_PUBLIC_URL` | `https://r2.yosuke-kiddy.com` | `r2.` サブドメインに注意 |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | .env.local の値をコピー | |
| `ADMIN_PASSWORD` | .env.local の値をコピー | |
| `NEXT_PUBLIC_LINE_ADD_FRIEND_URL` | .env.local の値をコピー | |
| `NEXT_PUBLIC_LINE_QR_IMAGE_PATH` | .env.local の値をコピー | |
| `NEXT_PUBLIC_SITE_URL` | `https://yosuke-kiddy.com` | |

> **ヒント**: `.env.local` をテキストエディタで開いておくと、値のコピペが楽です

### 5. テストデプロイ

環境変数を設定したら、テストデプロイで正常にビルドされるか確認します。

1. ローカルで変更をコミット＆プッシュ:
   ```bash
   git add -A
   git commit -m "initial setup"
   git push origin main
   ```
2. Vercel ダッシュボードに戻る
3. **Deployments** タブをクリック
4. 自動的にデプロイが始まる（GitHub プッシュをトリガーに自動実行される）
5. 以下を確認:

- [ ] ビルドが **成功（緑色のチェック）** になること
  - 失敗した場合 → デプロイをクリックして **Build Logs** でエラー内容を確認
- [ ] デプロイ後に表示される URL（例: `yosuke-kiddy-xxxxx.vercel.app`）をクリック
- [ ] Next.js のデフォルトページが表示されればOK

### 6. 本番ドメインでの表示確認（006 完了後）

- [ ] `https://yosuke-kiddy.com` にアクセスしてページが表示されることを確認
