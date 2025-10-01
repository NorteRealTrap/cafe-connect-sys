import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderStatusBadge, OrderStatus } from "./OrderStatus";
import { Clock, MapPin, Home, Package, Plus } from "lucide-react";

interface Order {
  id: string;
  numero: number;
  tipo: "local" | "delivery" | "retirada";
  status: OrderStatus;
  mesa?: string;
  cliente: string;
  itens: Array<{
    nome: string;
    quantidade: number;
    preco: number;
    observacoes?: string;
  }>;
  total: number;
  tempo: string;
  endereco?: string;
}

const sampleOrders: Order[] = [
  {
    id: "1",
    numero: 1,
    tipo: "local",
    status: "preparando",
    mesa: "Mesa 5",
    cliente: "João Silva",
    itens: [
      { nome: "Hambúrguer Artesanal", quantidade: 2, preco: 28.90 },
      { nome: "Batata Frita", quantidade: 1, preco: 12.90 },
      { nome: "Refrigerante 350ml", quantidade: 2, preco: 6.50 }
    ],
    total: 75.20,
    tempo: "15 min"
  },
  {
    id: "2",
    numero: 2,
    tipo: "delivery",
    status: "aceito",
    cliente: "Maria Santos",
    endereco: "Rua das Flores, 123",
    itens: [
      { nome: "Pizza Margherita", quantidade: 1, preco: 42.90 },
      { nome: "Coca-Cola 600ml", quantidade: 1, preco: 8.90 }
    ],
    total: 51.80,
    tempo: "5 min"
  },
  {
    id: "3",
    numero: 3,
    tipo: "retirada",
    status: "pronto",
    cliente: "Carlos Lima",
    itens: [
      { nome: "Açaí 500ml", quantidade: 1, preco: 18.50 },
      { nome: "Granola", quantidade: 1, preco: 3.50 }
    ],
    total: 22.00,
    tempo: "2 min"
  }
];

interface OrdersPanelProps {
  onBack: () => void;
}

export const OrdersPanel = ({ onBack }: OrdersPanelProps) => {
  const [orders, setOrders] = useState<Order[]>(sampleOrders);
  const [selectedTab, setSelectedTab] = useState("todos");
  
  const addNewOrder = () => {
    const newOrder: Order = {
      id: Date.now().toString(),
      numero: orders.length + 1,
      tipo: "local",
      status: "aceito",
      mesa: `Mesa ${Math.floor(Math.random() * 20) + 1}`,
      cliente: "Novo Cliente",
      itens: [
        { nome: "Item Exemplo", quantidade: 1, preco: 25.90 }
      ],
      total: 25.90,
      tempo: "Agora"
    };
    setOrders(prev => [newOrder, ...prev]);
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

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gerenciamento de Pedidos</h2>
          <p className="text-muted-foreground">Acompanhe todos os pedidos em tempo real</p>
        </div>
        <div className="flex gap-2">
          <Button variant="pdv" onClick={addNewOrder}>
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
                        {order.tempo}
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
                      {order.status === "pronto" && order.tipo === "delivery" && (
                        <Button 
                          size="sm" 
                          variant="info"
                          onClick={() => updateOrderStatus(order.id, "entregue")}
                        >
                          Marcar Entregue
                        </Button>
                      )}
                      {order.status === "pronto" && order.tipo === "retirada" && (
                        <Button 
                          size="sm" 
                          variant="info"
                          onClick={() => updateOrderStatus(order.id, "retirado")}
                        >
                          Marcar Retirado
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};