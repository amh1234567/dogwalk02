'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function AuthSuccessPage() {
  const [countdown, setCountdown] = useState(3)
  const router = useRouter()

  useEffect(() => {
    // 3秒のカウントダウン後にログインページにリダイレクト
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push('/login')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

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
            認証が完了しました
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            メールアドレスの確認が正常に完了しました
          </p>
          
          {/* ローディングスピナー */}
          <div className="flex flex-col items-center space-y-4">
            <LoadingSpinner size="lg" />
            <p className="text-sm text-gray-500">
              ログインページに移動しています...
            </p>
            <p className="text-xs text-gray-400">
              {countdown}秒後に自動的に移動します
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
