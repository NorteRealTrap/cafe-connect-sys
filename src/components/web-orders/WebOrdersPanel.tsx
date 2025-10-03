import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Globe, Check, X, Clock, ExternalLink, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { useOrders } from '@/hooks/useDatabase';

interface WebOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  total: number;
  status: string;
  type: string;
  orderTime: string;
  estimatedTime: number;
  createdAt: string;
  source: string;
}

interface WebOrdersPanelProps {
  onBack: () => void;
}

export const WebOrdersPanel: React.FC<WebOrdersPanelProps> = ({ onBack }) => {
  const [webOrders, setWebOrders] = useState<WebOrder[]>([]);
  const { addOrder } = useOrders();

  useEffect(() => {
    loadWebOrders();
    
    const handleNewWebOrder = (event: CustomEvent) => {
      loadWebOrders();
      toast.success('Novo pedido web recebido!');
    };

    window.addEventListener('newWebOrder', handleNewWebOrder as EventListener);
    
    return () => {
      window.removeEventListener('newWebOrder', handleNewWebOrder as EventListener);
    };
  }, []);

  const loadWebOrders = () => {
    const orders = JSON.parse(localStorage.getItem('ccpservices-web-orders') || '[]');
    setWebOrders(orders.sort((a: WebOrder, b: WebOrder) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
  };

  const updateWebOrderStatus = (orderId: string, newStatus: string) => {
    const orders = JSON.parse(localStorage.getItem('ccpservices-web-orders') || '[]');
    const updatedOrders = orders.map((order: WebOrder) => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    localStorage.setItem('ccpservices-web-orders', JSON.stringify(updatedOrders));
    setWebOrders(updatedOrders);
  };

  const acceptWebOrder = (webOrder: WebOrder) => {
    try {
      // Converter pedido web para pedido do sistema
      const systemOrder = {
        cliente: webOrder.customerName,
        telefone: webOrder.customerPhone,
        endereco: webOrder.customerAddress,
        tipo: 'delivery' as const,
        itens: webOrder.items.map(item => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          price: item.price,
          total: item.total
        })),
        total: webOrder.total,
        observacoes: `Pedido Web #${webOrder.id}`
      };

      addOrder(systemOrder);
      updateWebOrderStatus(webOrder.id, 'aceito');
      toast.success('Pedido aceito e adicionado ao sistema!');
    } catch (error) {
      toast.error('Erro ao aceitar pedido');
    }
  };

  const rejectWebOrder = (orderId: string) => {
    updateWebOrderStatus(orderId, 'rejeitado');
    toast.success('Pedido rejeitado');
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'web-pendente': { label: 'Pendente', variant: 'secondary' as const },
      'aceito': { label: 'Aceito', variant: 'success' as const },
      'rejeitado': { label: 'Rejeitado', variant: 'destructive' as const }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || { label: status, variant: 'secondary' as const };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const copyWebLink = () => {
    const webLink = `${window.location.origin}/web-order`;
    navigator.clipboard.writeText(webLink);
    toast.success('Link copiado para a área de transferência!');
  };

  const openWebLink = () => {
    const webLink = `${window.location.origin}/web-order`;
    window.open(webLink, '_blank');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Globe className="h-6 w-6" />
            Pedidos Web
          </h2>
          <p className="text-muted-foreground">
            Gerencie pedidos recebidos através do link web
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={copyWebLink}>
            <Copy className="h-4 w-4 mr-2" />
            Copiar Link
          </Button>
          <Button variant="outline" onClick={openWebLink}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Abrir Link
          </Button>
          <Button variant="outline" onClick={onBack}>
            Voltar
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Link de Pedidos Web</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <code className="flex-1 text-sm">
              {window.location.origin}/web-order
            </code>
            <Button size="sm" variant="outline" onClick={copyWebLink}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={openWebLink}>
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Compartilhe este link com seus clientes para que possam fazer pedidos online
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {webOrders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Globe className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Nenhum pedido web recebido ainda</p>
              <p className="text-sm text-gray-400 mt-2">
                Compartilhe o link acima para começar a receber pedidos
              </p>
            </CardContent>
          </Card>
        ) : (
          webOrders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Pedido {order.id}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(order.status)}
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{order.orderTime}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Dados do Cliente</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Nome:</strong> {order.customerName}</p>
                      <p><strong>Telefone:</strong> {order.customerPhone}</p>
                      <p><strong>Endereço:</strong> {order.customerAddress}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Itens do Pedido</h4>
                    <div className="space-y-1 text-sm">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between">
                          <span>{item.quantity}x {item.productName}</span>
                          <span>R$ {item.total.toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="border-t pt-1 mt-2 font-medium">
                        <div className="flex justify-between">
                          <span>Total:</span>
                          <span>R$ {order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {order.status === 'web-pendente' && (
                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    <Button 
                      onClick={() => acceptWebOrder(order)}
                      className="flex-1"
                      variant="default"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Aceitar Pedido
                    </Button>
                    <Button 
                      onClick={() => rejectWebOrder(order.id)}
                      variant="destructive"
                      className="flex-1"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Rejeitar
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};