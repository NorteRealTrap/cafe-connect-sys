// Sistema de Backup e Restauração
import { auditLogger } from './audit-logger';
import { notificationManager } from './notification-manager';

export interface BackupData {
  version: string;
  timestamp: string;
  data: {
    users: any[];
    products: any[];
    categories: any[];
    orders: any[];
    inventory: any[];
    tables: any[];
    payments: any[];
    config: any;
    notifications: any[];
    logs: any[];
  };
  metadata: {
    totalRecords: number;
    dataSize: number;
    createdBy: string;
  };
}

class BackupManager {
  private static instance: BackupManager;
  private readonly BACKUP_KEY_PREFIX = 'cafe-connect-backup-';
  private readonly MAX_BACKUPS = 10;
  private readonly AUTO_BACKUP_INTERVAL = 24 * 60 * 60 * 1000; // 24 horas

  private constructor() {
    this.scheduleAutoBackup();
  }

  static getInstance(): BackupManager {
    if (!BackupManager.instance) {
      BackupManager.instance = new BackupManager();
    }
    return BackupManager.instance;
  }

  private scheduleAutoBackup(): void {
    // Verificar se já passou tempo suficiente desde o último backup
    const lastBackup = localStorage.getItem('cafe-connect-last-backup');
    const now = Date.now();
    
    if (!lastBackup || now - parseInt(lastBackup) > this.AUTO_BACKUP_INTERVAL) {
      this.createAutoBackup();
    }

    // Agendar próximo backup
    setInterval(() => {
      this.createAutoBackup();
    }, this.AUTO_BACKUP_INTERVAL);
  }

  private getAllStorageKeys(): string[] {
    return [
      'ccpservices-users',
      'ccpservices-products',
      'ccpservices-categories',
      'cafe-connect-orders',
      'ccpservices-inventory',
      'ccpservices-tables',
      'ccpservices-payments',
      'cafe-connect-config',
      'cafe-connect-notifications',
      'cafe-connect-audit-logs'
    ];
  }

  createBackup(name?: string): string {
    try {
      const userId = localStorage.getItem('current-user-id') || 'system';
      const timestamp = new Date().toISOString();
      const backupId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const data: any = {};
      let totalRecords = 0;
      
      // Coletar todos os dados
      this.getAllStorageKeys().forEach(key => {
        const value = localStorage.getItem(key);
        if (value) {
          try {
            const parsed = JSON.parse(value);
            const keyName = key.replace('ccpservices-', '').replace('cafe-connect-', '');
            data[keyName] = parsed;
            
            if (Array.isArray(parsed)) {
              totalRecords += parsed.length;
            }
          } catch (e) {
            data[key] = value;
          }
        }
      });

      const backup: BackupData = {
        version: '2.0.0',
        timestamp,
        data,
        metadata: {
          totalRecords,
          dataSize: JSON.stringify(data).length,
          createdBy: userId
        }
      };

      // Salvar backup
      const backupKey = `${this.BACKUP_KEY_PREFIX}${backupId}`;
      localStorage.setItem(backupKey, JSON.stringify(backup));
      
      // Atualizar lista de backups
      this.updateBackupList(backupId, name || `Backup ${new Date().toLocaleString('pt-BR')}`);
      
      // Limpar backups antigos
      this.cleanOldBackups();
      
      auditLogger.info('system', 'Backup criado', { backupId, totalRecords });
      notificationManager.notify('Backup Criado', 'Backup dos dados realizado com sucesso', 'success', 'low');
      
      return backupId;
    } catch (error) {
      auditLogger.error('system', 'Erro ao criar backup', { error: (error as Error).message });
      notificationManager.notifyError('Erro ao criar backup');
      throw error;
    }
  }

  private createAutoBackup(): void {
    try {
      this.createBackup('Backup Automático');
      localStorage.setItem('cafe-connect-last-backup', Date.now().toString());
    } catch (error) {
      console.error('Erro no backup automático:', error);
    }
  }

  private updateBackupList(backupId: string, name: string): void {
    const list = this.getBackupList();
    list.unshift({ id: backupId, name, timestamp: new Date().toISOString() });
    localStorage.setItem('cafe-connect-backup-list', JSON.stringify(list));
  }

  getBackupList(): Array<{ id: string; name: string; timestamp: string }> {
    try {
      const stored = localStorage.getItem('cafe-connect-backup-list');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      return [];
    }
  }

  getBackup(backupId: string): BackupData | null {
    try {
      const backupKey = `${this.BACKUP_KEY_PREFIX}${backupId}`;
      const stored = localStorage.getItem(backupKey);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Erro ao carregar backup:', error);
      return null;
    }
  }

  restoreBackup(backupId: string): boolean {
    try {
      const backup = this.getBackup(backupId);
      if (!backup) {
        throw new Error('Backup não encontrado');
      }

      // Criar backup de segurança antes de restaurar
      this.createBackup('Backup antes de restauração');

      // Restaurar dados
      Object.entries(backup.data).forEach(([key, value]) => {
        const storageKey = key.includes('-') ? key : `ccpservices-${key}`;
        localStorage.setItem(storageKey, JSON.stringify(value));
      });

      // Disparar eventos de atualização
      window.dispatchEvent(new Event('orders-changed'));
      window.dispatchEvent(new Event('data-restored'));

      auditLogger.info('system', 'Backup restaurado', { backupId });
      notificationManager.notify('Backup Restaurado', 'Dados restaurados com sucesso', 'success', 'high');

      return true;
    } catch (error) {
      auditLogger.error('system', 'Erro ao restaurar backup', { backupId, error: (error as Error).message });
      notificationManager.notifyError('Erro ao restaurar backup');
      return false;
    }
  }

  deleteBackup(backupId: string): boolean {
    try {
      const backupKey = `${this.BACKUP_KEY_PREFIX}${backupId}`;
      localStorage.removeItem(backupKey);
      
      // Atualizar lista
      const list = this.getBackupList().filter(b => b.id !== backupId);
      localStorage.setItem('cafe-connect-backup-list', JSON.stringify(list));
      
      auditLogger.info('system', 'Backup deletado', { backupId });
      return true;
    } catch (error) {
      console.error('Erro ao deletar backup:', error);
      return false;
    }
  }

  private cleanOldBackups(): void {
    const list = this.getBackupList();
    if (list.length > this.MAX_BACKUPS) {
      const toDelete = list.slice(this.MAX_BACKUPS);
      toDelete.forEach(backup => this.deleteBackup(backup.id));
    }
  }

  exportBackup(backupId: string): string | null {
    const backup = this.getBackup(backupId);
    if (!backup) return null;
    
    return JSON.stringify(backup, null, 2);
  }

  importBackup(jsonData: string): boolean {
    try {
      const backup: BackupData = JSON.parse(jsonData);
      
      // Validar estrutura
      if (!backup.version || !backup.data) {
        throw new Error('Formato de backup inválido');
      }

      // Criar novo backup com os dados importados
      const backupId = `${Date.now()}_imported`;
      const backupKey = `${this.BACKUP_KEY_PREFIX}${backupId}`;
      localStorage.setItem(backupKey, JSON.stringify(backup));
      
      this.updateBackupList(backupId, `Backup Importado ${new Date().toLocaleString('pt-BR')}`);
      
      auditLogger.info('system', 'Backup importado', { backupId });
      notificationManager.notify('Backup Importado', 'Backup importado com sucesso', 'success', 'medium');
      
      return true;
    } catch (error) {
      auditLogger.error('system', 'Erro ao importar backup', { error: (error as Error).message });
      notificationManager.notifyError('Erro ao importar backup');
      return false;
    }
  }

  downloadBackup(backupId: string): void {
    const data = this.exportBackup(backupId);
    if (!data) return;

    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cafe-connect-backup-${backupId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export const backupManager = BackupManager.getInstance();