import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderStatusBadge, OrderStatus } from "./OrderStatus";
import { Clock, MapPin, Home, Package, Plus, AlertTriangle, CreditCard } from "lucide-react";
import { NewOrderForm } from "./NewOrderForm";
import { OrdersHistory } from "./OrdersHistory";
import { AdvancedCheckout } from "@/components/checkout/AdvancedCheckout";
import { ordersDatabase, Order } from "@/lib/orders-database";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { toast } from "sonner";



interface OrdersPanelProps {
  onBack: () => void;
}

export const OrdersPanel = ({ onBack }: OrdersPanelProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedTab, setSelectedTab] = useState("todos");
  const [showNewOrderForm, setShowNewOrderForm] = useState(false);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutOrder, setCheckoutOrder] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);

  // Atalhos de teclado
  useKeyboardShortcuts([
    {
      key: 'n',
      ctrl: true,
      action: () => setShowNewOrderForm(true),
      description: 'Novo Pedido'
    },
    {
      key: 'h',
      ctrl: true,
      action: () => setShowHistoryPanel(true),
      description: 'Histórico'
    },
    {
      key: 'Escape',
      action: () => {
        if (showNewOrderForm) setShowNewOrderForm(false);
        else if (showHistoryPanel) setShowHistoryPanel(false);
        else if (showCheckout) setShowCheckout(false);
        else onBack();
      },
      description: 'Fechar/Voltar'
    },
    {
      key: 'F5',
      action: () => loadOrders(),
      description: 'Atualizar'
    }
  ]);

  useEffect(() => {
    try {
      loadOrders();
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
    }
  }, []);

  const loadOrders = () => {
    try {
      const allOrders = ordersDatabase.getAllOrders();
      const orderStats = ordersDatabase.getOrdersStats();
      setOrders(allOrders);
      setStats(orderStats);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
      setOrders([]);
      setStats({ total: 0, today: 0, active: 0, completed: 0 });
    }
  };

  const getTimeElapsed = (createdAt: Date): string => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60));
    if (diff < 1) return "Agora";
    if (diff < 60) return `${diff} min`;
    const hours = Math.floor(diff / 60);
    return `${hours}h ${diff % 60}min`;
  };
  
  const handleNewOrder = (orderData: any) => {
    // Verificar duplicação
    const duplicate = ordersDatabase.checkDuplicateOrder(
      orderData.cliente,
      orderData.itens,
      5 // 5 minutos de janela
    );

    if (duplicate) {
      toast.error(`Pedido similar já existe (#${duplicate.numero}) - criado há ${getTimeElapsed(duplicate.createdAt)}`);
      return;
    }

    try {
      const newOrderData = {
        tipo: orderData.tipo,
        mesa: orderData.mesa,
        endereco: orderData.endereco,
        cliente: orderData.cliente,
        telefone: orderData.telefone,
        itens: orderData.itens.map((item: any) => ({
          id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          nome: item.nome,
          quantidade: item.quantidade,
          preco: item.preco,
          observacoes: item.observacoes
        })),
        total: orderData.total,
        observacoes: orderData.observacoes
      };
      
      const newOrder = ordersDatabase.createOrder(newOrderData);

      loadOrders();
      toast.success(`Pedido #${newOrder.numero} criado com sucesso!`);
      
      setShowNewOrderForm(false);
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      toast.error('Erro ao criar pedido. Tente novamente.');
    }
  };

  const getFilteredOrders = () => {
    if (selectedTab === "todos") return orders;
    return orders.filter(order => order.tipo === selectedTab);
  };

  const getTypeIcon = (type: "local" | "delivery" | "retirada") => {
    switch (type) {
      case "local": return <Home className="h-4 w-4" />;
      case "delivery": return <MapPin className="h-4 w-4" />;
      case "retirada": return <Package className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: "local" | "delivery" | "retirada") => {
    switch (type) {
      case "local": return "Local";
      case "delivery": return "Delivery";
      case "retirada": return "Retirada";
    }
  };

  const handleCheckout = (order: Order) => {
    // Converter Order para formato compatível com CheckoutModal
    const checkoutOrderData = {
      id: order.numero.toString(),
      customerName: order.cliente,
      customerPhone: order.telefone,
      customerAddress: order.endereco,
      items: order.itens.map(item => ({
        productId: item.id,
        productName: item.nome,
        quantity: item.quantidade,
        price: item.preco,
        total: item.quantidade * item.preco
      })),
      total: order.total,
      status: order.status as any,
      type: order.tipo as any,
      table: order.mesa ? parseInt(order.mesa.replace('Mesa ', '')) : undefined,
      orderTime: new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      estimatedTime: 0,
      createdAt: order.createdAt.toISOString()
    };
    
    setCheckoutOrder(checkoutOrderData);
    setShowCheckout(true);
  };

  const handlePaymentComplete = async (orderId: string, paymentData: any) => {
    // Atualizar status do pedido para entregue/retirado
    const order = orders.find(o => o.numero.toString() === orderId);
    if (order) {
      const finalStatus = order.tipo === 'delivery' ? 'entregue' : order.tipo === 'retirada' ? 'retirado' : 'entregue';
      updateOrderStatus(order.id, finalStatus as OrderStatus);
      
      // Pagamento registrado
    }
    
    setShowCheckout(false);
    setCheckoutOrder(null);
    
    const methods = paymentData.payments 
      ? paymentData.payments.map((p: any) => p.method).join(', ')
      : paymentData.method;
    toast.success(`Pagamento processado: ${methods}`);
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const updatedOrder = ordersDatabase.updateOrderStatus(orderId, newStatus);
      
      if (!updatedOrder) {
        toast.error('Erro ao atualizar status do pedido');
        return;
      }

      loadOrders();
      toast.success(`Pedido #${updatedOrder.numero} ${newStatus}!`);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status do pedido');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gerenciamento de Pedidos</h2>
          <p className="text-muted-foreground">Acompanhe todos os pedidos em tempo real</p>
          {stats && (
            <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
              <span>Total: {stats.total}</span>
              <span>Hoje: {stats.today}</span>
              <span>Ativos: {stats.active}</span>
              <span>Finalizados: {stats.completed}</span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowHistoryPanel(true)}>
            Histórico
          </Button>
          <Button variant="pdv" onClick={() => setShowNewOrderForm(true)}>
            <Plus className="h-4 w-4" />
            Novo Pedido
          </Button>
          <Button variant="outline" onClick={onBack}>
            Voltar
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="local">Local</TabsTrigger>
          <TabsTrigger value="delivery">Delivery</TabsTrigger>
          <TabsTrigger value="retirada">Retirada</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          {getFilteredOrders().length === 0 ? (
            <Card className="p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <Package className="h-16 w-16 text-muted-foreground" />
                <div>
                  <h3 className="text-lg font-semibold">Nenhum pedido encontrado</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Clique em "Novo Pedido" para criar o primeiro pedido
                  </p>
                </div>
                <Button variant="pdv" onClick={() => setShowNewOrderForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Pedido
                </Button>
              </div>
            </Card>
          ) : (
          <div className="grid gap-4">
            {getFilteredOrders().map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        Pedido #{order.numero.toString().padStart(3, '0')}
                        <Badge variant="outline" className="flex items-center gap-1">
                          {getTypeIcon(order.tipo)}
                          {getTypeLabel(order.tipo)}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4">
                        <span>{order.cliente}</span>
                        {order.mesa && <span>• {order.mesa}</span>}
                        {order.endereco && <span>• {order.endereco}</span>}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {getTimeElapsed(order.createdAt)}
                      </Badge>
                      <OrderStatusBadge status={order.status} type={order.tipo} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {order.itens.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.quantidade}x {item.nome}</span>
                        <span>R$ {(item.quantidade * item.preco).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="font-semibold">Total: R$ {order.total.toFixed(2)}</span>
                    <div className="flex gap-2">
                      {order.status === "aceito" && (
                        <Button 
                          size="sm" 
                          variant="success"
                          onClick={() => updateOrderStatus(order.id, "preparando")}
                        >
                          Iniciar Preparo
                        </Button>
                      )}
                      {order.status === "preparando" && (
                        <Button 
                          size="sm" 
                          variant="warning"
                          onClick={() => updateOrderStatus(order.id, "pronto")}
                        >
                          Marcar Pronto
                        </Button>
                      )}
                      {order.status === "pronto" && order.tipo !== "delivery" && (
                        <Button 
                          size="sm" 
                          variant="pdv"
                          onClick={() => handleCheckout(order)}
                          className="flex items-center gap-1"
                        >
                          <CreditCard className="h-3 w-3" />
                          Checkout
                        </Button>
                      )}
                      {order.status === "pronto" && order.tipo === "delivery" && (
                        <Button 
                          size="sm" 
                          variant="warning"
                          onClick={() => updateOrderStatus(order.id, "saiu-entrega" as OrderStatus)}
                        >
                          Saiu para Entrega
                        </Button>
                      )}
                      {order.status === "saiu-entrega" && (
                        <Button 
                          size="sm" 
                          variant="success"
                          onClick={() => updateOrderStatus(order.id, "entregue" as OrderStatus)}
                        >
                          Confirmar Entrega
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          )}
        </TabsContent>
      </Tabs>
      
      {showNewOrderForm && (
        <NewOrderForm 
          onClose={() => setShowNewOrderForm(false)}
          onSubmit={handleNewOrder}
        />
      )}
      
      {showHistoryPanel && (
        <div className="fixed inset-0 bg-background z-50">
          <OrdersHistory onBack={() => setShowHistoryPanel(false)} />
        </div>
      )}
      
      <AdvancedCheckout
        open={showCheckout}
        onClose={() => {
          setShowCheckout(false);
          setCheckoutOrder(null);
        }}
        order={checkoutOrder}
        onPaymentComplete={handlePaymentComplete}
      />
    </div>
  );
};