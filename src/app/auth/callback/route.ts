import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/auth-success'

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      // 認証成功時は認証完了画面にリダイレクト
      let redirectUrl = `${origin}/auth-success`
      
      // パスワードリセットの場合は認証完了画面をスキップして直接リセット画面へ
      if (next === '/reset-password') {
        redirectUrl = `${origin}${next}`
      }
      
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(redirectUrl)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${redirectUrl.replace(origin, '')}`)
      } else {
        return NextResponse.redirect(redirectUrl)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?message=認証に失敗しました。再度お試しください。`)
}
