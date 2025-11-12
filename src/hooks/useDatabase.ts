import { useState, useEffect } from 'react';

// Hook simplificado para produtos
export const useProducts = () => {
  const [products, setProducts] = useState<any[]>([]);

  const loadProducts = () => {
    try {
      const data = localStorage.getItem('ccpservices-products');
      setProducts(data ? JSON.parse(data) : []);
    } catch {
      setProducts([]);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const addProduct = (product: any) => {
    const newProduct = {
      ...product,
      id: `prod_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const updated = [...products, newProduct];
    localStorage.setItem('ccpservices-products', JSON.stringify(updated));
    setProducts(updated);
    return newProduct;
  };

  const updateProduct = (id: string, updates: any) => {
    const updated = products.map(p => p.id === id ? { ...p, ...updates } : p);
    localStorage.setItem('ccpservices-products', JSON.stringify(updated));
    setProducts(updated);
    return updated.find(p => p.id === id);
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter(p => p.id !== id);
    localStorage.setItem('ccpservices-products', JSON.stringify(updated));
    setProducts(updated);
  };

  return { products, addProduct, updateProduct, deleteProduct };
};

// Hook para categorias
export const useCategories = () => {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    try {
      const data = localStorage.getItem('ccpservices-categories');
      setCategories(data ? JSON.parse(data) : ['Bebidas', 'Lanches', 'Doces', 'Bar']);
    } catch {
      setCategories(['Bebidas', 'Lanches', 'Doces', 'Bar']);
    }
  }, []);

  return { categories };
};

// Hook para inventário
export const useInventory = () => {
  const [inventory, setInventory] = useState<any[]>([]);

  const loadInventory = () => {
    try {
      const data = localStorage.getItem('ccpservices-inventory');
      setInventory(data ? JSON.parse(data) : []);
    } catch {
      setInventory([]);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const addItem = (item: any) => {
    const newItem = { ...item, id: `inv_${Date.now()}` };
    const updated = [...inventory, newItem];
    localStorage.setItem('ccpservices-inventory', JSON.stringify(updated));
    setInventory(updated);
    return newItem;
  };

  const updateItem = (id: string, updates: any) => {
    const updated = inventory.map(i => i.id === id ? { ...i, ...updates } : i);
    localStorage.setItem('ccpservices-inventory', JSON.stringify(updated));
    setInventory(updated);
  };

  const deleteItem = (id: string) => {
    const updated = inventory.filter(i => i.id !== id);
    localStorage.setItem('ccpservices-inventory', JSON.stringify(updated));
    setInventory(updated);
  };

  return { inventory, addItem, updateItem, deleteItem };
};
