import { menuDatabase } from './database';
import { analyticsEngine } from './analytics';
import { financialSystem } from './financial';
import { reportsDatabase } from './database-reports';

export class DatabaseIntegration {
  // Sincronizar dados entre todos os sistemas
  static syncAllSystems() {
    try {
      // Verificar se todos os bancos estão funcionais
      const menuItems = menuDatabase.getAllItems();
      const payments = financialSystem.getAllPayments();
      const transactions = reportsDatabase.getAllTransactions();
      const reports = reportsDatabase.getAllReports();
      
      console.log('✅ Menu Database:', menuItems.length, 'items');
      console.log('✅ Financial System:', payments.length, 'payments');
      console.log('✅ Reports Database:', transactions.length, 'transactions,', reports.length, 'reports');
      
      return {
        menu: menuItems.length,
        payments: payments.length,
        transactions: transactions.length,
        reports: reports.length,
        status: 'operational'
      };
    } catch (error) {
      console.error('❌ Database Integration Error:', error);
      return { status: 'error', error };
    }
  }

  // Processar pedido completo com integração total
  static async processCompleteOrder(orderData: {
    orderId: string;
    items: Array<{ name: string; quantity: number; price: number; category: string }>;
    total: number;
    paymentMethod: 'dinheiro' | 'cartao_credito' | 'cartao_debito' | 'pix';
    customer?: string;
  }) {
    try {
      // 1. Processar pagamento no sistema financeiro
      const payment = financialSystem.processPayment(
        orderData.orderId,
        orderData.total,
        orderData.paymentMethod
      );

      // 2. Registrar transação no banco de relatórios
      const transaction = reportsDatabase.addTransaction({
        orderId: orderData.orderId,
        amount: orderData.total,
        method: orderData.paymentMethod,
        status: 'completed',
        date: new Date(),
        category: orderData.items[0]?.category || 'restaurante',
        products: orderData.items,
        customer: orderData.customer,
        metadata: {
          processingTime: 2000,
          gateway: 'integrated_system'
        }
      });

      // 3. Registrar vendas no analytics
      orderData.items.forEach(item => {
        analyticsEngine.addSale({
          date: new Date(),
          category: item.category,
          product: item.name,
          quantity: item.quantity,
          unitPrice: item.price,
          totalValue: item.quantity * item.price,
          paymentMethod: orderData.paymentMethod,
          status: 'completed'
        });
      });

      return {
        success: true,
        payment,
        transaction,
        message: 'Pedido processado com sucesso em todos os sistemas'
      };
    } catch (error) {
      console.error('Erro ao processar pedido:', error);
      return {
        success: false,
        error,
        message: 'Erro ao processar pedido'
      };
    }
  }

  // Gerar relatório consolidado
  static generateConsolidatedReport(type: 'daily' | 'monthly') {
    try {
      const today = new Date();
      let startDate: Date;
      let endDate: Date;

      if (type === 'daily') {
        startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
      } else {
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      }

      // Gerar relatório no banco de relatórios
      const report = reportsDatabase.generateReport(type, startDate, endDate);

      // Obter métricas do analytics
      const analyticsMetrics = analyticsEngine.getRevenueMetrics(startDate, endDate);

      // Obter resumo financeiro
      const financialSummary = financialSystem.getFinancialSummary(startDate, endDate);

      return {
        report,
        analytics: analyticsMetrics,
        financial: financialSummary,
        consolidated: {
          period: report.period,
          grossRevenue: report.metrics.grossRevenue,
          netRevenue: report.metrics.netRevenue,
          totalOrders: report.metrics.totalOrders,
          averageTicket: report.metrics.averageTicket,
          profit: report.metrics.profit,
          topProducts: report.topProducts,
          paymentBreakdown: report.paymentBreakdown,
          categoryBreakdown: report.categoryBreakdown
        }
      };
    } catch (error) {
      console.error('Erro ao gerar relatório consolidado:', error);
      return { error, message: 'Erro ao gerar relatório' };
    }
  }

  // Verificar integridade dos dados
  static validateDataIntegrity() {
    try {
      const issues: string[] = [];

      // Verificar se há dados em todos os sistemas
      const menuItems = menuDatabase.getAllItems();
      const payments = financialSystem.getAllPayments();
      const transactions = reportsDatabase.getAllTransactions();

      if (menuItems.length === 0) issues.push('Menu vazio');
      if (payments.length === 0) issues.push('Nenhum pagamento registrado');
      if (transactions.length === 0) issues.push('Nenhuma transação registrada');

      // Verificar consistência de categorias
      const menuCategories = [...new Set(menuItems.map(item => item.categoria))];
      const transactionCategories = [...new Set(transactions.map(t => t.category))];
      
      const missingCategories = menuCategories.filter(cat => !transactionCategories.includes(cat));
      if (missingCategories.length > 0) {
        issues.push(`Categorias não sincronizadas: ${missingCategories.join(', ')}`);
      }

      return {
        valid: issues.length === 0,
        issues,
        stats: {
          menuItems: menuItems.length,
          payments: payments.length,
          transactions: transactions.length,
          categories: {
            menu: menuCategories,
            transactions: transactionCategories
          }
        }
      };
    } catch (error) {
      return {
        valid: false,
        issues: ['Erro na validação'],
        error
      };
    }
  }

  // Limpar todos os dados (para reset)
  static clearAllData() {
    try {
      localStorage.removeItem('cafe-connect-menu-items');
      localStorage.removeItem('cafe-connect-sales-data');
      localStorage.removeItem('cafe-connect-payments');
      localStorage.removeItem('cafe-connect-financial-records');
      localStorage.removeItem('cafe-connect-reports');
      localStorage.removeItem('cafe-connect-transactions');
      
      return { success: true, message: 'Todos os dados foram limpos' };
    } catch (error) {
      return { success: false, error, message: 'Erro ao limpar dados' };
    }
  }

  // Inicializar dados de exemplo
  static initializeSampleData() {
    try {
      // Limpar dados existentes
      this.clearAllData();

      // Inicializar cada sistema para gerar dados de exemplo
      menuDatabase.getAllItems(); // Gera itens padrão
      analyticsEngine.getRevenueMetrics(); // Gera dados de vendas
      reportsDatabase.getAllTransactions(); // Gera transações de exemplo

      // Processar alguns pedidos de exemplo
      const sampleOrders = [
        {
          orderId: 'SAMPLE001',
          items: [
            { name: 'Hambúrguer Artesanal', quantity: 1, price: 28.90, category: 'lanchonete' },
            { name: 'Batata Frita', quantity: 1, price: 12.90, category: 'lanchonete' }
          ],
          total: 41.80,
          paymentMethod: 'cartao_credito' as const,
          customer: 'Cliente Exemplo'
        },
        {
          orderId: 'SAMPLE002',
          items: [
            { name: 'Pizza Margherita', quantity: 1, price: 42.90, category: 'restaurante' }
          ],
          total: 42.90,
          paymentMethod: 'pix' as const,
          customer: 'Cliente Teste'
        }
      ];

      sampleOrders.forEach(order => {
        this.processCompleteOrder(order);
      });

      return { 
        success: true, 
        message: 'Dados de exemplo inicializados com sucesso',
        stats: this.syncAllSystems()
      };
    } catch (error) {
      return { success: false, error, message: 'Erro ao inicializar dados' };
    }
  }
}

export const databaseIntegration = new DatabaseIntegration();