# 🚀 Deploy na Vercel - MultiPDV

## Pré-requisitos
- Conta na Vercel (https://vercel.com)
- Repositório Git (GitHub, GitLab ou Bitbucket)
- Banco de dados Neon configurado

## Passo 1: Preparar Repositório

```bash
# Já feito - commits realizados
git log --oneline
```

## Passo 2: Conectar com Vercel

### Opção A: Via CLI
```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer login
vercel login

# Deploy
vercel
```

### Opção B: Via Dashboard
1. Acesse https://vercel.com/new
2. Importe o repositório
3. Configure as variáveis de ambiente

## Passo 3: Configurar Variáveis de Ambiente

No dashboard da Vercel, adicione:

```
DATABASE_URL=postgresql://nooxdb_owner:npp_9y2Gj5Zk0yW@ep-steep-sound-adhiyc1w-pooler.c-2.us-east-1.aws.neon.tech/nooxdb?sslmode=require
DIRECT_URL=postgresql://nooxdb_owner:npp_9y2Gj5Zk0yW@ep-steep-sound-adhiyc1w.c-2.us-east-1.aws.neon.tech/nooxdb?sslmode=require
NEXTAUTH_URL=https://seu-dominio.vercel.app
NEXTAUTH_SECRET=multipdv_secret_key_2024_secure_random_string_for_auth
JWT_SECRET=jwt_secret_key_2024_secure_random_string_for_tokens
NODE_ENV=production
```

## Passo 4: Deploy Automático

Após configurar, cada push para a branch main fará deploy automático.

## Comandos Úteis

```bash
# Deploy de produção
vercel --prod

# Ver logs
vercel logs

# Ver domínios
vercel domains ls

# Adicionar domínio customizado
vercel domains add seu-dominio.com
```

## Credenciais de Teste

- **Admin**: admin@multipdv.com / admin123
- **Gerente**: gerente@multipdv.com / gerente123
- **Caixa**: caixa@multipdv.com / caixa123

## Troubleshooting

### Erro de Build
```bash
# Limpar cache
vercel --force

# Verificar logs
vercel logs --follow
```

### Erro de Banco
- Verificar se DATABASE_URL está correto
- Executar: `npx prisma db push` localmente primeiro
- Verificar conexão com Neon

### Erro de Autenticação
- Verificar NEXTAUTH_URL (deve ser HTTPS em produção)
- Gerar novo NEXTAUTH_SECRET se necessário
