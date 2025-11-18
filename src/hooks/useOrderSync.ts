import { useEffect } from 'react';

export const useOrderSync = (callback: () => void) => {
  useEffect(() => {
    // BroadcastChannel para sincronização entre abas
    const channel = new BroadcastChannel('order-updates');
    
    channel.onmessage = (event) => {
      if (event.data.type === 'ORDER_STATUS_UPDATED') {
        callback();
      }
    };

    // Storage event para fallback
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'cafe-connect-orders' || e.key === 'ccpservices-web-orders') {
        callback();
      }
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      channel.close();
      window.removeEventListener('storage', handleStorage);
    };
  }, [callback]);
};

export const notifyOrderUpdate = () => {
  try {
    const channel = new BroadcastChannel('order-updates');
    channel.postMessage({ type: 'ORDER_STATUS_UPDATED', timestamp: Date.now() });
    channel.close();
  } catch (error) {
    console.error('Erro ao notificar atualização:', error);
  }
};
