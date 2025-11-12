import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, RefreshCw, Package, Clock } from "lucide-react";
import { toast } from "sonner";

const STORAGE_KEY = 'cafe-connect-orders';

interface OrdersPanelProps {
  onBack: () => void;
}

export const OrdersPanel = ({ onBack }: OrdersPanelProps) => {
  const [orders, setOrders] = useState<any[]>([]);

  const loadOrders = () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      const parsed = data ? JSON.parse(data) : [];
      const sorted = Array.isArray(parsed) ? parsed.sort((a: any, b: any) => 
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      ) : [];
      setOrders(sorted);
    } catch (error) {
      console.error('Erro:', error);
      setOrders([]);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = (id: string, newStatus: string) => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      const parsed = data ? JSON.parse(data) : [];
      const updated = parsed.map((o: any) => 
        o.id === id ? { ...o, status: newStatus } : o
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      loadOrders();
      toast.success('Status atualizado!');
    } catch (error) {
      toast.error('Erro ao atualizar');
    }
  };

  const getTime = (createdAt: string) => {
    try {
      const diff = Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000);
      if (diff < 1) return "Agora";
      if (diff < 60) return `${diff}min`;
      return `${Math.floor(diff / 60)}h`;
    } catch {
      return "—";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Pedidos</h2>
          <p className="text-muted-foreground">Total: {orders.length}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={loadOrders}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={onBack}>
            Voltar
          </Button>
        </div>
      </div>

      {orders.length === 0 ? (
        <Card className="p-12 text-center">
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">Nenhum pedido</h3>
        </Card>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      #{order.numero || order.id?.slice(-6) || '000'}
                      <Badge variant="outline">{order.tipo || 'delivery'}</Badge>
                      {order.id?.startsWith('WEB-') && <Badge variant="secondary">WEB</Badge>}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {order.cliente || order.customerName || 'Cliente'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      <Clock className="h-3 w-3 mr-1" />
                      {getTime(order.createdAt)}
                    </Badge>
                    <Badge>{order.status || 'pendente'}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {(order.itens || order.items || []).map((item: any, idx: number) => {
                    const qtd = Number(item.quantidade || item.quantity) || 0;
                    const preco = Number(item.preco || item.price) || 0;
                    return (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>{qtd}x {item.nome || item.productName || 'Item'}</span>
                        <span>R$ {(qtd * preco).toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="font-semibold">
                    Total: R$ {(Number(order.total) || 0).toFixed(2)}
                  </span>
                  <div className="flex gap-2">
                    {(order.status === 'pendente' || order.status === 'web-pendente') && (
                      <Button size="sm" onClick={() => updateStatus(order.id, 'preparando')}>
                        Iniciar
                      </Button>
                    )}
                    {order.status === 'preparando' && (
                      <Button size="sm" onClick={() => updateStatus(order.id, 'pronto')}>
                        Pronto
                      </Button>
                    )}
                    {order.status === 'pronto' && (
                      <Button size="sm" onClick={() => updateStatus(order.id, 'entregue')}>
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
    </div>
  );
};
