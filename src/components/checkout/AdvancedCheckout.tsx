import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Banknote, Smartphone, Receipt, Percent, Plus, Minus, Calculator } from "lucide-react";
import { toast } from "sonner";

interface CheckoutItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

interface AdvancedCheckoutProps {
  open: boolean;
  onClose: () => void;
  order: {
    id: string;
    customerName: string;
    items: CheckoutItem[];
    total: number;
    type?: string;
    table?: number;
  } | null;
  onPaymentComplete: (orderId: string, paymentData: any) => void;
}

export const AdvancedCheckout = ({ open, onClose, order, onPaymentComplete }: AdvancedCheckoutProps) => {
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [receivedAmount, setReceivedAmount] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const [discountType, setDiscountType] = useState<"percent" | "value">("percent");
  const [splitPayment, setSplitPayment] = useState(false);
  const [payments, setPayments] = useState<Array<{ method: string; amount: number }>>([]);
  const [processing, setProcessing] = useState(false);

  if (!order) return null;

  const subtotal = order.total;
  const discountAmount = discountType === "percent" 
    ? (subtotal * discount) / 100 
    : discount;
  const finalTotal = Math.max(0, subtotal - discountAmount);
  const paidAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const remainingAmount = finalTotal - paidAmount;
  const received = parseFloat(receivedAmount) || 0;
  const change = paymentMethod === "dinheiro" ? Math.max(0, received - remainingAmount) : 0;

  const quickAmounts = [10, 20, 50, 100, 200];

  const addPayment = () => {
    if (!paymentMethod || remainingAmount <= 0) return;

    const amount = paymentMethod === "dinheiro" 
      ? Math.min(received, remainingAmount)
      : remainingAmount;

    setPayments([...payments, { method: paymentMethod, amount }]);
    setPaymentMethod("");
    setReceivedAmount("");
    toast.success(`Pagamento de R$ ${amount.toFixed(2)} adicionado`);
  };

  const removePayment = (index: number) => {
    setPayments(payments.filter((_, i) => i !== index));
  };

  const handleComplete = async () => {
    if (remainingAmount > 0.01) {
      toast.error("Valor restante não pago");
      return;
    }

    setProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    onPaymentComplete(order.id, {
      payments: splitPayment ? payments : [{ method: paymentMethod, amount: finalTotal }],
      subtotal,
      discount: discountAmount,
      discountType,
      finalTotal,
      change: splitPayment ? 0 : change,
      receivedAmount: splitPayment ? paidAmount : received
    });

    handleClose();
    toast.success("Pagamento concluído com sucesso!");
  };

  const handleClose = () => {
    setPaymentMethod("");
    setReceivedAmount("");
    setDiscount(0);
    setSplitPayment(false);
    setPayments([]);
    setProcessing(false);
    onClose();
  };

  const paymentMethods = [
    { id: "dinheiro", label: "Dinheiro", icon: <Banknote className="h-5 w-5" />, color: "bg-green-500" },
    { id: "debito", label: "Débito", icon: <CreditCard className="h-5 w-5" />, color: "bg-blue-500" },
    { id: "credito", label: "Crédito", icon: <CreditCard className="h-5 w-5" />, color: "bg-purple-500" },
    { id: "pix", label: "PIX", icon: <Smartphone className="h-5 w-5" />, color: "bg-teal-500" },
    { id: "vale", label: "Vale", icon: <Receipt className="h-5 w-5" />, color: "bg-orange-500" }
  ];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Checkout Avançado - Pedido #{order.id}
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Coluna Esquerda - Resumo */}
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cliente:</span>
                  <span className="font-medium">{order.customerName}</span>
                </div>
                {order.table && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mesa:</span>
                    <Badge>{order.table}</Badge>
                  </div>
                )}
                <div className="border-t pt-3 space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.name}</span>
                      <span>R$ {item.total.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Desconto */}
            <Card>
              <CardContent className="pt-6 space-y-3">
                <div className="flex items-center gap-2">
                  <Percent className="h-4 w-4" />
                  <Label>Desconto</Label>
                </div>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                    placeholder="0"
                  />
                  <Button
                    variant={discountType === "percent" ? "default" : "outline"}
                    onClick={() => setDiscountType("percent")}
                  >
                    %
                  </Button>
                  <Button
                    variant={discountType === "value" ? "default" : "outline"}
                    onClick={() => setDiscountType("value")}
                  >
                    R$
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Totais */}
            <Card className="bg-primary/5">
              <CardContent className="pt-6 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Desconto:</span>
                    <span>- R$ {discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span className="text-primary">R$ {finalTotal.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna Direita - Pagamento */}
          <div className="space-y-4">
            <Tabs value={splitPayment ? "split" : "single"} onValueChange={(v) => setSplitPayment(v === "split")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="single">Pagamento Único</TabsTrigger>
                <TabsTrigger value="split">Dividir Pagamento</TabsTrigger>
              </TabsList>

              <TabsContent value="single" className="space-y-4">
                <div className="space-y-3">
                  <Label>Método de Pagamento</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {paymentMethods.map((method) => (
                      <Button
                        key={method.id}
                        variant={paymentMethod === method.id ? "default" : "outline"}
                        className="h-20 flex-col gap-2"
                        onClick={() => setPaymentMethod(method.id)}
                      >
                        <div className={`p-2 rounded-full ${paymentMethod === method.id ? 'bg-white/20' : ''}`}>
                          {method.icon}
                        </div>
                        <span className="text-xs">{method.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {paymentMethod === "dinheiro" && (
                  <div className="space-y-3">
                    <Label>Valor Recebido</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={receivedAmount}
                      onChange={(e) => setReceivedAmount(e.target.value)}
                      placeholder={finalTotal.toFixed(2)}
                    />
                    <div className="grid grid-cols-5 gap-2">
                      {quickAmounts.map((amount) => (
                        <Button
                          key={amount}
                          variant="outline"
                          size="sm"
                          onClick={() => setReceivedAmount(amount.toString())}
                        >
                          {amount}
                        </Button>
                      ))}
                    </div>
                    {received > 0 && (
                      <Card className={change > 0 ? "bg-green-50 border-green-200" : ""}>
                        <CardContent className="pt-4">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Troco:</span>
                            <span className="font-bold text-xl text-green-600">
                              R$ {change.toFixed(2)}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}

                {paymentMethod === "pix" && (
                  <Card className="bg-teal-50 border-teal-200">
                    <CardContent className="pt-6 text-center space-y-3">
                      <div className="text-4xl">📱</div>
                      <p className="font-medium">Escaneie o QR Code</p>
                      <div className="bg-white p-4 rounded-lg border-2 border-teal-300">
                        <div className="w-32 h-32 mx-auto bg-gray-200 rounded flex items-center justify-center">
                          QR Code
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Chave: pix@cafeconnect.com
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="split" className="space-y-4">
                <Card>
                  <CardContent className="pt-6 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Valor Restante:</span>
                      <span className="text-2xl font-bold text-primary">
                        R$ {remainingAmount.toFixed(2)}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-3">
                  <Label>Adicionar Pagamento</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {paymentMethods.slice(0, 3).map((method) => (
                      <Button
                        key={method.id}
                        variant={paymentMethod === method.id ? "default" : "outline"}
                        className="h-16 flex-col gap-1"
                        onClick={() => setPaymentMethod(method.id)}
                      >
                        {method.icon}
                        <span className="text-xs">{method.label}</span>
                      </Button>
                    ))}
                  </div>

                  {paymentMethod === "dinheiro" && (
                    <Input
                      type="number"
                      step="0.01"
                      value={receivedAmount}
                      onChange={(e) => setReceivedAmount(e.target.value)}
                      placeholder="Valor"
                    />
                  )}

                  <Button
                    onClick={addPayment}
                    disabled={!paymentMethod || remainingAmount <= 0}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Pagamento
                  </Button>
                </div>

                {payments.length > 0 && (
                  <div className="space-y-2">
                    <Label>Pagamentos Adicionados</Label>
                    {payments.map((payment, index) => (
                      <Card key={index}>
                        <CardContent className="pt-4 flex justify-between items-center">
                          <div>
                            <Badge>{payment.method}</Badge>
                            <span className="ml-2 font-medium">
                              R$ {payment.amount.toFixed(2)}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removePayment(index)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={handleClose} disabled={processing} className="flex-1">
                Cancelar
              </Button>
              <Button
                onClick={handleComplete}
                disabled={processing || (splitPayment ? remainingAmount > 0.01 : !paymentMethod)}
                className="flex-1"
              >
                {processing ? "Processando..." : "Finalizar"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
