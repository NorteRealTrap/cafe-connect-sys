import { useState, useEffect } from "react";
import { FuturisticLogin } from "@/components/auth/FuturisticLogin";
import { BusinessSelector } from "@/components/business/BusinessSelector";
import { Dashboard } from "./Dashboard";

type UserRole = 'admin' | 'caixa' | 'atendente';

const Index = () => {
  const [user, setUser] = useState<{ role: UserRole } | null>(null);
  const [businessCategory, setBusinessCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedSession = localStorage.getItem('ccpservices-session');
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        if (session.role) {
          setUser({ role: session.role });
          if (session.businessCategory) {
            setBusinessCategory(session.businessCategory);
          }
        }
      } catch (e) {
        localStorage.removeItem('ccpservices-session');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (credentials: { email: string; password: string; role: string }) => {
    const session = {
      role: credentials.role,
      timestamp: Date.now()
    };
    localStorage.setItem('ccpservices-session', JSON.stringify(session));
    setUser({ role: credentials.role as UserRole });
  };

  const handleBusinessSelect = (category: any) => {
    const session = {
      role: user?.role,
      businessCategory: category,
      timestamp: Date.now()
    };
    localStorage.setItem('ccpservices-session', JSON.stringify(session));
    setBusinessCategory(category);
  };

  const handleBackToLogin = () => {
    setUser(null);
    setBusinessCategory(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('ccpservices-session');
    setUser(null);
    setBusinessCategory(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    try {
      return <FuturisticLogin onLogin={handleLogin} />;
    } catch (error) {
      console.error('Erro ao renderizar FuturisticLogin:', error);
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md w-full bg-card border border-border rounded-lg p-6 shadow-lg">
            <h1 className="text-2xl font-bold text-destructive mb-4">
              Erro ao carregar tela de login
            </h1>
            <p className="text-muted-foreground mb-4">
              Ocorreu um erro ao carregar a tela de login. Por favor, recarregue a página.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              Recarregar Página
            </button>
          </div>
        </div>
      );
    }
  }

  if (!businessCategory) {
    return (
      <BusinessSelector 
        onSelect={handleBusinessSelect}
        onBack={handleBackToLogin}
      />
    );
  }

  return <Dashboard userRole={user.role} businessCategory={businessCategory} onLogout={handleLogout} />;
};

export default Index;
