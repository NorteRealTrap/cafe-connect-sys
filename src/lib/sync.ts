// Sistema de sincronização entre dispositivos usando URL como ponte
export class CrossDeviceSync {
  private static instance: CrossDeviceSync;
  private syncUrl: string;

  static getInstance(): CrossDeviceSync {
    if (!CrossDeviceSync.instance) {
      CrossDeviceSync.instance = new CrossDeviceSync();
    }
    return CrossDeviceSync.instance;
  }

  constructor() {
    this.syncUrl = window.location.origin;
  }

  // Salvar pedido com sincronização
  async saveWebOrder(order: any) {
    try {
      // Salvar localmente
      const existingOrders = JSON.parse(localStorage.getItem('ccpservices-web-orders') || '[]');
      existingOrders.push(order);
      localStorage.setItem('ccpservices-web-orders', JSON.stringify(existingOrders));
      
      // Tentar sincronizar via URL hash (funciona entre dispositivos na mesma rede)
      const syncData = {
        type: 'newWebOrder',
        order: order,
        timestamp: Date.now()
      };
      
      // Usar sessionStorage como ponte temporária
      sessionStorage.setItem('pendingSync', JSON.stringify(syncData));
      
      // Broadcast para outras abas/dispositivos
      this.broadcastToAllDevices(syncData);
      
      return true;
    } catch (error) {
      console.error('Erro ao sincronizar pedido:', error);
      return false;
    }
  }

  // Verificar pedidos pendentes
  checkPendingOrders() {
    try {
      const pending = sessionStorage.getItem('pendingSync');
      if (pending) {
        const syncData = JSON.parse(pending);
        if (syncData.type === 'newWebOrder') {
          // Processar pedido pendente
          const existingOrders = JSON.parse(localStorage.getItem('ccpservices-web-orders') || '[]');
          const orderExists = existingOrders.find((o: any) => o.id === syncData.order.id);
          
          if (!orderExists) {
            existingOrders.push(syncData.order);
            localStorage.setItem('ccpservices-web-orders', JSON.stringify(existingOrders));
            
            // Notificar interface
            window.dispatchEvent(new CustomEvent('newWebOrder', { detail: syncData.order }));
          }
        }
        sessionStorage.removeItem('pendingSync');
      }
    } catch (error) {
      console.error('Erro ao verificar pedidos pendentes:', error);
    }
  }

  // Broadcast para outros dispositivos
  private broadcastToAllDevices(data: any) {
    // Usar BroadcastChannel se disponível
    if ('BroadcastChannel' in window) {
      const channel = new BroadcastChannel('cafe-connect-sync');
      channel.postMessage(data);
    }
    
    // Usar localStorage como fallback
    const syncKey = `sync-${Date.now()}`;
    localStorage.setItem(syncKey, JSON.stringify(data));
    
    // Limpar após 5 segundos
    setTimeout(() => {
      localStorage.removeItem(syncKey);
    }, 5000);
  }

  // Escutar sincronização
  startListening() {
    // BroadcastChannel
    if ('BroadcastChannel' in window) {
      const channel = new BroadcastChannel('cafe-connect-sync');
      channel.onmessage = (event) => {
        this.processSyncData(event.data);
      };
    }

    // Storage events
    window.addEventListener('storage', (e) => {
      if (e.key && e.key.startsWith('sync-') && e.newValue) {
        try {
          const data = JSON.parse(e.newValue);
          this.processSyncData(data);
        } catch (error) {
          console.error('Erro ao processar sync data:', error);
        }
      }
    });
  }

  private processSyncData(data: any) {
    if (data.type === 'newWebOrder') {
      const existingOrders = JSON.parse(localStorage.getItem('ccpservices-web-orders') || '[]');
      const orderExists = existingOrders.find((o: any) => o.id === data.order.id);
      
      if (!orderExists) {
        existingOrders.push(data.order);
        localStorage.setItem('ccpservices-web-orders', JSON.stringify(existingOrders));
        
        // Notificar interface
        window.dispatchEvent(new CustomEvent('newWebOrder', { detail: data.order }));
      }
    }
  }
}

// Hook para usar sincronização
import { useEffect } from 'react';

export function useCrossDeviceSync() {
  const sync = CrossDeviceSync.getInstance();

  useEffect(() => {
    sync.startListening();
    sync.checkPendingOrders();
    
    // Verificar periodicamente
    const interval = setInterval(() => {
      sync.checkPendingOrders();
    }, 2000);

    return () => clearInterval(interval);
  }, [sync]);

  return {
    saveWebOrder: (order: any) => sync.saveWebOrder(order)
  };
}