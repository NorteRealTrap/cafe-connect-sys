// Sistema Centralizado de Gerenciamento de Bancos de Dados

export interface DatabaseStatus {
  name: string;
  key: string;
  initialized: boolean;
  recordCount: number;
  lastSync: string;
  status: 'ok' | 'warning' | 'error';
}

class DatabaseManager {
  private databases = {
    users: 'ccpservices-users',
    products: 'ccpservices-products',
    categories: 'ccpservices-categories',
    orders: 'cafe-connect-orders',
    inventory: 'ccpservices-inventory',
    tables: 'ccpservices-tables',
    payments: 'ccpservices-payments',
    deliveries: 'ccpservices-deliveries',
    drivers: 'ccpservices-drivers',
    webOrders: 'ccpservices-web-orders',
    notifications: 'ccpservices-notifications',
    messagingCredentials: 'messaging-credentials',
    notificationLogs: 'notification-logs',
    transactions: 'ccpservices-transactions',
    analytics: 'ccpservices-analytics'
  };

  // Verificar status de todos os bancos
  checkAllDatabases(): DatabaseStatus[] {
    return Object.entries(this.databases).map(([name, key]) => {
      try {
        const data = localStorage.getItem(key);
        const records = data ? JSON.parse(data) : [];
        const count = Array.isArray(records) ? records.length : Object.keys(records).length;

        return {
          name,
          key,
          initialized: !!data,
          recordCount: count,
          lastSync: new Date().toISOString(),
          status: data ? 'ok' : 'warning'
        };
      } catch (error) {
        return {
          name,
          key,
          initialized: false,
          recordCount: 0,
          lastSync: new Date().toISOString(),
          status: 'error'
        };
      }
    });
  }

  // Inicializar banco se não existir
  initializeDatabase(key: string, defaultData: any = []): void {
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      console.log(`✅ Banco ${key} inicializado`);
    }
  }

  // Inicializar todos os bancos necessários
  initializeAllDatabases(): void {
    // Users
    this.initializeDatabase(this.databases.users, []);

    // Products
    this.initializeDatabase(this.databases.products, []);

    // Categories
    this.initializeDatabase(this.databases.categories, []);

    // Orders
    this.initializeDatabase(this.databases.orders, []);

    // Inventory
    this.initializeDatabase(this.databases.inventory, []);

    // Tables
    this.initializeDatabase(this.databases.tables, []);

    // Payments
    this.initializeDatabase(this.databases.payments, []);

    // Deliveries
    this.initializeDatabase(this.databases.deliveries, []);

    // Drivers
    this.initializeDatabase(this.databases.drivers, []);

    // Web Orders
    this.initializeDatabase(this.databases.webOrders, []);

    // Notifications
    this.initializeDatabase(this.databases.notifications, []);

    // Messaging Credentials
    this.initializeDatabase(this.databases.messagingCredentials, {});

    // Notification Logs
    this.initializeDatabase(this.databases.notificationLogs, []);

    // Transactions
    this.initializeDatabase(this.databases.transactions, []);

    // Analytics
    this.initializeDatabase(this.databases.analytics, {
      sales: [],
      revenue: [],
      customers: []
    });

    console.log('✅ Todos os bancos de dados inicializados');
  }

  // Salvar dados com sincronização automática
  save<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      
      // Disparar evento de sincronização
      window.dispatchEvent(new CustomEvent('dataChanged', {
        detail: { key, data, timestamp: new Date().toISOString() }
      }));
    } catch (error) {
      console.error(`Erro ao salvar ${key}:`, error);
    }
  }

  // Carregar dados
  load<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
      console.error(`Erro ao carregar ${key}:`, error);
      return defaultValue;
    }
  }

  // Backup de todos os dados
  backupAll(): string {
    const backup: Record<string, any> = {};
    
    Object.entries(this.databases).forEach(([name, key]) => {
      const data = localStorage.getItem(key);
      if (data) {
        backup[name] = JSON.parse(data);
      }
    });

    return JSON.stringify(backup, null, 2);
  }

  // Restaurar backup
  restoreBackup(backupJson: string): boolean {
    try {
      const backup = JSON.parse(backupJson);
      
      Object.entries(backup).forEach(([name, data]) => {
        const key = this.databases[name as keyof typeof this.databases];
        if (key) {
          localStorage.setItem(key, JSON.stringify(data));
        }
      });

      console.log('✅ Backup restaurado com sucesso');
      return true;
    } catch (error) {
      console.error('Erro ao restaurar backup:', error);
      return false;
    }
  }

  // Limpar banco específico
  clearDatabase(key: string): void {
    localStorage.removeItem(key);
    console.log(`🗑️ Banco ${key} limpo`);
  }

  // Limpar todos os bancos
  clearAllDatabases(): void {
    Object.values(this.databases).forEach(key => {
      localStorage.removeItem(key);
    });
    console.log('🗑️ Todos os bancos limpos');
  }

  // Estatísticas gerais
  getStats() {
    const statuses = this.checkAllDatabases();
    
    return {
      total: statuses.length,
      initialized: statuses.filter(s => s.initialized).length,
      totalRecords: statuses.reduce((sum, s) => sum + s.recordCount, 0),
      healthy: statuses.filter(s => s.status === 'ok').length,
      warnings: statuses.filter(s => s.status === 'warning').length,
      errors: statuses.filter(s => s.status === 'error').length,
      databases: statuses
    };
  }
}

export const databaseManager = new DatabaseManager();

// Auto-inicializar ao carregar
if (typeof window !== 'undefined') {
  databaseManager.initializeAllDatabases();
}
