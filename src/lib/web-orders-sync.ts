// Sincronizador de pedidos web para o sistema principal

import { ordersDB } from './orders-db';
import type { OrderStatus } from './orders-db';

const WEB_ORDERS_KEY = 'ccpservices-web-orders';

// Mapeamento de status entre sistemas
const statusMap: Record<string, OrderStatus> = {
  'web-pendente': 'pendente',
  'aceito': 'preparando',
  'preparando': 'preparando',
  'pronto': 'pronto',
  'saiu-entrega': 'pronto',
  'entregue': 'entregue',
  'cancelado': 'cancelado'
};

const reverseStatusMap: Record<OrderStatus, string> = {
  'pendente': 'web-pendente',
  'preparando': 'preparando',
  'pronto': 'pronto',
  'entregue': 'entregue',
  'cancelado': 'cancelado'
};

export const webOrdersSync = {
  // Importar pedidos web para o sistema principal
  importWebOrders: () => {
    try {
      const webOrders = JSON.parse(localStorage.getItem(WEB_ORDERS_KEY) || '[]');
      const mainOrders = ordersDB.getAll();
      
      let imported = 0;
      
      webOrders.forEach((webOrder: any) => {
        // Verificar se já foi importado
        const exists = mainOrders.find(o => o.id === webOrder.id);
        if (exists) {
          // Atualizar status se mudou (mapear status web para sistema)
          const mappedStatus = statusMap[webOrder.status] || 'pendente';
          if (exists.status !== mappedStatus) {
            ordersDB.updateStatus(webOrder.id, mappedStatus);
          }
          return;
        }
        
        // Importar para o sistema principal mantendo o ID original
        ordersDB.create({
          id: webOrder.id,
          tipo: 'delivery',
          cliente: webOrder.customerName,
          telefone: webOrder.customerPhone,
          endereco: webOrder.customerAddress,
          itens: webOrder.items.map((item: any) => ({
            id: item.productId,
            nome: item.productName,
            quantidade: Number(item.quantity),
            preco: Number(item.price),
            observacoes: ''
          })),
          total: Number(webOrder.total),
          observacoes: `Pedido Web - ${webOrder.id}`
        });
        
        imported++;
      });
      
      if (imported > 0) {
        console.log(`✅ ${imported} pedidos web importados`);
      }
      
      return imported;
    } catch (error) {
      console.error('Erro ao importar pedidos web:', error);
      return 0;
    }
  },

  // Sincronizar status de volta para pedidos web
  syncStatusToWeb: (orderId: string, status: OrderStatus) => {
    try {
      const webOrders = JSON.parse(localStorage.getItem(WEB_ORDERS_KEY) || '[]');
      let found = false;
      
      const updated = webOrders.map((order: any) => {
        if (order.id === orderId) {
          found = true;
          // Mapear status do sistema para status web
          const webStatus = reverseStatusMap[status] || status;
          return { ...order, status: webStatus, updatedAt: new Date().toISOString() };
        }
        return order;
      });
      
      if (found) {
        localStorage.setItem(WEB_ORDERS_KEY, JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('orderStatusChanged', { 
          detail: { orderId, status } 
        }));
        console.log(`✅ Status sincronizado: ${orderId} -> ${status}`);
      }
    } catch (error) {
      console.error('Erro ao sincronizar status:', error);
    }
  },

  // Iniciar sincronização automática
  startAutoSync: () => {
    // Importar ao iniciar
    webOrdersSync.importWebOrders();
    
    // Listener para novos pedidos web
    const handleNewWebOrder = () => {
      setTimeout(() => webOrdersSync.importWebOrders(), 500);
    };
    
    // Listener para mudanças no storage (outras abas)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === WEB_ORDERS_KEY || e.key === 'cafe-connect-orders') {
        webOrdersSync.importWebOrders();
      }
    };
    
    window.addEventListener('newWebOrder', handleNewWebOrder);
    window.addEventListener('storage', handleStorageChange);
    
    // Verificar periodicamente
    const interval = setInterval(() => {
      webOrdersSync.importWebOrders();
    }, 3000); // A cada 3 segundos
    
    return () => {
      window.removeEventListener('newWebOrder', handleNewWebOrder);
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }
};
