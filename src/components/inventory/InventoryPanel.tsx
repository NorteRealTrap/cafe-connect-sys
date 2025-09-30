import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Package, AlertTriangle, Plus, Minus } from "lucide-react";

interface InventoryPanelProps {
  onBack: () => void;
}

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  unit: string;
  cost: number;
}

const mockInventory: InventoryItem[] = [
  { id: 1, name: "Carne Bovina", category: "Carnes", currentStock: 15, minStock: 10, unit: "kg", cost: 35.00 },
  { id: 2, name: "Tomate", category: "Vegetais", currentStock: 5, minStock: 8, unit: "kg", cost: 8.50 },
  { id: 3, name: "Queijo Muçarela", category: "Laticínios", currentStock: 3, minStock: 5, unit: "kg", cost: 28.00 },
  { id: 4, name: "Pão de Hambúrguer", category: "Padaria", currentStock: 50, minStock: 20, unit: "unid", cost: 0.80 },
  { id: 5, name: "Batata", category: "Vegetais", currentStock: 25, minStock: 15, unit: "kg", cost: 4.50 },
];

export const InventoryPanel = ({ onBack }: InventoryPanelProps) => {
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock <= item.minStock) {
      return { status: "baixo", variant: "destructive" as const, label: "Estoque Baixo" };
    }
    if (item.currentStock <= item.minStock * 1.5) {
      return { status: "atencao", variant: "secondary" as const, label: "Atenção" };
    }
    return { status: "ok", variant: "default" as const, label: "OK" };
  };

  const updateStock = (itemId: number, change: number) => {
    setInventory(inventory.map(item => 
      item.id === itemId 
        ? { ...item, currentStock: Math.max(0, item.currentStock + change) }
        : item
    ));
  };

  const lowStockItems = inventory.filter(item => item.currentStock <= item.minStock);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold">Controle de Estoque</h1>
      </div>

      {lowStockItems.length > 0 && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Alertas de Estoque
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockItems.map(item => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span>{item.name}</span>
                  <span className="text-destructive font-medium">
                    {item.currentStock} {item.unit} (Mín: {item.minStock})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {inventory.map((item) => {
          const stockInfo = getStockStatus(item);
          
          return (
            <Card key={item.id} className="hover:shadow-pdv transition-shadow">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <Package className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                    <p className="text-xs text-muted-foreground">
                      Custo: R$ {item.cost.toFixed(2)} / {item.unit}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {item.currentStock}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.unit}
                    </div>
                  </div>

                  <Badge variant={stockInfo.variant}>
                    {stockInfo.label}
                  </Badge>

                  <div className="flex items-center gap-1">
                    <Button 
                      size="icon" 
                      variant="outline"
                      onClick={() => updateStock(item.id, -1)}
                      className="h-8 w-8"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="outline"
                      onClick={() => updateStock(item.id, 1)}
                      className="h-8 w-8"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};