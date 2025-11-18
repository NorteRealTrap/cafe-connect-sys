import { db, User } from './database';

export interface LoginCredentials {
  email: string;
  password: string;
  role: string;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  message?: string;
}

export class AuthService {
  static authenticate(credentials: LoginCredentials): AuthResult {
    const users = db.getUsers();
    
    // Buscar usuário por email
    const user = users.find(u => 
      u.email.toLowerCase() === credentials.email.toLowerCase() && 
      u.status === 'ativo'
    );

    if (!user) {
      return {
        success: false,
        message: 'Usuário não encontrado ou inativo'
      };
    }

    // Verificar senha
    if (user.password !== credentials.password) {
      return {
        success: false,
        message: 'Senha incorreta'
      };
    }

    // Verificar se o role corresponde
    if (user.role !== credentials.role) {
      return {
        success: false,
        message: 'Tipo de usuário incorreto'
      };
    }

    // Atualizar último login
    const updatedUsers = users.map(u => 
      u.id === user.id 
        ? { ...u, lastLogin: new Date().toISOString() }
        : u
    );
    db.saveUsers(updatedUsers);

    return {
      success: true,
      user: { ...user, lastLogin: new Date().toISOString() }
    };
  }

  static getRegisteredUsers(): User[] {
    return db.getUsers().filter(u => u.status === 'ativo');
  }
}