import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Package, AlertTriangle, TrendingUp, Search } from "lucide-react";

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  costPrice: number;
  supplier: string;
  lastUpdated: string;
  status: "normal" | "low" | "critical" | "excess";
}

interface InventoryPanelProps {
  onBack: () => void;
}

export const InventoryPanel = ({ onBack }: InventoryPanelProps) => {
  const [items, setItems] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('pdv-inventory');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Erro ao carregar estoque:', e);
      }
    }
    
    return [
      {
        id: "1",
        name: "Café em Grãos Premium",
        category: "Bebidas",
        currentStock: 25,
        minStock: 10,
        maxStock: 100,
        unit: "kg",
        costPrice: 45.90,
        supplier: "Café Brasil Ltda",
        lastUpdated: "2024-01-15 14:30",
        status: "normal"
      },
      {
        id: "2",
        name: "Açúcar Cristal",
        category: "Ingredientes",
        currentStock: 5,
        minStock: 20,
        maxStock: 200,
        unit: "kg",
        costPrice: 3.50,
        supplier: "Doce Vida",
        lastUpdated: "2024-01-15 10:15",
        status: "critical"
      },
      {
        id: "3",
        name: "Leite Integral",
        category: "Laticínios",
        currentStock: 8,
        minStock: 15,
        maxStock: 50,
        unit: "L",
        costPrice: 4.20,
        supplier: "Fazenda Feliz",
        lastUpdated: "2024-01-15 09:00",
        status: "low"
      },
      {
        id: "4",
        name: "Pão Francês",
        category: "Padaria",
        currentStock: 150,
        minStock: 50,
        maxStock: 100,
        unit: "unid",
        costPrice: 0.80,
        supplier: "Padaria Central",
        lastUpdated: "2024-01-15 06:00",
        status: "excess"
      }
    ];
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    currentStock: 0,
    minStock: 0,
    maxStock: 0,
    unit: "",
    costPrice: 0,
    supplier: ""
  });

  const saveItems = (updatedItems: InventoryItem[]) => {
    setItems(updatedItems);
    localStorage.setItem('pdv-inventory', JSON.stringify(updatedItems));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal": return "bg-green-100 text-green-800";
      case "low": return "bg-yellow-100 text-yellow-800";
      case "critical": return "bg-red-100 text-red-800";
      case "excess": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "critical": return <AlertTriangle className="h-4 w-4" />;
      case "low": return <AlertTriangle className="h-4 w-4" />;
      case "excess": return <TrendingUp className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const updateStock = (itemId: string, newStock: number) => {
    const updated = items.map(item => {
      if (item.id === itemId) {
        let status: InventoryItem["status"] = "normal";
        if (newStock <= item.minStock * 0.5) status = "critical";
        else if (newStock <= item.minStock) status = "low";
        else if (newStock > item.maxStock) status = "excess";
        
        return {
          ...item,
          currentStock: newStock,
          status,
          lastUpdated: new Date().toLocaleString('pt-BR')
        };
      }
      return item;
    });
    saveItems(updated);
  };

  const addItem = () => {
    if (!newItem.name.trim()) return;
    
    let status: InventoryItem["status"] = "normal";
    if (newItem.currentStock <= newItem.minStock * 0.5) status = "critical";
    else if (newItem.currentStock <= newItem.minStock) status = "low";
    else if (newItem.currentStock > newItem.maxStock) status = "excess";
    
    const item: InventoryItem = {
      id: Date.now().toString(),
      ...newItem,
      status,
      lastUpdated: new Date().toLocaleString('pt-BR')
    };
    
    saveItems([...items, item]);
    setNewItem({
      name: "",
      category: "",
      currentStock: 0,
      minStock: 0,
      maxStock: 0,
      unit: "",
      costPrice: 0,
      supplier: ""
    });
    setShowAddForm(false);
  };

  const deleteItem = (itemId: string) => {
    if (confirm('Tem certeza que deseja excluir este item?')) {
      const updated = items.filter(item => item.id !== itemId);
      saveItems(updated);
    }
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const criticalItems = items.filter(item => item.status === "critical").length;
  const lowStockItems = items.filter(item => item.status === "low").length;
  const totalValue = items.reduce((sum, item) => sum + (item.currentStock * item.costPrice), 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Controle de Estoque</h2>
          <p className="text-muted-foreground">Gerencie produtos, quantidades e fornecedores</p>
        </div>
        <div className="flex gap-2">
          <Button variant="pdv" onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="h-4 w-4" />
            Novo Item
          </Button>
          <Button variant="outline" onClick={onBack}>
            Voltar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Itens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{items.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Estoque Crítico</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalItems}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{lowStockItems}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {totalValue.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por nome, categoria ou fornecedor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Novo Item</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="itemName">Nome do Item</Label>
                <Input
                  id="itemName"
                  value={newItem.name}
                  onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Café Premium"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="itemCategory">Categoria</Label>
                <Input
                  id="itemCategory"
                  value={newItem.category}
                  onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="Ex: Bebidas"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentStock">Estoque Atual</Label>
                <Input
                  id="currentStock"
                  type="number"
                  value={newItem.currentStock}
                  onChange={(e) => setNewItem(prev => ({ ...prev, currentStock: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minStock">Estoque Mínimo</Label>
                <Input
                  id="minStock"
                  type="number"
                  value={newItem.minStock}
                  onChange={(e) => setNewItem(prev => ({ ...prev, minStock: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxStock">Estoque Máximo</Label>
                <Input
                  id="maxStock"
                  type="number"
                  value={newItem.maxStock}
                  onChange={(e) => setNewItem(prev => ({ ...prev, maxStock: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unidade</Label>
                <Input
                  id="unit"
                  value={newItem.unit}
                  onChange={(e) => setNewItem(prev => ({ ...prev, unit: e.target.value }))}
                  placeholder="kg, L, unid"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="costPrice">Preço de Custo</Label>
                <Input
                  id="costPrice"
                  type="number"
                  step="0.01"
                  value={newItem.costPrice}
                  onChange={(e) => setNewItem(prev => ({ ...prev, costPrice: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplier">Fornecedor</Label>
                <Input
                  id="supplier"
                  value={newItem.supplier}
                  onChange={(e) => setNewItem(prev => ({ ...prev, supplier: e.target.value }))}
                  placeholder="Nome do fornecedor"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={addItem} variant="success">
                Adicionar Item
              </Button>
              <Button onClick={() => setShowAddForm(false)} variant="outline">
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {filteredItems.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Package className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {item.category} • {item.supplier}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`flex items-center gap-1 ${getStatusColor(item.status)}`}>
                    {getStatusIcon(item.status)}
                    {item.status === "critical" ? "Crítico" : 
                     item.status === "low" ? "Baixo" :
                     item.status === "excess" ? "Excesso" : "Normal"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Estoque Atual</p>
                  <p className="font-bold text-lg">{item.currentStock} {item.unit}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Mín / Máx</p>
                  <p className="font-medium">{item.minStock} / {item.maxStock} {item.unit}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Preço de Custo</p>
                  <p className="font-medium">R$ {item.costPrice.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Valor Total</p>
                  <p className="font-bold text-primary">
                    R$ {(item.currentStock * item.costPrice).toFixed(2)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Label htmlFor={`stock-${item.id}`} className="text-sm">Ajustar Estoque:</Label>
                <Input
                  id={`stock-${item.id}`}
                  type="number"
                  defaultValue={item.currentStock}
                  className="w-24"
                  onBlur={(e) => updateStock(item.id, Number(e.target.value))}
                />
                <span className="text-sm text-muted-foreground">{item.unit}</span>
                <div className="ml-auto flex gap-1">
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteItem(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground">
                Última atualização: {item.lastUpdated}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};