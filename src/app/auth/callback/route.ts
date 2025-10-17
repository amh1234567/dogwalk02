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

  // 認証完了画面にリダイレクト（認証処理の結果に関係なく）
  const forwardedHost = request.headers.get('x-forwarded-host')
  const isLocalEnv = process.env.NODE_ENV === 'development'
  
  let redirectUrl = `${origin}/auth-success`
  
  // パスワードリセットの場合は認証完了画面をスキップして直接リセット画面へ
  if (next === '/reset-password') {
    redirectUrl = `${origin}${next}`
  }
  
  console.log('Redirecting to auth success page:', redirectUrl)
  
  // 認証処理を試行（ログのみ、結果は無視）
  if (code) {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      console.log('Auth exchange result:', {
        user: data?.user ? 'User found' : 'No user',
        session: data?.session ? 'Session created' : 'No session',
        error: error ? error.message : 'No error'
      })
    } catch (error) {
      console.log('Auth exchange error (ignored):', error)
    }
  }
  
  if (isLocalEnv) {
    return NextResponse.redirect(redirectUrl)
  } else if (forwardedHost) {
    return NextResponse.redirect(`https://${forwardedHost}${redirectUrl.replace(origin, '')}`)
  } else {
    return NextResponse.redirect(redirectUrl)
  }
}

