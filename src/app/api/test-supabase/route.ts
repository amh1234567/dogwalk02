import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createClient()
    
    // Supabaseクライアントの接続テスト
    const { data, error } = await supabase.auth.getSession()
    
    return NextResponse.json({
      success: true,
      message: 'Supabase接続成功',
      data: {
        hasSession: !!data.session,
        error: error?.message || null
      }
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Supabase接続エラー',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
