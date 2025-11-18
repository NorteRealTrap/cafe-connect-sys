import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { financialSystem } from "@/lib/financial";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export const PaymentReports = () => {
  const [dailyData, setDailyData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = () => {
    const payments = financialSystem.getAllPayments()
      .filter(p => p.status === 'completed');

    // Dados diários (últimos 30 dias)
    const today = new Date();
    const dailyChart = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const dayPayments = payments.filter(p => 
        p.date.toDateString() === date.toDateString()
      );
      
      const grossRevenue = dayPayments.reduce((sum, p) => sum + p.amount, 0);
      const netRevenue = dayPayments.reduce((sum, p) => sum + p.netAmount, 0);
      const fees = dayPayments.reduce((sum, p) => sum + p.fees, 0);
      
      dailyChart.push({
        date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        grossRevenue,
        netRevenue,
        fees,
        orders: dayPayments.length
      });
    }
    setDailyData(dailyChart);

    // Dados mensais (últimos 12 meses)
    const monthlyChart = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const nextMonth = new Date(today.getFullYear(), today.getMonth() - i + 1, 0);
      
      const monthPayments = payments.filter(p => 
        p.date >= date && p.date <= nextMonth
      );
      
      const grossRevenue = monthPayments.reduce((sum, p) => sum + p.amount, 0);
      const netRevenue = monthPayments.reduce((sum, p) => sum + p.netAmount, 0);
      const fees = monthPayments.reduce((sum, p) => sum + p.fees, 0);
      
      monthlyChart.push({
        month: date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
        grossRevenue,
        netRevenue,
        fees,
        orders: monthPayments.length
      });
    }
    setMonthlyData(monthlyChart);

    // Métodos de pagamento
    const methodStats: { [key: string]: { amount: number; fees: number; count: number } } = {};
    payments.forEach(p => {
      if (!methodStats[p.method]) {
        methodStats[p.method] = { amount: 0, fees: 0, count: 0 };
      }
      methodStats[p.method].amount += p.amount;
      methodStats[p.method].fees += p.fees;
      methodStats[p.method].count += 1;
    });

    const methodsArray = Object.entries(methodStats).map(([method, stats]) => ({
      method,
      ...stats,
      netAmount: stats.amount - stats.fees,
      avgFee: stats.count > 0 ? stats.fees / stats.count : 0
    }));

    setPaymentMethods(methodsArray);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getMethodLabel = (method: string) => {
    const labels: { [key: string]: string } = {
      'dinheiro': 'Dinheiro',
      'pix': 'PIX',
      'cartao_credito': 'Cartão Crédito',
      'cartao_debito': 'Cartão Débito'
    };
    return labels[method] || method;
  };

  return (
    <div className="space-y-6">
      {/* Gráfico Diário */}
      <Card>
        <CardHeader>
          <CardTitle>Faturamento Diário</CardTitle>
          <CardDescription>Receita bruta vs líquida - últimos 30 dias</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={(value) => `R$ ${value.toFixed(0)}`} />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  formatCurrency(value), 
                  name === 'grossRevenue' ? 'Receita Bruta' : 
                  name === 'netRevenue' ? 'Receita Líquida' : 'Taxas'
                ]} 
              />
              <Line type="monotone" dataKey="grossRevenue" stroke="#8884d8" strokeWidth={2} name="Receita Bruta" />
              <Line type="monotone" dataKey="netRevenue" stroke="#82ca9d" strokeWidth={2} name="Receita Líquida" />
              <Line type="monotone" dataKey="fees" stroke="#ff7300" strokeWidth={2} name="Taxas" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico Mensal */}
      <Card>
        <CardHeader>
          <CardTitle>Faturamento Mensal</CardTitle>
          <CardDescription>Evolução mensal - últimos 12 meses</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `R$ ${value.toFixed(0)}`} />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  formatCurrency(value), 
                  name === 'grossRevenue' ? 'Receita Bruta' : 
                  name === 'netRevenue' ? 'Receita Líquida' : 'Taxas'
                ]} 
              />
              <Bar dataKey="grossRevenue" fill="#8884d8" name="Receita Bruta" />
              <Bar dataKey="netRevenue" fill="#82ca9d" name="Receita Líquida" />
              <Bar dataKey="fees" fill="#ff7300" name="Taxas" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Análise por Método de Pagamento */}
      <Card>
        <CardHeader>
          <CardTitle>Análise por Método de Pagamento</CardTitle>
          <CardDescription>Performance e custos por forma de pagamento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div key={method.method} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{getMethodLabel(method.method)}</h4>
                  <Badge variant="outline">{method.count} transações</Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Receita Bruta</div>
                    <div className="font-bold text-blue-600">{formatCurrency(method.amount)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Receita Líquida</div>
                    <div className="font-bold text-green-600">{formatCurrency(method.netAmount)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Total Taxas</div>
                    <div className="font-bold text-red-600">{formatCurrency(method.fees)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Taxa Média</div>
                    <div className="font-bold text-orange-600">{formatCurrency(method.avgFee)}</div>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-xs text-muted-foreground">
                    Taxa efetiva: {method.amount > 0 ? ((method.fees / method.amount) * 100).toFixed(2) : 0}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};