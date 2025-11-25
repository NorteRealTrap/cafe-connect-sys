'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8">Carregando...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Produtos</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map(product => (
          <div key={product.id} className="border rounded-lg p-4">
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-lg font-bold mt-2">R$ {product.price.toFixed(2)}</p>
            <p className="text-sm text-gray-500">Estoque: {product.stock}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
