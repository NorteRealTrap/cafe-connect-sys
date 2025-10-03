// Sistema de persistência automática e sincronização em tempo real
export class PersistenceManager {
  private static instance: PersistenceManager;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();
  private autoSaveTimers: Map<string, NodeJS.Timeout> = new Map();

  static getInstance(): PersistenceManager {
    if (!PersistenceManager.instance) {
      PersistenceManager.instance = new PersistenceManager();
    }
    return PersistenceManager.instance;
  }

  // Salvar dados automaticamente
  save(key: string, data: any, autoSave = true) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      this.notifyListeners(key, data);
      
      if (autoSave) {
        // Debounce para evitar muitas escritas
        if (this.autoSaveTimers.has(key)) {
          clearTimeout(this.autoSaveTimers.get(key)!);
        }
        
        const timer = setTimeout(() => {
          window.dispatchEvent(new CustomEvent('dataChanged', { 
            detail: { key, data } 
          }));
        }, 100);
        
        this.autoSaveTimers.set(key, timer);
      }
    } catch (error) {
      console.error(`Erro ao salvar ${key}:`, error);
    }
  }

  // Carregar dados
  load<T>(key: string, defaultValue: T): T {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch (error) {
      console.error(`Erro ao carregar ${key}:`, error);
      return defaultValue;
    }
  }

  // Escutar mudanças em uma chave específica
  subscribe(key: string, callback: (data: any) => void) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)!.add(callback);

    // Retorna função para cancelar inscrição
    return () => {
      const keyListeners = this.listeners.get(key);
      if (keyListeners) {
        keyListeners.delete(callback);
      }
    };
  }

  // Notificar listeners sobre mudanças
  private notifyListeners(key: string, data: any) {
    const keyListeners = this.listeners.get(key);
    if (keyListeners) {
      keyListeners.forEach(callback => callback(data));
    }
  }

  // Sincronizar entre abas
  setupCrossTabSync() {
    window.addEventListener('storage', (e) => {
      if (e.key && e.newValue) {
        try {
          const data = JSON.parse(e.newValue);
          this.notifyListeners(e.key, data);
        } catch (error) {
          console.error('Erro na sincronização entre abas:', error);
        }
      }
    });
  }
}

// Hook para usar persistência automática
import { useState, useEffect, useCallback } from 'react';

export function usePersistentState<T>(key: string, defaultValue: T) {
  const pm = PersistenceManager.getInstance();
  const [state, setState] = useState<T>(() => pm.load(key, defaultValue));

  useEffect(() => {
    // Carregar dados iniciais
    const loaded = pm.load(key, defaultValue);
    setState(loaded);

    // Escutar mudanças
    const unsubscribe = pm.subscribe(key, (newData) => {
      setState(newData);
    });

    return unsubscribe;
  }, [key, defaultValue]);

  const updateState = useCallback((newValue: T | ((prev: T) => T)) => {
    setState(prev => {
      const nextValue = typeof newValue === 'function' 
        ? (newValue as (prev: T) => T)(prev) 
        : newValue;
      
      pm.save(key, nextValue);
      return nextValue;
    });
  }, [key, pm]);

  return [state, updateState] as const;
}

// Hook para auto-save de formulários
export function useAutoSave<T extends Record<string, any>>(
  key: string, 
  initialData: T,
  saveInterval = 1000
) {
  const [data, setData] = usePersistentState(key, initialData);
  const [lastSaved, setLastSaved] = useState<Date>(new Date());

  const updateField = useCallback((field: keyof T, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
    setLastSaved(new Date());
  }, [setData]);

  const resetForm = useCallback(() => {
    setData(initialData);
  }, [setData, initialData]);

  return {
    data,
    updateField,
    resetForm,
    lastSaved,
    setData
  };
}

// Inicializar sistema de persistência
export const initializePersistence = () => {
  const pm = PersistenceManager.getInstance();
  pm.setupCrossTabSync();
  
  // Auto-save periódico para dados críticos
  setInterval(() => {
    const criticalKeys = [
      'ccpservices-products',
      'cafe-connect-orders', 
      'ccpservices-web-orders',
      'ccpservices-users',
      'ccpservices-inventory'
    ];
    
    criticalKeys.forEach(key => {
      const data = pm.load(key, null);
      if (data) {
        pm.save(key, data, false); // Salvar sem trigger de eventos
      }
    });
  }, 30000); // A cada 30 segundos
};