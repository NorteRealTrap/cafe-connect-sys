// Sistema de Processamento de Pagamentos

export interface PaymentRecord {
  id: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  subtotal: number;
  discount: number;
  discountType: 'percent' | 'value';
  finalTotal: number;
  payments: Array<{
    method: string;
    amount: number;
  }>;
  change?: number;
  receivedAmount?: number;
  status: 'pending' | 'completed' | 'refunded';
  createdAt: string;
  completedAt?: string;
}

class PaymentProcessor {
  private storageKey = 'ccpservices-payments';

  private getPayments(): PaymentRecord[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Erro ao carregar pagamentos:', error);
      return [];
    }
  }

  private savePayments(payments: PaymentRecord[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(payments));
      
      // Disparar evento de sincronização
      window.dispatchEvent(new CustomEvent('dataChanged', {
        detail: { key: this.storageKey, data: payments }
      }));
    } catch (error) {
      console.error('Erro ao salvar pagamentos:', error);
    }
  }

  // Processar pagamento
  processPayment(paymentData: Omit<PaymentRecord, 'id' | 'status' | 'createdAt' | 'completedAt'>): PaymentRecord {
    const payments = this.getPayments();
    const now = new Date().toISOString();

    const newPayment: PaymentRecord = {
      ...paymentData,
      id: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'completed',
      createdAt: now,
      completedAt: now
    };

    payments.unshift(newPayment);
    this.savePayments(payments);

    console.log(`💰 Pagamento processado: R$ ${newPayment.finalTotal.toFixed(2)}`);
    return newPayment;
  }

  // Obter todos os pagamentos
  getAllPayments(): PaymentRecord[] {
    return this.getPayments().sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  // Obter pagamentos por período
  getPaymentsByPeriod(startDate: Date, endDate: Date): PaymentRecord[] {
    return this.getPayments().filter(payment => {
      const paymentDate = new Date(payment.createdAt);
      return paymentDate >= startDate && paymentDate <= endDate;
    });
  }

  // Obter pagamentos de hoje
  getTodayPayments(): PaymentRecord[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return this.getPaymentsByPeriod(today, tomorrow);
  }

  // Estatísticas de pagamento
  getPaymentStats() {
    const payments = this.getPayments();
    const today = this.getTodayPayments();

    const totalRevenue = payments.reduce((sum, p) => sum + p.finalTotal, 0);
    const todayRevenue = today.reduce((sum, p) => sum + p.finalTotal, 0);
    const totalDiscount = payments.reduce((sum, p) => sum + p.discount, 0);

    // Agrupar por método de pagamento
    const byMethod: Record<string, { count: number; total: number }> = {};
    payments.forEach(payment => {
      payment.payments.forEach(p => {
        if (!byMethod[p.method]) {
          byMethod[p.method] = { count: 0, total: 0 };
        }
        byMethod[p.method].count++;
        byMethod[p.method].total += p.amount;
      });
    });

    return {
      totalPayments: payments.length,
      todayPayments: today.length,
      totalRevenue,
      todayRevenue,
      totalDiscount,
      averageTicket: payments.length > 0 ? totalRevenue / payments.length : 0,
      byMethod
    };
  }

  // Reembolsar pagamento
  refundPayment(paymentId: string): boolean {
    const payments = this.getPayments();
    const index = payments.findIndex(p => p.id === paymentId);

    if (index === -1) {
      console.error('Pagamento não encontrado');
      return false;
    }

    payments[index].status = 'refunded';
    this.savePayments(payments);
    
    console.log(`↩️ Pagamento ${paymentId} reembolsado`);
    return true;
  }

  // Exportar relatório
  exportReport(startDate?: Date, endDate?: Date): string {
    const payments = startDate && endDate 
      ? this.getPaymentsByPeriod(startDate, endDate)
      : this.getPayments();

    const report = payments.map(p => ({
      Data: new Date(p.createdAt).toLocaleString('pt-BR'),
      Pedido: p.orderNumber,
      Cliente: p.customerName,
      Subtotal: p.subtotal.toFixed(2),
      Desconto: p.discount.toFixed(2),
      Total: p.finalTotal.toFixed(2),
      Métodos: p.payments.map(pm => `${pm.method}: R$ ${pm.amount.toFixed(2)}`).join(', '),
      Status: p.status
    }));

    return JSON.stringify(report, null, 2);
  }
}

export const paymentProcessor = new PaymentProcessor();
