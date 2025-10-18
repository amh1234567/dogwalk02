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
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      console.log('Auth exchange result:', {
        user: data?.user ? 'User found' : 'No user',
        session: data?.session ? 'Session created' : 'No session',
        error: error ? error.message : 'No error'
      })
      
      if (error) {
        console.error('Auth exchange error:', error)
        // エラーの場合はログインページにリダイレクト
        return NextResponse.redirect(`${origin}/login?message=認証に失敗しました。再度お試しください。`)
      }
      
      if (data?.user && data?.session) {
        console.log('User authenticated successfully, redirecting to success page')
        // 認証成功時は成功ページにリダイレクト
        return NextResponse.redirect(`${origin}/success`)
      }
    } catch (error) {
      console.error('Auth exchange exception:', error)
      return NextResponse.redirect(`${origin}/login?message=認証処理中にエラーが発生しました。`)
    }
  }

  // コードがない場合はログインページにリダイレクト
  console.log('No code present, redirecting to login page')
  console.log('=== AUTH CALLBACK END ===')
  
  return NextResponse.redirect(`${origin}/login?message=認証コードが見つかりません。`)
}

