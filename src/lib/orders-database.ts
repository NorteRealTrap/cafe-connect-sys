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
        console.error('Dados de pedidos corrompidos, resetando...');
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
        } catch (err) {
          console.error('Erro ao processar pedido:', err);
          return null;
        }
      }).filter(Boolean) as Order[];
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
      localStorage.removeItem(this.storageKey);
      return [];
    }
  }

  private saveOrders(orders: Order[]): void {
    try {
      if (!Array.isArray(orders)) {
        console.error('Tentativa de salvar dados inválidos');
        return;
      }
      const data = JSON.stringify(orders);
      localStorage.setItem(this.storageKey, data);
      
      // Disparar evento para atualizar outras abas
      window.dispatchEvent(new CustomEvent('ordersUpdated', { detail: { orders } }));
    } catch (error) {
      console.error('Erro ao salvar pedidos:', error);
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
    } catch (error) {
      console.error('Erro ao gerar número do pedido:', error);
      return Date.now() % 10000; // Fallback
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

  getOrderByNumber(numero: number): Order | null {
    const orders = this.getOrders();
    return orders.find(order => order.numero === numero) || null;
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
    
    console.log(`Pedido #${newOrder.numero} criado com sucesso`);
    return newOrder;
  }

  updateOrderStatus(id: string, status: OrderStatus): Order | null {
    const orders = this.getOrders();
    const index = orders.findIndex(order => order.id === id);
    
    if (index === -1) {
      console.error(`Pedido com ID ${id} não encontrado`);
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
    console.log(`Status do pedido #${orders[index].numero} atualizado para: ${status}`);
    return orders[index];
  }

  updateOrder(id: string, updates: Partial<Omit<Order, 'id' | 'numero' | 'createdAt'>>): Order | null {
    const orders = this.getOrders();
    const index = orders.findIndex(order => order.id === id);
    
    if (index === -1) {
      console.error(`Pedido com ID ${id} não encontrado`);
      return null;
    }

    orders[index] = {
      ...orders[index],
      ...updates,
      updatedAt: new Date()
    };

    this.saveOrders(orders);
    console.log(`Pedido #${orders[index].numero} atualizado`);
    return orders[index];
  }

  deleteOrder(id: string): boolean {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === id);
    
    if (!order) {
      console.error(`Pedido com ID ${id} não encontrado`);
      return false;
    }

    const filteredOrders = orders.filter(order => order.id !== id);
    this.saveOrders(filteredOrders);
    console.log(`Pedido #${order.numero} removido`);
    return true;
  }

  // Verificar se já existe pedido similar (mesmo cliente, mesmos itens, mesmo horário)
  checkDuplicateOrder(cliente: string, itens: OrderItem[], timeWindow: number = 5): Order | null {
    const orders = this.getOrders();
    const now = new Date();
    
    return orders.find(order => {
      const timeDiff = (now.getTime() - order.createdAt.getTime()) / (1000 * 60); // em minutos
      
      if (timeDiff > timeWindow) return false;
      if (order.cliente !== cliente) return false;
      if (order.itens.length !== itens.length) return false;
      
      // Verificar se os itens são idênticos
      const sameItems = order.itens.every(orderItem => 
        itens.some(newItem => 
          newItem.nome === orderItem.nome && 
          newItem.quantidade === orderItem.quantidade
        )
      );
      
      return sameItems;
    }) || null;
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
      cancelled: orders.filter(order => order.status === 'cancelado').length,
      byStatus: {
        aceito: orders.filter(order => order.status === 'aceito').length,
        preparando: orders.filter(order => order.status === 'preparando').length,
        pronto: orders.filter(order => order.status === 'pronto').length,
        entregue: orders.filter(order => order.status === 'entregue').length,
        retirado: orders.filter(order => order.status === 'retirado').length,
        cancelado: orders.filter(order => order.status === 'cancelado').length
      },
      byType: {
        local: orders.filter(order => order.tipo === 'local').length,
        delivery: orders.filter(order => order.tipo === 'delivery').length,
        retirada: orders.filter(order => order.tipo === 'retirada').length
      }
    };
  }

  // Limpar pedidos antigos (mais de 30 dias) - DESABILITADO para evitar perda de dados
  cleanOldOrders(daysToKeep: number = 30): number {
    // Não limpar pedidos automaticamente para evitar perda de dados
    return 0;
  }
}

export const ordersDatabase = new OrdersDatabase();