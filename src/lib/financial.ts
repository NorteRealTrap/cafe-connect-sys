import { analyticsEngine, SalesData } from './analytics';

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: 'dinheiro' | 'cartao_credito' | 'cartao_debito' | 'pix';
  status: 'pending' | 'completed' | 'failed';
  date: Date;
  fees: number;
  netAmount: number;
}

export interface FinancialRecord {
  id: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  date: Date;
  paymentId?: string;
  orderId?: string;
}

class FinancialSystem {
  private paymentsKey = 'cafe-connect-payments';
  private recordsKey = 'cafe-connect-financial-records';

  private getPayments(): Payment[] {
    try {
      const stored = localStorage.getItem(this.paymentsKey);
      return stored ? JSON.parse(stored).map((p: any) => ({
        ...p,
        date: new Date(p.date)
      })) : [];
    } catch {
      return [];
    }
  }

  private getRecords(): FinancialRecord[] {
    try {
      const stored = localStorage.getItem(this.recordsKey);
      return stored ? JSON.parse(stored).map((r: any) => ({
        ...r,
        date: new Date(r.date)
      })) : [];
    } catch {
      return [];
    }
  }

  private savePayments(payments: Payment[]): void {
    localStorage.setItem(this.paymentsKey, JSON.stringify(payments));
  }

  private saveRecords(records: FinancialRecord[]): void {
    localStorage.setItem(this.recordsKey, JSON.stringify(records));
  }

  processPayment(orderId: string, amount: number, method: Payment['method']): Payment {
    const fees = this.calculateFees(amount, method);
    const payment: Payment = {
      id: Date.now().toString(),
      orderId,
      amount,
      method,
      status: 'completed',
      date: new Date(),
      fees,
      netAmount: amount - fees
    };

    const payments = this.getPayments();
    payments.unshift(payment);
    this.savePayments(payments);

    // Registrar receita
    this.addFinancialRecord({
      type: 'income',
      category: 'vendas',
      description: `Pagamento pedido #${orderId}`,
      amount: payment.netAmount,
      paymentId: payment.id,
      orderId
    });

    // Registrar taxa se houver
    if (fees > 0) {
      this.addFinancialRecord({
        type: 'expense',
        category: 'taxas',
        description: `Taxa ${method} - pedido #${orderId}`,
        amount: fees,
        paymentId: payment.id,
        orderId
      });
    }

    return payment;
  }

  private calculateFees(amount: number, method: Payment['method']): number {
    const feeRates = {
      dinheiro: 0,
      pix: 0.01,
      cartao_debito: 0.025,
      cartao_credito: 0.035
    };
    return amount * feeRates[method];
  }

  addFinancialRecord(record: Omit<FinancialRecord, 'id' | 'date'>): FinancialRecord {
    const newRecord: FinancialRecord = {
      ...record,
      id: Date.now().toString(),
      date: new Date()
    };

    const records = this.getRecords();
    records.unshift(newRecord);
    this.saveRecords(records);

    return newRecord;
  }

  getFinancialSummary(startDate?: Date, endDate?: Date) {
    const records = this.getRecords();
    const payments = this.getPayments();
    
    let filteredRecords = records;
    let filteredPayments = payments;

    if (startDate && endDate) {
      filteredRecords = records.filter(r => r.date >= startDate && r.date <= endDate);
      filteredPayments = payments.filter(p => p.date >= startDate && p.date <= endDate);
    }

    const income = filteredRecords
      .filter(r => r.type === 'income')
      .reduce((sum, r) => sum + r.amount, 0);

    const expenses = filteredRecords
      .filter(r => r.type === 'expense')
      .reduce((sum, r) => sum + r.amount, 0);

    const totalFees = filteredPayments.reduce((sum, p) => sum + p.fees, 0);

    return {
      grossRevenue: filteredPayments.reduce((sum, p) => sum + p.amount, 0),
      netRevenue: income,
      totalExpenses: expenses,
      totalFees,
      profit: income - expenses,
      paymentsByMethod: this.getPaymentsByMethod(filteredPayments),
      expensesByCategory: this.getExpensesByCategory(filteredRecords)
    };
  }

  private getPaymentsByMethod(payments: Payment[]) {
    return payments.reduce((acc, payment) => {
      acc[payment.method] = (acc[payment.method] || 0) + payment.amount;
      return acc;
    }, {} as Record<string, number>);
  }

  private getExpensesByCategory(records: FinancialRecord[]) {
    return records
      .filter(r => r.type === 'expense')
      .reduce((acc, record) => {
        acc[record.category] = (acc[record.category] || 0) + record.amount;
        return acc;
      }, {} as Record<string, number>);
  }

  getAllPayments(): Payment[] {
    return this.getPayments();
  }

  getAllRecords(): FinancialRecord[] {
    return this.getRecords();
  }
}

export const financialSystem = new FinancialSystem();