import { useEffect, useCallback } from 'react';
import { integrationHub, SystemEvent } from '@/lib/integration-hub';

export const useIntegration = () => {
  // Criar pedido com sincronização automática
  const createOrder = useCallback((orderData: any) => {
    integrationHub.syncOrder(orderData);
  }, []);

  // Processar pagamento com sincronização
  const processPayment = useCallback((orderId: string, paymentData: any) => {
    integrationHub.processPayment(orderId, paymentData);
  }, []);

  // Atualizar estoque
  const updateInventory = useCallback((productId: string, quantity: number) => {
    integrationHub.updateInventory(productId, quantity);
  }, []);

  // Sincronizar produto
  const syncProduct = useCallback((product: any, action: 'create' | 'update' | 'delete') => {
    integrationHub.syncProduct(product, action);
  }, []);

  // Validar sistema
  const validateSystem = useCallback(() => {
    return integrationHub.validateSystem();
  }, []);

  // Escutar eventos específicos
  const onEvent = useCallback((eventType: string, callback: (data: any) => void) => {
    integrationHub.on(eventType, callback);
  }, []);

  return {
    createOrder,
    processPayment,
    updateInventory,
    syncProduct,
    validateSystem,
    onEvent
  };
};

// Hook para escutar eventos do sistema
export const useSystemEvents = (callback: (event: SystemEvent) => void) => {
  useEffect(() => {
    const handler = (e: Event) => {
      if (e instanceof CustomEvent) {
        callback(e.detail);
      }
    };
    window.addEventListener('system-event', handler);
    return () => window.removeEventListener('system-event', handler);
  }, [callback]);
};
