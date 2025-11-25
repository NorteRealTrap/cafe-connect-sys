import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const action = isLogin ? 'login' : 'register';
      const response = await fetch(`/api/auth?action=${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao processar requisição');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      toast.success(isLogin ? 'Login realizado com sucesso!' : 'Conta criada com sucesso!');
      navigate('/orders');

    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao autenticar');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {isLogin ? 'Bem-vindo de volta!' : 'Criar conta'}
          </CardTitle>
          <CardDescription className="text-center">
            {isLogin 
              ? 'Entre com suas credenciais para continuar' 
              : 'Preencha os dados para criar sua conta'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="João Silva"
                  value={formData.name}
                  onChange={handleChange}
                  required={!isLogin}
                  disabled={loading}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Senha</Label>
                {isLogin && (
                  <button
                    type="button"
                    onClick={() => navigate('/reset-password')}
                    className="text-xs text-primary hover:underline"
                    disabled={loading}
                  >
                    Esqueceu a senha?
                  </button>
                )}
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                minLength={6}
              />
              {!isLogin && (
                <p className="text-xs text-muted-foreground">
                  Mínimo de 6 caracteres
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading 
                ? 'Processando...' 
                : isLogin ? 'Entrar' : 'Criar conta'}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline"
              disabled={loading}
            >
              {isLogin 
                ? 'Não tem uma conta? Cadastre-se' 
                : 'Já tem uma conta? Faça login'}
            </button>
          </div>

          <div className="mt-4 p-3 bg-muted rounded-lg text-xs">
            <p className="font-semibold mb-1">Credenciais de teste:</p>
            <p>Admin: admin@cafeconnect.com / admintester12345</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
