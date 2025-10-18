'use client'

import { useRouter } from 'next/navigation'

export default function SuccessPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* 成功アイコン */}
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-8">
            <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          {/* メッセージ */}
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
            登録が完了しました
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            アカウントの登録が正常に完了しました
          </p>
          
          {/* 完了メッセージ */}
          <div className="flex flex-col items-center space-y-4 mb-8">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-lg text-gray-600">
              これでアプリをご利用いただけます
            </p>
            <p className="text-sm text-gray-500">
              ログインしてサービスを開始してください
            </p>
          </div>
          
          {/* アクションボタン */}
          <div className="space-y-4">
            <button
              onClick={() => router.push('/login')}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              ログインする
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="w-full flex justify-center py-3 px-4 border-2 border-indigo-300 rounded-md text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              ホームに戻る
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
