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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <FuturisticLogin onLogin={handleLogin} />;
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
