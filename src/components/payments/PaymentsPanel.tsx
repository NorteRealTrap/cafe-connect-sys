import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, DollarSign, Smartphone, Receipt } from "lucide-react";

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
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: "1",
      orderId: "001",
      amount: 45.90,
      method: "cartao",
      status: "aprovado",
      timestamp: "14:30",
      customer: "João Silva"
    },
    {
      id: "2",
      orderId: "002",
      amount: 28.50,
      method: "pix",
      status: "processando",
      timestamp: "14:25",
      customer: "Maria Santos"
    },
    {
      id: "3",
      orderId: "003",
      amount: 67.80,
      method: "dinheiro",
      status: "pendente",
      timestamp: "14:20",
      customer: "Carlos Lima"
    }
  ]);

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "cartao": return <CreditCard className="h-4 w-4" />;
      case "pix": return <Smartphone className="h-4 w-4" />;
      case "dinheiro": return <DollarSign className="h-4 w-4" />;
      case "vale": return <Receipt className="h-4 w-4" />;
      default: return null;
    }
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case "cartao": return "Cartão";
      case "pix": return "PIX";
      case "dinheiro": return "Dinheiro";
      case "vale": return "Vale";
      default: return method;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "aprovado": return "bg-green-100 text-green-800";
      case "processando": return "bg-yellow-100 text-yellow-800";
      case "pendente": return "bg-blue-100 text-blue-800";
      case "rejeitado": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const processPayment = (paymentId: string) => {
    setPayments(prev => prev.map(payment => 
      payment.id === paymentId 
        ? { ...payment, status: "aprovado" as const }
        : payment
    ));
  };

  const todayTotal = payments
    .filter(p => p.status === "aprovado")
    .reduce((sum, p) => sum + p.amount, 0);

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
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {payments.filter(p => p.status === "pendente").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Processando</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {payments.filter(p => p.status === "processando").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {payments.filter(p => p.status === "aprovado").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="todos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="pendente">Pendentes</TabsTrigger>
          <TabsTrigger value="processando">Processando</TabsTrigger>
          <TabsTrigger value="aprovado">Aprovados</TabsTrigger>
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
                          Pedido #{payment.orderId} - {payment.customer}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {getMethodLabel(payment.method)} • {payment.timestamp}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-primary">
                        R$ {payment.amount.toFixed(2)}
                      </div>
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-end gap-2">
                    {payment.status === "pendente" && (
                      <Button 
                        size="sm" 
                        variant="success"
                        onClick={() => processPayment(payment.id)}
                      >
                        Processar Pagamento
                      </Button>
                    )}
                    {payment.status === "processando" && (
                      <Button 
                        size="sm" 
                        variant="success"
                        onClick={() => processPayment(payment.id)}
                      >
                        Confirmar Pagamento
                      </Button>
                    )}
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