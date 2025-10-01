import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff, Zap, User, Lock, Sparkles, Rocket, Globe, AlertCircle } from "lucide-react";
import { db } from "@/lib/database";

export type UserRole = 'admin' | 'caixa' | 'atendente';

interface LoginFormProps {
  onLogin: (role: UserRole) => void;
}

export const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("admin");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      // Simular delay de autenticação
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Buscar usuários do banco de dados
      const users = db.getUsers();
      
      // Validar credenciais
      const user = users.find(u => 
        u.email.toLowerCase() === email.toLowerCase().trim() && 
        u.password === password &&
        u.role === role &&
        u.status === 'ativo'
      );
      
      if (user) {
        // Atualizar último login
        const updatedUsers = users.map(u => 
          u.id === user.id ? { ...u, lastLogin: new Date().toISOString() } : u
        );
        db.saveUsers(updatedUsers);
        
        onLogin(role);
      } else {
        setError("Email, senha ou nível de acesso inválidos. Verifique suas credenciais.");
      }
    } catch (err) {
      setError("Erro interno do sistema. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-2 h-2 bg-white/30 rounded-full animate-ping" />
        <div className="absolute top-40 right-32 w-1 h-1 bg-purple-400/50 rounded-full animate-pulse" />
        <div className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-blue-400/40 rounded-full animate-ping delay-700" />
        <div className="absolute top-1/3 right-20 w-1 h-1 bg-cyan-400/60 rounded-full animate-pulse delay-300" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full blur-lg opacity-75 animate-pulse" />
              <div className="relative w-20 h-20 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full flex items-center justify-center shadow-2xl">
                <Zap className="h-10 w-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                CCPServices
              </span>
            </h1>
            
            <div className="flex items-center justify-center gap-2 text-purple-200/80 mb-2">
              <Globe className="h-4 w-4" />
              <span className="text-sm font-medium">Sistema de Gestão Comercial</span>
              <Sparkles className="h-4 w-4" />
            </div>
            
            <p className="text-slate-400 text-sm">
              Tecnologia avançada para seu negócio
            </p>
          </div>

          {/* Login Card */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-2xl blur-xl" />
            <div className="relative bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-slate-200 font-medium">Nível de Acesso</Label>
                  <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="admin" className="text-white hover:bg-slate-700">
                        <div className="flex items-center gap-2">
                          <Rocket className="h-4 w-4 text-purple-400" />
                          Administrador
                        </div>
                      </SelectItem>
                      <SelectItem value="caixa" className="text-white hover:bg-slate-700">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-cyan-400" />
                          Caixa
                        </div>
                      </SelectItem>
                      <SelectItem value="atendente" className="text-white hover:bg-slate-700">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-blue-400" />
                          Atendente
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-slate-200 font-medium">Email</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500/20"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-slate-200 font-medium">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500/20"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Conectando...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Rocket className="h-4 w-4" />
                      Iniciar Sessão
                    </div>
                  )}
                </Button>
              </form>
              

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};