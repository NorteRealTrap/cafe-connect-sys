class StorageManager {
  private static instance: StorageManager;
  private initialized = false;

  static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  init() {
    if (this.initialized) return;
    
    // Verificar se localStorage está disponível
    if (typeof Storage === "undefined") {
      console.error("LocalStorage não suportado");
      return;
    }

    // Inicializar dados padrão se não existirem
    this.initializeDefaultData();
    this.initialized = true;
  }

  private initializeDefaultData() {
    const keys = [
      'cafe-connect-menu-items',
      'cafe-connect-sales-data', 
      'cafe-connect-payments',
      'cafe-connect-financial-records',
      'cafe-connect-transactions',
      'cafe-connect-reports'
    ];

    keys.forEach(key => {
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify([]));
      }
    });

    // Forçar inicialização dos dados padrão
    this.ensureDefaultData();
  }

  private ensureDefaultData() {
    // Menu items
    const menuItems = localStorage.getItem('cafe-connect-menu-items');
    if (!menuItems || JSON.parse(menuItems).length === 0) {
      const defaultMenu = this.getDefaultMenuItems();
      localStorage.setItem('cafe-connect-menu-items', JSON.stringify(defaultMenu));
    }

    // Sales data
    const salesData = localStorage.getItem('cafe-connect-sales-data');
    if (!salesData || JSON.parse(salesData).length === 0) {
      const defaultSales = this.getDefaultSalesData();
      localStorage.setItem('cafe-connect-sales-data', JSON.stringify(defaultSales));
    }

    // Transactions
    const transactions = localStorage.getItem('cafe-connect-transactions');
    if (!transactions || JSON.parse(transactions).length === 0) {
      const defaultTransactions = this.getDefaultTransactions();
      localStorage.setItem('cafe-connect-transactions', JSON.stringify(defaultTransactions));
    }
  }

  private getDefaultMenuItems() {
    const now = new Date();
    return [
      {
        id: "1",
        nome: "Hambúrguer Artesanal",
        descricao: "Pão brioche, carne 180g, queijo cheddar, alface, tomate",
        preco: 28.90,
        categoria: "lanchonete",
        disponivel: true,
        destaque: true,
        ingredientes: ["Pão brioche", "Carne bovina", "Queijo cheddar", "Alface", "Tomate"],
        createdAt: now,
        updatedAt: now
      },
      {
        id: "2",
        nome: "Pizza Margherita",
        descricao: "Molho de tomate, mozzarella, manjericão fresco",
        preco: 42.90,
        categoria: "restaurante",
        disponivel: true,
        destaque: false,
        createdAt: now,
        updatedAt: now
      },
      {
        id: "3",
        nome: "Bolo de Chocolate",
        descricao: "Bolo fofinho com cobertura de brigadeiro",
        preco: 8.50,
        categoria: "confeitaria",
        disponivel: true,
        destaque: true,
        createdAt: now,
        updatedAt: now
      }
    ];
  }

  private getDefaultSalesData() {
    const data = [];
    const now = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const salesCount = Math.floor(Math.random() * 6) + 3;
      
      for (let j = 0; j < salesCount; j++) {
        data.push({
          id: `${date.getTime()}-${j}`,
          date,
          category: 'restaurante',
          product: 'Produto Exemplo',
          quantity: 1,
          unitPrice: 25.00,
          totalValue: 25.00,
          paymentMethod: 'dinheiro',
          status: 'completed'
        });
      }
    }
    
    return data;
  }

  private getDefaultTransactions() {
    const transactions = [];
    const now = new Date();
    
    for (let i = 0; i < 50; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - Math.floor(i / 2));
      
      transactions.push({
        id: `txn_${Date.now()}_${i}`,
        orderId: `ORD${(i + 1).toString().padStart(3, '0')}`,
        amount: 25.00 + (Math.random() * 50),
        method: ['dinheiro', 'pix', 'cartao_credito', 'cartao_debito'][Math.floor(Math.random() * 4)],
        status: 'completed',
        date,
        fees: 1.00,
        netAmount: 24.00 + (Math.random() * 50),
        category: 'restaurante',
        products: [{ name: 'Produto Exemplo', quantity: 1, price: 25.00 }],
        metadata: { gateway: 'default' }
      });
    }
    
    return transactions;
  }

  // Método para verificar integridade dos dados
  validateStorage(): boolean {
    try {
      const keys = [
        'cafe-connect-menu-items',
        'cafe-connect-sales-data',
        'cafe-connect-transactions'
      ];

      for (const key of keys) {
        const data = localStorage.getItem(key);
        if (!data) {
          console.warn(`Chave ${key} não encontrada, reinicializando...`);
          this.initializeDefaultData();
          return false;
        }
        
        try {
          JSON.parse(data);
        } catch {
          console.warn(`Dados corrompidos em ${key}, reinicializando...`);
          localStorage.removeItem(key);
          this.initializeDefaultData();
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Erro na validação do storage:', error);
      return false;
    }
  }

  // Método para backup dos dados
  backup(): string {
    const backup = {};
    const keys = [
      'cafe-connect-menu-items',
      'cafe-connect-sales-data',
      'cafe-connect-payments',
      'cafe-connect-financial-records',
      'cafe-connect-transactions',
      'cafe-connect-reports'
    ];

    keys.forEach(key => {
      const data = localStorage.getItem(key);
      if (data) {
        backup[key] = JSON.parse(data);
      }
    });

    return JSON.stringify(backup);
  }

  // Método para restaurar backup
  restore(backupData: string): boolean {
    try {
      const data = JSON.parse(backupData);
      
      Object.keys(data).forEach(key => {
        localStorage.setItem(key, JSON.stringify(data[key]));
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao restaurar backup:', error);
      return false;
    }
  }
}

export const storageManager = StorageManager.getInstance();