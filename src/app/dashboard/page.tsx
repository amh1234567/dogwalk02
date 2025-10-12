import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/actions/auth'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                🐕 ダッシュボード
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                ようこそ、{user.email}さん！
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <form action={signOut}>
                <button
                  type="submit"
                  className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  ログアウト
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                散歩記録
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>ここに散歩記録の機能を追加できます。</p>
              </div>
              <div className="mt-5">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  新しい散歩記録を追加
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
