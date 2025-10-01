import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { analyticsEngine } from "@/lib/analytics";
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Target } from "lucide-react";

export const MetricsCards = () => {
  const metrics = analyticsEngine.getRevenueMetrics();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const cards = [
    {
      title: "Receita Total",
      value: formatCurrency(metrics.totalRevenue),
      icon: <DollarSign className="h-4 w-4" />,
      trend: metrics.growthRate,
      description: "Total acumulado"
    },
    {
      title: "Receita Diária",
      value: formatCurrency(metrics.dailyRevenue),
      icon: <TrendingUp className="h-4 w-4" />,
      description: "Hoje"
    },
    {
      title: "Receita Mensal",
      value: formatCurrency(metrics.monthlyRevenue),
      icon: <Target className="h-4 w-4" />,
      trend: metrics.growthRate,
      description: "Este mês"
    },
    {
      title: "Ticket Médio",
      value: formatCurrency(metrics.averageTicket),
      icon: <Users className="h-4 w-4" />,
      description: "Por pedido"
    },
    {
      title: "Total de Pedidos",
      value: metrics.totalOrders.toString(),
      icon: <ShoppingCart className="h-4 w-4" />,
      description: "Pedidos realizados"
    },
    {
      title: "Receita Anual",
      value: formatCurrency(metrics.yearlyRevenue),
      icon: <TrendingUp className="h-4 w-4" />,
      description: "Este ano"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            {card.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{card.description}</p>
              {card.trend !== undefined && (
                <Badge variant={card.trend >= 0 ? "default" : "destructive"} className="flex items-center gap-1">
                  {card.trend >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {Math.abs(card.trend).toFixed(1)}%
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};