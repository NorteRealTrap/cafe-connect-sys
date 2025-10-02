import React, { useState } from 'react';
import { FuturisticLogin } from './FuturisticLogin';

interface User {
  email: string;
  role: string;
}

interface AuthWrapperProps {
  children: React.ReactNode;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (credentials: { email: string; password: string; role: string }) => {
    // Aqui você pode integrar com seu sistema de autenticação existente
    // Por enquanto, vamos simular um login bem-sucedido
    setUser({
      email: credentials.email,
      role: credentials.role
    });
    
    // Salvar no localStorage para persistência
    localStorage.setItem('user', JSON.stringify({
      email: credentials.email,
      role: credentials.role
    }));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Verificar se há usuário logado no localStorage
  React.useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  if (!user) {
    return <FuturisticLogin onLogin={handleLogin} />;
  }

  return (
    <div>
      {/* Adicionar contexto do usuário para os componentes filhos */}
      {React.cloneElement(children as React.ReactElement, { 
        user, 
        onLogout: handleLogout 
      })}
    </div>
  );
};