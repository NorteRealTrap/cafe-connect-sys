import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle, ChefHat, Bell, Truck, CreditCard } from "lucide-react";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

interface Order {
  id: string;
  customerName: string;
  customerPhone?: string;
  customerAddress?: string;
  items: OrderItem[];
  total: number;
  status: "pendente" | "preparando" | "pronto" | "entregue" | "cancelado";
  type: "local" | "delivery" | "retirada";
  table?: number;
  orderTime: string;
  estimatedTime: number;
  createdAt: string;
}

interface StatusPanelProps {
  onBack: () => void;
}

const STORAGE_KEY = 'ccpservices-orders';

const getInitialOrders = (): Order[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Erro ao carregar pedidos:', error);
  }
  
  // Dados iniciais se não houver nada salvo
  return [
    {
      id: 'PED-001',
      customerName: 'João Silva',
      customerPhone: '(11) 99999-1111',
      items: [
        { productId: '1', productName: 'Hambúrguer Artesanal', quantity: 1, price: 25.90, total: 25.90 },
        { productId: '2', productName: 'Café Expresso', quantity: 2, price: 4.50, total: 9.00 }
      ],
      total: 34.90,
      status: 'preparando',
      type: 'local',
      table: 3,
      orderTime: '14:30',
      estimatedTime: 15,
      createdAt: new Date().toISOString()
    },
    {
      id: 'PED-002',
      customerName: 'Maria Santos',
      customerPhone: '(11) 88888-2222',
      customerAddress: 'Rua das Flores, 123',
      items: [
        { productId: '3', productName: 'Bolo de Chocolate', quantity: 1, price: 8.90, total: 8.90 }
      ],
      total: 8.90,
      status: 'pendente',
      type: 'delivery',
      orderTime: '14:45',
      estimatedTime: 30,
      createdAt: new Date().toISOString()
    },
    {
      id: 'PED-003',
      customerName: 'Carlos Lima',
      customerPhone: '(11) 77777-3333',
      items: [
        { productId: '1', productName: 'Café Expresso', quantity: 1, price: 4.50, total: 4.50 }
      ],
      total: 4.50,
      status: 'pronto',
      type: 'retirada',
      orderTime: '14:20',
      estimatedTime: 5,
      createdAt: new Date().toISOString()
    }
  ];
};

export const StatusPanel = ({ onBack }: StatusPanelProps) => {
  const [orders, setOrders] = useState<Order[]>(getInitialOrders);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutOrder, setCheckoutOrder] = useState<Order | null>(null);

  // Salvar no localStorage sempre que orders mudar
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  // Carregar dados do localStorage ao montar o componente
  useEffect(() => {
    const loadOrders = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsedOrders = JSON.parse(saved);
          setOrders(parsedOrders);
        }
      } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
      }
    };

    loadOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pendente": return "bg-yellow-100 text-yellow-800";
      case "preparando": return "bg-blue-100 text-blue-800";
      case "pronto": return "bg-green-100 text-green-800";
      case "entregue": return "bg-gray-100 text-gray-800";
      case "cancelado": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pendente": return <Clock className="h-4 w-4" />;
      case "preparando": return <ChefHat className="h-4 w-4" />;
      case "pronto": return <Bell className="h-4 w-4" />;
      case "entregue": return <CheckCircle className="h-4 w-4" />;
      case "cancelado": return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    setOrders(prevOrders => {
      const updatedOrders = prevOrders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      );
      // Salvar imediatamente
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedOrders));
      return updatedOrders;
    });
  };

  const getNextStatus = (currentStatus: Order["status"]): Order["status"] | null => {
    switch (currentStatus) {
      case "pendente": return "preparando";
      case "preparando": return "pronto";
      case "pronto": return "entregue";
      default: return null;
    }
  };

  const handleCheckout = (order: Order) => {
    setCheckoutOrder(order);
    setShowCheckout(true);
  };

  const handlePaymentComplete = (orderId: string, paymentData: any) => {
    updateOrderStatus(orderId, "entregue");
    setShowCheckout(false);
    setCheckoutOrder(null);
  };

  const pendingOrders = orders.filter(o => o.status === "pendente");
  const preparingOrders = orders.filter(o => o.status === "preparando");
  const readyOrders = orders.filter(o => o.status === "pronto");

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Status dos Pedidos</h2>
          <p className="text-muted-foreground">Acompanhe pedidos em tempo real</p>
        </div>
        <Button variant="outline" onClick={onBack}>
          Voltar
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingOrders.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ChefHat className="h-4 w-4 text-blue-600" />
              Preparando
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{preparingOrders.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Bell className="h-4 w-4 text-green-600" />
              Prontos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{readyOrders.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => (
          <Card key={order.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">{order.id}</CardTitle>
                  {order.type === "delivery" && <Truck className="h-4 w-4 text-muted-foreground" />}
                </div>
                <Badge className={`flex items-center gap-1 ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{order.customerName}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <p className="font-medium">Itens:</p>
                <ul className="text-muted-foreground">
                  {order.items.map((item, index) => (
                    <li key={index}>• {item.productName} (x{item.quantity})</li>
                  ))}
                </ul>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Horário</p>
                  <p className="font-medium">{order.orderTime}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total</p>
                  <p className="font-bold text-primary">R$ {order.total.toFixed(2)}</p>
                </div>
              </div>

              {order.table && (
                <div className="text-sm">
                  <p className="text-muted-foreground">Mesa: <span className="font-medium">{order.table}</span></p>
                </div>
              )}

              {order.customerPhone && (
                <div className="text-sm">
                  <p className="text-muted-foreground">Telefone: <span className="font-medium">{order.customerPhone}</span></p>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                {order.status === "pronto" && (
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
                
                {getNextStatus(order.status) && order.status !== "pronto" && (
                  <Button 
                    size="sm" 
                    variant="pdv"
                    onClick={() => updateOrderStatus(order.id, getNextStatus(order.status)!)}
                  >
                    {getNextStatus(order.status) === "preparando" && "Iniciar"}
                    {getNextStatus(order.status) === "pronto" && "Pronto"}
                    {getNextStatus(order.status) === "entregue" && "Entregar"}
                  </Button>
                )}
                
                {order.status !== "cancelado" && order.status !== "entregue" && (
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => updateOrderStatus(order.id, "cancelado")}
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <CheckoutModal
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