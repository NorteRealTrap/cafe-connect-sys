import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/components/auth/LoginForm";
import { Badge } from "@/components/ui/badge";
import { LogOut, Bell, Settings, UserCog } from "lucide-react";
import { NotificationsPanel } from "@/components/notifications/NotificationsPanel";
import { SettingsPanel } from "@/components/settings/SettingsPanel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DashboardHeaderProps {
  userRole: UserRole;
  onLogout: () => void;
  onRoleChange?: (role: UserRole) => void;
  onNotifications?: () => void;
  onSettings?: () => void;
}

export const DashboardHeader = ({ userRole, onLogout, onRoleChange }: DashboardHeaderProps) => {
  const currentUser = localStorage.getItem('current-user-id') || '';
  const isSuperAdmin = currentUser === 'admin@cafeconnect.com';
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
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
    <header className="bg-card/80 backdrop-blur-md border-b border-border/50 px-6 py-4 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-foreground">CCPServices</h1>
          {isSuperAdmin ? (
            <div className="flex items-center gap-2">
              <UserCog className="h-4 w-4 text-muted-foreground" />
              <Select value={userRole} onValueChange={(value: UserRole) => onRoleChange?.(value)}>
                <SelectTrigger className="w-[180px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="caixa">Operador de Caixa</SelectItem>
                  <SelectItem value="atendente">Atendente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ) : (
            <Badge variant={getRoleBadgeVariant(userRole)}>
              {getRoleLabel(userRole)}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setShowNotifications(true)}>
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)}>
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {showNotifications && (
        <NotificationsPanel onClose={() => setShowNotifications(false)} />
      )}
      
      {showSettings && (
        <SettingsPanel onClose={() => setShowSettings(false)} />
      )}
    </header>
  );
};