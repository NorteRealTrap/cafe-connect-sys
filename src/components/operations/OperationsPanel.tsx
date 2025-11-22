import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Utensils, Clock, Users, DollarSign } from "lucide-react";

interface OperationsPanelProps {
  onBack: () => void;
}

interface OperationMode {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  active: boolean;
  price?: number;
  features: string[];
}

const operationModes: OperationMode[] = [
  {
    id: "alacarte",
    name: "À La Carte",
    description: "Cardápio com pratos individuais e preços únicos",
    icon: <Utensils className="h-6 w-6" />,
    active: true,
    features: ["Pedidos individuais", "Preços por item", "Cardápio completo", "Personalização"]
  },
  {
    id: "rodizio",
    name: "Rodízio",
    description: "Sistema de rodízio com preço fixo por pessoa",
    icon: <Users className="h-6 w-6" />,
    active: false,
    price: 89.90,
    features: ["Preço fixo", "Consumo livre", "Controle de tempo", "Bebidas à parte"]
  },
  {
    id: "selfservice",
    name: "Self-Service",
    description: "Buffet com cobrança por peso ou preço fixo",
    icon: <DollarSign className="h-6 w-6" />,
    active: false,
    price: 45.90,
    features: ["Buffet livre", "Cobrança por kg", "Variedade", "Rapidez"]
  },
  {
    id: "executivo",
    name: "Prato Executivo",
    description: "Menu executivo para almoços corporativos",
    icon: <Clock className="h-6 w-6" />,
    active: false,
    price: 25.90,
    features: ["Preço fixo", "Opções limitadas", "Rapidez", "Horário específico"]
  }
];

const timeSlots = [
  { id: "almoco", label: "Almoço", time: "11:30 - 15:00", active: true },
  { id: "jantar", label: "Jantar", time: "18:00 - 23:00", active: true },
  { id: "lanche", label: "Lanche", time: "15:00 - 18:00", active: false }
];

export const OperationsPanel = ({ onBack }: OperationsPanelProps) => {
  const [modes, setModes] = useState<OperationMode[]>(operationModes);
  const [slots, setSlots] = useState(timeSlots);

  const toggleMode = (modeId: string) => {
    setModes(modes.map(mode => 
      mode.id === modeId ? { ...mode, active: !mode.active } : mode
    ));
  };

  const toggleTimeSlot = (slotId: string) => {
    setSlots(slots.map(slot =>
      slot.id === slotId ? { ...slot, active: !slot.active } : slot
    ));
  };

  const activeModes = modes.filter(mode => mode.active);
  const activeSlots = slots.filter(slot => slot.active);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold">Operações do Restaurante</h1>
      </div>

      <Card className="bg-gradient-subtle border-primary/20">
        <CardHeader>
          <CardTitle>Configuração Operacional</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Configure os tipos de operação do seu restaurante. Você pode ativar múltiplos modos
            e definir horários específicos para cada um.
          </p>
          <div className="flex gap-2 mt-3">
            <Badge variant="outline" className="bg-primary/10">
              {activeModes.length} modo(s) ativo(s)
            </Badge>
            <Badge variant="outline" className="bg-accent/10">
              {activeSlots.length} horário(s) ativo(s)
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Modos de Operação</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modes.map((mode) => (
              <Card 
                key={mode.id}
                className={`hover:shadow-pdv transition-all duration-200 ${
                  mode.active ? 'ring-2 ring-primary/20 bg-primary/5' : ''
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl ${
                        mode.active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                      }`}>
                        {mode.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{mode.name}</CardTitle>
                        {mode.price && (
                          <div className="text-sm font-medium text-primary">
                            R$ {mode.price.toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>
                    <Switch
                      checked={mode.active}
                      onCheckedChange={() => toggleMode(mode.id)}
                    />
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {mode.description}
                  </p>
                  
                  <div>
                    <span className="text-sm font-medium">Características:</span>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {mode.features.map((feature, index) => (
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
                  
                  {mode.active && (
                    <div className="pt-2 border-t">
                      <Button variant="outline" size="sm" className="w-full">
                        Configurar {mode.name}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Horários de Funcionamento</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {slots.map((slot) => (
              <Card 
                key={slot.id}
                className={`${slot.active ? 'ring-2 ring-primary/20 bg-primary/5' : ''}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-medium">{slot.label}</h3>
                      <p className="text-sm text-muted-foreground">{slot.time}</p>
                    </div>
                    <Switch
                      checked={slot.active}
                      onCheckedChange={() => toggleTimeSlot(slot.id)}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {activeModes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Resumo Operacional</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium">Modos ativos:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {activeModes.map((mode) => (
                      <Badge key={mode.id} className="bg-primary/10 text-primary">
                        {mode.name}
                        {mode.price && ` - R$ ${mode.price.toFixed(2)}`}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <span className="text-sm font-medium">Horários ativos:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {activeSlots.map((slot) => (
                      <Badge key={slot.id} variant="secondary">
                        {slot.label} ({slot.time})
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  O sistema ajustará automaticamente as opções disponíveis conforme os modos 
                  e horários ativos.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};