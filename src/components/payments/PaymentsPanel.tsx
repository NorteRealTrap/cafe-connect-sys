import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, CreditCard, Banknote, QrCode, Smartphone } from "lucide-react";

interface PaymentsPanelProps {
  onBack: () => void;
}

type PaymentMethod = "dinheiro" | "cartao" | "pix" | "debito";

interface Payment {
  id: number;
  orderId: string;
  amount: number;
  method: PaymentMethod;
  status: "pendente" | "processando" | "aprovado" | "recusado";
  timestamp: string;
}

const mockPayments: Payment[] = [
  { id: 1, orderId: "PDV-001", amount: 45.90, method: "cartao", status: "aprovado", timestamp: "19:45" },
  { id: 2, orderId: "PDV-002", amount: 28.50, method: "pix", status: "pendente", timestamp: "19:48" },
  { id: 3, orderId: "PDV-003", amount: 67.80, method: "dinheiro", status: "aprovado", timestamp: "19:50" },
];

export const PaymentsPanel = ({ onBack }: PaymentsPanelProps) => {
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [newPaymentAmount, setNewPaymentAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("dinheiro");

  const getMethodIcon = (method: PaymentMethod) => {
    const icons = {
      dinheiro: <Banknote className="h-4 w-4" />,
      cartao: <CreditCard className="h-4 w-4" />,
      pix: <QrCode className="h-4 w-4" />,
      debito: <Smartphone className="h-4 w-4" />
    };
    return icons[method];
  };

  const getMethodLabel = (method: PaymentMethod) => {
    const labels = {
      dinheiro: "Dinheiro",
      cartao: "Cartão",
      pix: "PIX",
      debito: "Débito"
    };
    return labels[method];
  };

  const getStatusBadge = (status: Payment["status"]) => {
    const variants = {
      pendente: "secondary",
      processando: "outline",
      aprovado: "default",
      recusado: "destructive"
    } as const;

    const labels = {
      pendente: "Pendente",
      processando: "Processando",
      aprovado: "Aprovado",
      recusado: "Recusado"
    };

    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  const processPayment = () => {
    if (!newPaymentAmount) return;

    const newPayment: Payment = {
      id: payments.length + 1,
      orderId: `PDV-${String(payments.length + 4).padStart(3, '0')}`,
      amount: parseFloat(newPaymentAmount),
      method: selectedMethod,
      status: selectedMethod === "dinheiro" ? "aprovado" : "processando",
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setPayments([newPayment, ...payments]);
    setNewPaymentAmount("");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold">Pagamentos</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Processar Novo Pagamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="Valor (R$)"
              value={newPaymentAmount}
              onChange={(e) => setNewPaymentAmount(e.target.value)}
              type="number"
              step="0.01"
              className="flex-1"
            />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {(["dinheiro", "cartao", "pix", "debito"] as PaymentMethod[]).map((method) => (
              <Button
                key={method}
                variant={selectedMethod === method ? "default" : "outline"}
                onClick={() => setSelectedMethod(method)}
                className="flex items-center gap-2"
              >
                {getMethodIcon(method)}
                {getMethodLabel(method)}
              </Button>
            ))}
          </div>
          
          <Button onClick={processPayment} className="w-full" disabled={!newPaymentAmount}>
            Processar Pagamento
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Histórico de Pagamentos</h2>
        {payments.map((payment) => (
          <Card key={payment.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {getMethodIcon(payment.method)}
                  <span className="font-medium">{payment.orderId}</span>
                </div>
                <span className="text-muted-foreground">{payment.timestamp}</span>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="font-bold text-lg">
                  R$ {payment.amount.toFixed(2)}
                </span>
                {getStatusBadge(payment.status)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};