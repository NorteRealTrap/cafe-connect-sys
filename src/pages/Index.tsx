import { useState, useEffect } from "react";
import { LoginForm, UserRole } from "@/components/auth/LoginForm";
import { Dashboard } from "./Dashboard";
import { storageManager } from "@/lib/storage-manager";
import { ordersDatabase } from "@/lib/orders-database";

const Index = () => {
  const [user, setUser] = useState<{ role: UserRole } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Inicializar storage manager
    storageManager.init();
    
    // Validar integridade dos dados
    if (!storageManager.validateStorage()) {
      console.log('Dados reinicializados devido à corrupção');
    }
    
    // Limpar pedidos antigos (mais de 30 dias) na inicialização
    ordersDatabase.cleanOldOrders(30);
    
    // Verificar se há sessão salva
    const savedSession = localStorage.getItem('ccpservices-session');
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        if (session.role && session.timestamp) {
          // Verificar se a sessão não expirou (24 horas)
          const now = Date.now();
          const sessionAge = now - session.timestamp;
          const maxAge = 24 * 60 * 60 * 1000; // 24 horas
          
          if (sessionAge < maxAge) {
            setUser({ role: session.role });
          } else {
            localStorage.removeItem('ccpservices-session');
          }
        }
      } catch (e) {
        localStorage.removeItem('ccpservices-session');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (role: UserRole) => {
    const session = {
      role,
      timestamp: Date.now()
    };
    localStorage.setItem('ccpservices-session', JSON.stringify(session));
    setUser({ role });
  };

  const handleLogout = () => {
    localStorage.removeItem('ccpservices-session');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return <Dashboard userRole={user.role} onLogout={handleLogout} />;
};

export default Index;
