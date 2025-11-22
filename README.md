# Café Connect Sys

## ⚠️ Pré-requisito: Instalar Git

Se o Git não estiver instalado no seu sistema, consulte o arquivo [INSTALACAO_GIT.md](INSTALACAO_GIT.md) para instruções de instalação.

## Configuração Inicial

### 1. Aceitar Convite

Verifique email → Aceitar convite do GitHub

Ou acesse: https://github.com/NorteRealTrap/cafe-connect-sys

### 2. Clonar o Repositório

```bash
git clone https://github.com/NorteRealTrap/cafe-connect-sys.git
cd cafe-connect-sys
```

### 3. Configurar Git (apenas primeira vez)

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@exemplo.com"
```

### 4. Setup do projeto

```bash
# Executar script de setup (opcional)
npm run setup

# Instalar dependências
npm i

# Iniciar o servidor de desenvolvimento
npm run dev
```

## Security Setup

IMPORTANTE: Antes de publicar em produção:

1. Execute o script de setup: npm run setup
2. Atualize o arquivo .env com credenciais seguras
3. Revise SECURITY.md (checklist completo de segurança)
4. Altere senhas padrão em produção
5. Configure JWT_SECRET com um valor aleatório e forte

Credenciais de desenvolvimento padrão:
- Admin: admin@system.local
- Caixa: caixa@system.local  
- Atendente: atendente@system.local
- Senha: ver VITE_DEFAULT_PASSWORD no .env

## Tecnologias utilizadas

### Frontend
- Vite 5.0
- React 18.2
- TypeScript 5.2
- shadcn-ui
- Tailwind CSS 3.3
- React Router 6.20
- TanStack Query 5.8
- Recharts 2.8

### Backend
- Vercel Serverless Functions
- Node.js

### Integrações
- WhatsApp Business API
- Instagram API
- Neon Database (PostgreSQL)

## Deploy

Este projeto é deployado na Vercel.

### Variáveis de Ambiente (Vercel)

Configure no painel da Vercel:

```env
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_ACCESS_TOKEN=
WEBHOOK_VERIFY_TOKEN=
INSTAGRAM_PAGE_ID=
INSTAGRAM_ACCESS_TOKEN=
DATABASE_URL=
```

## Fluxo de Trabalho Diário

### Antes de fazer alterações:

```bash
git pull origin main
```

### Criar uma branch para sua feature:

```bash
git checkout -b minha-feature
```

### Fazer alterações e commitar:

```bash
# Faça suas alterações nos arquivos...
git add .
git commit -m "Descrição clara das alterações"
git push origin minha-feature
```

## Criar Pull Request

1. Vá no GitHub → Seu repositório
2. Clique em "Compare & pull request"
3. Descreva suas alterações
4. Marque @NorteRealTrap para revisão

## Comandos Importantes

### Ver status atual:
```bash
git status
```

### Ver diferenças:
```bash
git diff
```

### Atualizar com changes do repositório:
```bash
git pull origin main
```

### Listar branches:
```bash
git branch
```

### Mudar para branch main:
```bash
git checkout main
```

## Serverless Functions

Localizadas no diretório /api:
- /api/orders - Order management
- /api/status - Order status sync
- /api/auth - Authentication (JWT)
- /api/verify-token - Token verification
- /api/webhook - WhatsApp/Instagram webhooks

## Documentação

- Security Checklist: ./SECURITY_CHECKLIST.md
- Performance Optimization: ./PERFORMANCE_OPTIMIZATION.md
- Development Guidelines: ./.amazonq/rules/memory-bank/guidelines.md
- Project Structure: ./.amazonq/rules/memory-bank/structure.md
- Tech Stack: ./.amazonq/rules/memory-bank/tech.md

## Recursos

### Funcionalidades
- Processamento de pedidos em tempo real
- Painel operacional e financeiro
- Integrações WhatsApp/Instagram
- Gestão de mesas, estoque e pagamentos

### Desenvolvimento

Scripts disponíveis:

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run deploy
```

### Estrutura do Projeto

```
cafe-connect-sys/
├── src/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   └── main.tsx
├── api/
│   ├── auth.ts
│   ├── orders.ts
│   └── webhook.ts
└── public/
```

## Segurança

Implementado:
- JWT (backend)
- Rate limiting
- Sanitização de entrada
- Variáveis de ambiente
- HTTPS enforcement

Pendente:
- bcrypt hashing
- CSRF
- Audit logging
- CSP
