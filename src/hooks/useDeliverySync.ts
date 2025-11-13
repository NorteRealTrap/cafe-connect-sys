import { useEffect, useState } from 'react';
import { deliverySync } from '@/lib/delivery-sync';

export const useDeliverySync = (orderId?: string) => {
  const [delivery, setDelivery] = useState<any>(null);
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (!orderId) return;

    const loadDelivery = () => {
      const deliveryData = deliverySync.getDeliveryByOrderId(orderId);
      setDelivery(deliveryData);
    };

    loadDelivery();

    const handleUpdate = (e: any) => {
      if (e.detail?.orderId === orderId) {
        loadDelivery();
      }
    };

    window.addEventListener('deliveryCreated', handleUpdate);
    window.addEventListener('deliveryStatusChanged', handleUpdate);
    window.addEventListener('orderStatusChanged', handleUpdate);

    return () => {
      window.removeEventListener('deliveryCreated', handleUpdate);
      window.removeEventListener('deliveryStatusChanged', handleUpdate);
      window.removeEventListener('orderStatusChanged', handleUpdate);
    };
  }, [orderId]);

  const createDelivery = (orderIdToCreate: string) => {
    return deliverySync.createDeliveryFromOrder(orderIdToCreate);
  };

  const updateDeliveryStatus = (deliveryId: string, status: any, driver?: string) => {
    deliverySync.updateDeliveryStatus(deliveryId, status, driver);
  };

  return {
    delivery,
    order,
    createDelivery,
    updateDeliveryStatus,
    hasDelivery: !!delivery
  };
};
