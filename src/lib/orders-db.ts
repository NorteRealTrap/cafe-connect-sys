// Sistema de banco de dados de pedidos simplificado e robusto

export type OrderStatus = 'pendente' | 'preparando' | 'pronto' | 'entregue' | 'cancelado';
export type OrderType = 'local' | 'delivery' | 'retirada';

export interface OrderItem {
  id: string;
  nome: string;
  quantidade: number;
  preco: number;
  observacoes?: string;
}

export interface Order {
  id: string;
  numero: number;
  tipo: OrderType;
  status: OrderStatus;
  mesa?: string;
  cliente: string;
  telefone?: string;
  endereco?: string;
  itens: OrderItem[];
  total: number;
  createdAt: string;
  updatedAt: string;
  observacoes?: string;
}

const STORAGE_KEY = 'cafe-connect-orders';
const COUNTER_KEY = 'cafe-connect-order-counter';

class OrdersDB {
  private getCounter(): number {
    const counter = localStorage.getItem(COUNTER_KEY);
    return counter ? parseInt(counter) : 0;
  }

  private setCounter(value: number): void {
    localStorage.setItem(COUNTER_KEY, value.toString());
  }

  private loadOrders(): Order[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private saveOrders(orders: Order[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
      window.dispatchEvent(new Event('orders-changed'));
    } catch (error) {
      console.error('Erro ao salvar pedidos:', error);
    }
  }

  getAll(): Order[] {
    return this.loadOrders().sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getById(id: string): Order | null {
    return this.loadOrders().find(o => o.id === id) || null;
  }

  create(data: Omit<Order, 'id' | 'numero' | 'createdAt' | 'updatedAt' | 'status'> & { id?: string }): Order {
    const orders = this.loadOrders();
    const counter = this.getCounter() + 1;
    
    const order: Order = {
      ...data,
      id: data.id || `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      numero: counter,
      status: 'pendente',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    orders.unshift(order);
    this.saveOrders(orders);
    this.setCounter(counter);
    
    return order;
  }

  updateStatus(id: string, status: OrderStatus): Order | null {
    const orders = this.loadOrders();
    const index = orders.findIndex(o => o.id === id);
    
    if (index === -1) return null;

    orders[index] = {
      ...orders[index],
      status,
      updatedAt: new Date().toISOString()
    };

    this.saveOrders(orders);
    return orders[index];
  }

  delete(id: string): boolean {
    const orders = this.loadOrders();
    const filtered = orders.filter(o => o.id !== id);
    
    if (filtered.length === orders.length) return false;
    
    this.saveOrders(filtered);
    return true;
  }

  getStats() {
    const orders = this.loadOrders();
    const today = new Date().setHours(0, 0, 0, 0);
    
    return {
      total: orders.length,
      today: orders.filter(o => new Date(o.createdAt).getTime() >= today).length,
      pendente: orders.filter(o => o.status === 'pendente').length,
      preparando: orders.filter(o => o.status === 'preparando').length,
      pronto: orders.filter(o => o.status === 'pronto').length,
      entregue: orders.filter(o => o.status === 'entregue').length
    };
  }

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(COUNTER_KEY);
    window.dispatchEvent(new Event('orders-changed'));
  }
}

export const ordersDB = new OrdersDB();
