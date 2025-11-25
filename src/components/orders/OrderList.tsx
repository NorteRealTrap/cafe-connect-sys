import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Clock, Package, CheckCircle, XCircle, Truck } from 'lucide-react';

interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface Order {
  id: number;
  user_id: number;
  customer_name: string;
  customer_email: string;
  total: number;
  status: string;
  notes: string;
  delivery_address: string;
  phone: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: 'Pendente', color: 'bg-yellow-500', icon: Clock },
  confirmed: { label: 'Confirmado', color: 'bg-blue-500', icon: CheckCircle },
  preparing: { label: 'Preparando', color: 'bg-purple-500', icon: Package },
  ready: { label: 'Pronto', color: 'bg-green-500', icon: CheckCircle },
  delivering: { label: 'Em Entrega', color: 'bg-indigo-500', icon: Truck },
  delivered: { label: 'Entregue', color: 'bg-green-600', icon: CheckCircle },
  cancelled: { label: 'Cancelado', color: 'bg-red-500', icon: XCircle },
};

export function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  const token = localStorage.getItem('auth-token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const url = selectedStatus === 'all' 
        ? '/api/orders-new' 
        : `/api/orders-new?status=${selectedStatus}`;

      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Erro ao buscar pedidos');

      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      toast.error('Erro ao carregar pedidos');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId: number) => {
    try {
      const response = await fetch(`/api/orders-new?id=${orderId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Erro ao buscar detalhes');

      const data = await response.json();
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, items: data.order.items } : order
      ));
      setExpandedOrder(orderId);
    } catch (error) {
      toast.error('Erro ao carregar detalhes do pedido');
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders-new?id=${orderId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Erro ao atualizar status');

      toast.success('Status atualizado!');
      fetchOrders();
    } catch (error) {
      toast.error('Erro ao atualizar status');
    }
  };

  const cancelOrder = async (orderId: number) => {
    if (!confirm('Tem certeza que deseja cancelar este pedido?')) return;

    try {
      const response = await fetch(`/api/orders-new?id=${orderId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Erro ao cancelar pedido');

      toast.success('Pedido cancelado!');
      fetchOrders();
    } catch (error) {
      toast.error('Erro ao cancelar pedido');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('pt-BR');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Pedidos</h1>
          <p className="text-muted-foreground">
            {user?.role === 'admin' ? 'Gerencie todos os pedidos' : 'Seus pedidos'}
          </p>
        </div>

        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="confirmed">Confirmado</SelectItem>
            <SelectItem value="preparing">Preparando</SelectItem>
            <SelectItem value="ready">Pronto</SelectItem>
            <SelectItem value="delivering">Em Entrega</SelectItem>
            <SelectItem value="delivered">Entregue</SelectItem>
            <SelectItem value="cancelled">Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum pedido encontrado</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => {
            const StatusIcon = statusConfig[order.status]?.icon || Clock;
            const isExpanded = expandedOrder === order.id;

            return (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        Pedido #{order.id}
                        <Badge className={statusConfig[order.status]?.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusConfig[order.status]?.label}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        {user?.role === 'admin' && (
                          <span className="font-medium">{order.customer_name} - </span>
                        )}
                        {formatDate(order.created_at)}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{formatCurrency(order.total)}</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {order.delivery_address && (
                    <div>
                      <p className="text-sm font-medium">Endereço de Entrega:</p>
                      <p className="text-sm text-muted-foreground">{order.delivery_address}</p>
                    </div>
                  )}

                  {order.phone && (
                    <div>
                      <p className="text-sm font-medium">Telefone:</p>
                      <p className="text-sm text-muted-foreground">{order.phone}</p>
                    </div>
                  )}

                  {order.notes && (
                    <div>
                      <p className="text-sm font-medium">Observações:</p>
                      <p className="text-sm text-muted-foreground">{order.notes}</p>
                    </div>
                  )}

                  {isExpanded && order.items && (
                    <div className="border-t pt-4">
                      <p className="text-sm font-medium mb-2">Itens do Pedido:</p>
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm bg-muted p-2 rounded">
                            <span>{item.quantity}x {item.product_name}</span>
                            <span className="font-medium">{formatCurrency(item.subtotal)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => isExpanded 
                        ? setExpandedOrder(null) 
                        : fetchOrderDetails(order.id)
                      }
                    >
                      {isExpanded ? 'Ocultar Detalhes' : 'Ver Detalhes'}
                    </Button>

                    {user?.role === 'admin' && order.status !== 'cancelled' && (
                      <Select onValueChange={(value) => updateOrderStatus(order.id, value)}>
                        <SelectTrigger className="w-[180px] h-9">
                          <SelectValue placeholder="Alterar Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="confirmed">Confirmar</SelectItem>
                          <SelectItem value="preparing">Em Preparação</SelectItem>
                          <SelectItem value="ready">Pronto</SelectItem>
                          <SelectItem value="delivering">Em Entrega</SelectItem>
                          <SelectItem value="delivered">Entregue</SelectItem>
                        </SelectContent>
                      </Select>
                    )}

                    {['pending', 'confirmed'].includes(order.status) && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => cancelOrder(order.id)}
                      >
                        Cancelar Pedido
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
