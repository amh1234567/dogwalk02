import Link from 'next/link'

export default function RegisterSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
            🎉 新規登録が完了しました！
          </h2>
          
          <p className="text-lg text-gray-600 mb-6">
            アカウントの作成が正常に完了しました
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  次のステップ
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>確認メールが送信されました。メールボックスを確認して、アカウントを有効化してください。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/login"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            ログイン画面に戻る
          </Link>
          
          <Link
            href="/"
            className="group relative w-full flex justify-center py-3 px-4 border-2 border-indigo-300 text-sm font-medium rounded-md text-indigo-700 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            ホームに戻る
          </Link>
        </div>
        
        <div className="text-center">
          <p className="text-xs text-gray-500">
            確認メールが届かない場合は、迷惑メールフォルダもご確認ください。
          </p>
        </div>
      </div>
    </div>
  )
}
