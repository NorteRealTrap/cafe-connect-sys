import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Plus, Edit, Star, Coffee, Pizza, Cake, Wine, Utensils } from "lucide-react";

interface MenuItem {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  disponivel: boolean;
  destaque: boolean;
  imagem?: string;
  ingredientes?: string[];
}

const sampleMenuItems: MenuItem[] = [
  {
    id: "1",
    nome: "Hambúrguer Artesanal",
    descricao: "Pão brioche, carne 180g, queijo cheddar, alface, tomate",
    preco: 28.90,
    categoria: "lanchonete",
    disponivel: true,
    destaque: true,
    ingredientes: ["Pão brioche", "Carne bovina", "Queijo cheddar", "Alface", "Tomate"]
  },
  {
    id: "2",
    nome: "Pizza Margherita",
    descricao: "Molho de tomate, mozzarella, manjericão fresco",
    preco: 42.90,
    categoria: "restaurante",
    disponivel: true,
    destaque: false
  },
  {
    id: "3",
    nome: "Bolo de Chocolate",
    descricao: "Bolo fofinho com cobertura de brigadeiro",
    preco: 8.50,
    categoria: "confeitaria",
    disponivel: true,
    destaque: true
  },
  {
    id: "4",
    nome: "Caipirinha",
    descricao: "Cachaça, limão, açúcar",
    preco: 12.90,
    categoria: "bar",
    disponivel: true,
    destaque: false
  },
  {
    id: "5",
    nome: "Sushi Combo",
    descricao: "10 peças variadas de sushi e sashimi",
    preco: 48.90,
    categoria: "japonesa",
    disponivel: true,
    destaque: true
  },
  {
    id: "6",
    nome: "Café Espresso",
    descricao: "Café especial torrado na casa",
    preco: 4.50,
    categoria: "cafeteria",
    disponivel: true,
    destaque: false
  }
];

const categories = [
  { id: "todos", label: "Todos", icon: <Utensils className="h-4 w-4" /> },
  { id: "restaurante", label: "Restaurante", icon: <Pizza className="h-4 w-4" /> },
  { id: "lanchonete", label: "Lanchonete", icon: <Utensils className="h-4 w-4" /> },
  { id: "confeitaria", label: "Confeitaria", icon: <Cake className="h-4 w-4" /> },
  { id: "bar", label: "Bar", icon: <Wine className="h-4 w-4" /> },
  { id: "japonesa", label: "Japonesa", icon: <Utensils className="h-4 w-4" /> },
  { id: "cafeteria", label: "Cafeteria", icon: <Coffee className="h-4 w-4" /> }
];

interface MenuPanelProps {
  onBack: () => void;
}

export const MenuPanel = ({ onBack }: MenuPanelProps) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(sampleMenuItems);
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");
  
  const addNewItem = () => {
    const newItem: MenuItem = {
      id: Date.now().toString(),
      nome: "Novo Item",
      descricao: "Descrição do novo item",
      preco: 0.00,
      categoria: selectedCategory === "todos" ? "restaurante" : selectedCategory,
      disponivel: true,
      destaque: false
    };
    setMenuItems(prev => [newItem, ...prev]);
  };

  const getFilteredItems = () => {
    let filtered = menuItems;
    
    if (selectedCategory !== "todos") {
      filtered = filtered.filter(item => item.categoria === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.descricao.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const toggleAvailability = (itemId: string) => {
    setMenuItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, disponivel: !item.disponivel } : item
    ));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Cardápio Digital</h2>
          <p className="text-muted-foreground">Gerencie produtos, categorias e menu</p>
        </div>
        <div className="flex gap-2">
          <Button variant="pdv" onClick={addNewItem}>
            <Plus className="h-4 w-4" />
            Novo Item
          </Button>
          <Button variant="outline" onClick={onBack}>
            Voltar
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-7">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-1">
              {category.icon}
              <span className="hidden sm:inline">{category.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {getFilteredItems().map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {item.nome}
                        {item.destaque && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            Destaque
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>{item.descricao}</CardDescription>
                    </div>
                    <Badge 
                      variant={item.disponivel ? "default" : "secondary"}
                      className={!item.disponivel ? "opacity-50" : ""}
                    >
                      {item.disponivel ? "Disponível" : "Indisponível"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {item.ingredientes && (
                    <div className="text-xs text-muted-foreground">
                      <strong>Ingredientes:</strong> {item.ingredientes.join(", ")}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">
                      R$ {item.preco.toFixed(2)}
                    </span>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => toggleAvailability(item.id)}
                      >
                        {item.disponivel ? "Desativar" : "Ativar"}
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {getFilteredItems().length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum item encontrado</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};