import { useState } from "react";
import { LoginForm, UserRole } from "@/components/auth/LoginForm";
import { Dashboard } from "./Dashboard";

const Index = () => {
  const [user, setUser] = useState<{ role: UserRole } | null>(null);

  const handleLogin = (role: UserRole) => {
    setUser({ role });
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return <Dashboard userRole={user.role} onLogout={handleLogout} />;
};

export default Index;
