import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, DollarSign, Smartphone, Receipt } from "lucide-react";
import { financialSystem, Payment } from "@/lib/financial";
import { analyticsEngine } from "@/lib/analytics";

interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: "dinheiro" | "cartao" | "pix" | "vale";
  status: "pendente" | "processando" | "aprovado" | "rejeitado";
  timestamp: string;
  customer: string;
}

interface PaymentsPanelProps {
  onBack: () => void;
}

export const PaymentsPanel = ({ onBack }: PaymentsPanelProps) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [summary, setSummary] = useState<any>({});

  useEffect(() => {
    loadPayments();
    loadSummary();
  }, []);

  const loadPayments = () => {
    const allPayments = financialSystem.getAllPayments();
    setPayments(allPayments);
  };

  const loadSummary = () => {
    const financialSummary = financialSystem.getFinancialSummary();
    setSummary(financialSummary);
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "cartao_credito":
      case "cartao_debito": return <CreditCard className="h-4 w-4" />;
      case "pix": return <Smartphone className="h-4 w-4" />;
      case "dinheiro": return <DollarSign className="h-4 w-4" />;
      default: return <Receipt className="h-4 w-4" />;
    }
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case "cartao_credito": return "Cartão Crédito";
      case "cartao_debito": return "Cartão Débito";
      case "pix": return "PIX";
      case "dinheiro": return "Dinheiro";
      default: return method;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "failed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed": return "Aprovado";
      case "pending": return "Pendente";
      case "failed": return "Rejeitado";
      default: return status;
    }
  };

  const processPayment = (orderId: string, amount: number, method: Payment['method']) => {
    financialSystem.processPayment(orderId, amount, method);
    loadPayments();
    loadSummary();
    
    // Atualizar analytics
    analyticsEngine.addSale({
      date: new Date(),
      category: 'vendas',
      product: `Pedido #${orderId}`,
      quantity: 1,
      unitPrice: amount,
      totalValue: amount,
      paymentMethod: method,
      status: 'completed'
    });
  };

  const todayTotal = summary.netRevenue || 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gerenciamento de Pagamentos</h2>
          <p className="text-muted-foreground">Processe vendas e acompanhe pagamentos</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack}>
            Voltar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              R$ {todayTotal.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Receita Bruta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              R$ {(summary.grossRevenue || 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taxas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              R$ {(summary.totalFees || 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Lucro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {(summary.profit || 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="todos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="pending">Pendentes</TabsTrigger>
          <TabsTrigger value="completed">Aprovados</TabsTrigger>
          <TabsTrigger value="failed">Rejeitados</TabsTrigger>
        </TabsList>

        <TabsContent value="todos" className="space-y-4">
          <div className="grid gap-4">
            {payments.map((payment) => (
              <Card key={payment.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        {getMethodIcon(payment.method)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          Pedido #{payment.orderId}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {getMethodLabel(payment.method)} • {payment.date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-primary">
                        R$ {payment.amount.toFixed(2)}
                      </div>
                      <Badge className={getStatusColor(payment.status)}>
                        {getStatusLabel(payment.status)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-end gap-2">
                    {payment.status === "pending" && (
                      <Button 
                        size="sm" 
                        variant="success"
                        onClick={() => processPayment(payment.orderId, payment.amount, payment.method)}
                      >
                        Confirmar Pagamento
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      Taxa: R$ {payment.fees.toFixed(2)}
                    </Button>
                    <Button size="sm" variant="ghost">
                      Líquido: R$ {payment.netAmount.toFixed(2)}
                    </Button>
                    <Button size="sm" variant="outline">
                      Ver Detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};