import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Store, Coffee, Pizza, Cake, Wine, Utensils } from "lucide-react";

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  active: boolean;
  itemCount: number;
}

interface CategoriesPanelProps {
  onBack: () => void;
}

export const CategoriesPanel = ({ onBack }: CategoriesPanelProps) => {
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('pdv-categories');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Erro ao carregar categorias:', e);
      }
    }
    
    return [
      {
        id: "1",
        name: "Restaurante",
        description: "Pratos principais, entradas e sobremesas",
        icon: "pizza",
        color: "bg-red-100 text-red-800",
        active: true,
        itemCount: 25
      },
      {
        id: "2",
        name: "Lanchonete",
        description: "Lanches, hambúrgueres e petiscos",
        icon: "utensils",
        color: "bg-orange-100 text-orange-800",
        active: true,
        itemCount: 18
      },
      {
        id: "3",
        name: "Confeitaria",
        description: "Bolos, doces e sobremesas",
        icon: "cake",
        color: "bg-pink-100 text-pink-800",
        active: true,
        itemCount: 12
      },
      {
        id: "4",
        name: "Bar",
        description: "Bebidas alcoólicas e coquetéis",
        icon: "wine",
        color: "bg-purple-100 text-purple-800",
        active: true,
        itemCount: 15
      },
      {
        id: "5",
        name: "Cafeteria",
        description: "Cafés, chás e bebidas quentes",
        icon: "coffee",
        color: "bg-amber-100 text-amber-800",
        active: true,
        itemCount: 8
      },
      {
        id: "6",
        name: "Delivery",
        description: "Itens exclusivos para entrega",
        icon: "store",
        color: "bg-green-100 text-green-800",
        active: false,
        itemCount: 0
      }
    ];
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    icon: "utensils",
    color: "bg-blue-100 text-blue-800"
  });

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "pizza": return <Pizza className="h-5 w-5" />;
      case "coffee": return <Coffee className="h-5 w-5" />;
      case "cake": return <Cake className="h-5 w-5" />;
      case "wine": return <Wine className="h-5 w-5" />;
      case "store": return <Store className="h-5 w-5" />;
      default: return <Utensils className="h-5 w-5" />;
    }
  };

  const saveCategories = (updatedCategories: Category[]) => {
    setCategories(updatedCategories);
    localStorage.setItem('pdv-categories', JSON.stringify(updatedCategories));
  };

  const toggleCategoryStatus = (categoryId: string) => {
    const updated = categories.map(cat => 
      cat.id === categoryId ? { ...cat, active: !cat.active } : cat
    );
    saveCategories(updated);
  };

  const addCategory = () => {
    if (!newCategory.name.trim()) return;
    
    const category: Category = {
      id: Date.now().toString(),
      name: newCategory.name,
      description: newCategory.description,
      icon: newCategory.icon,
      color: newCategory.color,
      active: true,
      itemCount: 0
    };
    
    saveCategories([...categories, category]);
    setNewCategory({ name: "", description: "", icon: "utensils", color: "bg-blue-100 text-blue-800" });
    setShowAddForm(false);
  };

  const deleteCategory = (categoryId: string) => {
    const updated = categories.filter(cat => cat.id !== categoryId);
    saveCategories(updated);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gerenciamento de Categorias</h2>
          <p className="text-muted-foreground">Organize produtos por categorias de negócio</p>
        </div>
        <div className="flex gap-2">
          <Button variant="pdv" onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="h-4 w-4" />
            Nova Categoria
          </Button>
          <Button variant="outline" onClick={onBack}>
            Voltar
          </Button>
        </div>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Nova Categoria</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="categoryName">Nome da Categoria</Label>
                <Input
                  id="categoryName"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Japonesa"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoryIcon">Ícone</Label>
                <select
                  id="categoryIcon"
                  value={newCategory.icon}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, icon: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="utensils">Utensílios</option>
                  <option value="pizza">Pizza</option>
                  <option value="coffee">Café</option>
                  <option value="cake">Bolo</option>
                  <option value="wine">Vinho</option>
                  <option value="store">Loja</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoryDesc">Descrição</Label>
              <Input
                id="categoryDesc"
                value={newCategory.description}
                onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva os tipos de produtos desta categoria"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={addCategory} variant="success">
                Adicionar
              </Button>
              <Button onClick={() => setShowAddForm(false)} variant="outline">
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Card key={category.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${category.color} rounded-lg flex items-center justify-center`}>
                    {getIcon(category.icon)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {category.itemCount} itens
                    </p>
                  </div>
                </div>
                <Badge variant={category.active ? "default" : "secondary"}>
                  {category.active ? "Ativa" : "Inativa"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {category.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={category.active}
                    onCheckedChange={() => toggleCategoryStatus(category.id)}
                  />
                  <Label className="text-sm">
                    {category.active ? "Ativa" : "Inativa"}
                  </Label>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => deleteCategory(category.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Resumo das Categorias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">
                  {categories.length}
                </div>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {categories.filter(c => c.active).length}
                </div>
                <p className="text-sm text-muted-foreground">Ativas</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-600">
                  {categories.filter(c => !c.active).length}
                </div>
                <p className="text-sm text-muted-foreground">Inativas</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {categories.reduce((sum, c) => sum + c.itemCount, 0)}
                </div>
                <p className="text-sm text-muted-foreground">Itens Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};