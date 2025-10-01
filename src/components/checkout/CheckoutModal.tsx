import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Banknote, Smartphone, Receipt } from "lucide-react";
import type { Order } from "@/lib/database";

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  order: Order | null;
  onPaymentComplete: (orderId: string, paymentData: {
    method: string;
    amount: number;
    receivedAmount?: number;
    change?: number;
  }) => void;
}

export const CheckoutModal = ({ open, onClose, order, onPaymentComplete }: CheckoutModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [receivedAmount, setReceivedAmount] = useState<number>(0);
  const [processing, setProcessing] = useState(false);

  if (!order) return null;

  const change = paymentMethod === "dinheiro" ? Math.max(0, receivedAmount - order.total) : 0;
  const canProcess = paymentMethod && (paymentMethod !== "dinheiro" || receivedAmount >= order.total);

  const handlePayment = async () => {
    if (!canProcess) return;

    setProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const paymentData = {
      method: paymentMethod,
      amount: order.total,
      ...(paymentMethod === "dinheiro" && {
        receivedAmount,
        change
      })
    };

    onPaymentComplete(order.id, paymentData);
    setProcessing(false);
    handleClose();
  };

  const handleClose = () => {
    setPaymentMethod("");
    setReceivedAmount(0);
    setProcessing(false);
    onClose();
  };

  const paymentMethods = [
    { id: "dinheiro", label: "Dinheiro", icon: <Banknote className="h-4 w-4" /> },
    { id: "cartao", label: "Cartão", icon: <CreditCard className="h-4 w-4" /> },
    { id: "pix", label: "PIX", icon: <Smartphone className="h-4 w-4" /> }
  ];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Checkout - {order.id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Cliente:</span>
                <span className="font-medium">{order.customerName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Tipo:</span>
                <Badge variant="outline">{order.type}</Badge>
              </div>
              {order.table && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Mesa:</span>
                  <span className="font-medium">{order.table}</span>
                </div>
              )}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between items-center font-bold">
                  <span>Total:</span>
                  <span className="text-lg text-primary">R$ {order.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <Label>Método de Pagamento</Label>
            <div className="grid grid-cols-3 gap-2">
              {paymentMethods.map((method) => (
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
          </div>

          {paymentMethod === "dinheiro" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="received">Valor Recebido (R$)</Label>
                <Input
                  id="received"
                  type="number"
                  step="0.01"
                  min={order.total}
                  value={receivedAmount}
                  onChange={(e) => setReceivedAmount(parseFloat(e.target.value) || 0)}
                  placeholder={order.total.toFixed(2)}
                />
              </div>
              
              {receivedAmount > 0 && (
                <Card className={change > 0 ? "border-green-200 bg-green-50" : ""}>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Troco:</span>
                      <span className={`font-bold text-lg ${change > 0 ? "text-green-600" : ""}`}>
                        R$ {change.toFixed(2)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {paymentMethod === "pix" && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="pt-4">
                <div className="text-center space-y-2">
                  <div className="text-2xl">📱</div>
                  <p className="text-sm text-muted-foreground">
                    Escaneie o QR Code ou use a chave PIX
                  </p>
                  <p className="font-mono text-sm bg-white p-2 rounded border">
                    pix@cafeconnect.com
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {paymentMethod === "cartao" && (
            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="pt-4">
                <div className="text-center space-y-2">
                  <div className="text-2xl">💳</div>
                  <p className="text-sm text-muted-foreground">
                    Insira ou aproxime o cartão na máquina
                  </p>
                  <p className="font-medium">Aguardando pagamento...</p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={handleClose} disabled={processing}>
              Cancelar
            </Button>
            <Button 
              onClick={handlePayment} 
              disabled={!canProcess || processing}
              className="min-w-[120px]"
            >
              {processing ? "Processando..." : "Finalizar Pagamento"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};