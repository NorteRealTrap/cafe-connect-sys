import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Store, Utensils, Coffee, Wine, Cake, Settings } from "lucide-react";

interface CategoriesPanelProps {
  onBack: () => void;
}

interface BusinessCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  active: boolean;
  features: string[];
}

const businessCategories: BusinessCategory[] = [
  {
    id: "restaurante",
    name: "Restaurante",
    description: "Restaurante tradicional com pratos à la carte",
    icon: <Utensils className="h-6 w-6" />,
    active: true,
    features: ["Mesas", "Comandos", "Cardápio completo", "Garçons"]
  },
  {
    id: "lanchonete",
    name: "Lanchonete",
    description: "Fast food e lanches rápidos",
    icon: <Store className="h-6 w-6" />,
    active: true,
    features: ["Delivery", "Balcão", "Pedidos rápidos"]
  },
  {
    id: "confeitaria",
    name: "Confeitaria",
    description: "Doces, bolos e produtos de confeitaria",
    icon: <Cake className="h-6 w-6" />,
    active: false,
    features: ["Encomendas", "Vitrine", "Produtos sazonais"]
  },
  {
    id: "bar",
    name: "Bar",
    description: "Bebidas, petiscos e ambiente noturno",
    icon: <Wine className="h-6 w-6" />,
    active: false,
    features: ["Happy hour", "Comanda", "Música", "Eventos"]
  },
  {
    id: "cafeteria",
    name: "Cafeteria",
    description: "Café, bebidas quentes e lanches leves",
    icon: <Coffee className="h-6 w-6" />,
    active: false,
    features: ["Café especial", "Wi-Fi", "Ambiente relaxante"]
  },
  {
    id: "adega",
    name: "Adega",
    description: "Vinhos, queijos e produtos gourmet",
    icon: <Wine className="h-6 w-6" />,
    active: false,
    features: ["Degustação", "Produtos importados", "Harmonização"]
  }
];

export const CategoriesPanel = ({ onBack }: CategoriesPanelProps) => {
  const [categories, setCategories] = useState<BusinessCategory[]>(businessCategories);

  const toggleCategory = (categoryId: string) => {
    setCategories(categories.map(cat => 
      cat.id === categoryId ? { ...cat, active: !cat.active } : cat
    ));
  };

  const activeCategories = categories.filter(cat => cat.active);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold">Categorias do Negócio</h1>
      </div>

      <Card className="bg-gradient-subtle border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuração do Estabelecimento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Configure os tipos de negócio que seu estabelecimento opera. 
            Isso determinará quais funcionalidades estarão disponíveis no sistema.
          </p>
          <div className="flex gap-2 mt-3">
            <Badge variant="outline" className="bg-primary/10">
              {activeCategories.length} categoria(s) ativa(s)
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((category) => (
          <Card 
            key={category.id} 
            className={`hover:shadow-pdv transition-all duration-200 ${
              category.active ? 'ring-2 ring-primary/20 bg-primary/5' : ''
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${
                    category.active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    {category.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={category.active}
                  onCheckedChange={() => toggleCategory(category.id)}
                />
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div>
                <span className="text-sm font-medium">Funcionalidades incluídas:</span>
                <div className="flex flex-wrap gap-1 mt-2">
                  {category.features.map((feature, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="text-xs"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {category.active && (
                <div className="pt-2 border-t">
                  <Button variant="outline" size="sm" className="w-full">
                    Configurar {category.name}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {activeCategories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resumo da Configuração</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Seu estabelecimento está configurado como:
              </p>
              <div className="flex flex-wrap gap-2">
                {activeCategories.map((category) => (
                  <Badge key={category.id} className="bg-primary/10 text-primary">
                    {category.name}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                As funcionalidades do sistema serão adaptadas conforme as categorias ativas.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};