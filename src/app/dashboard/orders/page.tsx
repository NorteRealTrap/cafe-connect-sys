'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useEstablishment } from '@/contexts/EstablishmentContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Plus, Clock, Eye } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function OrdersPage() {
  const router = useRouter()
  const { currentEstablishment } = useEstablishment()
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('ALL')

  const fetchOrders = async () => {
    if (!currentEstablishment) return
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        establishmentId: currentEstablishment.id,
        ...(statusFilter !== 'ALL' && { status: statusFilter })
      })
      const response = await fetch(`/api/orders?${params}`)
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [currentEstablishment, statusFilter])

  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
      PREPARING: { label: 'Preparando', color: 'bg-blue-100 text-blue-800' },
      READY: { label: 'Pronto', color: 'bg-green-100 text-green-800' },
      COMPLETED: { label: 'Completo', color: 'bg-gray-100 text-gray-800' },
      CANCELLED: { label: 'Cancelado', color: 'bg-red-100 text-red-800' }
    }
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pedidos</h1>
          <p className="text-muted-foreground">Gerencie todos os pedidos do estabelecimento</p>
        </div>
        <Button onClick={() => router.push('/dashboard/pos')}>
          <Plus className="w-4 h-4 mr-2" />Novo Pedido (PDV)
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos</SelectItem>
            <SelectItem value="PENDING">Pendente</SelectItem>
            <SelectItem value="PREPARING">Preparando</SelectItem>
            <SelectItem value="READY">Pronto</SelectItem>
            <SelectItem value="COMPLETED">Completo</SelectItem>
            <SelectItem value="CANCELLED">Cancelado</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={fetchOrders}>Atualizar</Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6"><div className="h-20 bg-gray-200 rounded"></div></CardContent>
            </Card>
          ))}
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map(order => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">Pedido #{order.id.slice(0, 8)}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.status).color}`}>
                        {getStatusBadge(order.status).label}
                      </span>
                      {order.table && <Badge variant="outline">Mesa {order.table.number}</Badge>}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true, locale: ptBR })}
                      </div>
                      <div>{order.items.length} {order.items.length === 1 ? 'item' : 'itens'}</div>
                      {order.customerName && <div>Cliente: {order.customerName}</div>}
                    </div>
                    <div className="text-sm">
                      {order.items.slice(0, 3).map((item: any) => (
                        <div key={item.id} className="text-gray-600">{item.quantity}x {item.product.name}</div>
                      ))}
                      {order.items.length > 3 && <div className="text-gray-500 italic">+{order.items.length - 3} mais...</div>}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-2xl font-bold text-orange-600">{formatCurrency(order.total)}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/orders/${order.id}`)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Clock className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum pedido encontrado</h3>
            <p className="text-muted-foreground mb-4">Comece criando um novo pedido no PDV</p>
            <Button onClick={() => router.push('/dashboard/pos')}>
              <Plus className="w-4 h-4 mr-2" />Abrir PDV
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
