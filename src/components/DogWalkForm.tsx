'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { DogWalkFormData } from '@/types'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function DogWalkForm() {
  const [formData, setFormData] = useState<DogWalkFormData>({
    walk_date: '',
    walk_time: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('dog_walks')
        .insert([formData])

      if (error) {
        throw error
      }

      setMessage('散歩記録を保存しました！')
      setFormData({ walk_date: '', walk_time: '' })
    } catch (error) {
      console.error('Error saving walk record:', error)
      setMessage('エラーが発生しました。もう一度お試しください。')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="card max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
        散歩記録を追加
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="walk_date" className="block text-sm font-medium text-gray-700 mb-2">
            日付
          </label>
          <input
            type="date"
            id="walk_date"
            name="walk_date"
            value={formData.walk_date}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>

        <div>
          <label htmlFor="walk_time" className="block text-sm font-medium text-gray-700 mb-2">
            時間
          </label>
          <input
            type="time"
            id="walk_time"
            name="walk_time"
            value={formData.walk_time}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? <LoadingSpinner /> : '記録を保存'}
        </button>
      </form>

      {message && (
        <div className={`mt-4 p-3 rounded-lg text-center ${
          message.includes('エラー') 
            ? 'bg-red-100 text-red-700' 
            : 'bg-green-100 text-green-700'
        }`}>
          {message}
        </div>
      )}
    </div>
  )
}
