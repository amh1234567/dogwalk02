import { APP_NAME } from '@/constants'

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <h1 className="text-2xl font-bold text-gray-900 text-center">
          🐕 {APP_NAME}
        </h1>
      </div>
    </header>
  )
}
