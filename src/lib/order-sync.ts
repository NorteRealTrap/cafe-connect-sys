// Sistema de sincronização universal de pedidos
export class OrderSyncManager {
  private static instance: OrderSyncManager;

  static getInstance(): OrderSyncManager {
    if (!OrderSyncManager.instance) {
      OrderSyncManager.instance = new OrderSyncManager();
    }
    return OrderSyncManager.instance;
  }

  // Sincronizar status para todos os sistemas
  async syncOrderStatus(orderData: {
    orderId: string;
    orderNumber: number;
    customerPhone: string;
    customerName: string;
    status: string;
  }) {
    console.log(`🔄 SYNC: Sincronizando pedido #${orderData.orderNumber} para status '${orderData.status}'`);

    try {
      // 1. Atualizar API
      await fetch('/api/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orderData.orderId,
          orderNumber: orderData.orderNumber,
          customerPhone: orderData.customerPhone,
          customerName: orderData.customerName,
          status: orderData.status,
          timestamp: new Date().toISOString()
        })
      });

      // 2. Atualizar localStorage de pedidos web
      this.updateWebOrders(orderData);

      // 3. Atualizar localStorage de pedidos principais
      this.updateMainOrders(orderData);

      // 4. Disparar eventos para componentes
      window.dispatchEvent(new CustomEvent('orderStatusUpdated', {
        detail: orderData
      }));

      console.log(`✅ SYNC: Pedido #${orderData.orderNumber} sincronizado com sucesso`);
      return true;
    } catch (error) {
      console.error(`❌ SYNC: Erro ao sincronizar pedido #${orderData.orderNumber}:`, error);
      return false;
    }
  }

  private updateWebOrders(orderData: any) {
    try {
      const webOrders = JSON.parse(localStorage.getItem('ccpservices-web-orders') || '[]');
      const updated = webOrders.map((order: any) => {
        if (order.customerPhone === orderData.customerPhone || 
            order.id.includes(orderData.orderNumber.toString())) {
          return { ...order, status: orderData.status };
        }
        return order;
      });
      localStorage.setItem('ccpservices-web-orders', JSON.stringify(updated));
      console.log(`📱 WEB: Atualizado pedidos web para cliente ${orderData.customerPhone}`);
    } catch (error) {
      console.error('Erro ao atualizar pedidos web:', error);
    }
  }

  private updateMainOrders(orderData: any) {
    try {
      const mainOrders = JSON.parse(localStorage.getItem('cafe-connect-orders') || '[]');
      const updated = mainOrders.map((order: any) => {
        if (order.id === orderData.orderId || 
            order.numero === orderData.orderNumber ||
            order.telefone === orderData.customerPhone) {
          return { ...order, status: orderData.status };
        }
        return order;
      });
      localStorage.setItem('cafe-connect-orders', JSON.stringify(updated));
      console.log(`🏪 MAIN: Atualizado pedidos principais para #${orderData.orderNumber}`);
    } catch (error) {
      console.error('Erro ao atualizar pedidos principais:', error);
    }
  }

  // Buscar pedidos por telefone do cliente
  getCustomerOrders(customerPhone: string) {
    try {
      const webOrders = JSON.parse(localStorage.getItem('ccpservices-web-orders') || '[]');
      const mainOrders = JSON.parse(localStorage.getItem('cafe-connect-orders') || '[]');
      
      const customerWebOrders = webOrders.filter((o: any) => o.customerPhone === customerPhone);
      const customerMainOrders = mainOrders.filter((o: any) => o.telefone === customerPhone);
      
      return [...customerWebOrders, ...customerMainOrders]
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error('Erro ao buscar pedidos do cliente:', error);
      return [];
    }
  }
}

export const orderSync = OrderSyncManager.getInstance();