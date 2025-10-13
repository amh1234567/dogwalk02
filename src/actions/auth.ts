'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signIn(formData: FormData) {
  const supabase = createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  console.log('Sign in attempt:', { email: data.email, passwordLength: data.password?.length })

  const { data: signInData, error } = await supabase.auth.signInWithPassword(data)

  console.log('Sign in response:', { signInData, error })

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

  const { data: signUpData, error } = await supabase.auth.signUp(data)

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

export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
