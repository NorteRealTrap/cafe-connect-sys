export interface SalesData {
  id: string;
  date: Date;
  category: string;
  product: string;
  quantity: number;
  unitPrice: number;
  totalValue: number;
  paymentMethod: string;
  status: 'completed' | 'cancelled' | 'pending';
}

export interface RevenueMetrics {
  totalRevenue: number;
  dailyRevenue: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  averageTicket: number;
  totalOrders: number;
  categoryBreakdown: { [key: string]: number };
  paymentMethodBreakdown: { [key: string]: number };
  topProducts: { product: string; revenue: number; quantity: number }[];
  growthRate: number;
}

class AnalyticsEngine {
  private storageKey = 'cafe-connect-sales-data';

  private getSalesData(): SalesData[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        return data.map((item: any) => ({
          ...item,
          date: new Date(item.date)
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar dados de vendas:', error);
    }
    return this.getDefaultSalesData();
  }

  private getDefaultSalesData(): SalesData[] {
    const now = new Date();
    const data: SalesData[] = [];
    
    // Gerar dados dos últimos 30 dias
    for (let i = 0; i < 30; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // 3-8 vendas por dia
      const salesCount = Math.floor(Math.random() * 6) + 3;
      
      for (let j = 0; j < salesCount; j++) {
        const categories = ['restaurante', 'lanchonete', 'confeitaria', 'bar', 'japonesa', 'cafeteria'];
        const products = {
          restaurante: ['Pizza Margherita', 'Lasanha', 'Risotto'],
          lanchonete: ['Hambúrguer Artesanal', 'Sanduíche Natural', 'Batata Frita'],
          confeitaria: ['Bolo de Chocolate', 'Torta de Morango', 'Brigadeiro'],
          bar: ['Caipirinha', 'Cerveja', 'Whisky'],
          japonesa: ['Sushi Combo', 'Temaki', 'Yakisoba'],
          cafeteria: ['Café Espresso', 'Cappuccino', 'Croissant']
        };
        const paymentMethods = ['dinheiro', 'cartao_credito', 'cartao_debito', 'pix'];
        
        const category = categories[Math.floor(Math.random() * categories.length)];
        const product = products[category][Math.floor(Math.random() * products[category].length)];
        const quantity = Math.floor(Math.random() * 3) + 1;
        const unitPrice = Math.random() * 50 + 10;
        
        data.push({
          id: `${date.getTime()}-${j}`,
          date,
          category,
          product,
          quantity,
          unitPrice,
          totalValue: quantity * unitPrice,
          paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
          status: Math.random() > 0.05 ? 'completed' : 'cancelled'
        });
      }
    }
    
    this.saveSalesData(data);
    return data;
  }

  private saveSalesData(data: SalesData[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Erro ao salvar dados de vendas:', error);
    }
  }

  addSale(sale: Omit<SalesData, 'id'>): void {
    const data = this.getSalesData();
    const newSale: SalesData = {
      ...sale,
      id: Date.now().toString()
    };
    data.unshift(newSale);
    this.saveSalesData(data);
  }

  getRevenueMetrics(startDate?: Date, endDate?: Date): RevenueMetrics {
    const data = this.getSalesData().filter(sale => sale.status === 'completed');
    
    let filteredData = data;
    if (startDate && endDate) {
      filteredData = data.filter(sale => 
        sale.date >= startDate && sale.date <= endDate
      );
    }

    const totalRevenue = filteredData.reduce((sum, sale) => sum + sale.totalValue, 0);
    const totalOrders = filteredData.length;
    const averageTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Revenue por período
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const thisYear = new Date(today.getFullYear(), 0, 1);

    const dailyRevenue = data.filter(sale => 
      sale.date.toDateString() === today.toDateString()
    ).reduce((sum, sale) => sum + sale.totalValue, 0);

    const monthlyRevenue = data.filter(sale => 
      sale.date >= thisMonth
    ).reduce((sum, sale) => sum + sale.totalValue, 0);

    const yearlyRevenue = data.filter(sale => 
      sale.date >= thisYear
    ).reduce((sum, sale) => sum + sale.totalValue, 0);

    // Breakdown por categoria
    const categoryBreakdown: { [key: string]: number } = {};
    filteredData.forEach(sale => {
      categoryBreakdown[sale.category] = (categoryBreakdown[sale.category] || 0) + sale.totalValue;
    });

    // Breakdown por método de pagamento
    const paymentMethodBreakdown: { [key: string]: number } = {};
    filteredData.forEach(sale => {
      paymentMethodBreakdown[sale.paymentMethod] = (paymentMethodBreakdown[sale.paymentMethod] || 0) + sale.totalValue;
    });

    // Top produtos
    const productStats: { [key: string]: { revenue: number; quantity: number } } = {};
    filteredData.forEach(sale => {
      if (!productStats[sale.product]) {
        productStats[sale.product] = { revenue: 0, quantity: 0 };
      }
      productStats[sale.product].revenue += sale.totalValue;
      productStats[sale.product].quantity += sale.quantity;
    });

    const topProducts = Object.entries(productStats)
      .map(([product, stats]) => ({ product, ...stats }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Taxa de crescimento (comparando com mês anterior)
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
    
    const lastMonthRevenue = data.filter(sale => 
      sale.date >= lastMonth && sale.date <= lastMonthEnd
    ).reduce((sum, sale) => sum + sale.totalValue, 0);

    const growthRate = lastMonthRevenue > 0 ? 
      ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;

    return {
      totalRevenue,
      dailyRevenue,
      monthlyRevenue,
      yearlyRevenue,
      averageTicket,
      totalOrders,
      categoryBreakdown,
      paymentMethodBreakdown,
      topProducts,
      growthRate
    };
  }

  getDailyRevenueChart(days: number = 30): { date: string; revenue: number }[] {
    const data = this.getSalesData().filter(sale => sale.status === 'completed');
    const today = new Date();
    const chartData: { date: string; revenue: number }[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const dayRevenue = data.filter(sale => 
        sale.date.toDateString() === date.toDateString()
      ).reduce((sum, sale) => sum + sale.totalValue, 0);

      chartData.push({
        date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        revenue: dayRevenue
      });
    }

    return chartData;
  }

  getCategoryRevenueChart(): { category: string; revenue: number; percentage: number }[] {
    const metrics = this.getRevenueMetrics();
    const total = metrics.totalRevenue;
    
    return Object.entries(metrics.categoryBreakdown).map(([category, revenue]) => ({
      category,
      revenue,
      percentage: total > 0 ? (revenue / total) * 100 : 0
    })).sort((a, b) => b.revenue - a.revenue);
  }

  getHourlyRevenueChart(): { hour: string; revenue: number }[] {
    const data = this.getSalesData().filter(sale => sale.status === 'completed');
    const hourlyData: { [key: string]: number } = {};

    // Inicializar todas as horas
    for (let i = 0; i < 24; i++) {
      hourlyData[i.toString().padStart(2, '0')] = 0;
    }

    data.forEach(sale => {
      const hour = sale.date.getHours().toString().padStart(2, '0');
      hourlyData[hour] += sale.totalValue;
    });

    return Object.entries(hourlyData).map(([hour, revenue]) => ({
      hour: `${hour}:00`,
      revenue
    }));
  }
}

export const analyticsEngine = new AnalyticsEngine();