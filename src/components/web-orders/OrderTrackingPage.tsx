import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Truck, ChefHat, Search } from 'lucide-react';

interface WebOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  status: string;
  total: number;
  orderTime: string;
  estimatedTime: number;
  items: Array<{
    productName: string;
    quantity: number;
    price: number;
  }>;
}

export const OrderTrackingPage: React.FC = () => {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<WebOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const searchOrder = () => {
    if (!orderId.trim()) return;
    
    setLoading(true);
    setNotFound(false);
    
    try {
      const webOrders = JSON.parse(localStorage.getItem('ccpservices-web-orders') || '[]');
      const mainOrders = JSON.parse(localStorage.getItem('cafe-connect-orders') || '[]');
      
      let foundOrder = webOrders.find((o: WebOrder) => o.id === orderId.trim());
      
      if (!foundOrder) {
        foundOrder = mainOrders.find((o: any) => o.id === orderId.trim() && o.source === 'web');
      }
      
      if (foundOrder) {
        setOrder(foundOrder);
        setNotFound(false);
      } else {
        setOrder(null);
        setNotFound(true);
      }
    } catch (error) {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (order) {
        searchOrder();
      }
    }, 10000); // Atualiza a cada 10 segundos

    return () => clearInterval(interval);
  }, [order, orderId]);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'web-pendente':
        return { 
          label: 'Aguardando Confirmação', 
          color: 'bg-yellow-500', 
          icon: Clock,
          description: 'Seu pedido foi recebido e está aguardando confirmação'
        };
      case 'aceito':
      case 'preparando':
        return { 
          label: 'Preparando', 
          color: 'bg-blue-500', 
          icon: ChefHat,
          description: 'Seu pedido está sendo preparado'
        };
      case 'pronto':
        return { 
          label: 'Saiu para Entrega', 
          color: 'bg-orange-500', 
          icon: Truck,
          description: 'Seu pedido saiu para entrega'
        };
      case 'entregue':
        return { 
          label: 'Entregue', 
          color: 'bg-green-500', 
          icon: CheckCircle,
          description: 'Pedido entregue com sucesso'
        };
      default:
        return { 
          label: 'Status Desconhecido', 
          color: 'bg-gray-500', 
          icon: Clock,
          description: 'Status não identificado'
        };
    }
  };

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case 'web-pendente': return 25;
      case 'aceito':
      case 'preparando': return 50;
      case 'pronto': return 75;
      case 'entregue': return 100;
      default: return 0;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Acompanhar Pedido
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Digite o código do seu pedido para acompanhar o status
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Buscar Pedido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Digite o código do pedido (ex: WEB-1234567890)"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchOrder()}
                />
                <Button onClick={searchOrder} disabled={loading}>
                  {loading ? 'Buscando...' : 'Buscar'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {notFound && (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">
                  Pedido não encontrado. Verifique o código e tente novamente.
                </p>
              </CardContent>
            </Card>
          )}

          {order && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Pedido {order.id}
                    <Badge variant="outline">{order.orderTime}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Cliente:</p>
                      <p className="font-medium">{order.customerName}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Total:</p>
                      <p className="font-medium text-green-600">R$ {order.total.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Status do Pedido</CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const statusInfo = getStatusInfo(order.status);
                    const StatusIcon = statusInfo.icon;
                    const progress = getProgressPercentage(order.status);
                    
                    return (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${statusInfo.color}`}>
                            <StatusIcon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium">{statusInfo.label}</p>
                            <p className="text-sm text-gray-600">{statusInfo.description}</p>
                          </div>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${statusInfo.color}`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Pedido Recebido</span>
                          <span>Preparando</span>
                          <span>Saiu para Entrega</span>
                          <span>Entregue</span>
                        </div>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Itens do Pedido</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                        <div>
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-sm text-gray-600">Qtd: {item.quantity}</p>
                        </div>
                        <p className="font-medium">R$ {(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {order.status !== 'entregue' && (
                <Card>
                  <CardContent className="text-center py-6">
                    <p className="text-sm text-gray-600 mb-2">
                      Tempo estimado de entrega: {order.estimatedTime} minutos
                    </p>
                    <p className="text-xs text-gray-500">
                      Esta página atualiza automaticamente a cada 10 segundos
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};