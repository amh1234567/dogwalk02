'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// 環境変数からベースURLを取得する関数
function getBaseUrl() {
  // 本番環境（Vercel）の場合
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // カスタムドメインが設定されている場合
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  
  // 開発環境のデフォルト
  return 'http://localhost:3000';
}

export async function signIn(formData: FormData) {
  const supabase = createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  console.log('Sign in attempt:', { email: data.email, passwordLength: data.password?.length })

  const { data: signInData, error } = await supabase.auth.signInWithPassword(data)

  console.log('Sign in response:', { 
    user: signInData?.user ? {
      id: signInData.user.id,
      email: signInData.user.email,
      email_confirmed_at: signInData.user.email_confirmed_at,
      created_at: signInData.user.created_at
    } : null,
    session: signInData?.session ? 'Session created' : 'No session',
    error: error ? {
      message: error.message,
      status: error.status
    } : null
  })

  if (error) {
    console.error('Sign in error details:', {
      message: error.message,
      status: error.status
    })
    
    let errorMessage = 'ログインに失敗しました'
    
    if (error.message.includes('Invalid login credentials')) {
      errorMessage = 'メールアドレスまたはパスワードが正しくありません'
    } else if (error.message.includes('Email not confirmed')) {
      errorMessage = 'メールアドレスが確認されていません。確認メールをチェックしてください'
    } else if (error.message.includes('User not found')) {
      errorMessage = 'このメールアドレスは登録されていません'
    } else if (error.message.includes('Invalid email')) {
      errorMessage = '有効なメールアドレスを入力してください'
    } else {
      errorMessage = `エラー: ${error.message}`
    }
    
    redirect(`/login?message=${encodeURIComponent(errorMessage)}`)
  }

  console.log('Sign in successful, redirecting to dashboard')
  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signUp(formData: FormData) {
  const supabase = createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string,
  }

  // バリデーション
  if (!data.email || !data.password) {
    redirect('/register?message=メールアドレスとパスワードを入力してください')
  }

  if (data.password.length < 6) {
    redirect('/register?message=パスワードは6文字以上で入力してください')
  }

  if (data.password !== data.confirmPassword) {
    redirect('/register?message=パスワードが一致しません')
  }

  const baseUrl = getBaseUrl()
  const redirectUrl = `${baseUrl}/auth/callback`
  
  console.log('Sign up redirect URL:', redirectUrl)
  console.log('Environment variables:', {
    VERCEL_URL: process.env.VERCEL_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NODE_ENV: process.env.NODE_ENV
  })
  
  const { data: signUpData, error } = await supabase.auth.signUp({
    ...data,
    options: {
      emailRedirectTo: redirectUrl,
    },
  })

  console.log('Sign up response:', { 
    user: signUpData?.user ? {
      id: signUpData.user.id,
      email: signUpData.user.email,
      email_confirmed_at: signUpData.user.email_confirmed_at,
      created_at: signUpData.user.created_at
    } : null,
    session: signUpData?.session ? 'Session created' : 'No session',
    error: error ? {
      message: error.message,
      status: error.status
    } : null
  })

  if (error) {
    console.error('Sign up error details:', {
      message: error.message,
      status: error.status
    })
    
    let errorMessage = 'ユーザーを作成できませんでした'
    
    if (error.message.includes('already registered') || error.message.includes('already been registered')) {
      errorMessage = 'このメールアドレスは既に登録されています'
    } else if (error.message.includes('Invalid email')) {
      errorMessage = '有効なメールアドレスを入力してください'
    } else if (error.message.includes('Password should be at least')) {
      errorMessage = 'パスワードは6文字以上で入力してください'
    } else if (error.message.includes('Unable to validate email address')) {
      errorMessage = 'メールアドレスの形式が正しくありません'
    } else if (error.message.includes('Signup is disabled')) {
      errorMessage = '新規登録が無効になっています。管理者にお問い合わせください'
    } else if (error.message.includes('Invalid API key')) {
      errorMessage = 'APIキーが無効です。設定を確認してください'
    } else if (error.message.includes('Failed to fetch')) {
      errorMessage = 'ネットワークエラーが発生しました。接続を確認してください'
    } else {
      errorMessage = `エラー: ${error.message}`
    }
    
    redirect(`/register?message=${encodeURIComponent(errorMessage)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/register-success')
}

export async function resetPassword(formData: FormData) {
  const supabase = createClient()

  const email = formData.get('email') as string

  if (!email) {
    redirect('/forgot-password?message=メールアドレスを入力してください')
  }

  console.log('Password reset request for email:', email)

  const baseUrl = getBaseUrl()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${baseUrl}/auth/callback?next=/reset-password`,
  })

  if (error) {
    console.error('Password reset error:', error)
    
    let errorMessage = 'パスワード再設定メールの送信に失敗しました'
    
    if (error.message.includes('Invalid email')) {
      errorMessage = '有効なメールアドレスを入力してください'
    } else if (error.message.includes('User not found')) {
      errorMessage = 'このメールアドレスは登録されていません'
    } else if (error.message.includes('Rate limit exceeded')) {
      errorMessage = '送信回数が上限に達しました。しばらく時間をおいてから再度お試しください'
    } else {
      errorMessage = `エラー: ${error.message}`
    }
    
    redirect(`/forgot-password?message=${encodeURIComponent(errorMessage)}`)
  }

  console.log('Password reset email sent successfully')
  redirect('/forgot-password?message=パスワード再設定メールを送信しました。メールをご確認ください。')
}

export async function updatePassword(formData: FormData) {
  const supabase = createClient()

  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!password || !confirmPassword) {
    redirect('/reset-password?message=パスワードを入力してください')
  }

  if (password.length < 6) {
    redirect('/reset-password?message=パスワードは6文字以上で入力してください')
  }

  if (password !== confirmPassword) {
    redirect('/reset-password?message=パスワードが一致しません')
  }

  console.log('Updating password for user')

  const { error } = await supabase.auth.updateUser({
    password: password
  })

  if (error) {
    console.error('Password update error:', error)
    
    let errorMessage = 'パスワードの更新に失敗しました'
    
    if (error.message.includes('Password should be at least')) {
      errorMessage = 'パスワードは6文字以上で入力してください'
    } else if (error.message.includes('Invalid password')) {
      errorMessage = '無効なパスワードです'
    } else {
      errorMessage = `エラー: ${error.message}`
    }
    
    redirect(`/reset-password?message=${encodeURIComponent(errorMessage)}`)
  }

  console.log('Password updated successfully')
  redirect('/login?message=パスワードが正常に更新されました。新しいパスワードでログインしてください。')
}

export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
