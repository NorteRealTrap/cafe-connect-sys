import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle, ChefHat, Bell, Truck } from "lucide-react";
import { useOrders } from "@/hooks/useDatabase";
import type { Order } from "@/lib/database";

interface StatusPanelProps {
  onBack: () => void;
}

export const StatusPanel = ({ onBack }: StatusPanelProps) => {
  const { orders, updateOrder } = useOrders();

  // Force re-render when component mounts to ensure fresh data
  useEffect(() => {
    // This ensures the component gets the latest data from localStorage
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
    updateOrder(orderId, { status: newStatus });
  };

  const getNextStatus = (currentStatus: Order["status"]): Order["status"] | null => {
    switch (currentStatus) {
      case "pendente": return "preparando";
      case "preparando": return "pronto";
      case "pronto": return "entregue";
      default: return null;
    }
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
                {getNextStatus(order.status) && (
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
    </div>
  );
};