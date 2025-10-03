import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Minus, ShoppingCart, MapPin, Phone, User, CheckCircle, Clock, Truck, ChefHat } from 'lucide-react';
import { useProducts } from '@/hooks/useDatabase';
import { useAutoSave } from '@/lib/persistence';
import { useRealtime, useRealtimeNotifications } from '@/lib/realtime';
import { useCrossDeviceSync } from '@/lib/sync';
import { toast } from 'sonner';

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export const WebOrderPage: React.FC = () => {
  const { products } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
  const { data: customerData, updateField, resetForm } = useAutoSave('web-order-form', {
    name: '',
    phone: '',
    address: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerOrders, setCustomerOrders] = useRealtime<any[]>('customer-orders-history', []);
  const { requestNotificationPermission } = useRealtimeNotifications();
  const { saveWebOrder } = useCrossDeviceSync();
  const [showOrderHistory, setShowOrderHistory] = useState(false);

  const categories = ['todos', 'Bebidas', 'Lanches', 'Doces', 'Bar'];

  useEffect(() => {
    loadCustomerOrders();
    requestNotificationPermission();
  }, [customerData.phone, requestNotificationPermission]);

  const loadCustomerOrders = () => {
    if (!customerData.phone) return;
    
    const webOrders = JSON.parse(localStorage.getItem('ccpservices-web-orders') || '[]');
    const mainOrders = JSON.parse(localStorage.getItem('cafe-connect-orders') || '[]');
    
    const allOrders = [...webOrders, ...mainOrders.filter((o: any) => o.source === 'web')];
    const phoneOrders = allOrders.filter((order: any) => 
      order.customerPhone === customerData.phone
    ).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    setCustomerOrders(phoneOrders);
    if (phoneOrders.length > 0) setShowOrderHistory(true);
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'web-pendente':
        return { label: 'Aguardando', color: 'bg-yellow-500', icon: Clock };
      case 'aceito':
      case 'preparando':
        return { label: 'Preparando', color: 'bg-blue-500', icon: ChefHat };
      case 'pronto':
        return { label: 'Saiu para Entrega', color: 'bg-orange-500', icon: Truck };
      case 'entregue':
        return { label: 'Entregue', color: 'bg-green-500', icon: CheckCircle };
      default:
        return { label: status, color: 'bg-gray-500', icon: Clock };
    }
  };
  
  const getFilteredProducts = () => {
    if (selectedCategory === 'todos') {
      return products.filter(p => p.available);
    }
    return products.filter(p => p.category === selectedCategory && p.available);
  };

  const addItem = (product: any) => {
    const existingItem = selectedItems.find(item => item.productId === product.id);
    if (existingItem) {
      setSelectedItems(prev => prev.map(item => 
        item.productId === product.id 
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
          : item
      ));
    } else {
      setSelectedItems(prev => [...prev, {
        productId: product.id,
        productName: product.name,
        quantity: 1,
        price: product.price,
        total: product.price
      }]);
    }
  };

  const updateQuantity = (productId: string, change: number) => {
    setSelectedItems(prev => prev.map(item => {
      if (item.productId === productId) {
        const newQuantity = Math.max(0, item.quantity + change);
        return newQuantity > 0 
          ? { ...item, quantity: newQuantity, total: newQuantity * item.price }
          : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const getTotal = () => {
    return selectedItems.reduce((sum, item) => sum + item.total, 0);
  };

  const handleSubmit = async () => {
    if (!customerData.name.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }

    if (!customerData.phone.trim()) {
      toast.error('Telefone é obrigatório');
      return;
    }

    if (!customerData.address.trim()) {
      toast.error('Endereço é obrigatório');
      return;
    }

    if (selectedItems.length === 0) {
      toast.error('Adicione pelo menos um item ao pedido');
      return;
    }

    setIsSubmitting(true);

    try {
      const webOrder = {
        id: `WEB-${Date.now()}`,
        customerName: customerData.name,
        customerPhone: customerData.phone,
        customerAddress: customerData.address,
        items: selectedItems.map(item => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          price: item.price,
          total: item.total
        })),
        total: getTotal(),
        status: 'web-pendente',
        type: 'delivery',
        orderTime: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        estimatedTime: 45,
        createdAt: new Date().toISOString(),
        source: 'web'
      };

      // Usar sistema de sincronização entre dispositivos
      await saveWebOrder(webOrder);
      
      window.dispatchEvent(new CustomEvent('newWebOrder', { detail: webOrder }));
      window.dispatchEvent(new CustomEvent('orderStatusChanged', { 
        detail: { orderId: webOrder.id, status: 'web-pendente' } 
      }));

      toast.success(`Pedido enviado! Código: ${webOrder.id}`);
      
      setSelectedItems([]);
      setCustomerOrders(prev => [webOrder, ...prev]);
      setShowOrderHistory(true);
      resetForm();
      
    } catch (error) {
      toast.error('Erro ao enviar pedido. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Café Connect
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Faça seu pedido online e receba em casa
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {showOrderHistory && customerOrders.length > 0 && (
            <div className="lg:col-span-2 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Seus Pedidos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {customerOrders.slice(0, 3).map((order) => {
                      const statusInfo = getStatusInfo(order.status);
                      const StatusIcon = statusInfo.icon;
                      return (
                        <div key={order.id} className="flex items-center justify-between p-3 border rounded">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-sm">{order.id}</p>
                              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs text-white ${statusInfo.color}`}>
                                <StatusIcon className="h-3 w-3" />
                                {statusInfo.label}
                              </div>
                            </div>
                            <p className="text-xs text-gray-600">
                              {order.items?.length || 0} itens • R$ {order.total.toFixed(2)} • {order.orderTime}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Nosso Cardápio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                <TabsList className="grid w-full grid-cols-5 mb-4">
                  {categories.map((category) => (
                    <TabsTrigger key={category} value={category} className="text-xs">
                      {category === 'todos' ? 'Todos' : category}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value={selectedCategory}>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {getFilteredProducts().map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                        <div className="flex-1">
                          <h3 className="font-medium">{product.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{product.description}</p>
                          <p className="text-lg font-bold text-green-600">R$ {product.price.toFixed(2)}</p>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => addItem(product)}
                          className="ml-4"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Seu Pedido
                  <Badge variant="secondary">{selectedItems.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {selectedItems.map((item) => (
                    <div key={item.productId} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex-1">
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-gray-600">
                          R$ {item.price.toFixed(2)} × {item.quantity} = R$ {item.total.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => updateQuantity(item.productId, -1)}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => updateQuantity(item.productId, 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {selectedItems.length === 0 && (
                    <p className="text-center py-8 text-gray-500">
                      Nenhum item selecionado
                    </p>
                  )}
                </div>
                
                {selectedItems.length > 0 && (
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-green-600">R$ {getTotal().toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dados para Entrega</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      value={customerData.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      placeholder="Seu nome completo"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      value={customerData.phone}
                      onChange={(e) => {
                        const phone = e.target.value;
                        updateField('phone', phone);
                        if (phone.length >= 10) {
                          setTimeout(loadCustomerOrders, 500);
                        }
                      }}
                      placeholder="(11) 99999-9999"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Endereço Completo *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="address"
                      value={customerData.address}
                      onChange={(e) => updateField('address', e.target.value)}
                      placeholder="Rua, número, bairro, cidade"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Input
                    id="notes"
                    value={customerData.notes}
                    onChange={(e) => updateField('notes', e.target.value)}
                    placeholder="Observações sobre o pedido (opcional)"
                  />
                </div>

                <Button 
                  onClick={handleSubmit}
                  disabled={selectedItems.length === 0 || isSubmitting}
                  className="w-full h-12 text-lg"
                  size="lg"
                >
                  {isSubmitting ? 'Enviando...' : `Finalizar Pedido - R$ ${getTotal().toFixed(2)}`}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};