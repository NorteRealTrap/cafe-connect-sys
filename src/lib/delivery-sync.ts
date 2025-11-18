// Sistema de sincronização entre pedidos e delivery

export interface DeliveryInfo {
  orderId: string;
  deliveryId: string;
  driver?: string;
  status: 'preparando' | 'saiu_entrega' | 'entregue' | 'cancelado';
  estimatedTime: string;
  distance: string;
}

class DeliverySyncService {
  private readonly ORDERS_KEY = 'cafe-connect-orders';
  private readonly DELIVERIES_KEY = 'ccpservices-deliveries';

  // Criar delivery a partir de um pedido
  createDeliveryFromOrder(orderId: string): string | null {
    const orders = JSON.parse(localStorage.getItem(this.ORDERS_KEY) || '[]');
    const order = orders.find((o: any) => o.id === orderId);
    
    if (!order || order.tipo !== 'delivery') return null;

    const deliveries = JSON.parse(localStorage.getItem(this.DELIVERIES_KEY) || '[]');
    
    const deliveryId = `DEL-${Date.now().toString().slice(-6)}`;
    const newDelivery = {
      id: deliveryId,
      orderId: orderId,
      customer: order.cliente || order.customerName || 'Cliente',
      phone: order.telefone || order.phone || '',
      address: order.endereco || order.address || '',
      items: (order.itens || order.items || []).map((item: any) => 
        `${item.quantidade || item.quantity}x ${item.nome || item.productName}`
      ),
      total: Number(order.total) || 0,
      status: 'preparando' as const,
      estimatedTime: '30 min',
      distance: '3.0 km',
      createdAt: new Date().toISOString()
    };

    deliveries.push(newDelivery);
    localStorage.setItem(this.DELIVERIES_KEY, JSON.stringify(deliveries));
    
    // Atualizar pedido com referência ao delivery
    const updatedOrders = orders.map((o: any) => 
      o.id === orderId ? { ...o, deliveryId } : o
    );
    localStorage.setItem(this.ORDERS_KEY, JSON.stringify(updatedOrders));
    
    window.dispatchEvent(new CustomEvent('deliveryCreated', { 
      detail: { orderId, deliveryId } 
    }));
    
    return deliveryId;
  }

  // Atualizar status do delivery e sincronizar com pedido
  updateDeliveryStatus(deliveryId: string, status: DeliveryInfo['status'], driver?: string): void {
    const deliveries = JSON.parse(localStorage.getItem(this.DELIVERIES_KEY) || '[]');
    const delivery = deliveries.find((d: any) => d.id === deliveryId);
    
    if (!delivery) return;

    const updatedDeliveries = deliveries.map((d: any) => 
      d.id === deliveryId ? { ...d, status, driver, updatedAt: new Date().toISOString() } : d
    );
    localStorage.setItem(this.DELIVERIES_KEY, JSON.stringify(updatedDeliveries));

    // Sincronizar status com pedido
    if (delivery.orderId) {
      const orderStatus = status === 'saiu_entrega' ? 'saiu-entrega' : status;
      this.updateOrderStatus(delivery.orderId, orderStatus);
    }

    window.dispatchEvent(new CustomEvent('deliveryStatusChanged', { 
      detail: { deliveryId, status, orderId: delivery.orderId } 
    }));
  }

  // Atualizar status do pedido e sincronizar com delivery
  updateOrderStatus(orderId: string, status: string): void {
    const orders = JSON.parse(localStorage.getItem(this.ORDERS_KEY) || '[]');
    const order = orders.find((o: any) => o.id === orderId);
    
    if (!order) return;

    const updatedOrders = orders.map((o: any) => 
      o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o
    );
    localStorage.setItem(this.ORDERS_KEY, JSON.stringify(updatedOrders));

    // Sincronizar com delivery se existir
    if (order.deliveryId) {
      const deliveryStatus = status === 'saiu-entrega' ? 'saiu_entrega' : status;
      this.syncDeliveryStatus(order.deliveryId, deliveryStatus);
    }

    window.dispatchEvent(new CustomEvent('orderStatusChanged', { 
      detail: { orderId, status } 
    }));
  }

  private syncDeliveryStatus(deliveryId: string, status: string): void {
    const deliveries = JSON.parse(localStorage.getItem(this.DELIVERIES_KEY) || '[]');
    const updatedDeliveries = deliveries.map((d: any) => 
      d.id === deliveryId ? { ...d, status } : d
    );
    localStorage.setItem(this.DELIVERIES_KEY, JSON.stringify(updatedDeliveries));
  }

  // Obter informações do delivery de um pedido
  getDeliveryByOrderId(orderId: string): any | null {
    const deliveries = JSON.parse(localStorage.getItem(this.DELIVERIES_KEY) || '[]');
    return deliveries.find((d: any) => d.orderId === orderId) || null;
  }

  // Obter pedido de um delivery
  getOrderByDeliveryId(deliveryId: string): any | null {
    const orders = JSON.parse(localStorage.getItem(this.ORDERS_KEY) || '[]');
    return orders.find((o: any) => o.deliveryId === deliveryId) || null;
  }
}

export const deliverySync = new DeliverySyncService();
