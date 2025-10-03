// Sistema de atualizações em tempo real
export class RealtimeManager {
  private static instance: RealtimeManager;
  private eventListeners: Map<string, Set<(data: any) => void>> = new Map();
  private pollingIntervals: Map<string, NodeJS.Timeout> = new Map();

  static getInstance(): RealtimeManager {
    if (!RealtimeManager.instance) {
      RealtimeManager.instance = new RealtimeManager();
    }
    return RealtimeManager.instance;
  }

  // Inicializar sistema de tempo real
  initialize() {
    this.setupStorageListener();
    this.setupCustomEventListener();
    this.startPolling();
  }

  // Escutar mudanças no localStorage
  private setupStorageListener() {
    window.addEventListener('storage', (e) => {
      if (e.key && e.newValue) {
        try {
          const data = JSON.parse(e.newValue);
          this.broadcast(e.key, data);
        } catch (error) {
          console.error('Erro ao processar mudança de storage:', error);
        }
      }
    });
  }

  // Escutar eventos customizados
  private setupCustomEventListener() {
    window.addEventListener('dataChanged', (e: any) => {
      const { key, data } = e.detail;
      this.broadcast(key, data);
    });

    window.addEventListener('newWebOrder', (e: any) => {
      this.broadcast('newWebOrder', e.detail);
    });

    window.addEventListener('orderStatusChanged', (e: any) => {
      this.broadcast('orderStatusChanged', e.detail);
    });
  }

  // Polling para atualizações críticas
  private startPolling() {
    const criticalKeys = [
      'cafe-connect-orders',
      'ccpservices-web-orders',
      'ccpservices-products',
      'ccpservices-inventory'
    ];

    criticalKeys.forEach(key => {
      const interval = setInterval(() => {
        try {
          const data = localStorage.getItem(key);
          if (data) {
            const parsed = JSON.parse(data);
            this.broadcast(key, parsed);
          }
        } catch (error) {
          console.error(`Erro no polling de ${key}:`, error);
        }
      }, 2000); // A cada 2 segundos

      this.pollingIntervals.set(key, interval);
    });
  }

  // Transmitir mudanças para todos os listeners
  private broadcast(event: string, data: any) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Erro ao executar callback para ${event}:`, error);
        }
      });
    }
  }

  // Inscrever-se em eventos
  subscribe(event: string, callback: (data: any) => void) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(callback);

    return () => {
      const listeners = this.eventListeners.get(event);
      if (listeners) {
        listeners.delete(callback);
      }
    };
  }

  // Emitir evento
  emit(event: string, data: any) {
    window.dispatchEvent(new CustomEvent(event, { detail: data }));
    this.broadcast(event, data);
  }

  // Cleanup
  destroy() {
    this.pollingIntervals.forEach(interval => clearInterval(interval));
    this.pollingIntervals.clear();
    this.eventListeners.clear();
  }
}

// Hook para usar atualizações em tempo real
import { useEffect, useState, useCallback } from 'react';

export function useRealtime<T>(key: string, initialValue: T) {
  const [data, setData] = useState<T>(initialValue);
  const rm = RealtimeManager.getInstance();

  useEffect(() => {
    // Carregar dados iniciais
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        setData(JSON.parse(stored));
      }
    } catch (error) {
      console.error(`Erro ao carregar ${key}:`, error);
    }

    // Inscrever-se em mudanças
    const unsubscribe = rm.subscribe(key, (newData) => {
      setData(newData);
    });

    return unsubscribe;
  }, [key, rm]);

  const updateData = useCallback((newValue: T | ((prev: T) => T)) => {
    setData(prev => {
      const nextValue = typeof newValue === 'function' 
        ? (newValue as (prev: T) => T)(prev) 
        : newValue;
      
      localStorage.setItem(key, JSON.stringify(nextValue));
      rm.emit('dataChanged', { key, data: nextValue });
      return nextValue;
    });
  }, [key, rm]);

  return [data, updateData] as const;
}

// Hook para notificações em tempo real
export function useRealtimeNotifications() {
  const rm = RealtimeManager.getInstance();

  useEffect(() => {
    const unsubscribeNewOrder = rm.subscribe('newWebOrder', (order) => {
      // Notificação visual ou sonora para novos pedidos
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Novo Pedido Web!', {
          body: `Pedido ${order.id} - R$ ${order.total.toFixed(2)}`,
          icon: '/favicon.ico'
        });
      }
    });

    const unsubscribeStatusChange = rm.subscribe('orderStatusChanged', (data) => {
      console.log('Status do pedido alterado:', data);
    });

    return () => {
      unsubscribeNewOrder();
      unsubscribeStatusChange();
    };
  }, [rm]);

  // Solicitar permissão para notificações
  const requestNotificationPermission = useCallback(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return { requestNotificationPermission };
}

// Inicializar sistema de tempo real
export const initializeRealtime = () => {
  const rm = RealtimeManager.getInstance();
  rm.initialize();
  
  // Solicitar permissão para notificações
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
};