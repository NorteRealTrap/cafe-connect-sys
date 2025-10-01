export interface ReportData {
  id: string;
  type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  date: Date;
  period: string;
  metrics: {
    grossRevenue: number;
    netRevenue: number;
    totalOrders: number;
    averageTicket: number;
    totalFees: number;
    profit: number;
  };
  paymentBreakdown: { [method: string]: number };
  categoryBreakdown: { [category: string]: number };
  topProducts: Array<{ product: string; revenue: number; quantity: number }>;
  createdAt: Date;
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  amount: number;
  method: 'dinheiro' | 'cartao_credito' | 'cartao_debito' | 'pix';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  date: Date;
  fees: number;
  netAmount: number;
  customer?: string;
  category: string;
  products: Array<{ name: string; quantity: number; price: number }>;
  metadata: {
    processingTime?: number;
    gateway?: string;
    reference?: string;
  };
}

class ReportsDatabase {
  private reportsKey = 'cafe-connect-reports';
  private transactionsKey = 'cafe-connect-transactions';

  private getReports(): ReportData[] {
    try {
      const stored = localStorage.getItem(this.reportsKey);
      return stored ? JSON.parse(stored).map((r: any) => ({
        ...r,
        date: new Date(r.date),
        createdAt: new Date(r.createdAt)
      })) : [];
    } catch {
      return [];
    }
  }

  private getTransactions(): PaymentTransaction[] {
    try {
      const stored = localStorage.getItem(this.transactionsKey);
      return stored ? JSON.parse(stored).map((t: any) => ({
        ...t,
        date: new Date(t.date)
      })) : this.generateSampleTransactions();
    } catch {
      return this.generateSampleTransactions();
    }
  }

  private generateSampleTransactions(): PaymentTransaction[] {
    const transactions: PaymentTransaction[] = [];
    const methods: PaymentTransaction['method'][] = ['dinheiro', 'pix', 'cartao_credito', 'cartao_debito'];
    const categories = ['restaurante', 'lanchonete', 'confeitaria', 'bar', 'cafeteria'];
    const products = [
      { name: 'Hambúrguer Artesanal', price: 28.90 },
      { name: 'Pizza Margherita', price: 42.90 },
      { name: 'Café Espresso', price: 4.50 },
      { name: 'Açaí 500ml', price: 18.50 },
      { name: 'Caipirinha', price: 12.90 }
    ];

    for (let i = 0; i < 100; i++) {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      
      const method = methods[Math.floor(Math.random() * methods.length)];
      const category = categories[Math.floor(Math.random() * categories.length)];
      const selectedProducts = products.slice(0, Math.floor(Math.random() * 3) + 1);
      
      const amount = selectedProducts.reduce((sum, p) => sum + p.price, 0);
      const fees = this.calculateFees(amount, method);
      
      transactions.push({
        id: `txn_${Date.now()}_${i}`,
        orderId: `ORD${(i + 1).toString().padStart(3, '0')}`,
        amount,
        method,
        status: Math.random() > 0.05 ? 'completed' : 'failed',
        date,
        fees,
        netAmount: amount - fees,
        category,
        products: selectedProducts.map(p => ({ name: p.name, quantity: 1, price: p.price })),
        metadata: {
          processingTime: Math.floor(Math.random() * 5000) + 1000,
          gateway: method === 'dinheiro' ? 'cash' : 'payment_gateway'
        }
      });
    }

    this.saveTransactions(transactions);
    return transactions;
  }

  private calculateFees(amount: number, method: PaymentTransaction['method']): number {
    const feeRates = {
      dinheiro: 0,
      pix: 0.01,
      cartao_debito: 0.025,
      cartao_credito: 0.035
    };
    return amount * feeRates[method];
  }

  private saveReports(reports: ReportData[]): void {
    localStorage.setItem(this.reportsKey, JSON.stringify(reports));
  }

  private saveTransactions(transactions: PaymentTransaction[]): void {
    localStorage.setItem(this.transactionsKey, JSON.stringify(transactions));
  }

  addTransaction(transaction: Omit<PaymentTransaction, 'id' | 'fees' | 'netAmount'>): PaymentTransaction {
    const transactions = this.getTransactions();
    const fees = this.calculateFees(transaction.amount, transaction.method);
    
    const newTransaction: PaymentTransaction = {
      ...transaction,
      id: `txn_${Date.now()}`,
      fees,
      netAmount: transaction.amount - fees
    };

    transactions.unshift(newTransaction);
    this.saveTransactions(transactions);
    return newTransaction;
  }

  generateReport(type: ReportData['type'], startDate: Date, endDate: Date): ReportData {
    const transactions = this.getTransactions()
      .filter(t => t.status === 'completed' && t.date >= startDate && t.date <= endDate);

    const grossRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
    const netRevenue = transactions.reduce((sum, t) => sum + t.netAmount, 0);
    const totalFees = transactions.reduce((sum, t) => sum + t.fees, 0);
    const totalOrders = transactions.length;
    const averageTicket = totalOrders > 0 ? grossRevenue / totalOrders : 0;

    const paymentBreakdown: { [method: string]: number } = {};
    const categoryBreakdown: { [category: string]: number } = {};
    const productStats: { [product: string]: { revenue: number; quantity: number } } = {};

    transactions.forEach(t => {
      paymentBreakdown[t.method] = (paymentBreakdown[t.method] || 0) + t.netAmount;
      categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + t.netAmount;
      
      t.products.forEach(p => {
        if (!productStats[p.name]) {
          productStats[p.name] = { revenue: 0, quantity: 0 };
        }
        productStats[p.name].revenue += p.price * p.quantity;
        productStats[p.name].quantity += p.quantity;
      });
    });

    const topProducts = Object.entries(productStats)
      .map(([product, stats]) => ({ product, ...stats }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    const report: ReportData = {
      id: `report_${Date.now()}`,
      type,
      date: new Date(),
      period: `${startDate.toLocaleDateString('pt-BR')} - ${endDate.toLocaleDateString('pt-BR')}`,
      metrics: {
        grossRevenue,
        netRevenue,
        totalOrders,
        averageTicket,
        totalFees,
        profit: netRevenue * 0.8 // Estimativa após custos operacionais
      },
      paymentBreakdown,
      categoryBreakdown,
      topProducts,
      createdAt: new Date()
    };

    const reports = this.getReports();
    reports.unshift(report);
    this.saveReports(reports);

    return report;
  }

  getReportsByType(type: ReportData['type']): ReportData[] {
    return this.getReports().filter(r => r.type === type);
  }

  getTransactionsByPeriod(startDate: Date, endDate: Date): PaymentTransaction[] {
    return this.getTransactions()
      .filter(t => t.date >= startDate && t.date <= endDate);
  }

  getPaymentMethodStats(): { [method: string]: { count: number; amount: number; fees: number } } {
    const transactions = this.getTransactions().filter(t => t.status === 'completed');
    const stats: { [method: string]: { count: number; amount: number; fees: number } } = {};

    transactions.forEach(t => {
      if (!stats[t.method]) {
        stats[t.method] = { count: 0, amount: 0, fees: 0 };
      }
      stats[t.method].count++;
      stats[t.method].amount += t.amount;
      stats[t.method].fees += t.fees;
    });

    return stats;
  }

  getAllTransactions(): PaymentTransaction[] {
    return this.getTransactions();
  }

  getAllReports(): ReportData[] {
    return this.getReports();
  }
}

export const reportsDatabase = new ReportsDatabase();