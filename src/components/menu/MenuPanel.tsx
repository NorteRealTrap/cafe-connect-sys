import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Plus, Edit, Star, Coffee, Pizza, Cake, Wine, Utensils } from "lucide-react";
import { useProducts } from "@/hooks/useDatabase";

const categories = [
  { id: "todos", label: "Todos", icon: <Utensils className="h-4 w-4" /> },
  { id: "Bebidas", label: "Bebidas", icon: <Coffee className="h-4 w-4" /> },
  { id: "Lanches", label: "Lanches", icon: <Pizza className="h-4 w-4" /> },
  { id: "Doces", label: "Doces", icon: <Cake className="h-4 w-4" /> },
  { id: "Bar", label: "Bar", icon: <Wine className="h-4 w-4" /> }
];

interface MenuPanelProps {
  onBack: () => void;
}

export const MenuPanel = ({ onBack }: MenuPanelProps) => {
  const { products: menuItems, updateProduct } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");

  const getFilteredItems = () => {
    let filtered = menuItems;
    
    if (selectedCategory !== "todos") {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const toggleAvailability = (itemId: string) => {
    const item = menuItems.find(i => i.id === itemId);
    if (item) {
      updateProduct(itemId, { available: !item.available });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Cardápio Digital</h2>
          <p className="text-muted-foreground">Gerencie produtos, categorias e menu</p>
        </div>
        <Button variant="outline" onClick={onBack}>
          Voltar
        </Button>
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
        <TabsList className="grid w-full grid-cols-5">
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
                        {item.name}
                        {item.featured && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            Destaque
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </div>
                    <Badge 
                      variant={item.available ? "default" : "secondary"}
                      className={!item.available ? "opacity-50" : ""}
                    >
                      {item.available ? "Disponível" : "Indisponível"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">
                      R$ {item.price.toFixed(2)}
                    </span>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => toggleAvailability(item.id)}
                      >
                        {item.available ? "Desativar" : "Ativar"}
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