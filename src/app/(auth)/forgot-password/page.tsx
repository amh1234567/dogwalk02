import { resetPassword } from '@/actions/auth'
import Link from 'next/link'

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            🔐 パスワード再設定
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            ご登録いただいたメールアドレスを入力してください。<br />
            メールアドレス宛にパスワード変更ページのURLが記載されたメールを送信します。
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          {searchParams?.message && (
            <div className={`px-4 py-3 rounded ${
              searchParams.message.includes('送信しました') || searchParams.message.includes('確認')
                ? 'bg-green-100 border border-green-400 text-green-700'
                : 'bg-red-100 border border-red-400 text-red-700'
            }`}>
              {searchParams.message}
            </div>
          )}

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

            <div className="space-y-4">
              <button
                formAction={resetPassword}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                パスワード再設定メールを送信する
              </button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-50 text-gray-500">または</span>
                </div>
              </div>
              
              <Link
                href="/login"
                className="group relative w-full flex justify-center py-3 px-4 border-2 border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                ログインページに戻る
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
