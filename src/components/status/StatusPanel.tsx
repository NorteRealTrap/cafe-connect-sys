import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { OrderStatusBadge } from "@/components/orders/OrderStatus";

interface StatusPanelProps {
  onBack: () => void;
}

interface OrderTracking {
  id: string;
  customerName: string;
  items: string[];
  status: "aceito" | "preparando" | "pronto" | "entregue" | "retirado";
  type: "local" | "delivery" | "retirada";
  estimatedTime: string;
  currentTime: string;
}

const mockTracking: OrderTracking[] = [
  {
    id: "PDV-001",
    customerName: "João Silva",
    items: ["Hambúrguer Especial", "Batata Frita"],
    status: "preparando",
    type: "local",
    estimatedTime: "15 min",
    currentTime: "8 min"
  },
  {
    id: "PDV-002", 
    customerName: "Maria Santos",
    items: ["Pizza Margherita", "Refrigerante"],
    status: "pronto",
    type: "retirada",
    estimatedTime: "20 min",
    currentTime: "18 min"
  },
  {
    id: "PDV-003",
    customerName: "Carlos Lima",
    items: ["Lasanha", "Salada Caesar"],
    status: "aceito",
    type: "delivery",
    estimatedTime: "35 min",
    currentTime: "2 min"
  }
];

export const StatusPanel = ({ onBack }: StatusPanelProps) => {
  const [orders, setOrders] = useState<OrderTracking[]>(mockTracking);

  // Simular atualização em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders(prevOrders => 
        prevOrders.map(order => {
          const currentMinutes = parseInt(order.currentTime);
          const estimatedMinutes = parseInt(order.estimatedTime);
          
          if (currentMinutes < estimatedMinutes) {
            return {
              ...order,
              currentTime: `${currentMinutes + 1} min`
            };
          }
          return order;
        })
      );
    }, 10000); // Atualiza a cada 10 segundos para demonstração

    return () => clearInterval(interval);
  }, []);

  const updateOrderStatus = (orderId: string, newStatus: OrderTracking["status"]) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const getProgressPercentage = (current: string, estimated: string) => {
    const currentMin = parseInt(current);
    const estimatedMin = parseInt(estimated);
    return Math.min((currentMin / estimatedMin) * 100, 100);
  };

  const getTypeLabel = (type: OrderTracking["type"]) => {
    const labels = {
      local: "Mesa",
      delivery: "Delivery", 
      retirada: "Retirada"
    };
    return labels[type];
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold">Status dos Pedidos - Tempo Real</h1>
      </div>

      <div className="grid gap-4">
        {orders.map((order) => (
          <Card key={order.id} className="hover:shadow-pdv transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <CardTitle className="text-lg">{order.id}</CardTitle>
                  <span className="text-muted-foreground">{getTypeLabel(order.type)}</span>
                </div>
                <OrderStatusBadge status={order.status} type={order.type} />
              </div>
              <p className="text-sm text-muted-foreground">Cliente: {order.customerName}</p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="text-sm">
                <span className="font-medium">Items:</span> {order.items.join(", ")}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Tempo: {order.currentTime} / {order.estimatedTime}</span>
                  </div>
                  <span className="text-muted-foreground">
                    {getProgressPercentage(order.currentTime, order.estimatedTime).toFixed(0)}%
                  </span>
                </div>
                
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage(order.currentTime, order.estimatedTime)}%` }}
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                {order.status === "aceito" && (
                  <Button 
                    size="sm" 
                    onClick={() => updateOrderStatus(order.id, "preparando")}
                  >
                    Iniciar Preparo
                  </Button>
                )}
                {order.status === "preparando" && (
                  <Button 
                    size="sm" 
                    variant="success"
                    onClick={() => updateOrderStatus(order.id, "pronto")}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Marcar como Pronto
                  </Button>
                )}
                {order.status === "pronto" && order.type === "retirada" && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => updateOrderStatus(order.id, "retirado")}
                  >
                    Confirmar Retirada
                  </Button>
                )}
                {order.status === "pronto" && order.type === "delivery" && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => updateOrderStatus(order.id, "entregue")}
                  >
                    Confirmar Entrega
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};