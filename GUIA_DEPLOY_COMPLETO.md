# 🚀 Guia Completo de Deploy - Vercel e GitHub

Este guia explica todas as configurações necessárias para fazer deploy automático das alterações na Vercel e GitHub.

## 📋 Índice

1. [Configuração Inicial do GitHub](#1-configuração-inicial-do-github)
2. [Configuração da Vercel](#2-configuração-da-vercel)
3. [Variáveis de Ambiente](#3-variáveis-de-ambiente)
4. [Fluxo de Deploy Automático](#4-fluxo-de-deploy-automático)
5. [Deploy Manual](#5-deploy-manual)
6. [Troubleshooting](#6-troubleshooting)

---

## 1. Configuração Inicial do GitHub

### 1.1. Verificar Repositório

Certifique-se de que o repositório está no GitHub:

```bash
# Verificar remote
git remote -v

# Se não estiver configurado, adicione:
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
```

### 1.2. Estrutura de Branches

O projeto está configurado para fazer deploy automático da branch `main`:

```bash
# Verificar branch atual
git branch

# Se estiver em outra branch, mude para main
git checkout main

# Ou crie a branch main se não existir
git checkout -b main
```

### 1.3. Configuração do Git

```bash
# Configurar usuário (se ainda não configurado)
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@exemplo.com"
```

---

## 2. Configuração da Vercel

### 2.1. Criar Conta e Conectar GitHub

1. Acesse [https://vercel.com](https://vercel.com)
2. Faça login com sua conta GitHub
3. Autorize a Vercel a acessar seus repositórios

### 2.2. Importar Projeto

1. No dashboard da Vercel, clique em **"Add New Project"**
2. Selecione o repositório: `cafe-connect-sys-main` (ou seu repositório)
3. Configure as seguintes opções:

   **Framework Preset:** `Vite`
   
   **Root Directory:** `./` (raiz do projeto)
   
   **Build Command:** `npm run build`
   
   **Output Directory:** `dist`
   
   **Install Command:** `npm install`

### 2.3. Configurar Deploy Automático

No painel do projeto na Vercel:

1. Vá em **Settings → Git**
2. Configure:
   - ✅ **Production Branch:** `main`
   - ✅ **Auto-deploy:** Enabled
   - ✅ **Preview Deployments:** Enabled (para PRs)

### 2.4. Verificar Configuração do vercel.json

O arquivo `vercel.json` já está configurado corretamente:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "github": {
    "enabled": true,
    "autoAlias": true,
    "silent": false
  },
  "build": {
    "env": {
      "NODE_OPTIONS": "--max-old-space-size=4096",
      "NODE_ENV": "production"
    }
  },
  "functions": {
    "api/**/*.{js,ts}": {
      "memory": 1024,
      "maxDuration": 10
    }
  }
}
```

**✅ Não é necessário alterar este arquivo.**

---

## 3. Variáveis de Ambiente

### 3.1. Configurar na Vercel

No painel da Vercel, vá em **Settings → Environment Variables** e adicione:

#### Variáveis Obrigatórias

```env
NODE_OPTIONS=--max-old-space-size=4096
NODE_ENV=production
```

#### Variáveis da Aplicação (se aplicável)

```env
# WhatsApp API (se usar)
WHATSAPP_PHONE_NUMBER_ID=seu_phone_number_id
WHATSAPP_ACCESS_TOKEN=seu_access_token
WHATSAPP_WEBHOOK_TOKEN=seu_verify_token

# Instagram API (se usar)
INSTAGRAM_PAGE_ID=seu_page_id
INSTAGRAM_ACCESS_TOKEN=seu_access_token

# Database (se usar)
DATABASE_URL=sua_database_url

# JWT (se usar)
JWT_SECRET=seu_jwt_secret
```

### 3.2. Configurar Ambientes

Para cada variável, você pode escolher:
- ✅ **Production** (produção)
- ✅ **Preview** (preview/PRs)
- ✅ **Development** (desenvolvimento)

**Recomendação:** Configure todas para Production e Preview.

### 3.3. Variáveis no GitHub (Opcional)

Se você usar GitHub Actions para CI/CD, configure secrets em:

**GitHub → Settings → Secrets and variables → Actions**

```
NODE_OPTIONS=--max-old-space-size=4096
```

**Nota:** Para deploy automático via Vercel, não é necessário configurar secrets no GitHub.

---

## 4. Fluxo de Deploy Automático

### 4.1. Como Funciona

1. **Você faz push para `main`:**
   ```bash
   git add .
   git commit -m "Sua mensagem de commit"
   git push origin main
   ```

2. **Vercel detecta automaticamente** o push

3. **Vercel faz build e deploy** automaticamente

4. **Você recebe notificação** por email (se configurado)

### 4.2. Verificar Status do Deploy

- **Dashboard Vercel:** https://vercel.com/dashboard
- **Deployments:** https://vercel.com/[seu-projeto]/deployments
- **Logs em tempo real:** Disponível no dashboard durante o deploy

### 4.3. Preview Deployments

Toda vez que você criar um Pull Request:
- A Vercel cria automaticamente um preview deployment
- Você recebe um link único para testar as alterações
- O preview é destruído quando o PR é fechado

---

## 5. Deploy Manual

### 5.1. Usando Vercel CLI

#### Instalar Vercel CLI

```bash
npm install -g vercel
```

#### Login

```bash
vercel login
```

#### Deploy

```bash
# Deploy para preview
vercel

# Deploy para produção
vercel --prod

# Deploy forçado (ignora cache)
vercel --prod --force
```

### 5.2. Usando Scripts NPM

O projeto já tem scripts configurados no `package.json`:

```bash
# Deploy forçado para produção
npm run deploy

# Deploy com logs
npm run deploy:debug

# Ver logs dos últimos 5 minutos
npm run deploy:logs
```

### 5.3. Scripts Windows/Linux

#### Windows

```cmd
# Deploy forçado
scripts\deploy.bat

# Ver logs
scripts\logs.bat
```

#### Linux/Mac

```bash
# Deploy forçado
bash scripts/deploy.sh
```

---

## 6. Troubleshooting

### 6.1. Deploy Falha no Build

**Problema:** Build falha na Vercel

**Soluções:**
1. Verifique os logs no dashboard da Vercel
2. Teste o build localmente:
   ```bash
   npm run build
   ```
3. Verifique se todas as dependências estão no `package.json`
4. Verifique se `NODE_OPTIONS` está configurado

### 6.2. Variáveis de Ambiente Não Funcionam

**Problema:** Variáveis não estão disponíveis no build

**Soluções:**
1. Verifique se as variáveis estão configuradas no painel da Vercel
2. Verifique se estão marcadas para o ambiente correto (Production/Preview)
3. Faça um novo deploy após adicionar variáveis
4. Variáveis que começam com `VITE_` são expostas no frontend

### 6.3. Erro 404 em Rotas

**Problema:** Rotas retornam 404 após deploy

**Solução:** O `vercel.json` já está configurado com rewrites. Se ainda houver problema, verifique se o arquivo existe e está correto.

### 6.4. Deploy Não é Acionado Automaticamente

**Problema:** Push para `main` não aciona deploy

**Soluções:**
1. Verifique se o repositório está conectado na Vercel
2. Verifique se a branch `main` está configurada como Production Branch
3. Verifique se Auto-deploy está habilitado
4. Verifique os logs de integração no painel da Vercel

### 6.5. Ver Logs Detalhados

```bash
# Via CLI
vercel logs --follow

# Últimos 5 minutos
vercel logs --since=5m

# Filtrar erros (Windows)
vercel logs | findstr /i "error"

# Filtrar erros (Linux/Mac)
vercel logs | grep -i "error"
```

### 6.6. Limpar Cache e Fazer Deploy Limpo

```bash
# Deploy forçado (ignora cache)
vercel --prod --force

# Ou via npm
npm run deploy
```

---

## 7. Checklist de Configuração

Use este checklist para garantir que tudo está configurado:

### GitHub
- [ ] Repositório criado no GitHub
- [ ] Branch `main` existe e está atualizada
- [ ] Remote configurado corretamente
- [ ] Permissões de push configuradas

### Vercel
- [ ] Conta Vercel criada e conectada ao GitHub
- [ ] Projeto importado na Vercel
- [ ] Framework Preset: Vite
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] Production Branch: `main`
- [ ] Auto-deploy: Enabled
- [ ] Preview Deployments: Enabled

### Variáveis de Ambiente
- [ ] `NODE_OPTIONS=--max-old-space-size=4096` configurado
- [ ] `NODE_ENV=production` configurado
- [ ] Outras variáveis necessárias configuradas
- [ ] Variáveis marcadas para Production e Preview

### Teste
- [ ] Build local funciona: `npm run build`
- [ ] Push para `main` aciona deploy automático
- [ ] Deploy é concluído com sucesso
- [ ] Aplicação funciona no domínio da Vercel

---

## 8. Comandos Úteis

### Git

```bash
# Status
git status

# Adicionar alterações
git add .

# Commit
git commit -m "Descrição das alterações"

# Push para main (aciona deploy automático)
git push origin main

# Ver histórico
git log --oneline
```

### Vercel CLI

```bash
# Login
vercel login

# Deploy preview
vercel

# Deploy produção
vercel --prod

# Deploy forçado
vercel --prod --force

# Ver logs
vercel logs --follow

# Listar projetos
vercel list

# Ver variáveis de ambiente
vercel env ls

# Ver limites
vercel limits
```

### NPM

```bash
# Instalar dependências
npm install

# Build local
npm run build

# Preview local
npm run preview

# Deploy
npm run deploy

# Ver logs
npm run deploy:logs
```

---

## 9. Próximos Passos

Após configurar tudo:

1. ✅ Faça um teste: faça uma pequena alteração e faça push
2. ✅ Verifique se o deploy foi acionado automaticamente
3. ✅ Acesse o link de produção fornecido pela Vercel
4. ✅ Configure domínio customizado (opcional) - veja `DOMINIOS_CUSTOMIZADOS.md`

---

## 📚 Documentação Adicional

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

## 🆘 Suporte

Se encontrar problemas:

1. Verifique os logs no dashboard da Vercel
2. Teste o build localmente
3. Consulte a documentação da Vercel
4. Verifique se todas as variáveis de ambiente estão configuradas

---

**Última atualização:** 2024
