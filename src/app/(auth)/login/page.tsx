import { signIn, signUp } from '@/actions/auth'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            🐕 犬の散歩記録アプリ
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            アカウントにログインするか、新規登録してください
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          {searchParams?.message && (
            <div className={`px-4 py-3 rounded ${
              searchParams.message.includes('確認メール') || searchParams.message.includes('送信しました')
                ? 'bg-green-100 border border-green-400 text-green-700'
                : 'bg-red-100 border border-red-400 text-red-700'
            }`}>
              {searchParams.message}
            </div>
          )}

          {/* デバッグ情報 */}
          <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-gray-600">
            <p>デバッグ情報:</p>
            <p>• Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '設定済み' : '未設定'}</p>
            <p>• Supabase Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '設定済み' : '未設定'}</p>
            <p>• ポート: 3001</p>
          </div>

          <form className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                メールアドレス
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="メールアドレスを入力"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                パスワード
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="パスワードを入力"
              />
            </div>

            <div className="space-y-4">
              <button
                formAction={signIn}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                ログイン
              </button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-50 text-gray-500">または</span>
                </div>
              </div>
              
              <button
                formAction={signUp}
                className="group relative w-full flex justify-center py-3 px-4 border-2 border-indigo-300 text-sm font-medium rounded-md text-indigo-700 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                新規登録
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
