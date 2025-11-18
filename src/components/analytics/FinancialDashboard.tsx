import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { financialSystem } from "@/lib/financial";
import { analyticsEngine } from "@/lib/analytics";
import { revenueSync } from "@/lib/revenue-sync";
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Smartphone, Receipt, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const FinancialDashboard = () => {
  const [summary, setSummary] = useState<any>({});
  const [metrics, setMetrics] = useState<any>({});

  const loadData = () => {
    // Sincronizar pedidos completados primeiro
    revenueSync.syncAllCompletedOrders();
    
    const financialSummary = financialSystem.getFinancialSummary();
    const analyticsMetrics = analyticsEngine.getRevenueMetrics();
    setSummary(financialSummary);
    setMetrics(analyticsMetrics);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSync = () => {
    toast.info('Sincronizando dados...');
    loadData();
    toast.success('Dados sincronizados!');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'cartao_credito':
      case 'cartao_debito':
        return <CreditCard className="h-4 w-4" />;
      case 'pix':
        return <Smartphone className="h-4 w-4" />;
      case 'dinheiro':
        return <DollarSign className="h-4 w-4" />;
      default:
        return <Receipt className="h-4 w-4" />;
    }
  };

  const getPaymentLabel = (method: string) => {
    switch (method) {
      case 'cartao_credito': return 'Cartão Crédito';
      case 'cartao_debito': return 'Cartão Débito';
      case 'pix': return 'PIX';
      case 'dinheiro': return 'Dinheiro';
      default: return method;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Dashboard Financeiro</h2>
          <p className="text-muted-foreground">Visão completa de receitas e despesas</p>
        </div>
        <Button onClick={handleSync} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Sincronizar
        </Button>
      </div>
      {/* Resumo Financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Bruta</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(summary.grossRevenue || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de vendas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Líquida</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(summary.netRevenue || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Após taxas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Taxas</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(summary.totalFees || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Taxas de pagamento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lucro</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(summary.profit || 0)}
            </div>
            <div className="flex items-center gap-1">
              {summary.profit >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-600" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-600" />
              )}
              <p className="text-xs text-muted-foreground">
                Receita - Despesas
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Métodos de Pagamento */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Métodos de Pagamento</CardTitle>
            <CardDescription>Distribuição por forma de pagamento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(summary.paymentsByMethod || {}).map(([method, amount]) => {
              const percentage = summary.grossRevenue > 0 ? ((amount as number) / summary.grossRevenue * 100).toFixed(1) : '0';
              return (
                <div key={method} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getPaymentIcon(method)}
                    <span className="font-medium">{getPaymentLabel(method)}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{formatCurrency(amount as number)}</div>
                    <Badge variant="outline">{percentage}%</Badge>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Despesas por Categoria</CardTitle>
            <CardDescription>Breakdown de gastos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(summary.expensesByCategory || {}).map(([category, amount]) => {
              const percentage = summary.totalExpenses > 0 ? ((amount as number) / summary.totalExpenses * 100).toFixed(1) : '0';
              return (
                <div key={category} className="flex items-center justify-between">
                  <span className="font-medium capitalize">{category}</span>
                  <div className="text-right">
                    <div className="font-bold text-red-600">{formatCurrency(amount as number)}</div>
                    <Badge variant="destructive">{percentage}%</Badge>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Comparação com Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Comparação de Dados</CardTitle>
          <CardDescription>Validação entre sistemas financeiro e analytics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground">Sistema Financeiro</div>
              <div className="text-xl font-bold text-primary">
                {formatCurrency(summary.netRevenue || 0)}
              </div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground">Analytics</div>
              <div className="text-xl font-bold text-accent">
                {formatCurrency(metrics.totalRevenue || 0)}
              </div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-sm text-muted-foreground">Diferença</div>
              <div className={`text-xl font-bold ${Math.abs((summary.netRevenue || 0) - (metrics.totalRevenue || 0)) < 100 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(Math.abs((summary.netRevenue || 0) - (metrics.totalRevenue || 0)))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};