-- ============================================
-- CAFÉ CONNECT - SCHEMA COMPLETO
-- ============================================

-- 1. TABELA DE USUÁRIOS
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABELA DE PEDIDOS
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  total DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  delivery_address TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABELA DE ITENS DO PEDIDO
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. TABELA DE COMENTÁRIOS
CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. TABELA DE LOGS DE WEBHOOK
CREATE TABLE IF NOT EXISTS webhook_logs (
  id SERIAL PRIMARY KEY,
  source TEXT NOT NULL,
  event_type TEXT,
  payload JSONB,
  received_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_source ON webhook_logs(source);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_received_at ON webhook_logs(received_at DESC);

-- ============================================
-- VIEWS ÚTEIS
-- ============================================

-- View de estatísticas de pedidos
CREATE OR REPLACE VIEW v_order_stats AS
SELECT 
  status,
  COUNT(*) as total_orders,
  SUM(total) as total_revenue,
  AVG(total) as avg_order_value
FROM orders
GROUP BY status;

-- View de pedidos completos com itens
CREATE OR REPLACE VIEW v_orders_with_items AS
SELECT 
  o.id,
  o.user_id,
  u.name as customer_name,
  u.email as customer_email,
  o.total,
  o.status,
  o.notes,
  o.delivery_address,
  o.phone,
  o.created_at,
  o.updated_at,
  json_agg(
    json_build_object(
      'id', oi.id,
      'product_name', oi.product_name,
      'quantity', oi.quantity,
      'price', oi.price,
      'subtotal', oi.subtotal
    )
  ) as items
FROM orders o
LEFT JOIN users u ON o.user_id = u.id
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id, u.name, u.email;

-- ============================================
-- DADOS DE TESTE
-- ============================================

-- Inserir usuário admin (senha: admintester12345)
INSERT INTO users (name, email, password_hash, role) VALUES
  ('Administrador', 'admin@cafeconnect.com', '$2b$10$UI7W.OLpgE/3xiDcjjFy2ukgWn181J7kyFrp18.gPLg8Hjv3673ly', 'admin')
ON CONFLICT (email) DO UPDATE SET 
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role;

-- Inserir usuário teste (senha: user123)
INSERT INTO users (name, email, password_hash, role) VALUES
  ('Usuário Teste', 'user@cafe.com', '$2a$10$rZ5YvH8qVvH8qVvH8qVvH.qVvH8qVvH8qVvH8qVvH8qVvH8qVvH8q', 'user')
ON CONFLICT (email) DO NOTHING;

-- Inserir pedido de teste
DO $$
DECLARE
  test_user_id INTEGER;
  test_order_id INTEGER;
BEGIN
  SELECT id INTO test_user_id FROM users WHERE email = 'user@cafe.com';
  
  IF test_user_id IS NOT NULL THEN
    INSERT INTO orders (user_id, total, status, notes, phone)
    VALUES (test_user_id, 32.50, 'pending', 'Pedido de teste', '+5511999999999')
    RETURNING id INTO test_order_id;
    
    INSERT INTO order_items (order_id, product_name, quantity, price, subtotal)
    VALUES 
      (test_order_id, 'Café Expresso', 2, 5.00, 10.00),
      (test_order_id, 'Pão de Queijo', 3, 7.50, 22.50);
  END IF;
END $$;

-- Inserir comentário de teste
INSERT INTO comments (comment) VALUES ('Primeiro comentário de teste!')
ON CONFLICT DO NOTHING;

-- ============================================
-- VERIFICAÇÃO FINAL
-- ============================================

-- Listar todas as tabelas criadas
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Contar registros em cada tabela
SELECT 'users' as table_name, COUNT(*) as records FROM users
UNION ALL
SELECT 'orders', COUNT(*) FROM orders
UNION ALL
SELECT 'order_items', COUNT(*) FROM order_items
UNION ALL
SELECT 'comments', COUNT(*) FROM comments
UNION ALL
SELECT 'webhook_logs', COUNT(*) FROM webhook_logs;
