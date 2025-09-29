import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart, Shield, UserCheck } from "lucide-react";

export type UserRole = "admin" | "caixa" | "atendente";

interface LoginFormProps {
  onLogin: (role: UserRole) => void;
}

export const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("caixa");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(role);
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "admin": return <Shield className="h-5 w-5" />;
      case "caixa": return <ShoppingCart className="h-5 w-5" />;
      case "atendente": return <UserCheck className="h-5 w-5" />;
    }
  };

  const getRoleDescription = (role: UserRole) => {
    switch (role) {
      case "admin": return "Acesso completo ao sistema";
      case "caixa": return "Gestão de vendas e pagamentos";
      case "atendente": return "Atendimento e pedidos";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
      <Card className="w-full max-w-md shadow-pdv">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center">
            <ShoppingCart className="h-10 w-10 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Sistema PDV</CardTitle>
            <CardDescription>
              Faça login para acessar o sistema
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">Tipo de Usuário</Label>
              <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
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
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                {getRoleIcon(role)}
                {getRoleDescription(role)}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-primary hover:bg-primary-hover transition-all duration-200"
            >
              Entrar no Sistema
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};