// Sistema de Banco de Dados Local para CCPServices PDV

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // Hash bcrypt
  role: 'admin' | 'caixa' | 'atendente';
  status: 'ativo' | 'inativo';
  createdAt: string;
  lastLogin?: string;
  mustChangePassword?: boolean; // Forçar alteração de senha
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  available: boolean;
  featured: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  active: boolean;
  createdAt: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone?: string;
  customerAddress?: string;
  items: OrderItem[];
  total: number;
  status: 'pendente' | 'preparando' | 'pronto' | 'entregue' | 'cancelado';
  type: 'local' | 'delivery' | 'retirada';
  table?: number;
  orderTime: string;
  estimatedTime: number;
  paymentMethod?: string;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  costPrice: number;
  supplier: string;
  lastUpdated: string;
  status: 'normal' | 'low' | 'critical' | 'excess';
}

export interface Table {
  id: string;
  number: number;
  capacity: number;
  status: 'livre' | 'ocupada' | 'reservada' | 'limpeza';
  currentOrder?: string;
  waiter?: string;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: 'dinheiro' | 'cartao' | 'pix' | 'vale';
  status: 'pendente' | 'aprovado' | 'rejeitado';
  createdAt: string;
}

class Database {
  private getKey(table: string): string {
    return `ccpservices-${table}`;
  }

  private load<T>(table: string): T[] {
    try {
      const data = localStorage.getItem(this.getKey(table));
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Error loading ${table}:`, error);
      return [];
    }
  }

  private save<T>(table: string, data: T[]): void {
    try {
      localStorage.setItem(this.getKey(table), JSON.stringify(data));
      window.dispatchEvent(new CustomEvent('dataChanged', { detail: { key: table, data } }));
    } catch (error) {
      console.error(`Error saving ${table}:`, error);
    }
  }

  // Users
  getUsers(): User[] {
    return this.load<User>('users');
  }

  saveUsers(users: User[]): void {
    this.save('users', users);
  }

  // Products
  getProducts(): Product[] {
    return this.load<Product>('products');
  }

  saveProducts(products: Product[]): void {
    this.save('products', products);
  }

  // Categories
  getCategories(): Category[] {
    return this.load<Category>('categories');
  }

  saveCategories(categories: Category[]): void {
    this.save('categories', categories);
  }

  // Orders
  getOrders(): Order[] {
    return this.load<Order>('orders');
  }

  saveOrders(orders: Order[]): void {
    this.save('orders', orders);
  }

  // Inventory
  getInventory(): InventoryItem[] {
    return this.load<InventoryItem>('inventory');
  }

  saveInventory(inventory: InventoryItem[]): void {
    this.save('inventory', inventory);
  }

  // Tables
  getTables(): Table[] {
    return this.load<Table>('tables');
  }

  saveTables(tables: Table[]): void {
    this.save('tables', tables);
  }

  // Payments
  getPayments(): Payment[] {
    return this.load<Payment>('payments');
  }

  savePayments(payments: Payment[]): void {
    this.save('payments', payments);
  }

  // Initialize with sample data
  initializeDatabase(): void {
    // Users - inicialização com usuários padrão
    if (this.getUsers().length === 0) {
      const defaultUsers: User[] = [{
        id: '1',
        name: 'Administrador',
        email: process.env.REACT_APP_ADMIN_EMAIL || 'admin@system.local',
        password: process.env.REACT_APP_ADMIN_HASH || '$2a$12$PLACEHOLDER',
        role: 'admin',
        status: 'ativo',
        createdAt: new Date().toISOString(),
        mustChangePassword: true
      }];
      this.saveUsers(defaultUsers);
    }

    // Categories
    if (this.getCategories().length === 0) {
      const categories: Category[] = [
        {
          id: '1',
          name: 'Bebidas',
          description: 'Cafés, sucos, refrigerantes',
          icon: 'Coffee',
          color: 'bg-blue-500',
          active: true,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Lanches',
          description: 'Sanduíches, hambúrguers, salgados',
          icon: 'Sandwich',
          color: 'bg-green-500',
          active: true,
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Doces',
          description: 'Bolos, tortas, sobremesas',
          icon: 'Cake',
          color: 'bg-pink-500',
          active: true,
          createdAt: new Date().toISOString()
        }
      ];
      this.saveCategories(categories);
    }

    // Products
    if (this.getProducts().length === 0) {
      const products: Product[] = [
        {
          id: '1',
          name: 'Café Expresso',
          description: 'Café forte e encorpado',
          price: 4.50,
          category: 'Bebidas',
          available: true,
          featured: true,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Hambúrguer Artesanal',
          description: 'Hambúrguer com carne 180g, queijo e salada',
          price: 25.90,
          category: 'Lanches',
          available: true,
          featured: false,
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Bolo de Chocolate',
          description: 'Fatia de bolo de chocolate com cobertura',
          price: 8.90,
          category: 'Doces',
          available: true,
          featured: true,
          createdAt: new Date().toISOString()
        }
      ];
      this.saveProducts(products);
    }

    // Inventory
    if (this.getInventory().length === 0) {
      const inventory: InventoryItem[] = [
        {
          id: '1',
          name: 'Café em Grãos Premium',
          category: 'Bebidas',
          currentStock: 25,
          minStock: 10,
          maxStock: 100,
          unit: 'kg',
          costPrice: 45.90,
          supplier: 'Café Brasil Ltda',
          lastUpdated: new Date().toLocaleString('pt-BR'),
          status: 'normal'
        },
        {
          id: '2',
          name: 'Açúcar Cristal',
          category: 'Ingredientes',
          currentStock: 5,
          minStock: 20,
          maxStock: 200,
          unit: 'kg',
          costPrice: 3.50,
          supplier: 'Doce Vida',
          lastUpdated: new Date().toLocaleString('pt-BR'),
          status: 'critical'
        }
      ];
      this.saveInventory(inventory);
    }

    // Tables
    if (this.getTables().length === 0) {
      const tables: Table[] = [
        { id: '1', number: 1, capacity: 2, status: 'livre' },
        { id: '2', number: 2, capacity: 4, status: 'livre' },
        { id: '3', number: 3, capacity: 6, status: 'ocupada', currentOrder: 'PED-001' },
        { id: '4', number: 4, capacity: 2, status: 'livre' },
        { id: '5', number: 5, capacity: 4, status: 'reservada' }
      ];
      this.saveTables(tables);
    }

    // Orders - Always ensure we have sample orders
    const existingOrders = this.getOrders();
    if (existingOrders.length === 0) {
      const orders: Order[] = [
        {
          id: 'PED-001',
          customerName: 'João Silva',
          customerPhone: '(11) 99999-1111',
          items: [
            {
              productId: '2',
              productName: 'Hambúrguer Artesanal',
              quantity: 1,
              price: 25.90,
              total: 25.90
            },
            {
              productId: '1',
              productName: 'Café Expresso',
              quantity: 2,
              price: 4.50,
              total: 9.00
            }
          ],
          total: 34.90,
          status: 'preparando',
          type: 'local',
          table: 3,
          orderTime: '14:30',
          estimatedTime: 15,
          createdAt: new Date().toISOString()
        },
        {
          id: 'PED-002',
          customerName: 'Maria Santos',
          customerPhone: '(11) 88888-2222',
          customerAddress: 'Rua das Flores, 123',
          items: [
            {
              productId: '3',
              productName: 'Bolo de Chocolate',
              quantity: 1,
              price: 8.90,
              total: 8.90
            }
          ],
          total: 8.90,
          status: 'pendente',
          type: 'delivery',
          orderTime: '14:45',
          estimatedTime: 30,
          createdAt: new Date().toISOString()
        },
        {
          id: 'PED-003',
          customerName: 'Carlos Lima',
          customerPhone: '(11) 77777-3333',
          items: [
            {
              productId: '1',
              productName: 'Café Expresso',
              quantity: 1,
              price: 4.50,
              total: 4.50
            }
          ],
          total: 4.50,
          status: 'pronto',
          type: 'retirada',
          orderTime: '14:20',
          estimatedTime: 5,
          createdAt: new Date().toISOString()
        }
      ];
      this.saveOrders(orders);
    }
  }
}

export const db = new Database();

// Initialize database on first load
if (typeof window !== 'undefined') {
  // Ensure initialization happens after DOM is ready
  const initDb = () => {
    try {
      db.initializeDatabase();
    } catch {
      console.warn('Erro ao inicializar banco de dados');
    }
  };
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDb);
  } else {
    initDb();
  }
}