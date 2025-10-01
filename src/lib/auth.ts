import { authenticateUser, initializeDatabase, User } from './database';

export class AuthService {
  private static initialized = false;

  static async initialize() {
    if (!this.initialized) {
      await initializeDatabase();
      this.initialized = true;
    }
  }

  static async login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      await this.initialize();
      
      if (!email.trim() || !password.trim()) {
        return { success: false, error: 'Email e senha são obrigatórios' };
      }

      if (password.length < 3) {
        return { success: false, error: 'Senha deve ter pelo menos 3 caracteres' };
      }

      const user = await authenticateUser(email, password);
      
      if (!user) {
        return { success: false, error: 'Email ou senha inválidos' };
      }

      return { success: true, user };
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, error: 'Erro interno do servidor' };
    }
  }
}