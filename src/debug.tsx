// Debug component para identificar erros
import { useEffect } from 'react';

export const Debug = () => {
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log('Sistema carregado');
      console.log('React Router:', typeof window !== 'undefined' ? window.location : 'SSR');
    }
  }, []);

  return null;
};