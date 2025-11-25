# 🚀 Comandos Rápidos - Deploy Vercel

## ⚡ Commit e Push (Execute Agora!)

```bash
# Adicionar todos os arquivos
git add .

# Criar commit
git commit -m "fix: adicionar 'use client' em componentes interativos e criar theme-provider"

# Enviar para repositório
git push origin main
```

---

## 📦 Após Deploy na Vercel

### Configurar Banco de Dados
```bash
# Sincronizar schema com o banco
npx prisma db push

# Popular dados iniciais
npx prisma db seed
```

---

## 🔍 Verificar Status

### Build Local
```bash
npm run build
```

### Desenvolvimento Local
```bash
npm run dev
```

### Prisma Studio (Visualizar Banco)
```bash
npx prisma studio
```

---

## 🌐 URLs Importantes

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Seu Projeto:** https://seu-projeto.vercel.app
- **Neon Database:** https://console.neon.tech

---

## 🔑 Credenciais de Teste

```
Admin:
  Email: admin@multipdv.com
  Senha: admin123

Gerente:
  Email: gerente@multipdv.com
  Senha: gerente123

Caixa:
  Email: caixa@multipdv.com
  Senha: caixa123
```

---

## 🛠️ Troubleshooting Rápido

### Build falha localmente
```bash
# Limpar cache
rmdir /s /q .next
rmdir /s /q node_modules\.cache

# Reinstalar dependências
npm install

# Gerar Prisma Client
npx prisma generate

# Tentar build novamente
npm run build
```

### Deploy falha na Vercel
1. Verifique variáveis de ambiente na Vercel
2. Verifique logs do deployment
3. Certifique-se que `DATABASE_URL` e `NEXTAUTH_SECRET` estão configurados

### Erro de conexão com banco
```bash
# Testar conexão
npx prisma db push

# Se falhar, verifique:
# - DATABASE_URL no .env
# - DIRECT_URL no .env
# - Conexão com Neon Database
```

---

## 📋 Checklist Rápido

Antes de fazer commit:
- [ ] `npm run build` funciona sem erros
- [ ] Todas as páginas carregam localmente
- [ ] Variáveis de ambiente configuradas

Após deploy:
- [ ] Site acessível na URL da Vercel
- [ ] Login funciona
- [ ] Dashboard carrega
- [ ] Banco de dados populado

---

## 🎯 Próximo Passo AGORA

Execute este comando para fazer o commit:

```bash
git add . && git commit -m "fix: adicionar 'use client' em componentes interativos e criar theme-provider" && git push origin main
```

Depois aguarde 2-5 minutos e acesse a Vercel para ver o deploy! 🚀
