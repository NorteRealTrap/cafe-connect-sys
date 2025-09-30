import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Shield, ShoppingCart, UserCheck } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "caixa" | "atendente";
  status: "ativo" | "inativo";
  lastLogin: string;
}

interface UsersPanelProps {
  onBack: () => void;
}

export const UsersPanel = ({ onBack }: UsersPanelProps) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('pdv-users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Erro ao carregar usuários:', e);
      }
    }
    
    return [
      {
        id: "1",
        name: "João Silva",
        email: "joao@cafeconnect.com",
        role: "admin",
        status: "ativo",
        lastLogin: "2024-01-15 14:30"
      },
      {
        id: "2",
        name: "Maria Santos",
        email: "maria@cafeconnect.com",
        role: "caixa",
        status: "ativo",
        lastLogin: "2024-01-15 13:45"
      },
      {
        id: "3",
        name: "Carlos Lima",
        email: "carlos@cafeconnect.com",
        role: "atendente",
        status: "inativo",
        lastLogin: "2024-01-14 18:20"
      }
    ];
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin": return <Shield className="h-4 w-4" />;
      case "caixa": return <ShoppingCart className="h-4 w-4" />;
      case "atendente": return <UserCheck className="h-4 w-4" />;
      default: return null;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin": return "Administrador";
      case "caixa": return "Caixa";
      case "atendente": return "Atendente";
      default: return role;
    }
  };

  const toggleUserStatus = (userId: string) => {
    const updatedUsers = users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === "ativo" ? "inativo" : "ativo" as const }
        : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('pdv-users', JSON.stringify(updatedUsers));
  };

  const editUser = (userId: string) => {
    console.log('Editar usuário:', userId);
  };

  const deleteUser = (userId: string) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
      localStorage.setItem('pdv-users', JSON.stringify(updatedUsers));
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gerenciamento de Usuários</h2>
          <p className="text-muted-foreground">Gerencie usuários e permissões do sistema</p>
        </div>
        <div className="flex gap-2">
          <Button variant="pdv">
            <Plus className="h-4 w-4" />
            Novo Usuário
          </Button>
          <Button variant="outline" onClick={onBack}>
            Voltar
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    {getRoleIcon(user.role)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{user.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={user.status === "ativo" ? "default" : "secondary"}>
                    {user.status}
                  </Badge>
                  <Badge variant="outline">
                    {getRoleLabel(user.role)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Último acesso: {user.lastLogin}
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => editUser(user.id)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant={user.status === "ativo" ? "secondary" : "default"}
                    onClick={() => toggleUserStatus(user.id)}
                  >
                    {user.status === "ativo" ? "Desativar" : "Ativar"}
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteUser(user.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};