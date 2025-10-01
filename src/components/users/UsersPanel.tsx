import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "atendente" as User["role"],
    password: ""
  });
  
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
      },
      {
        id: "4",
        name: "Gabriel Pereira",
        email: "gabriel.pereira@ccpservices.com.br",
        role: "admin",
        status: "ativo",
        lastLogin: "Nunca"
      },
      {
        id: "5",
        name: "Ferramenta Cega",
        email: "ferramentacega@ccpservices.com.br",
        role: "admin",
        status: "ativo",
        lastLogin: "Nunca"
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

  const addUser = () => {
    if (!newUser.name.trim() || !newUser.email.trim() || !newUser.password.trim()) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    if (users.some(user => user.email === newUser.email)) {
      alert('Email já cadastrado');
      return;
    }

    const user: User = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: "ativo",
      lastLogin: "Nunca"
    };

    const updatedUsers = [...users, user];
    setUsers(updatedUsers);
    localStorage.setItem('pdv-users', JSON.stringify(updatedUsers));
    
    setNewUser({ name: "", email: "", role: "atendente", password: "" });
    setShowAddForm(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gerenciamento de Usuários</h2>
          <p className="text-muted-foreground">Gerencie usuários e permissões do sistema</p>
        </div>
        <div className="flex gap-2">
          <Button variant="pdv" onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="h-4 w-4" />
            Novo Usuário
          </Button>
          <Button variant="outline" onClick={onBack}>
            Voltar
          </Button>
        </div>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Novo Usuário</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="userName">Nome Completo</Label>
                <Input
                  id="userName"
                  value={newUser.name}
                  onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: João Silva"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userEmail">Email</Label>
                <Input
                  id="userEmail"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="joao@cafeconnect.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="userRole">Função</Label>
                <Select value={newUser.role} onValueChange={(value) => setNewUser(prev => ({ ...prev, role: value as User["role"] }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Administrador
                      </div>
                    </SelectItem>
                    <SelectItem value="caixa">
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="h-4 w-4" />
                        Caixa
                      </div>
                    </SelectItem>
                    <SelectItem value="atendente">
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4" />
                        Atendente
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="userPassword">Senha Temporária</Label>
                <Input
                  id="userPassword"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="••••••••"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={addUser} variant="success">
                Adicionar Usuário
              </Button>
              <Button onClick={() => setShowAddForm(false)} variant="outline">
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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