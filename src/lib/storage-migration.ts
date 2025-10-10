// Sistema de migração e validação de dados do localStorage
import { ordersDB } from './orders-db';

const STORAGE_VERSION_KEY = 'cafe-connect-storage-version';
const CURRENT_VERSION = '2.0.0';

interface StorageValidationResult {
  isValid: boolean;
  errors: string[];
  needsMigration: boolean;
}

class StorageMigration {
  private static instance: StorageMigration;

  static getInstance(): StorageMigration {
    if (!StorageMigration.instance) {
      StorageMigration.instance = new StorageMigration();
    }
    return StorageMigration.instance;
  }

  // Verificar e migrar dados se necessário
  checkAndMigrate(): void {
    const currentVersion = localStorage.getItem(STORAGE_VERSION_KEY);
    
    if (!currentVersion || currentVersion !== CURRENT_VERSION) {
      console.log('🔄 Iniciando migração de dados...');
      this.migrate(currentVersion);
      localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION);
      console.log('✅ Migração concluída!');
    }

    // Validar dados após migração
    const validation = this.validateAllData();
    if (!validation.isValid) {
      console.warn('⚠️ Dados inválidos detectados:', validation.errors);
      this.cleanupInvalidData();
    }
  }

  // Migrar dados de versões antigas
  private migrate(fromVersion: string | null): void {
    if (!fromVersion) {
      // Primeira vez ou dados muito antigos - limpar tudo
      this.cleanupAll();
      return;
    }

    // Migrar pedidos do formato antigo para o novo
    this.migrateOrders();
    
    // Limpar dados órfãos ou corrompidos
    this.cleanupOrphanedData();
  }

  // Migrar pedidos para o novo formato
  private migrateOrders(): void {
    try {
      const oldOrders = localStorage.getItem('cafe-connect-orders');
      if (!oldOrders) return;

      const orders = JSON.parse(oldOrders);
      if (!Array.isArray(orders)) {
        console.warn('Formato de pedidos inválido, limpando...');
        localStorage.removeItem('cafe-connect-orders');
        return;
      }

      // Validar e corrigir cada pedido
      const validOrders = orders.filter((order: any) => {
        // Verificar campos obrigatórios
        if (!order.id || !order.numero || !order.tipo || !order.cliente) {
          return false;
        }

        // Verificar se status é válido
        const validStatuses = ['pendente', 'preparando', 'pronto', 'entregue', 'cancelado'];
        if (!validStatuses.includes(order.status)) {
          order.status = 'pendente';
        }

        // Garantir que itens é um array
        if (!Array.isArray(order.itens)) {
          order.itens = [];
        }

        // Garantir que datas são strings ISO
        if (order.createdAt && !(typeof order.createdAt === 'string')) {
          order.createdAt = new Date(order.createdAt).toISOString();
        }
        if (order.updatedAt && !(typeof order.updatedAt === 'string')) {
          order.updatedAt = new Date(order.updatedAt).toISOString();
        }

        // Remover campos extras que não fazem parte do tipo Order
        delete order.source;
        delete order.delivery;

        return true;
      });

      localStorage.setItem('cafe-connect-orders', JSON.stringify(validOrders));
      console.log(`✅ ${validOrders.length} pedidos migrados com sucesso`);
    } catch (error) {
      console.error('Erro ao migrar pedidos:', error);
      localStorage.removeItem('cafe-connect-orders');
    }
  }

  // Validar todos os dados
  private validateAllData(): StorageValidationResult {
    const result: StorageValidationResult = {
      isValid: true,
      errors: [],
      needsMigration: false
    };

    // Validar pedidos
    try {
      const ordersData = localStorage.getItem('cafe-connect-orders');
      if (ordersData) {
        const orders = JSON.parse(ordersData);
        if (!Array.isArray(orders)) {
          result.isValid = false;
          result.errors.push('cafe-connect-orders não é um array');
        }
      }
    } catch (error) {
      result.isValid = false;
      result.errors.push('cafe-connect-orders está corrompido');
    }

    // Validar contador
    try {
      const counter = localStorage.getItem('cafe-connect-order-counter');
      if (counter && isNaN(parseInt(counter))) {
        result.isValid = false;
        result.errors.push('cafe-connect-order-counter inválido');
      }
    } catch (error) {
      result.isValid = false;
      result.errors.push('cafe-connect-order-counter está corrompido');
    }

    return result;
  }

  // Limpar dados inválidos
  private cleanupInvalidData(): void {
    const keysToValidate = [
      'cafe-connect-orders',
      'cafe-connect-order-counter',
      'ccpservices-web-orders'
    ];

    keysToValidate.forEach(key => {
      try {
        const data = localStorage.getItem(key);
        if (data) {
          JSON.parse(data);
        }
      } catch {
        console.warn(`Removendo dados corrompidos: ${key}`);
        localStorage.removeItem(key);
      }
    });

    // Reinicializar dados essenciais
    if (!localStorage.getItem('cafe-connect-orders')) {
      localStorage.setItem('cafe-connect-orders', JSON.stringify([]));
    }
    if (!localStorage.getItem('cafe-connect-order-counter')) {
      localStorage.setItem('cafe-connect-order-counter', '0');
    }
  }

  // Limpar dados órfãos
  private cleanupOrphanedData(): void {
    // Remover chaves antigas que não são mais usadas
    const obsoleteKeys = [
      'ccpservices-orders', // Formato antigo
      'old-orders', // Backup antigo
    ];

    obsoleteKeys.forEach(key => {
      if (localStorage.getItem(key)) {
        console.log(`Removendo chave obsoleta: ${key}`);
        localStorage.removeItem(key);
      }
    });
  }

  // Limpar tudo e reinicializar
  private cleanupAll(): void {
    console.log('🧹 Limpando todos os dados...');
    
    const keysToKeep = [
      'ccpservices-session', // Manter sessão do usuário
      'current-user-id'
    ];

    // Remover todas as chaves exceto as essenciais
    const allKeys = Object.keys(localStorage);
    allKeys.forEach(key => {
      if (!keysToKeep.includes(key)) {
        localStorage.removeItem(key);
      }
    });

    // Reinicializar dados essenciais
    localStorage.setItem('cafe-connect-orders', JSON.stringify([]));
    localStorage.setItem('cafe-connect-order-counter', '0');
    localStorage.setItem('ccpservices-web-orders', JSON.stringify([]));
  }

  // Método público para forçar limpeza (útil para debug)
  forceCleanup(): void {
    this.cleanupAll();
    localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION);
    window.location.reload();
  }

  // Exportar dados para backup
  exportData(): string {
    const data = {
      version: CURRENT_VERSION,
      timestamp: new Date().toISOString(),
      orders: ordersDB.getAll(),
      counter: localStorage.getItem('cafe-connect-order-counter')
    };
    return JSON.stringify(data, null, 2);
  }

  // Importar dados de backup
  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.orders && Array.isArray(data.orders)) {
        localStorage.setItem('cafe-connect-orders', JSON.stringify(data.orders));
      }
      
      if (data.counter) {
        localStorage.setItem('cafe-connect-order-counter', data.counter);
      }
      
      window.dispatchEvent(new Event('orders-changed'));
      return true;
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      return false;
    }
  }
}

export const storageMigration = StorageMigration.getInstance();