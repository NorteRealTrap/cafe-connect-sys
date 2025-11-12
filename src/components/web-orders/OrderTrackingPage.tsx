import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Truck, ChefHat, Search, Send } from 'lucide-react';
import { toast } from 'sonner';

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
  const [sendingReport, setSendingReport] = useState(false);

  const searchOrder = (silent = false) => {
    if (!orderId.trim()) return;
    
    if (!silent) setLoading(true);
    setNotFound(false);
    
    try {
      const webOrders = JSON.parse(localStorage.getItem('ccpservices-web-orders') || '[]');
      const mainOrders = JSON.parse(localStorage.getItem('cafe-connect-orders') || '[]');
      
      let foundOrder = webOrders.find((o: WebOrder) => o.id === orderId.trim());
      
      if (!foundOrder) {
        foundOrder = mainOrders.find((o: any) => o.id === orderId.trim());
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
      if (!silent) setLoading(false);
    }
  };

  const sendReportToWhatsApp = async () => {
    if (!order) return;

    setSendingReport(true);
    try {
      const config = JSON.parse(localStorage.getItem('pdv-config') || '{}');
      const ownerPhone = config.ownerPhone || config.storePhone;

      if (!ownerPhone) {
        toast.error('Número do dono não configurado. Configure em Configurações > Geral');
        return;
      }

      const statusInfo = getStatusInfo(order.status);
      const itemsList = order.items.map((item, i) => 
        `${i + 1}. ${item.productName} - Qtd: ${item.quantity} - R$ ${(item.price * item.quantity).toFixed(2)}`
      ).join('%0A');

      const message = `*RELATÓRIO DE PEDIDO*%0A%0A` +
        `*Pedido:* ${order.id}%0A` +
        `*Cliente:* ${order.customerName}%0A` +
        `*Telefone:* ${order.customerPhone}%0A` +
        `*Status:* ${statusInfo.label}%0A` +
        `*Data/Hora:* ${new Date(order.orderTime || order.createdAt).toLocaleString('pt-BR')}%0A%0A` +
        `*ITENS DO PEDIDO:*%0A${itemsList}%0A%0A` +
        `*TOTAL: R$ ${order.total.toFixed(2)}*%0A%0A` +
        `*Endereço de Entrega:*%0A${order.customerAddress || 'Não informado'}`;

      const whatsappUrl = `https://wa.me/${ownerPhone.replace(/\D/g, '')}?text=${message}`;
      window.open(whatsappUrl, '_blank');
      
      toast.success('Abrindo WhatsApp...');
    } catch (error) {
      toast.error('Erro ao enviar relatório');
    } finally {
      setSendingReport(false);
    }
  };

  useEffect(() => {
    // Carregar dados do cliente e último pedido
    const customerData = localStorage.getItem('customer-data');
    if (customerData) {
      const data = JSON.parse(customerData);
      if (data.lastOrderId) {
        setOrderId(data.lastOrderId);
        // Auto-buscar o pedido
        setTimeout(() => {
          const input = document.querySelector('input[placeholder*="código"]') as HTMLInputElement;
          if (input) {
            input.value = data.lastOrderId;
            setOrderId(data.lastOrderId);
          }
        }, 100);
      }
    }

    // Verificar URL params
    const urlParams = new URLSearchParams(window.location.search);
    const idFromUrl = urlParams.get('id');
    if (idFromUrl) {
      setOrderId(idFromUrl);
      setTimeout(() => searchOrder(), 200);
    }
  }, []);

  useEffect(() => {
    if (!orderId || !order) return;

    const interval = setInterval(() => {
      searchOrder(true); // Silent refresh
    }, 5000);

    return () => clearInterval(interval);
  }, [orderId]);

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

              <Card>
                <CardContent className="py-6 space-y-4">
                  {order.status !== 'entregue' && (
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">
                        Tempo estimado de entrega: {order.estimatedTime || 30} minutos
                      </p>
                      <p className="text-xs text-gray-500">
                        Esta página atualiza automaticamente a cada 5 segundos
                      </p>
                    </div>
                  )}
                  
                  <Button 
                    onClick={sendReportToWhatsApp}
                    disabled={sendingReport}
                    className="w-full"
                    variant="outline"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {sendingReport ? 'Enviando...' : 'Enviar Relatório para Dono via WhatsApp'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};