import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Minus, X, ShoppingCart } from "lucide-react";
import { useProducts } from "@/hooks/useDatabase";
import { toast } from "sonner";

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

interface NewOrderModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (orderData: {
    cliente: string;
    telefone: string;
    tipo: "local" | "delivery" | "retirada";
    mesa?: string;
    endereco?: string;
    itens: OrderItem[];
    total: number;
    observacoes?: string;
  }) => void;
}

export const NewOrderModal = ({ open, onClose, onSubmit }: NewOrderModalProps) => {
  const { products } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [orderData, setOrderData] = useState({
    cliente: "",
    telefone: "",
    tipo: "local" as "local" | "delivery" | "retirada",
    mesa: "",
    endereco: "",
    observacoes: ""
  });
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);

  const categories = ["todos", "Bebidas", "Lanches", "Doces", "Bar"];
  
  const getFilteredProducts = () => {
    if (selectedCategory === "todos") {
      return products.filter(p => p.available);
    }
    return products.filter(p => p.category === selectedCategory && p.available);
  };

  const addItem = (product: any) => {
    const existingItem = selectedItems.find(item => item.productId === product.id);
    if (existingItem) {
      setSelectedItems(prev => prev.map(item => 
        item.productId === product.id 
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
          : item
      ));
    } else {
      setSelectedItems(prev => [...prev, {
        productId: product.id,
        productName: product.name,
        quantity: 1,
        price: product.price,
        total: product.price
      }]);
    }
  };

  const updateQuantity = (productId: string, change: number) => {
    setSelectedItems(prev => prev.map(item => {
      if (item.productId === productId) {
        const newQuantity = Math.max(0, item.quantity + change);
        return newQuantity > 0 
          ? { ...item, quantity: newQuantity, total: newQuantity * item.price }
          : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeItem = (productId: string) => {
    setSelectedItems(prev => prev.filter(item => item.productId !== productId));
  };

  const getTotal = () => {
    return selectedItems.reduce((sum, item) => sum + item.total, 0);
  };

  const handleSubmit = () => {
    if (!orderData.cliente.trim()) {
      toast.error("Nome do cliente é obrigatório");
      return;
    }

    if (selectedItems.length === 0) {
      toast.error("Adicione pelo menos um item ao pedido");
      return;
    }

    if (orderData.tipo === "local" && !orderData.mesa.trim()) {
      toast.error("Mesa é obrigatória para pedidos locais");
      return;
    }

    if (orderData.tipo === "delivery" && !orderData.endereco.trim()) {
      toast.error("Endereço é obrigatório para delivery");
      return;
    }

    onSubmit({
      ...orderData,
      itens: selectedItems,
      total: getTotal()
    });

    // Reset form
    setOrderData({
      cliente: "",
      telefone: "",
      tipo: "local",
      mesa: "",
      endereco: "",
      observacoes: ""
    });
    setSelectedItems([]);
    onClose();
  };

  const handleClose = () => {
    setOrderData({
      cliente: "",
      telefone: "",
      tipo: "local",
      mesa: "",
      endereco: "",
      observacoes: ""
    });
    setSelectedItems([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Novo Pedido
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 overflow-y-auto max-h-[75vh]">
          {/* Dados do Cliente */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Dados do Cliente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Cliente *</Label>
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
                </div>

                <div className="space-y-2">
                  <Label>Tipo de Pedido</Label>
                  <Select 
                    value={orderData.tipo} 
                    onValueChange={(value: any) => setOrderData(prev => ({ ...prev, tipo: value }))}
                  >
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

                {orderData.tipo === "local" && (
                  <div className="space-y-2">
                    <Label>Mesa *</Label>
                    <Input
                      value={orderData.mesa}
                      onChange={(e) => setOrderData(prev => ({ ...prev, mesa: e.target.value }))}
                      placeholder="Ex: Mesa 5"
                    />
                  </div>
                )}

                {orderData.tipo === "delivery" && (
                  <div className="space-y-2">
                    <Label>Endereço *</Label>
                    <Input
                      value={orderData.endereco}
                      onChange={(e) => setOrderData(prev => ({ ...prev, endereco: e.target.value }))}
                      placeholder="Endereço completo"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Observações</Label>
                  <Input
                    value={orderData.observacoes}
                    onChange={(e) => setOrderData(prev => ({ ...prev, observacoes: e.target.value }))}
                    placeholder="Observações do pedido"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Itens Selecionados */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  Itens Selecionados
                  <Badge variant="secondary">{selectedItems.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {selectedItems.map((item) => (
                    <div key={item.productId} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.productName}</p>
                        <p className="text-xs text-muted-foreground">
                          R$ {item.price.toFixed(2)} × {item.quantity} = R$ {item.total.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => updateQuantity(item.productId, -1)}
                          className="h-6 w-6 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => updateQuantity(item.productId, 1)}
                          className="h-6 w-6 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => removeItem(item.productId)}
                          className="h-6 w-6 p-0 ml-1"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {selectedItems.length === 0 && (
                    <p className="text-muted-foreground text-center py-4 text-sm">
                      Nenhum item selecionado
                    </p>
                  )}
                </div>
                
                {selectedItems.length > 0 && (
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between items-center font-bold">
                      <span>Total:</span>
                      <span className="text-lg text-primary">R$ {getTotal().toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Cardápio */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Cardápio</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                  <TabsList className="grid w-full grid-cols-5">
                    {categories.map((category) => (
                      <TabsTrigger key={category} value={category} className="text-xs">
                        {category === "todos" ? "Todos" : category}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  <TabsContent value={selectedCategory} className="mt-4">
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {getFilteredProducts().map((product) => (
                        <div key={product.id} className="flex items-center justify-between p-3 border rounded hover:bg-muted/50">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{product.description}</p>
                            <p className="text-sm font-bold text-primary">R$ {product.price.toFixed(2)}</p>
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => addItem(product)}
                            className="ml-2"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      {getFilteredProducts().length === 0 && (
                        <p className="text-muted-foreground text-center py-8 text-sm">
                          Nenhum produto disponível nesta categoria
                        </p>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-lg font-bold">
            Total: R$ {getTotal().toFixed(2)}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={selectedItems.length === 0}
              className="min-w-[120px]"
            >
              Criar Pedido
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};