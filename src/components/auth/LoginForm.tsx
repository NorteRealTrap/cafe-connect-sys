import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

export type UserRole = "admin" | "caixa" | "atendente";

interface LoginFormProps {
  onLogin: (role: UserRole) => void;
}

export const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      alert('Preencha email e senha');
      return;
    }
    
    try {
      // Tentar autenticação via API
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        onLogin(result.user.role as UserRole);
        return;
      }
    } catch (error) {
      console.warn('API falhou, usando fallback localStorage:', error);
    }
    
    // Fallback para localStorage
    const emailLower = email.toLowerCase().trim();
    
    if (emailLower === 'admin@cafeconnect.com' && password === 'admin123') {
      onLogin('admin');
    } else if (emailLower === 'gabriel.pereira@ccpservices.com.br' && password === 'ccpservices123') {
      onLogin('admin');
    } else if (emailLower === 'ferramentacega@ccpservices.com.br' && password === 'ccpservices123') {
      onLogin('admin');
    } else {
      alert('Email ou senha inválidos.\nCredenciais disponíveis:\n- admin@cafeconnect.com / admin123\n- gabriel.pereira@ccpservices.com.br / ccpservices123\n- ferramentacega@ccpservices.com.br / ccpservices123');
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
            <CardTitle className="text-2xl font-bold">CCPServices</CardTitle>
            <CardDescription>
              Entre com suas credenciais cadastradas
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">

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
          
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground text-center mb-2">
              <strong>Login Padrão (primeira vez):</strong>
            </p>
            <div className="text-xs text-muted-foreground text-center space-y-1">
              <p><strong>Credenciais disponíveis:</strong></p>
              <p>admin@cafeconnect.com / admin123</p>
              <p>gabriel.pereira@ccpservices.com.br / ccpservices123</p>
              <p>ferramentacega@ccpservices.com.br / ccpservices123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};