import { Button } from "@/components/ui/button";
import { UserRole } from "@/components/auth/LoginForm";
import { Badge } from "@/components/ui/badge";
import { LogOut, Bell, Settings } from "lucide-react";

interface DashboardHeaderProps {
  userRole: UserRole;
  onLogout: () => void;
}

export const DashboardHeader = ({ userRole, onLogout }: DashboardHeaderProps) => {
  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case "admin": return "default";
      case "caixa": return "secondary";
      case "atendente": return "outline";
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case "admin": return "Administrador";
      case "caixa": return "Operador de Caixa";
      case "atendente": return "Atendente";
    }
  };

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-foreground">Sistema PDV</h1>
          <Badge variant={getRoleBadgeVariant(userRole)}>
            {getRoleLabel(userRole)}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};