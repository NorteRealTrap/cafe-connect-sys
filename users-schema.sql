-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Inserir usuários de teste (senhas: admin123 e user123)
INSERT INTO users (name, email, password_hash, role) VALUES
  ('Administrador', 'admin@cafeconnect.com', '$2a$10$rZ5YvH8qVvH8qVvH8qVvH.qVvH8qVvH8qVvH8qVvH8qVvH8qVvH8q', 'admin'),
  ('Usuário Teste', 'user@cafe.com', '$2a$10$rZ5YvH8qVvH8qVvH8qVvH.qVvH8qVvH8qVvH8qVvH8qVvH8qVvH8q', 'user')
ON CONFLICT (email) DO NOTHING;

-- Criar índice para melhorar performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
