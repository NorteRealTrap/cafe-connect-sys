import { financialSystem } from './financial';
import { analyticsEngine } from './analytics';

class RevenueSync {
  private ordersKey = 'cafe-connect-orders';

  syncOrderToFinancial(orderId: string) {
    try {
      const orders = JSON.parse(localStorage.getItem(this.ordersKey) || '[]');
      const order = orders.find((o: any) => o.id === orderId);

      if (!order || order.status !== 'entregue') return;

      // Verificar se já foi processado
      const payments = financialSystem.getAllPayments();
      if (payments.some(p => p.orderId === orderId)) return;

      // Processar pagamento
      const paymentMethod = order.paymentMethod || order.metodoPagamento || 'dinheiro';
      const amount = Number(order.total) || 0;

      if (amount > 0) {
        financialSystem.processPayment(orderId, amount, paymentMethod);

        // Adicionar venda ao analytics
        if (order.itens || order.items) {
          const items = order.itens || order.items;
          items.forEach((item: any) => {
            analyticsEngine.addSale({
              date: new Date(order.createdAt || Date.now()),
              category: item.categoria || 'geral',
              product: item.nome || item.productName || 'Produto',
              quantity: Number(item.quantidade || item.quantity) || 1,
              unitPrice: Number(item.preco || item.price) || 0,
              totalValue: (Number(item.quantidade || item.quantity) || 1) * (Number(item.preco || item.price) || 0),
              paymentMethod,
              status: 'completed'
            });
          });
        }
      }
    } catch (error) {
      console.error('Erro ao sincronizar pedido:', error);
    }
  }

  syncAllCompletedOrders() {
    try {
      const orders = JSON.parse(localStorage.getItem(this.ordersKey) || '[]');
      const completedOrders = orders.filter((o: any) => o.status === 'entregue');

      completedOrders.forEach((order: any) => {
        this.syncOrderToFinancial(order.id);
      });
    } catch (error) {
      console.error('Erro ao sincronizar pedidos:', error);
    }
  }

  getRevenueReport() {
    const financial = financialSystem.getFinancialSummary();
    const analytics = analyticsEngine.getRevenueMetrics();

    return {
      financial: {
        grossRevenue: financial.grossRevenue,
        netRevenue: financial.netRevenue,
        totalFees: financial.totalFees,
        profit: financial.profit,
        paymentsByMethod: financial.paymentsByMethod
      },
      analytics: {
        totalRevenue: analytics.totalRevenue,
        dailyRevenue: analytics.dailyRevenue,
        monthlyRevenue: analytics.monthlyRevenue,
        averageTicket: analytics.averageTicket,
        totalOrders: analytics.totalOrders,
        categoryBreakdown: analytics.categoryBreakdown
      },
      summary: {
        totalOrders: analytics.totalOrders,
        totalRevenue: financial.netRevenue,
        averageTicket: analytics.averageTicket,
        profit: financial.profit
      }
    };
  }
}

export const revenueSync = new RevenueSync();
