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

  // それ以外は認証完了画面にリダイレクト
  const redirectUrl = `${origin}/auth-success`
  console.log('Redirecting to auth success page:', redirectUrl)
  console.log('=== AUTH CALLBACK END ===')
  
  return NextResponse.redirect(redirectUrl)
}

