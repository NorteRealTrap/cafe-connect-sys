'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Store, ShoppingCart, BarChart3, Users } from 'lucide-react'

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    if (session) {
      router.push('/dashboard')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (session) {
    return null // Redirecionando para dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Store className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">MultiPDV</h1>
            </div>
            <Button onClick={() => router.push('/login')}>
              Fazer Login
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Sistema PDV
            <span className="text-blue-600"> Multi-Estabelecimentos</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Gerencie padarias, lanchonetes, bares, adegas, confeitarias, restaurantes e bistrôs 
            em uma única plataforma integrada.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <Button 
              size="lg" 
              onClick={() => router.push('/login')}
              className="w-full sm:w-auto"
            >
              Começar Agora
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <Store className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Multi-Estabelecimentos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Gerencie múltiplos estabelecimentos de diferentes tipos em uma única plataforma.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <ShoppingCart className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Pedidos Web & Local</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Receba pedidos online e gerencie vendas presenciais com facilidade.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>Controle de Estoque</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Monitore estoque em tempo real com alertas de produtos em falta.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-orange-600 mb-2" />
                <CardTitle>Gestão Completa</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Relatórios, impressão de cupons, controle fiscal e muito mais.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Establishment Types */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Tipos de Estabelecimentos Suportados
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              'Padarias',
              'Lanchonetes', 
              'Bares',
              'Adegas',
              'Confeitarias',
              'Restaurantes',
              'Bistrôs',
              'Pizzarias',
              'Sorveterias',
              'Fast Food'
            ].map((type) => (
              <div key={type} className="text-center p-4 bg-white rounded-lg shadow-sm">
                <p className="font-medium text-gray-900">{type}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p>&copy; 2024 MultiPDV. Sistema Multi-Estabelecimentos.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}