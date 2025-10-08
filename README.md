# 犬の散歩記録アプリ

愛犬の散歩時間を記録するシンプルなWebアプリケーションです。

## 機能

- 散歩の日付と時間を記録
- Supabaseを使用したデータベース保存
- レスポンシブデザイン

## 技術スタック

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase

## セットアップ

1. 依存関係をインストール
```bash
npm install
```

2. 環境変数を設定
`.env.local`ファイルを作成し、以下の内容を追加：
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

3. Supabaseでテーブルを作成
```sql
CREATE TABLE dog_walks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  walk_date DATE NOT NULL,
  walk_time TIME NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

4. 開発サーバーを起動
```bash
npm run dev
```

## プロジェクト構造

```
src/
├── app/                    # Next.js App Router
│   ├── _components/        # ページ専用コンポーネント
│   ├── layout.tsx         # 共通レイアウト
│   └── page.tsx           # トップページ
├── components/            # 共通コンポーネント
├── lib/                   # ユーティリティ関数
├── types/                 # TypeScript型定義
└── styles/               # CSSファイル
```
