import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Minus } from "lucide-react";
import { toast } from "sonner";

interface MenuItem {
  id: string;
  nome: string;
  preco: number;
  categoria: string;
}

interface OrderItem {
  id: string;
  nome: string;
  quantidade: number;
  preco: number;
}

interface NewOrderFormProps {
  onClose: () => void;
  onSubmit: (order: any) => void;
}

const menuItems: MenuItem[] = [
  { id: "1", nome: "Hambúrguer Artesanal", preco: 28.90, categoria: "lanchonete" },
  { id: "2", nome: "Pizza Margherita", preco: 42.90, categoria: "restaurante" },
  { id: "3", nome: "Açaí 500ml", preco: 18.50, categoria: "confeitaria" },
  { id: "4", nome: "Café Espresso", preco: 4.50, categoria: "cafeteria" },
  { id: "5", nome: "Batata Frita", preco: 12.90, categoria: "lanchonete" },
  { id: "6", nome: "Refrigerante 350ml", preco: 6.50, categoria: "bebidas" }
];

export const NewOrderForm = ({ onClose, onSubmit }: NewOrderFormProps) => {
  const [orderData, setOrderData] = useState({
    cliente: "",
    telefone: "",
    tipo: "local" as "local" | "delivery" | "retirada",
    mesa: "",
    endereco: ""
  });
  
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);

  const addItem = (menuItem: MenuItem) => {
    const existingItem = selectedItems.find(item => item.id === menuItem.id);
    if (existingItem) {
      setSelectedItems(prev => prev.map(item => 
        item.id === menuItem.id 
          ? { ...item, quantidade: item.quantidade + 1 }
          : item
      ));
    } else {
      setSelectedItems(prev => [...prev, {
        id: menuItem.id,
        nome: menuItem.nome,
        quantidade: 1,
        preco: menuItem.preco
      }]);
    }
  };

  const updateQuantity = (id: string, change: number) => {
    setSelectedItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantidade + change;
        return newQuantity > 0 ? { ...item, quantidade: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantidade > 0));
  };

  const getTotal = () => {
    return selectedItems.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
  };

  const handleSubmit = () => {
    if (!orderData.cliente || selectedItems.length === 0) {
      toast.error("Preencha o cliente e adicione pelo menos um item");
      return;
    }

    if (orderData.tipo === "local" && !orderData.mesa) {
      toast.error("Informe a mesa para pedidos locais");
      return;
    }

    if (orderData.tipo === "delivery" && !orderData.endereco) {
      toast.error("Informe o endereço para delivery");
      return;
    }

    const newOrder = {
      cliente: orderData.cliente,
      telefone: orderData.telefone,
      tipo: orderData.tipo,
      mesa: orderData.tipo === "local" ? orderData.mesa : undefined,
      endereco: orderData.tipo === "delivery" ? orderData.endereco : undefined,
      itens: selectedItems,
      total: getTotal()
    };

    onSubmit(newOrder);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Novo Pedido</CardTitle>
            <Button size="sm" variant="ghost" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Cliente</Label>
              <Input
                value={orderData.cliente}
                onChange={(e) => setOrderData(prev => ({ ...prev, cliente: e.target.value }))}
                placeholder="Nome do cliente"
              />
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input
                value={orderData.telefone}
                onChange={(e) => setOrderData(prev => ({ ...prev, telefone: e.target.value }))}
                placeholder="(11) 99999-9999"
              />
            </div>
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={orderData.tipo} onValueChange={(value) => setOrderData(prev => ({ ...prev, tipo: value as any }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="local">Local</SelectItem>
                  <SelectItem value="delivery">Delivery</SelectItem>
                  <SelectItem value="retirada">Retirada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {orderData.tipo === "local" && (
            <div className="space-y-2">
              <Label>Mesa</Label>
              <Input
                value={orderData.mesa}
                onChange={(e) => setOrderData(prev => ({ ...prev, mesa: e.target.value }))}
                placeholder="Ex: Mesa 5"
              />
            </div>
          )}

          {orderData.tipo === "delivery" && (
            <div className="space-y-2">
              <Label>Endereço</Label>
              <Input
                value={orderData.endereco}
                onChange={(e) => setOrderData(prev => ({ ...prev, endereco: e.target.value }))}
                placeholder="Endereço completo"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Cardápio</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {menuItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <p className="font-medium">{item.nome}</p>
                      <p className="text-sm text-muted-foreground">R$ {item.preco.toFixed(2)}</p>
                    </div>
                    <Button size="sm" onClick={() => addItem(item)}>
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Itens Selecionados</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {selectedItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex-1">
                      <p className="font-medium">{item.nome}</p>
                      <p className="text-sm text-muted-foreground">
                        R$ {(item.preco * item.quantidade).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, -1)}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Badge variant="secondary">{item.quantidade}</Badge>
                      <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, 1)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                {selectedItems.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">
                    Nenhum item selecionado
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-lg font-bold">
              Total: R$ {getTotal().toFixed(2)}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit} disabled={selectedItems.length === 0}>
                Criar Pedido
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};