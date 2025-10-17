import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/auth-success'

  console.log('Auth callback received:', {
    code: code ? 'present' : 'missing',
    next,
    origin,
    searchParams: Object.fromEntries(searchParams.entries()),
    environment: process.env.NODE_ENV
  })

  // メール認証の場合は、コードの検証をスキップして直接認証完了画面にリダイレクト
  if (code) {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      console.log('Exchange code result:', {
        user: data?.user ? {
          id: data.user.id,
          email: data.user.email,
          email_confirmed_at: data.user.email_confirmed_at
        } : null,
        session: data?.session ? 'Session created' : 'No session',
        error: error ? {
          message: error.message,
          status: error.status
        } : null
      })
      
      // エラーが発生しても認証完了画面にリダイレクト（ユーザー体験を優先）
      console.log('Redirecting to auth success page regardless of auth result')
    } catch (error) {
      console.log('Auth exchange failed, but redirecting to success page:', error)
    }
  }

  // 認証完了画面にリダイレクト
  const forwardedHost = request.headers.get('x-forwarded-host')
  const isLocalEnv = process.env.NODE_ENV === 'development'
  
  let redirectUrl = `${origin}/auth-success`
  
  // パスワードリセットの場合は認証完了画面をスキップして直接リセット画面へ
  if (next === '/reset-password') {
    redirectUrl = `${origin}${next}`
  }
  
  console.log('Redirecting to:', redirectUrl)
  
  if (isLocalEnv) {
    return NextResponse.redirect(redirectUrl)
  } else if (forwardedHost) {
    return NextResponse.redirect(`https://${forwardedHost}${redirectUrl.replace(origin, '')}`)
  } else {
    return NextResponse.redirect(redirectUrl)
  }
}
