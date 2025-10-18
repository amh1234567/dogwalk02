import { signIn } from '@/actions/auth'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-glow py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="card-warm">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-earth-800">
            🐕 犬の散歩記録アプリ
          </h2>
          <p className="mt-2 text-center text-sm text-earth-600">
            アカウントにログインするか、新規登録してください
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          {searchParams?.message && (
            <div className={`px-4 py-3 rounded ${
              searchParams.message.includes('確認メール') || searchParams.message.includes('送信しました')
                ? 'bg-secondary-100 border border-secondary-400 text-secondary-700'
                : 'bg-warm-100 border border-warm-400 text-warm-700'
            }`}>
              {searchParams.message}
            </div>
          )}

          {/* デバッグ情報 */}
          <div className="mt-4 p-3 bg-earth-100 rounded text-xs text-earth-600">
            <p>デバッグ情報:</p>
            <p>• Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '設定済み' : '未設定'}</p>
            <p>• Supabase Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '設定済み' : '未設定'}</p>
            <p>• ポート: 3001</p>
          </div>

          <form className="space-y-6 card">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-earth-700">
                メールアドレス
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="input-field"
                placeholder="メールアドレスを入力"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-earth-700">
                パスワード
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="input-field"
                placeholder="パスワードを入力"
              />
              <div className="mt-2 text-right">
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary-600 hover:text-primary-500"
                >
                  パスワードを忘れた方へ
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <button
                formAction={signIn}
                className="btn-primary w-full"
              >
                ログイン
              </button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-earth-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-earth-500">または</span>
                </div>
              </div>
              
              <Link
                href="/register"
                className="btn-secondary w-full"
              >
                新規登録
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
