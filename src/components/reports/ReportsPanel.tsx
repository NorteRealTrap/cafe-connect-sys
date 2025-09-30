import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, TrendingUp, DollarSign, ShoppingCart, Download } from "lucide-react";

interface ReportsPanelProps {
  onBack: () => void;
}

export const ReportsPanel = ({ onBack }: ReportsPanelProps) => {
  const [period, setPeriod] = useState("hoje");

  const salesData = {
    today: { total: 1250.80, orders: 45, avgTicket: 27.80 },
    week: { total: 8750.60, orders: 315, avgTicket: 27.78 },
    month: { total: 35200.40, orders: 1260, avgTicket: 27.94 }
  };

  const topProducts = [
    { name: "Hambúrguer Artesanal", quantity: 25, revenue: 722.50 },
    { name: "Pizza Margherita", quantity: 18, revenue: 772.20 },
    { name: "Açaí 500ml", quantity: 32, revenue: 592.00 },
    { name: "Café Espresso", quantity: 48, revenue: 216.00 }
  ];

  const currentData = useMemo(() => {
    switch (period) {
      case "hoje": return salesData.today;
      case "semana": return salesData.week;
      case "mes": return salesData.month;
      default: return salesData.today;
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturamento</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              R$ {currentData.total.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              +12% em relação ao período anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {currentData.orders}
            </div>
            <p className="text-xs text-muted-foreground">
              +8% em relação ao período anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              R$ {currentData.avgTicket.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              +3% em relação ao período anterior
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="vendas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="vendas">Vendas</TabsTrigger>
          <TabsTrigger value="produtos">Produtos</TabsTrigger>
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
        </TabsList>

        <TabsContent value="vendas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vendas por Período</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Gráfico de vendas seria exibido aqui</p>
                </div>
              </div>
            </CardContent>
          </Card>
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
                  <div key={product.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.quantity} unidades vendidas
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">
                        R$ {product.revenue.toFixed(2)}
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
                <div className="flex justify-between">
                  <span>PIX</span>
                  <span className="font-bold">45%</span>
                </div>
                <div className="flex justify-between">
                  <span>Cartão de Crédito</span>
                  <span className="font-bold">35%</span>
                </div>
                <div className="flex justify-between">
                  <span>Dinheiro</span>
                  <span className="font-bold">15%</span>
                </div>
                <div className="flex justify-between">
                  <span>Cartão de Débito</span>
                  <span className="font-bold">5%</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Resumo Financeiro</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Receita Bruta</span>
                  <span className="font-bold text-green-600">R$ {currentData.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Impostos</span>
                  <span className="font-bold text-red-600">R$ {(currentData.total * 0.1).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxa de Serviço</span>
                  <span className="font-bold text-blue-600">R$ {(currentData.total * 0.1).toFixed(2)}</span>
                </div>
                <hr />
                <div className="flex justify-between">
                  <span className="font-bold">Receita Líquida</span>
                  <span className="font-bold text-primary">R$ {(currentData.total * 0.8).toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};