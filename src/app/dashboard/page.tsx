'use client';

import React, { useState, useEffect } from 'react';
import { Coffee, ShoppingCart, Package, TrendingUp, Users, Clock, Plus, Edit2, X } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  stock: number;
}

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
  customer?: { name: string };
}

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: { name: string };
}

export default function CafeConnectDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/products').then(r => r.json()),
      fetch('/api/orders').then(r => r.json())
    ]).then(([productsData, ordersData]) => {
      setProducts(productsData);
      setOrders(ordersData);
      setLoading(false);
    });
  }, []);

  const stats = {
    totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
    totalOrders: orders.length,
    totalProducts: products.length,
    activeOrders: orders.filter(o => ['PENDING', 'PREPARING'].includes(o.status)).length,
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Coffee className="w-8 h-8 text-amber-600" />
              <h1 className="text-2xl font-bold text-gray-900">Café Connect</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Admin</span>
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {[
              { id: 'overview', label: 'Visão Geral' },
              { id: 'products', label: 'Produtos' },
              { id: 'orders', label: 'Pedidos' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && <OverviewTab stats={stats} recentOrders={orders.slice(0, 5)} />}
        {activeTab === 'products' && <ProductsTab products={products} setProducts={setProducts} />}
        {activeTab === 'orders' && <OrdersTab orders={orders} setOrders={setOrders} />}
      </main>
    </div>
  );
}

function OverviewTab({ stats, recentOrders }: { stats: any; recentOrders: Order[] }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Receita Total" value={`R$ ${stats.totalRevenue.toFixed(2)}`} icon={<TrendingUp className="w-6 h-6" />} color="green" />
        <StatCard title="Pedidos Hoje" value={stats.totalOrders} icon={<ShoppingCart className="w-6 h-6" />} color="blue" />
        <StatCard title="Produtos Ativos" value={stats.totalProducts} icon={<Package className="w-6 h-6" />} color="purple" />
        <StatCard title="Em Preparação" value={stats.activeOrders} icon={<Clock className="w-6 h-6" />} color="amber" />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-600" />
          Pedidos Recentes
        </h2>
        <div className="space-y-3">
          {recentOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div>
                <p className="font-medium text-gray-900">#{order.id.slice(-6)}</p>
                <p className="text-sm text-gray-600">{order.customer?.name || 'Cliente'}</p>
                <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString('pt-BR')}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-amber-600">R$ {order.total.toFixed(2)}</p>
                <span className={`text-xs px-2 py-1 rounded font-medium ${getStatusColor(order.status)}`}>
                  {translateStatus(order.status)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductsTab({ products, setProducts }: { products: Product[]; setProducts: Function }) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleSave = async (product: Product) => {
    const method = products.find(p => p.id === product.id) ? 'PUT' : 'POST';
    const url = method === 'PUT' ? `/api/products/${product.id}` : '/api/products';
    
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });

    if (response.ok) {
      const savedProduct = await response.json();
      if (method === 'PUT') {
        setProducts(products.map((p: Product) => p.id === savedProduct.id ? savedProduct : p));
      } else {
        setProducts([...products, savedProduct]);
      }
    }
    
    setShowModal(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Package className="w-7 h-7 text-amber-600" />
          Gerenciar Produtos
        </h2>
        <button
          onClick={() => {
            setEditingProduct({ id: '', name: '', description: '', price: 0, category: 'COFFEE', stock: 0 });
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors shadow-md"
        >
          <Plus className="w-5 h-5" />
          Novo Produto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
            <div className="h-40 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
              <Coffee className="w-16 h-16 text-amber-600" />
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-lg mb-1 text-gray-900">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-bold text-amber-600">R$ {product.price.toFixed(2)}</span>
                <span className="text-sm bg-gray-100 px-2 py-1 rounded">Estoque: {product.stock}</span>
              </div>
              <button
                onClick={() => {
                  setEditingProduct(product);
                  setShowModal(true);
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Editar
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && editingProduct && (
        <ProductModal
          product={editingProduct}
          onSave={handleSave}
          onCancel={() => {
            setShowModal(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
}

function ProductModal({ product, onSave, onCancel }: any) {
  const [formData, setFormData] = useState(product);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold">
            {product.id ? 'Editar Produto' : 'Novo Produto'}
          </h3>
          <button onClick={onCancel} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Nome do Produto</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Descrição</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Preço (R$)</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Estoque</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Categoria</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="COFFEE">☕ Café</option>
              <option value="TEA">🍵 Chá</option>
              <option value="PASTRY">🥐 Padaria</option>
              <option value="SANDWICH">🥪 Sanduíche</option>
              <option value="DESSERT">🍰 Sobremesa</option>
              <option value="OTHER">📦 Outros</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => onSave(formData)}
              className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
            >
              Salvar
            </button>
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrdersTab({ orders, setOrders }: { orders: Order[]; setOrders: Function }) {
  const updateStatus = async (orderId: string, newStatus: string) => {
    const response = await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });

    if (response.ok) {
      setOrders(orders.map((order: Order) => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <ShoppingCart className="w-7 h-7 text-amber-600" />
        Gerenciar Pedidos
      </h2>

      <div className="grid gap-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Pedido #{order.id.slice(-6)}</h3>
                <p className="text-sm text-gray-600 mt-1">{order.customer?.name || 'Cliente'}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(order.createdAt).toLocaleString('pt-BR')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-amber-600">R$ {order.total.toFixed(2)}</p>
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  className={`mt-2 px-3 py-1 rounded-lg text-sm font-medium cursor-pointer ${getStatusColor(order.status)}`}
                >
                  <option value="PENDING">Pendente</option>
                  <option value="CONFIRMED">Confirmado</option>
                  <option value="PREPARING">Preparando</option>
                  <option value="READY">Pronto</option>
                  <option value="COMPLETED">Concluído</option>
                  <option value="CANCELLED">Cancelado</option>
                </select>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3 text-gray-700">Itens do Pedido:</h4>
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700">
                      <span className="font-semibold">{item.quantity}x</span> {item.product.name}
                    </span>
                    <span className="font-semibold text-amber-600">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: any) {
  const colorClasses: any = {
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    amber: 'bg-amber-100 text-amber-600',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-4 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function getStatusColor(status: string) {
  const colors: any = {
    PENDING: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
    CONFIRMED: 'bg-blue-100 text-blue-800 border border-blue-300',
    PREPARING: 'bg-purple-100 text-purple-800 border border-purple-300',
    READY: 'bg-green-100 text-green-800 border border-green-300',
    COMPLETED: 'bg-gray-100 text-gray-800 border border-gray-300',
    CANCELLED: 'bg-red-100 text-red-800 border border-red-300',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

function translateStatus(status: string) {
  const translations: any = {
    PENDING: 'Pendente',
    CONFIRMED: 'Confirmado',
    PREPARING: 'Preparando',
    READY: 'Pronto',
    COMPLETED: 'Concluído',
    CANCELLED: 'Cancelado',
  };
  return translations[status] || status;
}
