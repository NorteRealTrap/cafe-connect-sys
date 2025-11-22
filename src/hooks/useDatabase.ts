import { useState, useEffect } from 'react';

// Hook simplificado para produtos
export const useProducts = () => {
  const [products, setProducts] = useState<any[]>([]);

  const loadProducts = () => {
    try {
      const data = localStorage.getItem('ccpservices-products');
      setProducts(data ? JSON.parse(data) : []);
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const addProduct = (product: any) => {
    try {
      const newProduct = {
        ...product,
        id: `prod_${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      const updated = [...products, newProduct];
      localStorage.setItem('ccpservices-products', JSON.stringify(updated));
      setProducts(updated);
      return newProduct;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  };

  const updateProduct = (id: string, updates: any) => {
    try {
      const updated = products.map(p => p.id === id ? { ...p, ...updates } : p);
      localStorage.setItem('ccpservices-products', JSON.stringify(updated));
      setProducts(updated);
      return updated.find(p => p.id === id);
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  const deleteProduct = (id: string) => {
    try {
      const updated = products.filter(p => p.id !== id);
      localStorage.setItem('ccpservices-products', JSON.stringify(updated));
      setProducts(updated);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
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
    } catch (error) {
      console.error('Error loading categories:', error);
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
    } catch (error) {
      console.error('Error loading inventory:', error);
      setInventory([]);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const addItem = (item: any) => {
    try {
      const newItem = { ...item, id: `inv_${Date.now()}` };
      const updated = [...inventory, newItem];
      localStorage.setItem('ccpservices-inventory', JSON.stringify(updated));
      setInventory(updated);
      return newItem;
    } catch (error) {
      console.error('Error adding item:', error);
      throw error;
    }
  };

  const updateItem = (id: string, updates: any) => {
    try {
      const updated = inventory.map(i => i.id === id ? { ...i, ...updates } : i);
      localStorage.setItem('ccpservices-inventory', JSON.stringify(updated));
      setInventory(updated);
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  };

  const deleteItem = (id: string) => {
    try {
      const updated = inventory.filter(i => i.id !== id);
      localStorage.setItem('ccpservices-inventory', JSON.stringify(updated));
      setInventory(updated);
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  };

  return { inventory, addItem, updateItem, deleteItem };
};
