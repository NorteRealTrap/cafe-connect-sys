'use client';

import { useState, useEffect } from 'react';
import { Order } from '@/types';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8">Carregando...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Pedidos</h1>
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="border rounded-lg p-4">
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold">Pedido #{order.id.slice(-6)}</h3>
                <p className="text-sm text-gray-600">Cliente: {order.customer?.name}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">R$ {order.total.toFixed(2)}</p>
                <span className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded">
                  {order.status}
                </span>
              </div>
            </div>
            <div className="mt-2">
              {order.items.map(item => (
                <div key={item.id} className="text-sm text-gray-600">
                  {item.quantity}x {item.product?.name}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
