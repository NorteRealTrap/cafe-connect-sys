// Sistema de Logs e Auditoria
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical';
export type LogCategory = 'auth' | 'orders' | 'payments' | 'inventory' | 'users' | 'system' | 'data';

export interface AuditLog {
  id: string;
  timestamp: string;
  level: LogLevel;
  category: LogCategory;
  action: string;
  userId?: string;
  userName?: string;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

class AuditLogger {
  private static instance: AuditLogger;
  private readonly STORAGE_KEY = 'cafe-connect-audit-logs';
  private readonly MAX_LOGS = 1000;
  private readonly RETENTION_DAYS = 90;

  private constructor() {
    this.cleanOldLogs();
  }

  static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger();
    }
    return AuditLogger.instance;
  }

  private loadLogs(): AuditLog[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Erro ao carregar logs:', error);
      return [];
    }
  }

  private saveLogs(logs: AuditLog[]): void {
    try {
      // Manter apenas os últimos MAX_LOGS
      const limited = logs.slice(0, this.MAX_LOGS);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(limited));
    } catch (error) {
      console.error('Erro ao salvar logs:', error);
    }
  }

  private cleanOldLogs(): void {
    const logs = this.loadLogs();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.RETENTION_DAYS);
    
    const filtered = logs.filter(log => 
      new Date(log.timestamp) > cutoffDate
    );
    
    if (filtered.length !== logs.length) {
      this.saveLogs(filtered);
      console.log(`Removidos ${logs.length - filtered.length} logs antigos`);
    }
  }

  log(
    level: LogLevel,
    category: LogCategory,
    action: string,
    details: Record<string, any> = {}
  ): void {
    const userId = localStorage.getItem('current-user-id');
    const session = localStorage.getItem('ccpservices-session');
    let userName = 'Sistema';
    
    if (session) {
      try {
        const sessionData = JSON.parse(session);
        userName = sessionData.userName || 'Usuário';
      } catch (e) {
        // Ignorar erro
      }
    }

    const log: AuditLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      level,
      category,
      action,
      userId: userId || undefined,
      userName,
      details,
      userAgent: navigator.userAgent
    };

    const logs = this.loadLogs();
    logs.unshift(log);
    this.saveLogs(logs);

    // Log no console em desenvolvimento
    const isDev = import.meta.env?.DEV || false;
    if (isDev) {
      const emoji = {
        debug: '🔍',
        info: 'ℹ️',
        warn: '⚠️',
        error: '❌',
        critical: '🚨'
      }[level];
      
      console.log(`${emoji} [${category}] ${action}`, details);
    }
  }

  // Métodos de conveniência
  debug(category: LogCategory, action: string, details?: Record<string, any>): void {
    this.log('debug', category, action, details);
  }

  info(category: LogCategory, action: string, details?: Record<string, any>): void {
    this.log('info', category, action, details);
  }

  warn(category: LogCategory, action: string, details?: Record<string, any>): void {
    this.log('warn', category, action, details);
  }

  error(category: LogCategory, action: string, details?: Record<string, any>): void {
    this.log('error', category, action, details);
  }

  critical(category: LogCategory, action: string, details?: Record<string, any>): void {
    this.log('critical', category, action, details);
  }

  // Métodos de consulta
  getLogs(filters?: {
    level?: LogLevel;
    category?: LogCategory;
    startDate?: Date;
    endDate?: Date;
    userId?: string;
  }): AuditLog[] {
    let logs = this.loadLogs();

    if (filters) {
      if (filters.level) {
        logs = logs.filter(log => log.level === filters.level);
      }
      if (filters.category) {
        logs = logs.filter(log => log.category === filters.category);
      }
      if (filters.startDate) {
        logs = logs.filter(log => new Date(log.timestamp) >= filters.startDate!);
      }
      if (filters.endDate) {
        logs = logs.filter(log => new Date(log.timestamp) <= filters.endDate!);
      }
      if (filters.userId) {
        logs = logs.filter(log => log.userId === filters.userId);
      }
    }

    return logs;
  }

  getRecentLogs(count: number = 50): AuditLog[] {
    return this.loadLogs().slice(0, count);
  }

  exportLogs(format: 'json' | 'csv' = 'json'): string {
    const logs = this.loadLogs();
    
    if (format === 'json') {
      return JSON.stringify(logs, null, 2);
    } else {
      // CSV format
      const headers = ['Timestamp', 'Level', 'Category', 'Action', 'User', 'Details'];
      const rows = logs.map(log => [
        log.timestamp,
        log.level,
        log.category,
        log.action,
        log.userName || 'N/A',
        JSON.stringify(log.details)
      ]);
      
      return [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');
    }
  }

  clearLogs(): void {
    this.saveLogs([]);
    this.info('system', 'Logs limpos', { action: 'clear_all_logs' });
  }

  // Logs específicos de ações
  logLogin(userId: string, userName: string, success: boolean): void {
    this.info('auth', success ? 'Login bem-sucedido' : 'Tentativa de login falhou', {
      userId,
      userName,
      success
    });
  }

  logLogout(userId: string, userName: string): void {
    this.info('auth', 'Logout', { userId, userName });
  }

  logOrderCreated(orderId: string, orderNumber: number, total: number): void {
    this.info('orders', 'Pedido criado', { orderId, orderNumber, total });
  }

  logOrderStatusChanged(orderId: string, oldStatus: string, newStatus: string): void {
    this.info('orders', 'Status do pedido alterado', { orderId, oldStatus, newStatus });
  }

  logPaymentProcessed(paymentId: string, amount: number, method: string): void {
    this.info('payments', 'Pagamento processado', { paymentId, amount, method });
  }

  logInventoryUpdated(itemId: string, itemName: string, oldStock: number, newStock: number): void {
    this.info('inventory', 'Estoque atualizado', { itemId, itemName, oldStock, newStock });
  }

  logUserCreated(userId: string, userName: string, role: string): void {
    this.info('users', 'Usuário criado', { userId, userName, role });
  }

  logDataCorruption(dataType: string, details: Record<string, any>): void {
    this.error('data', 'Dados corrompidos detectados', { dataType, ...details });
  }

  logSystemError(error: Error, context?: Record<string, any>): void {
    this.error('system', 'Erro do sistema', {
      message: error.message,
      stack: error.stack,
      ...context
    });
  }
}

export const auditLogger = AuditLogger.getInstance();