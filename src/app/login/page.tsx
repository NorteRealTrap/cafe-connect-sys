'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Coffee, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
        setIsLoading(false)
        return
      }

      if (result?.ok) {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (error) {
      setError('Erro ao fazer login')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mb-4">
            <Coffee className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-center">Café Connect SYS</h1>
          <p className="text-gray-600 text-center">Sistema Multi-Estabelecimentos</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              placeholder="admin@multipdv.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={isLoading}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              disabled={isLoading}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50 flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </button>
        </form>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-semibold mb-2">Credenciais de teste:</p>
          <div className="text-xs space-y-1 text-gray-600">
            <p>👨‍💼 Admin: admin@multipdv.com / admin123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
