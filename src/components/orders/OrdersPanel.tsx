import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, RefreshCw, Package, Clock, MapPin, Home, AlertTriangle } from "lucide-react";
import { ordersDB, Order, OrderStatus, OrderType } from "@/lib/orders-db";
import { webOrdersSync } from "@/lib/web-orders-sync";
import { NewOrderForm } from "./NewOrderForm";
import { toast } from "sonner";
import { storageMigration } from "@/lib/storage-migration";

interface OrdersPanelProps {
  onBack: () => void;
}

const isValidOrder = (order: any): boolean => {
  try {
    return (
      order &&
      typeof order.id === 'string' &&
      typeof order.numero === 'number' &&
      typeof order.cliente === 'string' &&
      Array.isArray(order.itens) &&
      order.itens.every((item: any) => 
        item &&
        typeof item.nome === 'string' &&
        !isNaN(Number(item.quantidade)) &&
        !isNaN(Number(item.preco)) &&
        Number(item.quantidade) > 0 &&
        Number(item.preco) >= 0
      ) &&
      !isNaN(Number(order.total))
    );
  } catch {
    return false;
  }
};

const sanitizeOrder = (order: any): Order | null => {
  try {
    if (!isValidOrder(order)) {
      console.warn('Pedido inválido:', order);
      return null;
    }

    return {
      ...order,
      total: Number(order.total) || 0,
      itens: order.itens.map((item: any) => ({
        ...item,
        quantidade: Number(item.quantidade) || 0,
        preco: Number(item.preco) || 0
      }))
    };
  } catch (error) {
    console.error('Erro ao sanitizar:', error);
    return null;
  }
};

export const OrdersPanel = ({ onBack }: OrdersPanelProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState("todos");
  const [showNewOrder, setShowNewOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = () => {
    try {
      setError(null);
      
      const allOrders = ordersDB.getAll();
      const validOrders = allOrders
        .map(sanitizeOrder)
        .filter((order): order is Order => order !== null);

      if (validOrders.length < allOrders.length) {
        const lostCount = allOrders.length - validOrders.length;
        console.warn(`${lostCount} pedido(s) inválido(s) removidos`);
        toast.warning(`${lostCount} pedido(s) corrompidos ignorados`);
      }

      setOrders(validOrders);
      setStats(ordersDB.getStats());

    } catch (error) {
      console.error('Erro ao carregar:', error);
      setError('Erro ao carregar pedidos. Dados corrompidos.');
      setOrders([]);
      setStats({ total: 0, today: 0, pendente: 0, preparando: 0 });
    }
  };

  const handleClearData = () => {
    if (confirm('⚠️ Isso irá limpar TODOS os dados. Continuar?')) {
      try {
        storageMigration.forceCleanup();
        setOrders([]);
        setStats(null);
        setError(null);
        toast.success('Dados limpos!');
        setTimeout(() => window.location.reload(), 1000);
      } catch (error) {
        toast.error('Erro ao limpar');
      }
    }
  };

  useEffect(() => {
    let mounted = true;
    let stopSync: (() => void) | undefined;

    const initialize = async () => {
      if (!mounted) return;

      try {
        loadData();
        
        try {
          stopSync = webOrdersSync.startAutoSync();
        } catch (syncError) {
          console.error('Erro sync:', syncError);
        }
      } catch (error) {
        console.error('Erro init:', error);
        if (mounted) {
          setError('Erro ao inicializar. Clique em "Limpar Dados".');
        }
      }
    };

    initialize();
    
    const handleChange = () => {
      if (mounted) {
        try {
          loadData();
        } catch (error) {
          console.error('Erro reload:', error);
        }
      }
    };
    
    window.addEventListener('orders-changed', handleChange);
    
    return () => {
      mounted = false;
      window.removeEventListener('orders-changed', handleChange);
      if (stopSync) stopSync();
    };
  }, []);

  const handleNewOrder = (data: any) => {
    try {
      if (!data.cliente?.trim()) {
        toast.error('Nome obrigatório');
        return;
      }

      if (!Array.isArray(data.itens) || data.itens.length === 0) {
        toast.error('Adicione itens');
        return;
      }

      const invalidItems = data.itens.some((item: any) => 
        !item.nome || 
        isNaN(Number(item.quantidade)) || 
        isNaN(Number(item.preco)) ||
        Number(item.quantidade) <= 0
      );

      if (invalidItems) {
        toast.error('Itens inválidos');
        return;
      }

      ordersDB.create({
        tipo: data.tipo,
        mesa: data.mesa,
        endereco: data.endereco,
        cliente: data.cliente.trim(),
        telefone: data.telefone?.trim() || '',
        itens: data.itens.map((item: any) => ({
          ...item,
          quantidade: Number(item.quantidade),
          preco: Number(item.preco)
        })),
        total: Number(data.total),
        observacoes: data.observacoes
      });
      
      toast.success('Pedido criado!');
      setShowNewOrder(false);
      loadData();
    } catch (error) {
      console.error('Erro criar:', error);
      toast.error('Erro ao criar pedido');
    }
  };

  const updateStatus = (id: string, status: OrderStatus) => {
    try {
      const order = orders.find(o => o.id === id);
      if (!order) {
        toast.error('Pedido não encontrado');
        return;
      }

      ordersDB.updateStatus(id, status);
      
      try {
        webOrdersSync.syncStatusToWeb(id, status);
      } catch (syncError) {
        console.warn('Erro sync status:', syncError);
      }
      
      toast.success('Status atualizado!');
      loadData();
    } catch (error) {
      console.error('Erro status:', error);
      toast.error('Erro ao atualizar');
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

  const getStatusColor = (status: OrderStatus): "default" | "secondary" | "destructive" | "outline" | "success" | "warning" => {
    if (status === "pendente") return "secondary";
    if (status === "preparando") return "warning";
    if (status === "pronto") return "success";
    if (status === "entregue") return "default";
    return "destructive";
  };

  const getTimeElapsed = (createdAt: string) => {
    try {
      const diff = Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000);
      if (diff < 1) return "Agora";
      if (diff < 60) return `${diff} min`;
      return `${Math.floor(diff / 60)}h ${diff % 60}min`;
    } catch {
      return "—";
    }
  };

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <Card className="p-12 text-center border-destructive">
          <div className="flex flex-col items-center gap-4">
            <AlertTriangle className="h-16 w-16 text-destructive" />
            <div>
              <h3 className="text-lg font-semibold">Erro ao Carregar Pedidos</h3>
              <p className="text-sm text-muted-foreground mt-2">{error}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="destructive" onClick={handleClearData}>
                <AlertTriangle className="h-4 w-4 mr-2" />
                Limpar Dados
              </Button>
              <Button variant="outline" onClick={() => {
                setError(null);
                loadData();
              }}>
                Tentar Novamente
              </Button>
              <Button variant="outline" onClick={onBack}>
                Voltar
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gerenciamento de Pedidos</h2>
          <p className="text-muted-foreground">Acompanhe todos os pedidos</p>
          {stats && (
            <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
              <span>Total: {stats.total || 0}</span>
              <span>Hoje: {stats.today || 0}</span>
              <span>Pendentes: {stats.pendente || 0}</span>
              <span>Preparando: {stats.preparando || 0}</span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={loadData} title="Recarregar">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="sm" onClick={handleClearData} title="Limpar dados">
            <AlertTriangle className="h-4 w-4" />
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
                      {order.itens.map((item, idx) => {
                        const quantidade = Number(item.quantidade) || 0;
                        const preco = Number(item.preco) || 0;
                        const subtotal = quantidade * preco;
                        
                        return (
                          <div key={idx} className="flex justify-between text-sm">
                            <span>{quantidade}x {item.nome || 'Item sem nome'}</span>
                            <span>R$ {subtotal.toFixed(2)}</span>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="font-semibold">
                        Total: R$ {(Number(order.total) || 0).toFixed(2)}
                      </span>
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
