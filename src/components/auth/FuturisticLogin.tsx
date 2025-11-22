import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Lock, Coffee } from 'lucide-react';
// import { AuthService } from '@/lib/auth';
import { db } from '@/lib/database';
import { toast } from 'sonner';
import './FuturisticLogin.css';

interface FuturisticLoginProps {
  onLogin: (credentials: { email: string; password: string; role: string }) => void;
}

export const FuturisticLogin: React.FC<FuturisticLoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      // Garantir que o banco de dados está inicializado
      if (db && typeof db.initializeDatabase === 'function') {
        db.initializeDatabase();
      }
    } catch (error) {
      console.error('Erro ao inicializar banco de dados:', error);
    }
    
    // Criar partículas de fundo após um pequeno delay para garantir que o DOM está pronto
    const timer = setTimeout(() => {
      try {
        createParticles();
      } catch (error) {
        console.error('Erro ao criar partículas:', error);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const createParticles = () => {
    try {
      const canvas = document.getElementById('particles-canvas') as HTMLCanvasElement;
      if (!canvas) {
        console.warn('Canvas não encontrado, tentando novamente...');
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.warn('Contexto 2D não disponível');
        return;
      }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
    }> = [];

    // Criar partículas
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Desenhar partículas
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 255, 255, 0.6)';
        ctx.fill();
      });

      // Conectar partículas próximas
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const distance = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 255, 255, ${0.2 - distance / 500})`;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();
    } catch (error) {
      console.error('Erro ao criar animação de partículas:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Gerar identificador único para rate limiting
      const clientId = localStorage.getItem('client-id') || 
        `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('client-id', clientId);

      // Validação temporária para desenvolvimento
      const validUsers = {
        'admin@system.local': { password: process.env.VITE_DEFAULT_PASSWORD || 'temp123', role: 'admin' },
        'caixa@system.local': { password: process.env.VITE_DEFAULT_PASSWORD || 'temp123', role: 'caixa' },
        'atendente@system.local': { password: process.env.VITE_DEFAULT_PASSWORD || 'temp123', role: 'atendente' }
      };
      
      const user = validUsers[email as keyof typeof validUsers];
      const isValid = user && user.password === password && user.role === role;
      
      if (isValid) {
        toast.success('Login realizado com sucesso!');
        onLogin({ email, password, role });
      } else {
        setError('Credenciais inválidas');
        toast.error('Email, senha ou tipo de usuário incorretos');
      }
    } catch (error) {
      setError('Erro interno do sistema');
      toast.error('Erro interno do sistema');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetDatabase = () => {
    if (confirm('⚠️ Isso irá reinicializar o banco de dados com os usuários padrão. Continuar?')) {
      // Limpar usuários e reinicializar
      localStorage.removeItem('ccpservices-users');
      db.initializeDatabase();
      toast.success('Banco de dados reinicializado! Use as credenciais padrão.');
      setEmail('');
      setPassword('');
      setRole('admin');
    }
  };

  return (
    <div className="futuristic-login">
      <canvas id="particles-canvas" className="particles-bg"></canvas>
      
      <div className="login-container">
        <div className="login-box">
          <div className="logo-section">
            <Coffee className="logo-icon" />
            <h1 className="logo-text">CAFE CONNECT</h1>
            <div className="subtitle">Sistema de Gestão Avançado</div>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <div className="input-wrapper">
                <User className="input-icon" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="futuristic-input"
                  placeholder=" "
                  required
                />
                <Label className="floating-label">Email</Label>
              </div>
            </div>

            <div className="input-group">
              <div className="input-wrapper">
                <Lock className="input-icon" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="futuristic-input"
                  placeholder=" "
                  required
                />
                <Label className="floating-label">Senha</Label>
              </div>
            </div>

            <div className="input-group">
              <div className="input-wrapper">
                <select 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)}
                  className="futuristic-select"
                  aria-label="Tipo de Usuário"
                  title="Selecione o tipo de usuário"
                >
                  <option value="admin">Administrador</option>
                  <option value="caixa">Caixa</option>
                  <option value="atendente">Atendente</option>
                </select>
                <Label className="select-label">Tipo de Usuário</Label>
              </div>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {/* Removido: Exibição de credenciais padrão por segurança */}

            <Button 
              type="submit" 
              className="futuristic-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="loading-spinner"></div>
              ) : (
                'ACESSAR SISTEMA'
              )}
            </Button>
          </form>

          <div className="footer-text">
            Tecnologia Avançada • Segurança Máxima
            <button 
              type="button"
              onClick={handleResetDatabase}
              className="reset-db-button"
            >
              🔄 Reinicializar Banco de Dados
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};