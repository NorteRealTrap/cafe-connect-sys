import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Minus, ShoppingCart, MapPin, Phone, User } from 'lucide-react';
import { toast } from 'sonner';

export const WebOrderPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ['todos', 'Bebidas', 'Lanches', 'Doces', 'Bar'];

  useEffect(() => {
    const data = localStorage.getItem('ccpservices-products');
    setProducts(data ? JSON.parse(data) : []);
  }, []);

  const getFilteredProducts = () => {
    if (selectedCategory === 'todos') {
      return products.filter(p => p.available);
    }
    return products.filter(p => p.category === selectedCategory && p.available);
  };

  const addItem = (product: any) => {
    const existing = selectedItems.find(item => item.productId === product.id);
    if (existing) {
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
      toast.error('Adicione pelo menos um item');
      return;
    }

    setIsSubmitting(true);

    try {
      const webOrder = {
        id: `WEB-${Date.now()}`,
        numero: Date.now() % 10000,
        customerName: customerData.name,
        customerPhone: customerData.phone,
        customerAddress: customerData.address,
        cliente: customerData.name,
        telefone: customerData.phone,
        endereco: customerData.address,
        items: selectedItems,
        itens: selectedItems.map(item => ({
          id: item.productId,
          nome: item.productName,
          quantidade: item.quantity,
          preco: item.price
        })),
        total: getTotal(),
        status: 'pendente',
        tipo: 'delivery',
        createdAt: new Date().toISOString(),
        observacoes: customerData.notes
      };

      // Salvar em ambos os storages
      const webOrders = JSON.parse(localStorage.getItem('ccpservices-web-orders') || '[]');
      webOrders.push(webOrder);
      localStorage.setItem('ccpservices-web-orders', JSON.stringify(webOrders));

      const mainOrders = JSON.parse(localStorage.getItem('cafe-connect-orders') || '[]');
      mainOrders.unshift(webOrder);
      localStorage.setItem('cafe-connect-orders', JSON.stringify(mainOrders));

      toast.success(`Pedido enviado! Código: ${webOrder.id}`);
      
      setSelectedItems([]);
      setCustomerData({ name: '', phone: '', address: '', notes: '' });
      
    } catch (error) {
      toast.error('Erro ao enviar pedido');
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
            Faça seu pedido online
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Cardápio
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
                    {getFilteredProducts().length === 0 ? (
                      <p className="text-center py-8 text-gray-500">
                        Nenhum produto disponível
                      </p>
                    ) : (
                      getFilteredProducts().map((product) => (
                        <div key={product.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
                          {product.image && (
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                          )}
                          <div className="flex-1">
                            <h3 className="font-medium">{product.name}</h3>
                            <p className="text-sm text-gray-600">{product.description}</p>
                            <p className="text-lg font-bold text-green-600">R$ {product.price.toFixed(2)}</p>
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => addItem(product)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    )}
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
                      onChange={(e) => setCustomerData(prev => ({ ...prev, name: e.target.value }))}
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
                      onChange={(e) => setCustomerData(prev => ({ ...prev, phone: e.target.value }))}
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
                      onChange={(e) => setCustomerData(prev => ({ ...prev, address: e.target.value }))}
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
                    onChange={(e) => setCustomerData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Observações (opcional)"
                  />
                </div>

                <Button 
                  onClick={handleSubmit}
                  disabled={selectedItems.length === 0 || isSubmitting}
                  className="w-full h-12 text-lg"
                  size="lg"
                >
                  {isSubmitting ? 'Enviando...' : `Finalizar Pedido - R$ {getTotal().toFixed(2)}`}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
