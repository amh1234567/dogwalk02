import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/auth-success'

  console.log('Auth callback received:', {
    code: code ? 'present' : 'missing',
    next,
    origin,
    searchParams: Object.fromEntries(searchParams.entries()),
    environment: process.env.NODE_ENV
  })

  if (code) {
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
    
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      // 認証成功時は認証完了画面にリダイレクト
      let redirectUrl = `${origin}/auth-success`
      
      // パスワードリセットの場合は認証完了画面をスキップして直接リセット画面へ
      if (next === '/reset-password') {
        redirectUrl = `${origin}${next}`
      }
      
      console.log('Redirecting to:', redirectUrl)
      
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(redirectUrl)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${redirectUrl.replace(origin, '')}`)
      } else {
        return NextResponse.redirect(redirectUrl)
      }
    } else {
      console.error('Auth exchange error:', error)
    }
  } else {
    console.log('No code parameter found')
  }

  // return the user to an error page with instructions
  console.log('Redirecting to login with error message')
  return NextResponse.redirect(`${origin}/login?message=認証に失敗しました。再度お試しください。`)
}
