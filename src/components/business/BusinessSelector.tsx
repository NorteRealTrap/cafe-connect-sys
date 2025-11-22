import React, { useState } from "react";
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
  ArrowRight,
  Zap
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
  onSelect: (_category: BusinessCategory) => void;
  onBack: () => void;
}

const businessCategories: BusinessCategory[] = [
  {
    id: "restaurante",
    name: "Restaurante",
    description: "Pratos executivos, almoços e jantares",
    icon: <UtensilsCrossed className="h-6 w-6" />,
    color: "text-orange-400",
    gradient: "from-orange-500/20 to-red-500/20",
    features: ["Cardápio completo", "Mesas", "Garçons", "Cozinha"]
  },
  {
    id: "lanchonete",
    name: "Lanchonete",
    description: "Lanches, hambúrguers e fast food",
    icon: <Sandwich className="h-6 w-6" />,
    color: "text-yellow-400",
    gradient: "from-yellow-500/20 to-orange-500/20",
    features: ["Lanches rápidos", "Delivery", "Balcão", "Drive-thru"]
  },
  {
    id: "confeitaria",
    name: "Confeitaria",
    description: "Bolos, doces e sobremesas artesanais",
    icon: <Cake className="h-6 w-6" />,
    color: "text-pink-400",
    gradient: "from-pink-500/20 to-purple-500/20",
    features: ["Bolos personalizados", "Doces finos", "Encomendas", "Vitrine"]
  },
  {
    id: "bar",
    name: "Bar & Pub",
    description: "Bebidas, petiscos e ambiente noturno",
    icon: <Wine className="h-6 w-6" />,
    color: "text-purple-400",
    gradient: "from-purple-500/20 to-indigo-500/20",
    features: ["Drinks", "Petiscos", "Música", "Ambiente"]
  },
  {
    id: "cafeteria",
    name: "Cafeteria",
    description: "Cafés especiais, pães e ambiente aconchegante",
    icon: <Coffee className="h-6 w-6" />,
    color: "text-amber-400",
    gradient: "from-amber-500/20 to-yellow-500/20",
    features: ["Cafés especiais", "Pães artesanais", "Wi-Fi", "Coworking"]
  },
  {
    id: "japonesa",
    name: "Culinária Japonesa",
    description: "Sushi, sashimi e pratos orientais",
    icon: <Fish className="h-6 w-6" />,
    color: "text-red-400",
    gradient: "from-red-500/20 to-pink-500/20",
    features: ["Sushi bar", "Rodízio", "Delivery", "Sake"]
  },
  {
    id: "pizzaria",
    name: "Pizzaria",
    description: "Pizzas artesanais e massas",
    icon: <Pizza className="h-6 w-6" />,
    color: "text-green-400",
    gradient: "from-green-500/20 to-teal-500/20",
    features: ["Forno a lenha", "Delivery", "Massas", "Rodízio"]
  },
  {
    id: "gourmet",
    name: "Gourmet",
    description: "Alta gastronomia e experiências únicas",
    icon: <ChefHat className="h-6 w-6" />,
    color: "text-slate-400",
    gradient: "from-slate-500/20 to-gray-500/20",
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
    }, 800);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),rgba(255,255,255,0))]" />
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-1 h-1 bg-white/20 rounded-full animate-ping" />
        <div className="absolute top-40 right-32 w-0.5 h-0.5 bg-purple-400/30 rounded-full animate-pulse" />
        <div className="absolute bottom-32 left-1/4 w-1 h-1 bg-blue-400/20 rounded-full animate-ping delay-700" />
        <div className="absolute top-1/3 right-20 w-0.5 h-0.5 bg-cyan-400/40 rounded-full animate-pulse delay-300" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
        {/* Header */}
        <div className="text-center mb-12 max-w-2xl">
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-cyan-500/30 rounded-full blur-2xl animate-pulse" />
            <div className="relative w-16 h-16 bg-gradient-to-r from-purple-600/80 to-cyan-600/80 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10">
              <Zap className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-6xl font-bold mb-4 tracking-tight">
            <span className="text-gradient-primary">
              Escolha seu Negócio
            </span>
          </h1>
          
          <p className="text-slate-200 text-xl leading-relaxed font-medium">
            Selecione a categoria que melhor representa seu estabelecimento
            <br />
            <span className="text-slate-300 text-lg font-normal">para uma experiência personalizada</span>
          </p>
        </div>

        {/* Business Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl w-full mb-12">
          {businessCategories.map((category, index) => (
            <div
              key={category.id}
              className={`group cursor-pointer transition-all duration-500 transform ${
                selectedCategory?.id === category.id 
                  ? 'scale-105 z-10' 
                  : hoveredCard === category.id 
                    ? 'scale-102 z-5' 
                    : 'hover:scale-102'
              }`}
              onClick={() => handleSelect(category)}
              onMouseEnter={() => setHoveredCard(category.id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative">
                {/* Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${category.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* Card */}
                <Card className={`relative bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden transition-all duration-500 ${
                  selectedCategory?.id === category.id 
                    ? 'border-purple-500/50 shadow-2xl shadow-purple-500/20' 
                    : 'hover:border-slate-600/70 hover:shadow-xl hover:shadow-black/20'
                }`}>
                  <CardHeader className="text-center pb-4 pt-8">
                    <div className={`w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-r ${category.gradient} flex items-center justify-center border border-white/10 transition-transform duration-300 group-hover:scale-110`}>
                      <div className={category.color}>
                        {category.icon}
                      </div>
                    </div>
                    <CardTitle className={`text-xl font-bold ${category.color} mb-2 tracking-tight`}>
                      {category.name}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="text-center space-y-4 pb-8">
                    <p className="text-sm text-slate-300 leading-relaxed px-2 font-medium">
                      {category.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 justify-center">
                      {category.features.slice(0, 2).map((feature, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs bg-slate-700/50 text-slate-200 border-slate-600/50 font-semibold">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    
                    {hoveredCard === category.id && (
                      <div className="mt-3 space-y-2 animate-in fade-in duration-300">
                        <div className="flex flex-wrap gap-1 justify-center">
                          {category.features.slice(2).map((feature, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs border-slate-600 text-slate-300 font-medium">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Category Preview */}
        {selectedCategory && (
          <div className="text-center animate-in fade-in duration-500">
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-slate-800/60 backdrop-blur-xl rounded-full border border-slate-700/50 shadow-2xl">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${selectedCategory.gradient} flex items-center justify-center border border-white/10`}>
                <div className={selectedCategory.color}>
                  {selectedCategory.icon}
                </div>
              </div>
              <span className="font-bold text-white text-xl tracking-tight">
                Iniciando {selectedCategory.name}...
              </span>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          </div>
        )}

        {/* Footer */}
        {!selectedCategory && (
          <div className="text-center mt-8">
            <Button 
              variant="outline" 
              onClick={onBack} 
              className="bg-slate-800/40 backdrop-blur-sm border-slate-700/50 text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-300"
            >
              <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
              Voltar ao Login
            </Button>
            <p className="text-sm text-slate-400 mt-4 font-medium">
              Você poderá alterar a categoria a qualquer momento
            </p>
          </div>
        )}
      </div>
    </div>
  );
};