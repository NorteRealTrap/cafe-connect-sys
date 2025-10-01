import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, TrendingUp, DollarSign, ShoppingCart, Download, FileText, Calendar } from "lucide-react";
import { MetricsCards } from "@/components/analytics/MetricsCards";
import { RevenueChart } from "@/components/analytics/RevenueChart";
import { FinancialDashboard } from "@/components/analytics/FinancialDashboard";
import { PaymentReports } from "@/components/analytics/PaymentReports";
import { analyticsEngine } from "@/lib/analytics";
import { financialSystem } from "@/lib/financial";
import { reportsDatabase, ReportData } from "@/lib/database-reports";

interface ReportsPanelProps {
  onBack: () => void;
}

export const ReportsPanel = ({ onBack }: ReportsPanelProps) => {
  const [period, setPeriod] = useState("hoje");
  const [reports, setReports] = useState<ReportData[]>([]);
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
  
  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = () => {
    const allReports = reportsDatabase.getAllReports();
    setReports(allReports);
  };
  
  const metrics = analyticsEngine.getRevenueMetrics();
  const topProducts = metrics.topProducts;
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const currentData = useMemo(() => {
    const summary = financialSystem.getFinancialSummary();
    const today = new Date();
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const payments = financialSystem.getAllPayments().filter(p => p.status === 'completed');
    
    switch (period) {
      case "hoje": {
        const todayPayments = payments.filter(p => p.date.toDateString() === today.toDateString());
        const total = todayPayments.reduce((sum, p) => sum + p.netAmount, 0);
        const orders = todayPayments.length;
        const avgTicket = orders > 0 ? total / orders : 0;
        return { total, orders, avgTicket };
      }
      case "semana": {
        const weekPayments = payments.filter(p => p.date >= thisWeek);
        const total = weekPayments.reduce((sum, p) => sum + p.netAmount, 0);
        const orders = weekPayments.length;
        const avgTicket = orders > 0 ? total / orders : 0;
        return { total, orders, avgTicket };
      }
      case "mes": {
        const monthPayments = payments.filter(p => p.date >= thisMonth);
        const total = monthPayments.reduce((sum, p) => sum + p.netAmount, 0);
        const orders = monthPayments.length;
        const avgTicket = orders > 0 ? total / orders : 0;
        return { total, orders, avgTicket };
      }
      default: {
        const todayPayments = payments.filter(p => p.date.toDateString() === today.toDateString());
        const total = todayPayments.reduce((sum, p) => sum + p.netAmount, 0);
        const orders = todayPayments.length;
        const avgTicket = orders > 0 ? total / orders : 0;
        return { total, orders, avgTicket };
      }
    }
  }, [period]);

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
          <TabsTrigger value="relatorios">Relatórios Salvos</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard Integrado</TabsTrigger>
        </TabsList>

        <TabsContent value="vendas" className="space-y-4">
          <PaymentReports />
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
                  <span className="font-bold text-green-600">{formatCurrency(currentData.total / 0.97)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxas de Pagamento</span>
                  <span className="font-bold text-red-600">{formatCurrency((currentData.total / 0.97) * 0.03)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Impostos Estimados</span>
                  <span className="font-bold text-orange-600">{formatCurrency(currentData.total * 0.08)}</span>
                </div>
                <hr />
                <div className="flex justify-between">
                  <span className="font-bold">Receita Líquida</span>
                  <span className="font-bold text-primary">{formatCurrency(currentData.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Lucro Estimado</span>
                  <span className="font-bold text-green-600">{formatCurrency(currentData.total * 0.92)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="relatorios" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Relatórios Gerados</h3>
            <div className="flex gap-2">
              <Button 
                variant="success" 
                onClick={() => {
                  const today = new Date();
                  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
                  reportsDatabase.generateReport('daily', startOfDay, endOfDay);
                  loadReports();
                }}
              >
                <FileText className="h-4 w-4" />
                Gerar Diário
              </Button>
              <Button 
                variant="info" 
                onClick={() => {
                  const today = new Date();
                  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                  reportsDatabase.generateReport('monthly', startOfMonth, endOfMonth);
                  loadReports();
                }}
              >
                <Calendar className="h-4 w-4" />
                Gerar Mensal
              </Button>
            </div>
          </div>
          
          <div className="grid gap-4">
            {reports.map((report) => (
              <Card key={report.id} className="cursor-pointer hover:shadow-md" onClick={() => setSelectedReport(report)}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="capitalize">
                        Relatório {report.type === 'daily' ? 'Diário' : report.type === 'monthly' ? 'Mensal' : report.type}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Período: {report.period}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">
                        {formatCurrency(report.metrics.netRevenue)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {report.metrics.totalOrders} pedidos
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Receita Bruta:</span>
                      <div className="font-bold">{formatCurrency(report.metrics.grossRevenue)}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Taxas:</span>
                      <div className="font-bold text-red-600">{formatCurrency(report.metrics.totalFees)}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Ticket Médio:</span>
                      <div className="font-bold">{formatCurrency(report.metrics.averageTicket)}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Lucro:</span>
                      <div className="font-bold text-green-600">{formatCurrency(report.metrics.profit)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {selectedReport && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Detalhes do Relatório</CardTitle>
                <Button variant="outline" onClick={() => setSelectedReport(null)}>Fechar</Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Métodos de Pagamento</h4>
                    {Object.entries(selectedReport.paymentBreakdown).map(([method, amount]) => (
                      <div key={method} className="flex justify-between">
                        <span className="capitalize">{method.replace('_', ' ')}</span>
                        <span className="font-bold">{formatCurrency(amount as number)}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Top Produtos</h4>
                    {selectedReport.topProducts.slice(0, 5).map((product) => (
                      <div key={product.product} className="flex justify-between">
                        <span>{product.product}</span>
                        <span className="font-bold">{formatCurrency(product.revenue)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-4">
          <FinancialDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};