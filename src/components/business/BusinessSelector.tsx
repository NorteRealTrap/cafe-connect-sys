import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Coffee, 
  Pizza, 
  Cake, 
  Sandwich, 
  Wine, 
  Fish,
  UtensilsCrossed,
  ChefHat,
  Sparkles
} from "lucide-react";

interface BusinessCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  features: string[];
}

interface BusinessSelectorProps {
  onSelect: (category: BusinessCategory) => void;
  onBack: () => void;
}

const businessCategories: BusinessCategory[] = [
  {
    id: "restaurante",
    name: "Restaurante",
    description: "Pratos executivos, almoços e jantares",
    icon: <UtensilsCrossed className="h-8 w-8" />,
    color: "text-orange-600",
    gradient: "from-orange-500 to-red-500",
    features: ["Cardápio completo", "Mesas", "Garçons", "Cozinha"]
  },
  {
    id: "lanchonete",
    name: "Lanchonete",
    description: "Lanches, hambúrguers e fast food",
    icon: <Sandwich className="h-8 w-8" />,
    color: "text-yellow-600",
    gradient: "from-yellow-500 to-orange-500",
    features: ["Lanches rápidos", "Delivery", "Balcão", "Drive-thru"]
  },
  {
    id: "confeitaria",
    name: "Confeitaria",
    description: "Bolos, doces e sobremesas artesanais",
    icon: <Cake className="h-8 w-8" />,
    color: "text-pink-600",
    gradient: "from-pink-500 to-purple-500",
    features: ["Bolos personalizados", "Doces finos", "Encomendas", "Vitrine"]
  },
  {
    id: "bar",
    name: "Bar & Pub",
    description: "Bebidas, petiscos e ambiente noturno",
    icon: <Wine className="h-8 w-8" />,
    color: "text-purple-600",
    gradient: "from-purple-500 to-indigo-500",
    features: ["Drinks", "Petiscos", "Música", "Ambiente"]
  },
  {
    id: "cafeteria",
    name: "Cafeteria",
    description: "Cafés especiais, pães e ambiente aconchegante",
    icon: <Coffee className="h-8 w-8" />,
    color: "text-amber-600",
    gradient: "from-amber-500 to-yellow-500",
    features: ["Cafés especiais", "Pães artesanais", "Wi-Fi", "Coworking"]
  },
  {
    id: "japonesa",
    name: "Culinária Japonesa",
    description: "Sushi, sashimi e pratos orientais",
    icon: <Fish className="h-8 w-8" />,
    color: "text-red-600",
    gradient: "from-red-500 to-pink-500",
    features: ["Sushi bar", "Rodízio", "Delivery", "Sake"]
  },
  {
    id: "pizzaria",
    name: "Pizzaria",
    description: "Pizzas artesanais e massas",
    icon: <Pizza className="h-8 w-8" />,
    color: "text-green-600",
    gradient: "from-green-500 to-teal-500",
    features: ["Forno a lenha", "Delivery", "Massas", "Rodízio"]
  },
  {
    id: "gourmet",
    name: "Gourmet",
    description: "Alta gastronomia e experiências únicas",
    icon: <ChefHat className="h-8 w-8" />,
    color: "text-slate-600",
    gradient: "from-slate-500 to-gray-500",
    features: ["Menu degustação", "Chef", "Vinhos", "Experiência"]
  }
];

export const BusinessSelector = ({ onSelect, onBack }: BusinessSelectorProps) => {
  const [selectedCategory, setSelectedCategory] = useState<BusinessCategory | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const handleSelect = (category: BusinessCategory) => {
    setSelectedCategory(category);
    setTimeout(() => {
      onSelect(category);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              CCPServices
            </h1>
          </div>
          <h2 className="text-2xl font-semibold text-slate-700 mb-2">
            Escolha seu Tipo de Negócio
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Selecione a categoria que melhor representa seu estabelecimento para uma experiência personalizada
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {businessCategories.map((category) => (
            <Card
              key={category.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 ${
                selectedCategory?.id === category.id 
                  ? 'border-primary shadow-lg scale-105' 
                  : hoveredCard === category.id 
                    ? 'border-slate-300' 
                    : 'border-slate-200'
              }`}
              onClick={() => handleSelect(category)}
              onMouseEnter={() => setHoveredCard(category.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <CardHeader className="text-center pb-2">
                <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r ${category.gradient} flex items-center justify-center text-white shadow-lg`}>
                  {category.icon}
                </div>
                <CardTitle className={`text-lg ${category.color}`}>
                  {category.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-3">
                <p className="text-sm text-slate-600 leading-relaxed">
                  {category.description}
                </p>
                <div className="flex flex-wrap gap-1 justify-center">
                  {category.features.slice(0, 2).map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
                {hoveredCard === category.id && (
                  <div className="mt-2 space-y-1">
                    {category.features.slice(2).map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs mr-1">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedCategory && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-lg border-2 border-primary">
              <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${selectedCategory.gradient} flex items-center justify-center text-white`}>
                {selectedCategory.icon}
              </div>
              <span className="font-semibold text-slate-700">
                Iniciando {selectedCategory.name}...
              </span>
            </div>
          </div>
        )}

        <div className="text-center mt-8">
          <Button variant="outline" onClick={onBack} className="mr-4">
            Voltar ao Login
          </Button>
          <p className="text-sm text-slate-500 mt-4">
            Você poderá alterar a categoria a qualquer momento nas configurações
          </p>
        </div>
      </div>
    </div>
  );
};