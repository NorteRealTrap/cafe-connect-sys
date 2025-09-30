import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, TrendingUp, DollarSign, Package, Users, Download } from "lucide-react";

interface ReportsPanelProps {
  onBack: () => void;
}

const salesData = [
  { period: "Hoje", revenue: 1250.80, orders: 45, avgTicket: 27.80 },
  { period: "Ontem", revenue: 980.50, orders: 38, avgTicket: 25.80 },
  { period: "Esta Semana", revenue: 8750.20, orders: 312, avgTicket: 28.04 },
  { period: "Semana Passada", revenue: 7890.15, orders: 298, avgTicket: 26.48 },
  { period: "Este Mês", revenue: 35240.80, orders: 1250, avgTicket: 28.19 },
  { period: "Mês Passado", revenue: 32180.50, orders: 1180, avgTicket: 27.27 }
];

const topProducts = [
  { name: "Hambúrguer Especial", sold: 85, revenue: 2380.00 },
  { name: "Pizza Margherita", sold: 62, revenue: 1860.00 },
  { name: "Batata Frita", sold: 120, revenue: 1200.00 },
  { name: "Refrigerante", sold: 150, revenue: 900.00 },
  { name: "Lasanha", sold: 35, revenue: 1050.00 }
];

const cashFlowData = [
  { date: "01/12", entrada: 1250.80, saida: 450.30, saldo: 800.50 },
  { date: "02/12", entrada: 980.50, saida: 380.20, saldo: 600.30 },
  { date: "03/12", entrada: 1580.20, saida: 520.80, saldo: 1059.40 },
  { date: "04/12", entrada: 1120.90, saida: 410.50, saldo: 710.40 },
  { date: "05/12", entrada: 1350.75, saida: 480.90, saldo: 869.85 }
];

export const ReportsPanel = ({ onBack }: ReportsPanelProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState("Hoje");

  const exportReport = (type: string) => {
    // Simular exportação
    console.log(`Exportando relatório: ${type}`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold">Relatórios</h1>
        </div>
        <Button variant="outline" onClick={() => exportReport("geral")}>
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </div>

      <Tabs defaultValue="vendas" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="vendas">Vendas</TabsTrigger>
          <TabsTrigger value="produtos">Produtos</TabsTrigger>
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
          <TabsTrigger value="clientes">Clientes</TabsTrigger>
        </TabsList>

        <TabsContent value="vendas" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {salesData.slice(0, 3).map((data, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{data.period}</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R$ {data.revenue.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    {data.orders} pedidos • Ticket médio: R$ {data.avgTicket.toFixed(2)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Histórico de Vendas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salesData.map((data, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-2">
                    <span className="font-medium">{data.period}</span>
                    <div className="text-right">
                      <div className="font-bold">R$ {data.revenue.toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">{data.orders} pedidos</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="produtos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Produtos Mais Vendidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-lg text-muted-foreground">
                        #{index + 1}
                      </span>
                      <span className="font-medium">{product.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">R$ {product.revenue.toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">{product.sold} vendidos</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financeiro" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">R$ 35.240,80</div>
                <p className="text-xs text-muted-foreground">Este mês</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Despesas</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">R$ 8.750,20</div>
                <p className="text-xs text-muted-foreground">Este mês</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">R$ 26.490,60</div>
                <p className="text-xs text-muted-foreground">Este mês</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Fluxo de Caixa Diário</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cashFlowData.map((data, index) => (
                  <div key={index} className="grid grid-cols-4 gap-4 text-sm">
                    <span className="font-medium">{data.date}</span>
                    <span className="text-success">+R$ {data.entrada.toFixed(2)}</span>
                    <span className="text-destructive">-R$ {data.saida.toFixed(2)}</span>
                    <span className="font-bold">R$ {data.saldo.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clientes" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.847</div>
                <p className="text-xs text-muted-foreground">+180 este mês</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.250</div>
                <p className="text-xs text-muted-foreground">Últimos 30 dias</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};