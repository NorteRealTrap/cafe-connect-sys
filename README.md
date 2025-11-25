# 🏪 MultiPDV - Sistema Multi-Estabelecimentos

Sistema completo de PDV para gerenciar múltiplos tipos de estabelecimentos: padarias, lanchonetes, bares, adegas, confeitarias, restaurantes, bistrôs e muito mais.

## 🚀 Funcionalidades

### ✅ Multi-Estabelecimentos
- Suporte para 10+ tipos de estabelecimentos
- Gestão centralizada de múltiplas unidades
- Configurações específicas por estabelecimento

### ✅ Pedidos Completos
- **Pedidos Locais**: Atendimento presencial com mesas
- **Pedidos Web**: Recebimento online de clientes
- **Delivery**: Gestão de entregas
- **Takeaway**: Pedidos para retirada

### ✅ Controle de Estoque
- Movimentação automática de estoque
- Alertas de estoque baixo
- Histórico completo de movimentações
- Ajustes manuais com auditoria

### ✅ Sistema de Impressão
- Cupons térmicos
- Impressão para cozinha/bar
- Comprovantes fiscais
- Múltiplas impressoras por estabelecimento

### ✅ Gestão Completa
- Usuários com diferentes permissões
- Relatórios e analytics
- Controle de mesas
- Múltiplas formas de pagamento

## 🛠️ Tecnologias

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Auth**: NextAuth.js
- **UI**: Tailwind CSS + shadcn/ui
- **Language**: TypeScript

## 📦 Instalação

### 1. Clone o repositório
```bash
git clone <repository-url>
cd cafe-connect-sys-main
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o banco de dados
```bash
# Copie o arquivo de ambiente
cp .env.example .env

# Configure suas variáveis no .env
# DATABASE_URL e DIRECT_URL com suas credenciais do Neon
```

### 4. Execute as migrações
```bash
npx prisma db push
npx prisma generate
```

### 5. Popule o banco com dados iniciais
```bash
npm run db:seed
```

### 6. Inicie o servidor
```bash
npm run dev
```

## 🔑 Credenciais de Teste

Após executar o seed, use estas credenciais:

- **Admin**: admin@multipdv.com / admin123
- **Gerente**: gerente@multipdv.com / gerente123  
- **Caixa**: caixa@multipdv.com / caixa123

## 🏪 Estabelecimentos Criados

O seed cria 5 estabelecimentos de exemplo:

1. **Padaria Pão Quente** (BAKERY)
2. **Lanchonete Sabor & Arte** (COFFEE_SHOP)
3. **Bar do Zé** (BAR)
4. **Adega Vinhos Finos** (WINE_SHOP)
5. **Confeitaria Doce Sabor** (CONFECTIONERY)

## 📊 Estrutura do Banco

### Principais Tabelas
- `establishments` - Estabelecimentos
- `users` - Usuários do sistema
- `establishment_users` - Relacionamento usuário-estabelecimento
- `products` - Produtos/cardápio
- `categories` - Categorias de produtos
- `orders` - Pedidos
- `order_items` - Itens dos pedidos
- `tables` - Mesas dos estabelecimentos
- `payments` - Pagamentos
- `stock_movements` - Movimentações de estoque
- `web_orders` - Pedidos web/delivery
- `print_configs` - Configurações de impressão

## 🔧 Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run lint         # Análise de código
npm run db:generate  # Gerar Prisma Client
npm run db:push      # Aplicar schema ao banco
npm run db:studio    # Abrir Prisma Studio
npm run db:seed      # Popular banco com dados
npm run db:reset     # Resetar e popular banco
```

## 🌐 Deploy

### Vercel
1. Conecte seu repositório no Vercel
2. Configure as variáveis de ambiente:
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
3. Deploy automático!

## 📱 Funcionalidades por Tipo de Estabelecimento

### Padarias
- Controle de pães e produtos de panificação
- Gestão de estoque de ingredientes
- Vendas por peso e unidade

### Lanchonetes/Coffee Shops
- Cardápio de lanches e bebidas
- Controle de mesas
- Pedidos para viagem

### Bares
- Gestão de bebidas alcoólicas
- Controle de comandas
- Petiscos e porções

### Adegas
- Catálogo de vinhos
- Controle de safras e fornecedores
- Vendas especializadas

### Confeitarias
- Produtos doces e salgados finos
- Encomendas especiais
- Controle de ingredientes especiais

### Restaurantes/Bistrôs
- Cardápio completo
- Gestão de mesas e reservas
- Controle de cozinha

## 🔒 Segurança

- Autenticação JWT com NextAuth
- Middleware de proteção de rotas
- Criptografia de senhas com bcrypt
- Headers de segurança HTTP
- Validação de dados com Zod

## 📈 Performance

- Server-side rendering com Next.js
- Otimização de imagens
- Lazy loading de componentes
- Cache de dados com React Query

## 🆘 Suporte

Para dúvidas e suporte:
1. Verifique a documentação
2. Consulte os logs de erro
3. Execute `npm run db:studio` para verificar dados

## 📄 Licença

Sistema proprietário - Todos os direitos reservados.

---

**Versão**: 2.0.0  
**Última atualização**: 2024