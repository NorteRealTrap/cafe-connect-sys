import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Minus, Search } from "lucide-react";
import { toast } from "sonner";

interface TableOrderModalProps {
  open: boolean;
  onClose: () => void;
  tableNumber: number;
  onSave: (items: any[], total: number) => void;
  currentItems?: any[];
}

export const TableOrderModal = ({ open, onClose, tableNumber, onSave, currentItems = [] }: TableOrderModalProps) => {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<any[]>(currentItems);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const data = localStorage.getItem('ccpservices-products');
    setProducts(data ? JSON.parse(data).filter((p: any) => p.available) : []);
  }, []);

  useEffect(() => {
    setSelectedItems(currentItems);
  }, [currentItems]);

  const getFilteredProducts = () => {
    if (!searchTerm) return products;
    return products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const addItem = (product: any) => {
    const existing = selectedItems.find(item => item.productId === product.id);
    if (existing) {
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

  const getTotal = () => {
    return selectedItems.reduce((sum, item) => sum + item.total, 0);
  };

  const handleSave = () => {
    if (selectedItems.length === 0) {
      toast.error('Adicione pelo menos um item');
      return;
    }
    onSave(selectedItems, getTotal());
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Pedido - Mesa {tableNumber}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 flex-1 overflow-hidden">
          {/* Produtos */}
          <div className="space-y-4 overflow-y-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="space-y-2">
              {getFilteredProducts().length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  Nenhum produto disponível
                </p>
              ) : (
                getFilteredProducts().map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 border rounded hover:bg-accent">
                    <div className="flex-1">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">R$ {product.price.toFixed(2)}</p>
                    </div>
                    <Button size="sm" onClick={() => addItem(product)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pedido */}
          <div className="space-y-4 overflow-y-auto border-l pl-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Itens do Pedido</h3>
              <Badge variant="secondary">{selectedItems.length}</Badge>
            </div>

            <div className="space-y-2">
              {selectedItems.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  Nenhum item adicionado
                </p>
              ) : (
                selectedItems.map((item) => (
                  <div key={item.productId} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex-1">
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-muted-foreground">
                        R$ {item.price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateQuantity(item.productId, -1)}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateQuantity(item.productId, 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {selectedItems.length > 0 && (
              <div className="border-t pt-4 space-y-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-primary">R$ {getTotal().toFixed(2)}</span>
                </div>
                <Button onClick={handleSave} className="w-full" size="lg">
                  Confirmar Pedido
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
