export type OrderStatus = 'aceito' | 'preparando' | 'pronto' | 'entregue' | 'retirado' | 'cancelado';
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
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  observacoes?: string;
}

class OrdersDatabase {
  private storageKey = 'cafe-connect-orders';
  private counterKey = 'cafe-connect-order-counter';

  private getOrders(): Order[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return [];
      
      const orders = JSON.parse(stored);
      if (!Array.isArray(orders)) {
        console.warn('Dados corrompidos, resetando');
        localStorage.removeItem(this.storageKey);
        return [];
      }
      
      return orders.map((order: any) => {
        try {
          return {
            ...order,
            createdAt: new Date(order.createdAt),
            updatedAt: new Date(order.updatedAt),
            completedAt: order.completedAt ? new Date(order.completedAt) : undefined
          };
        } catch {
          console.warn('Erro ao processar pedido');
          return null;
        }
      }).filter(Boolean) as Order[];
    } catch {
      console.warn('Erro ao carregar pedidos');
      localStorage.removeItem(this.storageKey);
      return [];
    }
  }

  private saveOrders(orders: Order[]): void {
    try {
      if (!Array.isArray(orders)) {
        console.warn('Dados inválidos');
        return;
      }
      const data = JSON.stringify(orders);
      localStorage.setItem(this.storageKey, data);
      window.dispatchEvent(new CustomEvent('ordersUpdated', { detail: { orders } }));
    } catch (error) {
      console.warn('Erro ao salvar pedidos');
      if (error instanceof Error && error.message.includes('quota')) {
        alert('Armazenamento cheio. Limpe dados antigos.');
      }
    }
  }

  private getNextOrderNumber(): number {
    try {
      const stored = localStorage.getItem(this.counterKey);
      const current = stored ? parseInt(stored) : 0;
      const next = current + 1;
      localStorage.setItem(this.counterKey, next.toString());
      return next;
    } catch {
      console.warn('Erro ao gerar número');
      return Date.now() % 10000;
    }
  }

  getAllOrders(): Order[] {
    return this.getOrders().sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  getActiveOrders(): Order[] {
    return this.getOrders().filter(order => 
      !['entregue', 'retirado', 'cancelado'].includes(order.status)
    ).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  getOrdersByStatus(status: OrderStatus): Order[] {
    return this.getOrders().filter(order => order.status === status);
  }

  getOrdersByType(type: OrderType): Order[] {
    return this.getOrders().filter(order => order.tipo === type);
  }

  getOrderById(id: string): Order | null {
    const orders = this.getOrders();
    return orders.find(order => order.id === id) || null;
  }

  createOrder(orderData: Omit<Order, 'id' | 'numero' | 'status' | 'createdAt' | 'updatedAt'>): Order {
    const orders = this.getOrders();
    const now = new Date();
    
    const newOrder: Order = {
      ...orderData,
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      numero: this.getNextOrderNumber(),
      status: 'aceito',
      createdAt: now,
      updatedAt: now
    };

    orders.unshift(newOrder);
    this.saveOrders(orders);
    console.info('Pedido criado');
    return newOrder;
  }

  updateOrderStatus(id: string, status: OrderStatus): Order | null {
    const orders = this.getOrders();
    const index = orders.findIndex(order => order.id === id);
    
    if (index === -1) {
      console.warn('Pedido não encontrado');
      return null;
    }

    const now = new Date();
    orders[index] = {
      ...orders[index],
      status,
      updatedAt: now,
      completedAt: ['entregue', 'retirado', 'cancelado'].includes(status) ? now : orders[index].completedAt
    };

    this.saveOrders(orders);
    console.info('Status atualizado');
    return orders[index];
  }

  deleteOrder(id: string): boolean {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === id);
    
    if (!order) {
      console.warn('Pedido não encontrado');
      return false;
    }

    const filteredOrders = orders.filter(order => order.id !== id);
    this.saveOrders(filteredOrders);
    console.info('Pedido removido');
    return true;
  }

  getOrdersStats() {
    const orders = this.getOrders();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayOrders = orders.filter(order => order.createdAt >= today);
    
    return {
      total: orders.length,
      today: todayOrders.length,
      active: orders.filter(order => !['entregue', 'retirado', 'cancelado'].includes(order.status)).length,
      completed: orders.filter(order => ['entregue', 'retirado'].includes(order.status)).length,
      cancelled: orders.filter(order => order.status === 'cancelado').length
    };
  }
}

export const ordersDatabase = new OrdersDatabase();