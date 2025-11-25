-- ================================
-- SCHEMA COMPLETO - CAFÉ CONNECT
-- ================================

-- 1. TABELA DE USUÁRIOS
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 2. TABELA DE PEDIDOS
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  total DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  notes TEXT,
  delivery_address TEXT,
  phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- 3. TABELA DE ITENS DO PEDIDO
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- 4. TABELA DE HISTÓRICO DE STATUS
CREATE TABLE IF NOT EXISTS order_status_history (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  old_status VARCHAR(50),
  new_status VARCHAR(50) NOT NULL,
  changed_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_status_history_order_id ON order_status_history(order_id);

-- 5. TABELA DE COMENTÁRIOS
CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  comment TEXT NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);

-- 6. TABELA DE MENSAGENS (WhatsApp/Instagram)
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  platform VARCHAR(50) NOT NULL,
  sender_id VARCHAR(255) NOT NULL,
  message_id VARCHAR(255) UNIQUE NOT NULL,
  content TEXT,
  message_type VARCHAR(50),
  media_id VARCHAR(255),
  received_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_messages_platform ON messages(platform);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_message_id ON messages(message_id);

-- 7. TABELA DE LOGS DE WEBHOOK
CREATE TABLE IF NOT EXISTS webhook_logs (
  id SERIAL PRIMARY KEY,
  source VARCHAR(50) NOT NULL,
  payload JSONB NOT NULL,
  error TEXT,
  received_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_webhook_logs_source ON webhook_logs(source);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_received_at ON webhook_logs(received_at DESC);

-- ================================
-- TRIGGERS
-- ================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ================================
-- DADOS DE TESTE
-- ================================

-- Usuário admin (senha: admintester12345)
INSERT INTO users (email, password, name, role, phone)
VALUES 
  ('admin@cafeconnect.com', '$2b$10$UI7W.OLpgE/3xiDcjjFy2ukgWn181J7kyFrp18.gPLg8Hjv3673ly', 'Administrador', 'admin', '+5511999999999')
ON CONFLICT (email) DO UPDATE SET 
  password = EXCLUDED.password,
  role = EXCLUDED.role;

-- Usuário teste (senha: user123)
INSERT INTO users (email, password, name, role, phone)
VALUES 
  ('user@cafe.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Usuário Teste', 'user', '+5511988888888')
ON CONFLICT (email) DO NOTHING;

-- ================================
-- VIEWS ÚTEIS
-- ================================

CREATE OR REPLACE VIEW v_orders_full AS
SELECT 
  o.id,
  o.user_id,
  u.name as customer_name,
  u.email as customer_email,
  u.phone as customer_phone,
  o.total,
  o.status,
  o.notes,
  o.delivery_address,
  o.phone as order_phone,
  o.created_at,
  o.updated_at,
  COUNT(oi.id) as item_count
FROM orders o
LEFT JOIN users u ON o.user_id = u.id
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id, u.name, u.email, u.phone;

CREATE OR REPLACE VIEW v_order_stats AS
SELECT 
  status,
  COUNT(*) as count,
  SUM(total) as total_revenue,
  AVG(total) as avg_order_value
FROM orders
GROUP BY status;

-- ================================
-- FIM DO SCHEMA
-- ================================
