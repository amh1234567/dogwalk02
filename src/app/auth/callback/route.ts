import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/auth-success'

  console.log('=== AUTH CALLBACK START ===')
  console.log('Code present:', !!code)
  console.log('Next:', next)
  console.log('Origin:', origin)
  console.log('Environment:', process.env.NODE_ENV)

  // パスワードリセットの場合は直接リセット画面へ
  if (next === '/reset-password') {
    console.log('Redirecting to reset password page')
    return NextResponse.redirect(`${origin}/reset-password`)
  }

  // メール認証の場合
  if (code) {
    console.log('=== EMAIL AUTH PROCESSING ===')
    console.log('Code received:', code.substring(0, 10) + '...')
    
    try {
      const supabase = createClient()
      console.log('Supabase client created, attempting code exchange...')
      
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      console.log('Auth exchange result:', {
        user: data?.user ? {
          id: data.user.id,
          email: data.user.email,
          email_confirmed_at: data.user.email_confirmed_at
        } : 'No user',
        session: data?.session ? 'Session created' : 'No session',
        error: error ? {
          message: error.message,
          status: error.status
        } : 'No error'
      })
      
      if (error) {
        console.error('Auth exchange error:', error)
        console.log('Redirecting to login with error message')
        return NextResponse.redirect(`${origin}/login?message=認証に失敗しました。再度お試しください。`)
      }
      
      if (data?.user && data?.session) {
        console.log('✅ User authenticated successfully!')
        console.log('User ID:', data.user.id)
        console.log('User Email:', data.user.email)
        console.log('Redirecting to dashboard:', `${origin}/dashboard`)
        return NextResponse.redirect(`${origin}/dashboard`)
      } else {
        console.log('❌ Authentication failed: No user or session')
        console.log('User data:', data?.user)
        console.log('Session data:', data?.session)
        return NextResponse.redirect(`${origin}/login?message=認証に失敗しました。`)
      }
    } catch (error) {
      console.error('Auth exchange exception:', error)
      return NextResponse.redirect(`${origin}/login?message=認証処理中にエラーが発生しました。`)
    }
  } else {
    console.log('❌ No code parameter found in URL')
  }

  // コードがない場合はログインページにリダイレクト
  console.log('No code present, redirecting to login page')
  console.log('=== AUTH CALLBACK END ===')
  
  return NextResponse.redirect(`${origin}/login?message=認証コードが見つかりません。`)
}

