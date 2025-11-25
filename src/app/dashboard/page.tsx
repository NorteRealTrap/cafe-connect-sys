'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Store, 
  ShoppingCart, 
  Package, 
  Users, 
  TrendingUp,
  Clock,
  DollarSign,
  AlertTriangle
} from 'lucide-react'

interface DashboardStats {
  totalEstablishments: number
  totalOrders: number
  totalProducts: number
  totalRevenue: number
  todayOrders: number
  lowStockProducts: number
}

export default function Dashboard() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<DashboardStats>({
    totalEstablishments: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    todayOrders: 0,
    lowStockProducts: 0
  })
  const [establishments, setEstablishments] = useState([])
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Buscar estabelecimentos
      const establishmentsRes = await fetch('/api/establishments')
      const establishmentsData = await establishmentsRes.json()
      setEstablishments(establishmentsData)

      // Buscar pedidos recentes
      const ordersRes = await fetch('/api/orders')
      const ordersData = await ordersRes.json()
      setRecentOrders(ordersData.slice(0, 5))

      // Calcular estatísticas
      const totalRevenue = ordersData
        .filter((order: any) => order.status === 'COMPLETED')
        .reduce((sum: number, order: any) => sum + Number(order.total), 0)

      const today = new Date().toDateString()
      const todayOrders = ordersData.filter((order: any) => 
        new Date(order.createdAt).toDateString() === today
      ).length

      setStats({
        totalEstablishments: establishmentsData.length,
        totalOrders: ordersData.length,
        totalProducts: establishmentsData.reduce((sum: number, est: any) => sum + est._count.products, 0),
        totalRevenue,
        todayOrders,
        lowStockProducts: 0 // Implementar busca de produtos com estoque baixo
      })

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Bem-vindo, {session?.user?.name}</p>
        </div>
        <Button onClick={fetchDashboardData}>
          Atualizar Dados
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estabelecimentos</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEstablishments}</div>
            <p className="text-xs text-muted-foreground">
              Ativos no sistema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Hoje</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayOrders}</div>
            <p className="text-xs text-muted-foreground">
              Total de {stats.totalOrders} pedidos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Cadastrados no sistema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturamento</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {stats.totalRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de vendas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Estabelecimentos */}
        <Card>
          <CardHeader>
            <CardTitle>Meus Estabelecimentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {establishments.map((establishment: any) => (
                <div key={establishment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{establishment.name}</h3>
                    <p className="text-sm text-gray-600">{establishment.type}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline">
                        {establishment._count.products} produtos
                      </Badge>
                      <Badge variant="outline">
                        {establishment._count.orders} pedidos
                      </Badge>
                    </div>
                  </div>
                  <Badge variant={establishment.isActive ? 'default' : 'secondary'}>
                    {establishment.isActive ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              ))}
              {establishments.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  Nenhum estabelecimento encontrado
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pedidos Recentes */}
        <Card>
          <CardHeader>
            <CardTitle>Pedidos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order: any) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{order.orderNumber}</h3>
                    <p className="text-sm text-gray-600">
                      {order.customerName || 'Cliente não informado'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={
                        order.status === 'COMPLETED' ? 'default' :
                        order.status === 'PREPARING' ? 'secondary' :
                        order.status === 'CANCELLED' ? 'destructive' : 'outline'
                      }
                    >
                      {order.status}
                    </Badge>
                    <p className="text-sm font-medium mt-1">
                      R$ {Number(order.total).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
              {recentOrders.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  Nenhum pedido encontrado
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col">
              <ShoppingCart className="h-6 w-6 mb-2" />
              Novo Pedido
            </Button>
            <Button variant="outline" className="h-20 flex flex-col">
              <Package className="h-6 w-6 mb-2" />
              Produtos
            </Button>
            <Button variant="outline" className="h-20 flex flex-col">
              <Store className="h-6 w-6 mb-2" />
              Estabelecimentos
            </Button>
            <Button variant="outline" className="h-20 flex flex-col">
              <TrendingUp className="h-6 w-6 mb-2" />
              Relatórios
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}