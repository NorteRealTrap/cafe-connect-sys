import { useState, useEffect } from 'react';
import { db, User, Product, Category, Order, InventoryItem, Table, Payment } from '@/lib/database';

// Hook para Users
export const useUsers = () => {
  const [users, setUsers] = useState<User[]>(() => db.getUsers());

  useEffect(() => {
    const loadedUsers = db.getUsers();
    setUsers(loadedUsers);
  }, []);

  const addUser = (user: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    db.saveUsers(updatedUsers);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    const updatedUsers = users.map(user => 
      user.id === id ? { ...user, ...updates } : user
    );
    setUsers(updatedUsers);
    db.saveUsers(updatedUsers);
  };

  const deleteUser = (id: string) => {
    const updatedUsers = users.filter(user => user.id !== id);
    setUsers(updatedUsers);
    db.saveUsers(updatedUsers);
  };

  return { users, addUser, updateUser, deleteUser };
};

// Hook para Products
export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>(() => db.getProducts());

  useEffect(() => {
    const loadedProducts = db.getProducts();
    setProducts(loadedProducts);
  }, []);

  const addProduct = (product: Omit<Product, 'id' | 'createdAt'>) => {
    try {
      const newProduct: Product = {
        ...product,
        id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString()
      };
      const updatedProducts = [...products, newProduct];
      setProducts(updatedProducts);
      db.saveProducts(updatedProducts);
      console.log('Produto adicionado:', newProduct.name);
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
    }
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const updatedProducts = products.map(product => 
      product.id === id ? { ...product, ...updates } : product
    );
    setProducts(updatedProducts);
    db.saveProducts(updatedProducts);
  };

  const deleteProduct = (id: string) => {
    const updatedProducts = products.filter(product => product.id !== id);
    setProducts(updatedProducts);
    db.saveProducts(updatedProducts);
  };

  return { products, addProduct, updateProduct, deleteProduct };
};

// Hook para Categories
export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>(() => db.getCategories());

  useEffect(() => {
    const loadedCategories = db.getCategories();
    setCategories(loadedCategories);
  }, []);

  const addCategory = (category: Omit<Category, 'id' | 'createdAt'>) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    db.saveCategories(updatedCategories);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    const updatedCategories = categories.map(category => 
      category.id === id ? { ...category, ...updates } : category
    );
    setCategories(updatedCategories);
    db.saveCategories(updatedCategories);
  };

  const deleteCategory = (id: string) => {
    const updatedCategories = categories.filter(category => category.id !== id);
    setCategories(updatedCategories);
    db.saveCategories(updatedCategories);
  };

  return { categories, addCategory, updateCategory, deleteCategory };
};

// Hook para Orders
export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>(() => db.getOrders());

  useEffect(() => {
    // Reload orders from database on mount
    const loadedOrders = db.getOrders();
    setOrders(loadedOrders);
  }, []);

  // Listen for storage changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'ccpservices-orders') {
        const updatedOrders = db.getOrders();
        setOrders(updatedOrders);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addOrder = (order: Omit<Order, 'id' | 'createdAt'>) => {
    const newOrder: Order = {
      ...order,
      id: `PED-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString()
    };
    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    db.saveOrders(updatedOrders);
  };

  const updateOrder = (id: string, updates: Partial<Order>) => {
    const updatedOrders = orders.map(order => 
      order.id === id ? { ...order, ...updates } : order
    );
    setOrders(updatedOrders);
    db.saveOrders(updatedOrders);
    
    // Force immediate persistence and state update
    setTimeout(() => {
      const freshOrders = db.getOrders();
      setOrders(freshOrders);
    }, 0);
  };

  const deleteOrder = (id: string) => {
    const updatedOrders = orders.filter(order => order.id !== id);
    setOrders(updatedOrders);
    db.saveOrders(updatedOrders);
  };

  return { orders, addOrder, updateOrder, deleteOrder };
};

// Hook para Inventory
export const useInventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>(() => db.getInventory());

  useEffect(() => {
    const loadedInventory = db.getInventory();
    setInventory(loadedInventory);
  }, []);

  const addInventoryItem = (item: Omit<InventoryItem, 'id' | 'lastUpdated' | 'status'>) => {
    let status: InventoryItem['status'] = 'normal';
    if (item.currentStock <= item.minStock * 0.5) status = 'critical';
    else if (item.currentStock <= item.minStock) status = 'low';
    else if (item.currentStock > item.maxStock) status = 'excess';

    const newItem: InventoryItem = {
      ...item,
      id: Date.now().toString(),
      lastUpdated: new Date().toLocaleString('pt-BR'),
      status
    };
    const updatedInventory = [...inventory, newItem];
    setInventory(updatedInventory);
    db.saveInventory(updatedInventory);
  };

  const updateInventoryItem = (id: string, updates: Partial<InventoryItem>) => {
    const updatedInventory = inventory.map(item => {
      if (item.id === id) {
        const updated = { ...item, ...updates, lastUpdated: new Date().toLocaleString('pt-BR') };
        
        // Recalculate status
        let status: InventoryItem['status'] = 'normal';
        if (updated.currentStock <= updated.minStock * 0.5) status = 'critical';
        else if (updated.currentStock <= updated.minStock) status = 'low';
        else if (updated.currentStock > updated.maxStock) status = 'excess';
        
        return { ...updated, status };
      }
      return item;
    });
    setInventory(updatedInventory);
    db.saveInventory(updatedInventory);
  };

  const deleteInventoryItem = (id: string) => {
    const updatedInventory = inventory.filter(item => item.id !== id);
    setInventory(updatedInventory);
    db.saveInventory(updatedInventory);
  };

  return { inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem };
};

// Hook para Tables
export const useTables = () => {
  const [tables, setTables] = useState<Table[]>(() => db.getTables());

  useEffect(() => {
    const loadedTables = db.getTables();
    setTables(loadedTables);
  }, []);

  const updateTable = (id: string, updates: Partial<Table>) => {
    const updatedTables = tables.map(table => 
      table.id === id ? { ...table, ...updates } : table
    );
    setTables(updatedTables);
    db.saveTables(updatedTables);
  };

  return { tables, updateTable };
};

// Hook para Payments
export const usePayments = () => {
  const [payments, setPayments] = useState<Payment[]>(() => db.getPayments());

  useEffect(() => {
    const loadedPayments = db.getPayments();
    setPayments(loadedPayments);
  }, []);

  const addPayment = (payment: Omit<Payment, 'id' | 'createdAt'>) => {
    const newPayment: Payment = {
      ...payment,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    const updatedPayments = [...payments, newPayment];
    setPayments(updatedPayments);
    db.savePayments(updatedPayments);
  };

  const updatePayment = (id: string, updates: Partial<Payment>) => {
    const updatedPayments = payments.map(payment => 
      payment.id === id ? { ...payment, ...updates } : payment
    );
    setPayments(updatedPayments);
    db.savePayments(updatedPayments);
  };

  return { payments, addPayment, updatePayment };
};