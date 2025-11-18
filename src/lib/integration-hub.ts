// Hub Central de Integração do Sistema
// Conecta todos os módulos e sincroniza dados entre eles

import { db } from './database';
import { ordersDatabase } from './orders-database';
import { databaseManager } from './database-manager';
import { paymentProcessor } from './payment-processor';

export interface SystemEvent {
  type: 'order' | 'payment' | 'inventory' | 'user' | 'product' | 'table' | 'delivery';
  action: 'create' | 'update' | 'delete' | 'status_change';
  data: any;
  timestamp: string;
}

class IntegrationHub {
  private listeners: Map<string, Function[]> = new Map();

  // Registrar listener para eventos
  on(eventType: string, callback: Function) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)?.push(callback);
  }

  // Emitir evento para todos os listeners
  emit(event: SystemEvent) {
    const key = `${event.type}:${event.action}`;
    this.listeners.get(key)?.forEach(callback => callback(event.data));
    this.listeners.get(event.type)?.forEach(callback => callback(event));
    
    // Disparar evento global no window
    window.dispatchEvent(new CustomEvent('system-event', { detail: event }));
  }

  // Sincronizar pedido com todos os módulos relacionados
  syncOrder(order: any) {
    // Atualizar estoque
    if (order.items) {
      order.items.forEach((item: any) => {
        this.updateInventory(item.productId, -item.quantity);
      });
    }

    // Atualizar mesa se for pedido local
    if (order.table) {
      this.updateTableStatus(order.table, 'ocupada', order.id);
    }

    // Criar registro de pagamento pendente
    if (order.status === 'pronto') {
      this.createPendingPayment(order);
    }

    // Notificar delivery se for entrega
    if (order.type === 'delivery') {
      this.notifyDelivery(order);
    }

    this.emit({
      type: 'order',
      action: 'create',
      data: order,
      timestamp: new Date().toISOString()
    });
  }

  // Atualizar estoque
  updateInventory(productId: string, quantityChange: number) {
    const inventory = db.getInventory();
    const updated = inventory.map(item => {
      if (item.id === productId) {
        const newStock = item.currentStock + quantityChange;
        const status = newStock <= item.minStock ? 'critical' : 
                      newStock <= item.minStock * 1.5 ? 'low' : 
                      newStock >= item.maxStock ? 'excess' : 'normal';
        return { ...item, currentStock: newStock, status, lastUpdated: new Date().toLocaleString('pt-BR') };
      }
      return item;
    });
    db.saveInventory(updated);

    this.emit({
      type: 'inventory',
      action: 'update',
      data: { productId, quantityChange },
      timestamp: new Date().toISOString()
    });
  }

  // Atualizar status da mesa
  updateTableStatus(tableNumber: number, status: string, orderId?: string) {
    const tables = db.getTables();
    const updated = tables.map(table => 
      table.number === tableNumber 
        ? { ...table, status, currentOrder: orderId }
        : table
    );
    db.saveTables(updated);

    this.emit({
      type: 'table',
      action: 'update',
      data: { tableNumber, status, orderId },
      timestamp: new Date().toISOString()
    });
  }

  // Criar pagamento pendente
  createPendingPayment(order: any) {
    const payments = db.getPayments();
    const payment = {
      id: `PAY-${Date.now()}`,
      orderId: order.id,
      amount: order.total,
      method: 'dinheiro' as const,
      status: 'pendente' as const,
      createdAt: new Date().toISOString()
    };
    payments.push(payment);
    db.savePayments(payments);

    this.emit({
      type: 'payment',
      action: 'create',
      data: payment,
      timestamp: new Date().toISOString()
    });
  }

  // Notificar sistema de delivery
  notifyDelivery(order: any) {
    const deliveries = JSON.parse(localStorage.getItem('ccpservices-deliveries') || '[]');
    const delivery = {
      id: `DEL-${Date.now()}`,
      orderId: order.id,
      customer: order.customerName,
      phone: order.customerPhone,
      address: order.customerAddress,
      items: order.items.map((i: any) => i.productName),
      total: order.total,
      status: 'preparando' as const,
      estimatedTime: `${order.estimatedTime || 30} min`,
      distance: '2.5 km'
    };
    deliveries.push(delivery);
    localStorage.setItem('ccpservices-deliveries', JSON.stringify(deliveries));

    this.emit({
      type: 'delivery',
      action: 'create',
      data: delivery,
      timestamp: new Date().toISOString()
    });
  }

  // Processar pagamento completo
  processPayment(orderId: string, paymentData: any) {
    // Atualizar status do pedido
    const orders = ordersDatabase.getAllOrders();
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: 'entregue', paymentMethod: paymentData.method } : order
    );
    ordersDatabase.saveOrders(updatedOrders);

    // Registrar transação
    paymentProcessor.recordTransaction({
      orderId,
      amount: paymentData.amount,
      method: paymentData.method,
      timestamp: new Date().toISOString()
    });

    // Liberar mesa se houver
    const order = orders.find(o => o.id === orderId);
    if (order?.table) {
      this.updateTableStatus(order.table, 'livre');
    }

    this.emit({
      type: 'payment',
      action: 'update',
      data: { orderId, ...paymentData },
      timestamp: new Date().toISOString()
    });
  }

  // Sincronizar produto com estoque
  syncProduct(product: any, action: 'create' | 'update' | 'delete') {
    if (action === 'create') {
      // Criar item de estoque correspondente
      const inventory = db.getInventory();
      const inventoryItem = {
        id: product.id,
        name: product.name,
        category: product.category,
        currentStock: 0,
        minStock: 10,
        maxStock: 100,
        unit: 'un',
        costPrice: product.price * 0.6,
        supplier: 'Fornecedor Padrão',
        lastUpdated: new Date().toLocaleString('pt-BR'),
        status: 'critical' as const
      };
      inventory.push(inventoryItem);
      db.saveInventory(inventory);
    }

    this.emit({
      type: 'product',
      action,
      data: product,
      timestamp: new Date().toISOString()
    });
  }

  // Validar integridade do sistema
  validateSystem(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Verificar bancos de dados
    const dbStatus = databaseManager.getAllDatabases();
    dbStatus.forEach(db => {
      if (db.status === 'error') {
        errors.push(`Banco ${db.name} com erro`);
      }
    });

    // Verificar pedidos órfãos (sem produtos válidos)
    const orders = ordersDatabase.getAllOrders();
    const products = db.getProducts();
    orders.forEach(order => {
      order.items.forEach(item => {
        if (!products.find(p => p.id === item.productId)) {
          errors.push(`Pedido ${order.id} contém produto inválido ${item.productId}`);
        }
      });
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Sincronização em tempo real
  startRealtimeSync() {
    // Sincronizar a cada 2 segundos
    setInterval(() => {
      // Verificar novos pedidos web
      const webOrders = JSON.parse(localStorage.getItem('ccpservices-web-orders') || '[]');
      const mainOrders = ordersDatabase.getAllOrders();
      
      webOrders.forEach((webOrder: any) => {
        if (!mainOrders.find(o => o.id === webOrder.id)) {
          ordersDatabase.createOrder(webOrder);
          this.syncOrder(webOrder);
        }
      });

      // Sincronizar status de delivery
      const deliveries = JSON.parse(localStorage.getItem('ccpservices-deliveries') || '[]');
      deliveries.forEach((delivery: any) => {
        if (delivery.orderId) {
          const order = mainOrders.find(o => o.id === delivery.orderId);
          if (order && order.status !== delivery.status) {
            ordersDatabase.updateOrderStatus(delivery.orderId, delivery.status);
          }
        }
      });
    }, 2000);
  }
}

export const integrationHub = new IntegrationHub();

// Iniciar sincronização automática
if (typeof window !== 'undefined') {
  integrationHub.startRealtimeSync();
}
