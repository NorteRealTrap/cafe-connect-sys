import { useEffect } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  action: () => void;
  description: string;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[]) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      shortcuts.forEach(shortcut => {
        const ctrlMatch = shortcut.ctrl ? e.ctrlKey || e.metaKey : !e.ctrlKey && !e.metaKey;
        const altMatch = shortcut.alt ? e.altKey : !e.altKey;
        const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey;
        
        if (
          e.key.toLowerCase() === shortcut.key.toLowerCase() &&
          ctrlMatch &&
          altMatch &&
          shiftMatch
        ) {
          e.preventDefault();
          shortcut.action();
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};

// Atalhos globais do sistema
export const GLOBAL_SHORTCUTS = {
  NEW_ORDER: { key: 'n', ctrl: true, description: 'Novo Pedido' },
  SEARCH: { key: 'k', ctrl: true, description: 'Buscar' },
  SAVE: { key: 's', ctrl: true, description: 'Salvar' },
  CLOSE: { key: 'Escape', description: 'Fechar/Cancelar' },
  HELP: { key: 'F1', description: 'Ajuda' },
  REFRESH: { key: 'F5', description: 'Atualizar' },
};
