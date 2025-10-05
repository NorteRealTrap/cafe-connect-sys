import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, RefreshCw, Package, Clock, MapPin, Home } from "lucide-react";
import { ordersDB, Order, OrderStatus, OrderType } from "@/lib/orders-db";
import { webOrdersSync } from "@/lib/web-orders-sync";
import { NewOrderForm } from "./NewOrderForm";
import { toast } from "sonner";

interface OrdersPanelProps {
  onBack: () => void;
}

export const OrdersPanel = ({ onBack }: OrdersPanelProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState("todos");
  const [showNewOrder, setShowNewOrder] = useState(false);

  const loadData = () => {
    try {
      setOrders(ordersDB.getAll());
      setStats(ordersDB.getStats());
    } catch (error) {
      console.error('Erro ao carregar:', error);
      toast.error('Erro ao carregar pedidos');
    }
  };

  useEffect(() => {
    loadData();
    
    // Iniciar sincronização automática de pedidos web
    const stopSync = webOrdersSync.startAutoSync();
    
    const handleChange = () => loadData();
    window.addEventListener('orders-changed', handleChange);
    
    return () => {
      window.removeEventListener('orders-changed', handleChange);
      stopSync();
    };
  }, []);

  const handleNewOrder = (data: any) => {
    try {
      ordersDB.create({
        tipo: data.tipo,
        mesa: data.mesa,
        endereco: data.endereco,
        cliente: data.cliente,
        telefone: data.telefone,
        itens: data.itens,
        total: data.total,
        observacoes: data.observacoes
      });
      
      toast.success('Pedido criado com sucesso!');
      setShowNewOrder(false);
      loadData();
    } catch (error) {
      toast.error('Erro ao criar pedido');
    }
  };

  const updateStatus = (id: string, status: OrderStatus) => {
    try {
      ordersDB.updateStatus(id, status);
      
      // Sincronizar status de volta para pedidos web
      webOrdersSync.syncStatusToWeb(id, status);
      
      toast.success('Status atualizado!');
      loadData();
    } catch (error) {
      toast.error('Erro ao atualizar status');
    }
  };

  const getFilteredOrders = () => {
    if (selectedTab === "todos") return orders;
    return orders.filter(o => o.tipo === selectedTab);
  };

  const getTypeIcon = (type: OrderType) => {
    if (type === "local") return <Home className="h-4 w-4" />;
    if (type === "delivery") return <MapPin className="h-4 w-4" />;
    return <Package className="h-4 w-4" />;
  };

  const getStatusColor = (status: OrderStatus) => {
    if (status === "pendente") return "secondary";
    if (status === "preparando") return "warning";
    if (status === "pronto") return "success";
    if (status === "entregue") return "default";
    return "destructive";
  };

  const getTimeElapsed = (createdAt: string) => {
    const diff = Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000);
    if (diff < 1) return "Agora";
    if (diff < 60) return `${diff} min`;
    return `${Math.floor(diff / 60)}h ${diff % 60}min`;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gerenciamento de Pedidos</h2>
          <p className="text-muted-foreground">Acompanhe todos os pedidos</p>
          {stats && (
            <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
              <span>Total: {stats.total}</span>
              <span>Hoje: {stats.today}</span>
              <span>Pendentes: {stats.pendente}</span>
              <span>Preparando: {stats.preparando}</span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={loadData}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="pdv" onClick={() => setShowNewOrder(true)}>
            <Plus className="h-4 w-4 mr-2" />
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
              <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">Nenhum pedido encontrado</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Clique em "Novo Pedido" para criar
              </p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {getFilteredOrders().map((order) => (
                <Card key={order.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          Pedido #{order.numero.toString().padStart(3, '0')}
                          <Badge variant="outline" className="flex items-center gap-1">
                            {getTypeIcon(order.tipo)}
                            {order.tipo}
                          </Badge>
                          {order.observacoes?.includes('Pedido Web') && (
                            <Badge variant="secondary" className="text-xs">
                              WEB
                            </Badge>
                          )}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {order.cliente}
                          {order.mesa && ` • ${order.mesa}`}
                          {order.endereco && ` • ${order.endereco}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {getTimeElapsed(order.createdAt)}
                        </Badge>
                        <Badge variant={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {order.itens.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span>{item.quantidade}x {item.nome}</span>
                          <span>R$ {(item.quantidade * item.preco).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="font-semibold">Total: R$ {order.total.toFixed(2)}</span>
                      <div className="flex gap-2">
                        {order.status === "pendente" && (
                          <Button size="sm" onClick={() => updateStatus(order.id, "preparando")}>
                            Iniciar Preparo
                          </Button>
                        )}
                        {order.status === "preparando" && (
                          <Button size="sm" variant="warning" onClick={() => updateStatus(order.id, "pronto")}>
                            Marcar Pronto
                          </Button>
                        )}
                        {order.status === "pronto" && (
                          <Button size="sm" variant="success" onClick={() => updateStatus(order.id, "entregue")}>
                            Finalizar
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

      {showNewOrder && (
        <NewOrderForm 
          onClose={() => setShowNewOrder(false)}
          onSubmit={handleNewOrder}
        />
      )}
    </div>
  );
};
