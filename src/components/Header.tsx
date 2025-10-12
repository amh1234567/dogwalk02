import { APP_NAME } from '@/constants'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function Header() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            <Link href="/" className="hover:text-gray-700">
              🐕 {APP_NAME}
            </Link>
          </h1>
          
          <nav className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  ダッシュボード
                </Link>
                <span className="text-sm text-gray-500">
                  {user.email}
                </span>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                ログイン
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}


