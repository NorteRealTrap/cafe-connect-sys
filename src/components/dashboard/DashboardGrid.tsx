import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ShoppingCart, 
  Users, 
  Package, 
  BarChart3, 
  Settings, 
  MessageSquare,
  Clock,
  CreditCard,
  Utensils,
  FileText,
  Store,
  Truck
} from "lucide-react";
import { UserRole } from "@/components/auth/LoginForm";
import { MetricsCards } from "@/components/analytics/MetricsCards";
import { RevenueChart } from "@/components/analytics/RevenueChart";

interface DashboardModule {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  roles: UserRole[];
  color: string;
}

const modules: DashboardModule[] = [
  {
    id: "pedidos",
    title: "Pedidos",
    description: "Gerenciar pedidos locais, delivery e retirada",
    icon: <ShoppingCart className="h-6 w-6" />,
    roles: ["admin", "caixa", "atendente"],
    color: "bg-gradient-primary"
  },
  {
    id: "cardapio",
    title: "Cardápio",
    description: "Produtos, categorias e menu",
    icon: <Utensils className="h-6 w-6" />,
    roles: ["admin", "caixa", "atendente"],
    color: "bg-gradient-accent"
  },
  {
    id: "mesas",
    title: "Mesas & Comandos",
    description: "Controle de mesas e comandos",
    icon: <Users className="h-6 w-6" />,
    roles: ["admin", "atendente"],
    color: "bg-info"
  },
  {
    id: "pagamentos",
    title: "Pagamentos",
    description: "Processar vendas e pagamentos",
    icon: <CreditCard className="h-6 w-6" />,
    roles: ["admin", "caixa"],
    color: "bg-success"
  },
  {
    id: "status",
    title: "Status dos Pedidos",
    description: "Acompanhamento em tempo real",
    icon: <Clock className="h-6 w-6" />,
    roles: ["admin", "caixa", "atendente"],
    color: "bg-warning"
  },
  {
    id: "estoque",
    title: "Estoque",
    description: "Controle de produtos e ingredientes",
    icon: <Package className="h-6 w-6" />,
    roles: ["admin"],
    color: "bg-primary"
  },
  {
    id: "relatorios",
    title: "Relatórios",
    description: "Vendas, produtos e financeiro",
    icon: <BarChart3 className="h-6 w-6" />,
    roles: ["admin"],
    color: "bg-accent"
  },
  {
    id: "comunicacao",
    title: "Comunicação",
    description: "WhatsApp, Instagram e contatos",
    icon: <MessageSquare className="h-6 w-6" />,
    roles: ["admin", "atendente"],
    color: "bg-info"
  },
  {
    id: "categorias",
    title: "Categorias",
    description: "Restaurante, confeitaria, bar, etc.",
    icon: <Store className="h-6 w-6" />,
    roles: ["admin"],
    color: "bg-secondary"
  },
  {
    id: "delivery",
    title: "Delivery",
    description: "Gestão de entregas e entregadores",
    icon: <Truck className="h-6 w-6" />,
    roles: ["admin", "atendente"],
    color: "bg-success"
  },
  {
    id: "operacoes",
    title: "Operações",
    description: "Rodízio, à la carte, self-service",
    icon: <FileText className="h-6 w-6" />,
    roles: ["admin"],
    color: "bg-warning"
  },
  {
    id: "usuarios",
    title: "Usuários",
    description: "Gerenciar usuários e permissões",
    icon: <Users className="h-6 w-6" />,
    roles: ["admin"],
    color: "bg-info"
  },
  {
    id: "configuracoes",
    title: "Configurações",
    description: "Configurações avançadas do sistema",
    icon: <Settings className="h-6 w-6" />,
    roles: ["admin"],
    color: "bg-muted"
  }
];

interface DashboardGridProps {
  userRole: UserRole;
  onModuleClick: (moduleId: string) => void;
}

export const DashboardGrid = ({ userRole, onModuleClick }: DashboardGridProps) => {
  const availableModules = modules.filter(module => 
    module.roles.includes(userRole)
  );

  return (
    <div className="space-y-6 p-6">
      {/* Analytics Overview */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Visão Geral</h2>
        <MetricsCards />
      </div>
      
      {/* Revenue Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RevenueChart 
          type="daily" 
          title="Receita Diária" 
          description="Últimos 30 dias" 
        />
        <RevenueChart 
          type="category" 
          title="Receita por Categoria" 
          description="Distribuição por tipo" 
        />
      </div>
      
      {/* Modules Grid */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Módulos do Sistema</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {availableModules.map((module) => (
            <Card 
              key={module.id} 
              className="group hover:shadow-pdv transition-all duration-200 cursor-pointer border-border/50"
              onClick={() => onModuleClick(module.id)}
            >
              <CardHeader className="pb-3">
                <div className={`w-12 h-12 ${module.color} rounded-xl flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform duration-200`}>
                  {module.icon}
                </div>
                <CardTitle className="text-lg">{module.title}</CardTitle>
                <CardDescription className="text-sm">
                  {module.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-primary hover:text-primary-hover"
                  onClick={(e) => {
                    e.stopPropagation();
                    onModuleClick(module.id);
                  }}
                >
                  Acessar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};