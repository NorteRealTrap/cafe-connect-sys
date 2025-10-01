import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { analyticsEngine } from "@/lib/analytics";
import { financialSystem } from "@/lib/financial";
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Target } from "lucide-react";
import { useEffect, useState } from "react";

export const MetricsCards = () => {
  const [metrics, setMetrics] = useState<any>({});
  const [summary, setSummary] = useState<any>({});

  useEffect(() => {
    const analyticsMetrics = analyticsEngine.getRevenueMetrics();
    const financialSummary = financialSystem.getFinancialSummary();
    setMetrics(analyticsMetrics);
    setSummary(financialSummary);
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const cards = [
    {
      title: "Receita Bruta",
      value: formatCurrency(summary.grossRevenue || 0),
      icon: <DollarSign className="h-4 w-4" />,
      description: "Total de vendas"
    },
    {
      title: "Receita Líquida",
      value: formatCurrency(summary.netRevenue || 0),
      icon: <TrendingUp className="h-4 w-4" />,
      description: "Após taxas"
    },
    {
      title: "Receita Diária",
      value: formatCurrency(metrics.dailyRevenue || 0),
      icon: <Target className="h-4 w-4" />,
      description: "Hoje"
    },
    {
      title: "Ticket Médio",
      value: formatCurrency(metrics.averageTicket || 0),
      icon: <Users className="h-4 w-4" />,
      description: "Por pedido"
    },
    {
      title: "Total de Pedidos",
      value: (metrics.totalOrders || 0).toString(),
      icon: <ShoppingCart className="h-4 w-4" />,
      description: "Pedidos realizados"
    },
    {
      title: "Lucro",
      value: formatCurrency(summary.profit || 0),
      icon: <TrendingUp className="h-4 w-4" />,
      trend: summary.profit >= 0 ? 5 : -5,
      description: "Receita - Despesas"
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
                  {card.trend >= 0 ? 'Positivo' : 'Negativo'}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};