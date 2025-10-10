// Sistema de Gerenciamento de Notificações
import { configManager } from './config-manager';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

class NotificationManager {
  private static instance: NotificationManager;
  private readonly STORAGE_KEY = 'cafe-connect-notifications';
  private readonly MAX_NOTIFICATIONS = 100;

  private constructor() {
    this.requestPermission();
  }

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  private async requestPermission(): Promise<void> {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  }

  private loadNotifications(): Notification[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
      return [];
    }
  }

  private saveNotifications(notifications: Notification[]): void {
    try {
      // Manter apenas as últimas MAX_NOTIFICATIONS
      const limited = notifications.slice(0, this.MAX_NOTIFICATIONS);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(limited));
      window.dispatchEvent(new CustomEvent('notifications-changed', { detail: limited }));
    } catch (error) {
      console.error('Erro ao salvar notificações:', error);
    }
  }

  notify(
    title: string,
    message: string,
    type: NotificationType = 'info',
    priority: NotificationPriority = 'medium',
    options?: {
      actionUrl?: string;
      actionLabel?: string;
      sound?: boolean;
      desktop?: boolean;
    }
  ): string {
    const config = configManager.getConfig();
    
    if (!config.notifications.enabled) {
      return '';
    }

    const notification: Notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      priority,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      actionUrl: options?.actionUrl,
      actionLabel: options?.actionLabel
    };

    // Salvar no storage
    const notifications = this.loadNotifications();
    notifications.unshift(notification);
    this.saveNotifications(notifications);

    // Notificação de desktop
    if (options?.desktop !== false && config.notifications.desktop) {
      this.showDesktopNotification(title, message, type);
    }

    // Som
    if (options?.sound !== false && config.notifications.sound) {
      this.playNotificationSound(type);
    }

    return notification.id;
  }

  private showDesktopNotification(title: string, message: string, type: NotificationType): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      const icon = this.getIconForType(type);
      new Notification(title, {
        body: message,
        icon,
        badge: icon,
        tag: 'cafe-connect'
      });
    }
  }

  private playNotificationSound(type: NotificationType): void {
    try {
      const audio = new Audio();
      // Usar diferentes frequências para diferentes tipos
      const frequencies = {
        info: 440,
        success: 523,
        warning: 392,
        error: 330
      };
      
      const context = new AudioContext();
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      
      oscillator.frequency.value = frequencies[type];
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);
      
      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.5);
    } catch (error) {
      console.error('Erro ao reproduzir som:', error);
    }
  }

  private getIconForType(type: NotificationType): string {
    const icons = {
      info: '📢',
      success: '✅',
      warning: '⚠️',
      error: '❌'
    };
    return icons[type];
  }

  getAll(): Notification[] {
    return this.loadNotifications();
  }

  getUnread(): Notification[] {
    return this.loadNotifications().filter(n => !n.read);
  }

  markAsRead(id: string): void {
    const notifications = this.loadNotifications();
    const updated = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    this.saveNotifications(updated);
  }

  markAllAsRead(): void {
    const notifications = this.loadNotifications();
    const updated = notifications.map(n => ({ ...n, read: true }));
    this.saveNotifications(updated);
  }

  delete(id: string): void {
    const notifications = this.loadNotifications();
    const filtered = notifications.filter(n => n.id !== id);
    this.saveNotifications(filtered);
  }

  clear(): void {
    this.saveNotifications([]);
  }

  // Métodos de conveniência
  notifyNewOrder(orderNumber: number): void {
    const config = configManager.getConfig();
    if (config.notifications.newOrders) {
      this.notify(
        'Novo Pedido!',
        `Pedido #${orderNumber} recebido`,
        'info',
        'high',
        { desktop: true, sound: true }
      );
    }
  }

  notifyLowStock(itemName: string, currentStock: number): void {
    const config = configManager.getConfig();
    if (config.notifications.lowStock) {
      this.notify(
        'Estoque Baixo',
        `${itemName} está com apenas ${currentStock} unidades`,
        'warning',
        'medium',
        { desktop: true }
      );
    }
  }

  notifyOrderReady(orderNumber: number): void {
    this.notify(
      'Pedido Pronto',
      `Pedido #${orderNumber} está pronto para entrega`,
      'success',
      'high',
      { desktop: true, sound: true }
    );
  }

  notifyError(message: string): void {
    this.notify(
      'Erro',
      message,
      'error',
      'high',
      { desktop: true }
    );
  }
}

export const notificationManager = NotificationManager.getInstance();