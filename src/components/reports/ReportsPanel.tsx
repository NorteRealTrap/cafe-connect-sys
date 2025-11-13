import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { revenueSync } from '@/lib/revenue-sync';
import { analyticsEngine } from '@/lib/analytics';
import { financialSystem } from '@/lib/financial';
import { BarChart3, TrendingUp, DollarSign, Package, Download } from 'lucide-react';
import { toast } from 'sonner';

interface ReportsPanelProps {
  onBack: () => void;
}

export const ReportsPanel = ({ onBack }: ReportsPanelProps) => {
  const [report, setReport] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = () => {
    setLoading(true);
    try {
      revenueSync.syncAllCompletedOrders();
      const data = revenueSync.getRevenueReport();
      setReport(data);
    } catch (error) {
      toast.error('Erro ao carregar relatório');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  const exportReport = () => {
    const data = JSON.stringify(report, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    toast.success('Relatório exportado!');
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <p>Carregando relatórios...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Relatórios</h2>
          <p className="text-muted-foreground">Análise completa de vendas e faturamento</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportReport} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={loadReport} variant="outline" size="sm">
            Atualizar
          </Button>
          <Button onClick={onBack} variant="outline">
            Voltar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList>
          <TabsTrigger value="summary">Resumo</TabsTrigger>
          <TabsTrigger value="financial">Financeiro</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Total de Pedidos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{report.summary?.totalOrders || 0}</div>
                <p className="text-xs text-muted-foreground">Pedidos completados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Receita Total
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(report.summary?.totalRevenue || 0)}
                </div>
                <p className="text-xs text-muted-foreground">Receita líquida</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Ticket Médio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(report.summary?.averageTicket || 0)}
                </div>
                <p className="text-xs text-muted-foreground">Por pedido</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Lucro
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {formatCurrency(report.summary?.profit || 0)}
                </div>
                <p className="text-xs text-muted-foreground">Receita - Despesas</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Receitas</CardTitle>
                <CardDescription>Breakdown de receitas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Receita Bruta:</span>
                  <span className="font-bold">{formatCurrency(report.financial?.grossRevenue || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxas:</span>
                  <span className="font-bold text-red-600">-{formatCurrency(report.financial?.totalFees || 0)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-medium">Receita Líquida:</span>
                  <span className="font-bold text-green-600">{formatCurrency(report.financial?.netRevenue || 0)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Métodos de Pagamento</CardTitle>
                <CardDescription>Distribuição por forma</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(report.financial?.paymentsByMethod || {}).map(([method, amount]) => (
                  <div key={method} className="flex justify-between">
                    <span className="capitalize">{method.replace('_', ' ')}:</span>
                    <span className="font-bold">{formatCurrency(amount as number)}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Receita por Período</CardTitle>
                <CardDescription>Breakdown temporal</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hoje:</span>
                  <span className="font-bold">{formatCurrency(report.analytics?.dailyRevenue || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Este Mês:</span>
                  <span className="font-bold">{formatCurrency(report.analytics?.monthlyRevenue || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="font-bold text-primary">{formatCurrency(report.analytics?.totalRevenue || 0)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Receita por Categoria</CardTitle>
                <CardDescription>Top categorias</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(report.analytics?.categoryBreakdown || {})
                  .sort(([, a], [, b]) => (b as number) - (a as number))
                  .slice(0, 5)
                  .map(([category, amount]) => (
                    <div key={category} className="flex justify-between">
                      <span className="capitalize">{category}:</span>
                      <span className="font-bold">{formatCurrency(amount as number)}</span>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
