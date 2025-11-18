import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OrderStatusBadge } from "./OrderStatus";
import { Search, Calendar, Filter, Download } from "lucide-react";
import { ordersDatabase, Order, OrderStatus, OrderType } from "@/lib/orders-database";

interface OrdersHistoryProps {
  onBack: () => void;
}

export const OrdersHistory = ({ onBack }: OrdersHistoryProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "todos">("todos");
  const [typeFilter, setTypeFilter] = useState<OrderType | "todos">("todos");
  const [dateFilter, setDateFilter] = useState<"hoje" | "semana" | "mes" | "todos">("todos");

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [orders, searchTerm, statusFilter, typeFilter, dateFilter]);

  const loadOrders = () => {
    const allOrders = ordersDatabase.getAllOrders();
    setOrders(allOrders);
  };

  const applyFilters = () => {
    let filtered = [...orders];

    // Filtro por texto
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.numero.toString().includes(searchTerm) ||
        order.itens.some(item => item.nome.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filtro por status
    if (statusFilter !== "todos") {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Filtro por tipo
    if (typeFilter !== "todos") {
      filtered = filtered.filter(order => order.tipo === typeFilter);
    }

    // Filtro por data
    if (dateFilter !== "todos") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.createdAt);
        
        switch (dateFilter) {
          case "hoje":
            return orderDate >= today;
          case "semana":
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return orderDate >= weekAgo;
          case "mes":
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return orderDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    setFilteredOrders(filtered);
  };

  const getTypeLabel = (type: OrderType) => {
    switch (type) {
      case "local": return "Local";
      case "delivery": return "Delivery";
      case "retirada": return "Retirada";
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const exportOrders = () => {
    const csvContent = [
      "Número,Cliente,Tipo,Status,Total,Data,Itens",
      ...filteredOrders.map(order => [
        order.numero,
        order.cliente,
        getTypeLabel(order.tipo),
        order.status,
        `R$ ${order.total.toFixed(2)}`,
        formatDate(order.createdAt),
        order.itens.map(item => `${item.quantidade}x ${item.nome}`).join("; ")
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `pedidos_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Histórico de Pedidos</h2>
          <p className="text-muted-foreground">
            {filteredOrders.length} de {orders.length} pedidos
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportOrders}>
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          <Button variant="outline" onClick={onBack}>
            Voltar
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cliente, número ou item..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="aceito">Aceito</SelectItem>
                  <SelectItem value="preparando">Preparando</SelectItem>
                  <SelectItem value="pronto">Pronto</SelectItem>
                  <SelectItem value="entregue">Entregue</SelectItem>
                  <SelectItem value="retirado">Retirado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo</label>
              <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="local">Local</SelectItem>
                  <SelectItem value="delivery">Delivery</SelectItem>
                  <SelectItem value="retirada">Retirada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Período</label>
              <Select value={dateFilter} onValueChange={(value) => setDateFilter(value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="hoje">Hoje</SelectItem>
                  <SelectItem value="semana">Última semana</SelectItem>
                  <SelectItem value="mes">Último mês</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de pedidos */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    Pedido #{order.numero.toString().padStart(3, '0')}
                    <Badge variant="outline">
                      {getTypeLabel(order.tipo)}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-4">
                    <span>{order.cliente}</span>
                    {order.telefone && <span>• {order.telefone}</span>}
                    {order.mesa && <span>• {order.mesa}</span>}
                    {order.endereco && <span>• {order.endereco}</span>}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(order.createdAt)}
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
                {order.completedAt && (
                  <span className="text-sm text-muted-foreground">
                    Finalizado em {formatDate(order.completedAt)}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredOrders.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">Nenhum pedido encontrado com os filtros aplicados</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};