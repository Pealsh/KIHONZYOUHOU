# Vercel デプロイ手順

このアプリをVercelにデプロイする方法を説明します。

## 🚀 デプロイ方法

### 方法1: Vercel CLI（推奨）

1. **Vercel CLIをインストール**
```bash
npm install -g vercel
```

2. **ログイン**
```bash
vercel login
```

3. **デプロイ**
```bash
vercel
```

初回デプロイ時は以下の質問に答えます：
- Set up and deploy? → `Y`
- Which scope? → あなたのアカウントを選択
- Link to existing project? → `N`
- What's your project's name? → `kihon-jouhou-quiz`（または任意の名前）
- In which directory is your code located? → `./`（Enter）
- Want to override the settings? → `N`

4. **本番環境へデプロイ**
```bash
vercel --prod
```

### 方法2: Vercel Web UI（簡単）

1. **GitHubにプッシュ**（まずGitリポジトリを作成）
```bash
# Gitリポジトリの初期化
git init

# すべてのファイルをステージング
git add .

# 最初のコミット
git commit -m "Initial commit: 基本情報技術者試験クイズアプリ"

# GitHubにリポジトリを作成してから
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

2. **Vercelに接続**
   - https://vercel.com にアクセス
   - GitHubでログイン
   - 「New Project」をクリック
   - GitHubリポジトリを選択
   - 「Import」をクリック

3. **設定確認**
   - Framework Preset: `Create React App`
   - Build Command: `npm run build`（自動検出）
   - Output Directory: `build`（自動検出）
   - Install Command: `npm install`（自動検出）

4. **デプロイ**
   - 「Deploy」ボタンをクリック

## 📝 環境変数（必要な場合）

現在このアプリは環境変数を使用していませんが、将来的に必要な場合：

```bash
# Vercel CLIの場合
vercel env add REACT_APP_API_URL

# または Vercel Web UIで設定
# Project Settings → Environment Variables
```

## 🔄 自動デプロイ

GitHubと連携した場合、以下の自動デプロイが有効になります：
- `main`ブランチへのpush → 本番環境へ自動デプロイ
- Pull Request作成 → プレビュー環境を自動作成

## 🌐 カスタムドメイン

Vercelダッシュボードで独自ドメインを設定できます：
1. Project Settings → Domains
2. ドメイン名を入力
3. DNS設定を更新

## ⚡ パフォーマンス最適化

Vercelは以下を自動で最適化します：
- CDN配信
- 自動SSL証明書
- Gzip/Brotli圧縮
- 画像最適化
- キャッシング

## 🔍 ビルドログの確認

デプロイ時に問題が発生した場合：
- Vercel Dashboard → Deployments → 該当デプロイをクリック
- Build Logsタブでエラーを確認

## 📊 現在のプロジェクト情報

- **フレームワーク**: React 18.2.0
- **ビルドコマンド**: `npm run build`
- **出力ディレクトリ**: `build`
- **Node.jsバージョン**: 推奨 18.x 以上

## 🚨 トラブルシューティング

### ビルドエラーが発生する場合

1. **ローカルでビルドテスト**
```bash
npm run build
```

2. **Node.jsバージョン確認**
```bash
node --version
```

3. **依存関係の再インストール**
```bash
rm -rf node_modules package-lock.json
npm install
```

### デプロイ後にページが表示されない

1. vercel.jsonの設定を確認
2. build フォルダが正しく生成されているか確認
3. Vercel Dashboard → Deployments → Logsでエラー確認

## 📞 サポート

- Vercel Documentation: https://vercel.com/docs
- Vercel Community: https://github.com/vercel/vercel/discussions
