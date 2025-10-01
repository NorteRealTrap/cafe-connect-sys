import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, TrendingUp, DollarSign, ShoppingCart, Download } from "lucide-react";
import { MetricsCards } from "@/components/analytics/MetricsCards";
import { RevenueChart } from "@/components/analytics/RevenueChart";
import { FinancialDashboard } from "@/components/analytics/FinancialDashboard";
import { analyticsEngine } from "@/lib/analytics";
import { financialSystem } from "@/lib/financial";

interface ReportsPanelProps {
  onBack: () => void;
}

export const ReportsPanel = ({ onBack }: ReportsPanelProps) => {
  const [period, setPeriod] = useState("hoje");
  
  const metrics = analyticsEngine.getRevenueMetrics();
  const topProducts = metrics.topProducts;
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const currentData = useMemo(() => {
    switch (period) {
      case "hoje": return { total: metrics.dailyRevenue, orders: Math.floor(metrics.dailyRevenue / metrics.averageTicket), avgTicket: metrics.averageTicket };
      case "semana": return { total: metrics.monthlyRevenue * 0.25, orders: Math.floor(metrics.totalOrders * 0.25), avgTicket: metrics.averageTicket };
      case "mes": return { total: metrics.monthlyRevenue, orders: metrics.totalOrders, avgTicket: metrics.averageTicket };
      default: return { total: metrics.dailyRevenue, orders: Math.floor(metrics.dailyRevenue / metrics.averageTicket), avgTicket: metrics.averageTicket };
    }
  }, [period, metrics]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Relatórios e Analytics</h2>
          <p className="text-muted-foreground">Acompanhe o desempenho do seu negócio</p>
        </div>
        <div className="flex gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hoje">Hoje</SelectItem>
              <SelectItem value="semana">Semana</SelectItem>
              <SelectItem value="mes">Mês</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={onBack}>
            Voltar
          </Button>
        </div>
      </div>

      <MetricsCards />

      <Tabs defaultValue="vendas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="vendas">Vendas</TabsTrigger>
          <TabsTrigger value="produtos">Produtos</TabsTrigger>
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard Integrado</TabsTrigger>
        </TabsList>

        <TabsContent value="vendas" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <RevenueChart 
              type="daily" 
              title="Receita Diária" 
              description="Últimos 30 dias" 
            />
            <RevenueChart 
              type="hourly" 
              title="Receita por Horário" 
              description="Distribuição ao longo do dia" 
            />
          </div>
          <RevenueChart 
            type="category" 
            title="Receita por Categoria" 
            description="Distribuição por tipo de produto" 
          />
        </TabsContent>

        <TabsContent value="produtos" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Produtos Mais Vendidos</CardTitle>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4" />
                Exportar
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product) => (
                  <div key={product.product} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{product.product}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.quantity} unidades vendidas
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">
                        {formatCurrency(product.revenue)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financeiro" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Formas de Pagamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(metrics.paymentMethodBreakdown).map(([method, value]) => {
                  const percentage = ((value / metrics.totalRevenue) * 100).toFixed(1);
                  const methodNames = {
                    'pix': 'PIX',
                    'cartao_credito': 'Cartão de Crédito',
                    'cartao_debito': 'Cartão de Débito',
                    'dinheiro': 'Dinheiro'
                  };
                  return (
                    <div key={method} className="flex justify-between">
                      <span>{methodNames[method as keyof typeof methodNames] || method}</span>
                      <div className="text-right">
                        <span className="font-bold">{percentage}%</span>
                        <div className="text-xs text-muted-foreground">
                          {formatCurrency(value)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Resumo Financeiro</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Receita Bruta</span>
                  <span className="font-bold text-green-600">{formatCurrency(currentData.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Impostos</span>
                  <span className="font-bold text-red-600">{formatCurrency(currentData.total * 0.1)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxa de Serviço</span>
                  <span className="font-bold text-blue-600">{formatCurrency(currentData.total * 0.1)}</span>
                </div>
                <hr />
                <div className="flex justify-between">
                  <span className="font-bold">Receita Líquida</span>
                  <span className="font-bold text-primary">{formatCurrency(currentData.total * 0.8)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-4">
          <FinancialDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};