// Sistema de Gerenciamento de Configurações
export interface SystemConfig {
  theme: 'light' | 'dark' | 'system';
  language: 'pt-BR' | 'en-US' | 'es-ES';
  currency: 'BRL' | 'USD' | 'EUR';
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  timeFormat: '12h' | '24h';
  notifications: {
    enabled: boolean;
    sound: boolean;
    desktop: boolean;
    lowStock: boolean;
    newOrders: boolean;
  };
  printer: {
    enabled: boolean;
    autoPrint: boolean;
    printerName?: string;
  };
  business: {
    name: string;
    address: string;
    phone: string;
    email: string;
    logo?: string;
  };
}

const DEFAULT_CONFIG: SystemConfig = {
  theme: 'system',
  language: 'pt-BR',
  currency: 'BRL',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '24h',
  notifications: {
    enabled: true,
    sound: true,
    desktop: true,
    lowStock: true,
    newOrders: true
  },
  printer: {
    enabled: false,
    autoPrint: false
  },
  business: {
    name: 'Cafe Connect',
    address: '',
    phone: '',
    email: ''
  }
};

class ConfigManager {
  private static instance: ConfigManager;
  private config: SystemConfig;
  private readonly STORAGE_KEY = 'cafe-connect-config';

  private constructor() {
    this.config = this.loadConfig();
  }

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  private loadConfig(): SystemConfig {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...DEFAULT_CONFIG, ...parsed };
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
    return DEFAULT_CONFIG;
  }

  private saveConfig(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.config));
      window.dispatchEvent(new CustomEvent('config-changed', { detail: this.config }));
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
    }
  }

  getConfig(): SystemConfig {
    return { ...this.config };
  }

  updateConfig(updates: Partial<SystemConfig>): void {
    this.config = { ...this.config, ...updates };
    this.saveConfig();
  }

  resetConfig(): void {
    this.config = DEFAULT_CONFIG;
    this.saveConfig();
  }

  // Métodos de conveniência
  getTheme(): string {
    return this.config.theme;
  }

  setTheme(theme: SystemConfig['theme']): void {
    this.updateConfig({ theme });
  }

  getLanguage(): string {
    return this.config.language;
  }

  setLanguage(language: SystemConfig['language']): void {
    this.updateConfig({ language });
  }

  areNotificationsEnabled(): boolean {
    return this.config.notifications.enabled;
  }

  toggleNotifications(enabled: boolean): void {
    this.updateConfig({
      notifications: { ...this.config.notifications, enabled }
    });
  }
}

export const configManager = ConfigManager.getInstance();