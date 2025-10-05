// Sincronizador de pedidos web para o sistema principal

import { ordersDB } from './orders-db';

const WEB_ORDERS_KEY = 'ccpservices-web-orders';

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
        if (exists) return;
        
        // Importar para o sistema principal
        ordersDB.create({
          tipo: 'delivery',
          cliente: webOrder.customerName,
          telefone: webOrder.customerPhone,
          endereco: webOrder.customerAddress,
          itens: webOrder.items.map((item: any) => ({
            id: item.productId,
            nome: item.productName,
            quantidade: item.quantity,
            preco: item.price,
            observacoes: ''
          })),
          total: webOrder.total,
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
  syncStatusToWeb: (orderId: string, status: string) => {
    try {
      const webOrders = JSON.parse(localStorage.getItem(WEB_ORDERS_KEY) || '[]');
      const updated = webOrders.map((order: any) => {
        if (order.id === orderId) {
          return { ...order, status };
        }
        return order;
      });
      
      localStorage.setItem(WEB_ORDERS_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('orderStatusChanged', { 
        detail: { orderId, status } 
      }));
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
    
    window.addEventListener('newWebOrder', handleNewWebOrder);
    
    // Verificar periodicamente
    const interval = setInterval(() => {
      webOrdersSync.importWebOrders();
    }, 5000); // A cada 5 segundos
    
    return () => {
      window.removeEventListener('newWebOrder', handleNewWebOrder);
      clearInterval(interval);
    };
  }
};
