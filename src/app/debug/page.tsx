import { createClient } from '@/lib/supabase/server'

export default async function DebugPage() {
  const supabase = createClient()
  
  // 環境変数の確認
  const envCheck = {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? '設定済み' : '未設定',
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '設定済み' : '未設定',
  }
  
  // 現在のセッション確認
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
  
  // ユーザー情報確認
  const { data: userData, error: userError } = await supabase.auth.getUser()
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">デバッグ情報</h1>
        
        <div className="space-y-6">
          {/* 環境変数 */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">環境変数</h2>
            <div className="space-y-2">
              <p><strong>Supabase URL:</strong> {envCheck.supabaseUrl}</p>
              <p><strong>Supabase Key:</strong> {envCheck.supabaseKey}</p>
            </div>
          </div>
          
          {/* セッション情報 */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">セッション情報</h2>
            <div className="space-y-2">
              <p><strong>セッション有無:</strong> {sessionData.session ? 'あり' : 'なし'}</p>
              {sessionData.session && (
                <>
                  <p><strong>ユーザーID:</strong> {sessionData.session.user.id}</p>
                  <p><strong>メール:</strong> {sessionData.session.user.email}</p>
                  <p><strong>確認済み:</strong> {sessionData.session.user.email_confirmed_at ? 'はい' : 'いいえ'}</p>
                </>
              )}
              {sessionError && (
                <p className="text-red-600"><strong>エラー:</strong> {sessionError.message}</p>
              )}
            </div>
          </div>
          
          {/* ユーザー情報 */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">ユーザー情報</h2>
            <div className="space-y-2">
              <p><strong>ユーザー有無:</strong> {userData.user ? 'あり' : 'なし'}</p>
              {userData.user && (
                <>
                  <p><strong>ユーザーID:</strong> {userData.user.id}</p>
                  <p><strong>メール:</strong> {userData.user.email}</p>
                  <p><strong>確認済み:</strong> {userData.user.email_confirmed_at ? 'はい' : 'いいえ'}</p>
                  <p><strong>作成日時:</strong> {userData.user.created_at}</p>
                </>
              )}
              {userError && (
                <p className="text-red-600"><strong>エラー:</strong> {userError.message}</p>
              )}
            </div>
          </div>
          
          {/* 推奨アクション */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-800">推奨アクション</h2>
            <div className="space-y-2 text-blue-700">
              {!envCheck.supabaseUrl || !envCheck.supabaseKey ? (
                <p>• 環境変数（.env.local）を設定してください</p>
              ) : null}
              {userData.user && !userData.user.email_confirmed_at ? (
                <p>• メールアドレスが確認されていません。確認メールをチェックしてください</p>
              ) : null}
              {!userData.user ? (
                <p>• ユーザーがログインしていません。ログインを試してください</p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
