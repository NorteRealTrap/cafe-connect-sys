import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Globe, Check, X, Clock, ExternalLink, Copy, Info } from 'lucide-react';
import { toast } from 'sonner';

import { OrderTrackingInfo } from './OrderTrackingInfo';

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
  const [showTrackingInfo, setShowTrackingInfo] = useState(false);

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

  const acceptWebOrder = async (webOrder: WebOrder) => {
    try {
      // Criar pedido diretamente no localStorage do orders-database
      const storageKey = 'cafe-connect-orders';
      const counterKey = 'cafe-connect-order-counter';
      
      // Obter próximo número do pedido
      const currentCounter = localStorage.getItem(counterKey);
      const nextNumber = currentCounter ? parseInt(currentCounter) + 1 : 1;
      localStorage.setItem(counterKey, nextNumber.toString());
      
      // Criar novo pedido
      const now = new Date();
      const newOrder = {
        id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        numero: nextNumber,
        cliente: webOrder.customerName,
        telefone: webOrder.customerPhone,
        endereco: webOrder.customerAddress,
        tipo: 'delivery',
        status: 'preparando',
        itens: webOrder.items.map(item => ({
          id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          nome: item.productName,
          quantidade: item.quantity,
          preco: item.price,
          observacoes: ''
        })),
        total: webOrder.total,
        observacoes: `Pedido Web #${webOrder.id} - Aceito em ${now.toLocaleString('pt-BR')}`,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        source: 'web',
        delivery: {
          address: webOrder.customerAddress,
          phone: webOrder.customerPhone,
          estimatedTime: webOrder.estimatedTime || 45,
          status: 'preparando',
          distance: '0 km'
        }
      };
      
      // Salvar no localStorage
      const existingOrders = JSON.parse(localStorage.getItem(storageKey) || '[]');
      existingOrders.unshift(newOrder);
      localStorage.setItem(storageKey, JSON.stringify(existingOrders));
      
      updateWebOrderStatus(webOrder.id, 'aceito');
      
      // Adicionar referência cruzada
      const webOrders = JSON.parse(localStorage.getItem('ccpservices-web-orders') || '[]');
      const updatedWebOrders = webOrders.map((order: WebOrder) => 
        order.id === webOrder.id 
          ? { ...order, systemOrderId: nextNumber.toString(), acceptedAt: now.toISOString() }
          : order
      );
      localStorage.setItem('ccpservices-web-orders', JSON.stringify(updatedWebOrders));
      
      // Criar entrada no sistema de delivery
      const deliveryOrder = {
        id: `DEL-${nextNumber}`,
        customer: webOrder.customerName,
        phone: webOrder.customerPhone,
        address: webOrder.customerAddress,
        items: webOrder.items.map(item => `${item.quantity}x ${item.productName}`),
        total: webOrder.total,
        status: 'preparando',
        estimatedTime: `${webOrder.estimatedTime || 45} min`,
        distance: '0 km',
        orderId: newOrder.id,
        createdAt: now.toISOString()
      };
      
      const existingDeliveries = JSON.parse(localStorage.getItem('ccpservices-deliveries') || '[]');
      existingDeliveries.unshift(deliveryOrder);
      localStorage.setItem('ccpservices-deliveries', JSON.stringify(existingDeliveries));
      
      // Emitir eventos de tempo real
      window.dispatchEvent(new CustomEvent('dataChanged', { 
        detail: { key: 'cafe-connect-orders', data: existingOrders } 
      }));
      window.dispatchEvent(new CustomEvent('dataChanged', { 
        detail: { key: 'ccpservices-deliveries', data: existingDeliveries } 
      }));
      window.dispatchEvent(new CustomEvent('orderStatusChanged', { 
        detail: { orderId: webOrder.id, status: 'aceito', systemOrderId: nextNumber } 
      }));
      
      toast.success(`Pedido aceito! Criado como Pedido #${nextNumber} no módulo Pedidos`);
      loadWebOrders();
    } catch (error) {
      console.error('Erro ao aceitar pedido:', error);
      toast.error('Erro ao aceitar pedido');
    }
  };

  const rejectWebOrder = (orderId: string) => {
    updateWebOrderStatus(orderId, 'rejeitado');
    
    // Emitir evento de mudança de status
    window.dispatchEvent(new CustomEvent('orderStatusChanged', { 
      detail: { orderId, status: 'rejeitado' } 
    }));
    
    toast.success('Pedido rejeitado');
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'web-pendente': { label: 'Aguardando', variant: 'secondary' as const },
      'aceito': { label: 'Aceito → Pedidos', variant: 'success' as const },
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
          <Button variant="outline" onClick={() => setShowTrackingInfo(!showTrackingInfo)}>
            <Info className="h-4 w-4 mr-2" />
            {showTrackingInfo ? 'Ocultar' : 'Como Funciona'}
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

      {showTrackingInfo && (
        <OrderTrackingInfo />
      )}

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
                
                {order.status === 'aceito' && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <Check className="h-4 w-4" />
                      <span>Pedido aceito e enviado para o painel de Pedidos</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {(order as any).systemOrderId ? 
                        `Pedido #${(order as any).systemOrderId} criado no módulo "Pedidos"` :
                        'Processando integração...'
                      }
                    </p>
                  </div>
                )}
                
                {order.status === 'rejeitado' && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-red-600">
                      <X className="h-4 w-4" />
                      <span>Pedido rejeitado</span>
                    </div>
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