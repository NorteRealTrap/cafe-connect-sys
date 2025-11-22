# 🚀 Passo a Passo - Configuração de Deploy (3 Etapas)

Guia prático e detalhado para configurar o deploy automático na Vercel e GitHub.

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de que:

- [ ] Você tem uma conta no GitHub
- [ ] Você tem uma conta no Vercel (ou pode criar uma gratuita)
- [ ] O repositório está no GitHub
- [ ] Você tem acesso de administrador ao repositório

---

## ETAPA 1: Conectar Repositório na Vercel

### Passo 1.1: Acessar a Vercel

1. Abra seu navegador e acesse: **https://vercel.com**
2. Clique em **"Sign Up"** ou **"Log In"** (se já tiver conta)
3. **Escolha "Continue with GitHub"** para conectar sua conta GitHub

### Passo 1.2: Autorizar Acesso

1. Você será redirecionado para o GitHub
2. Clique em **"Authorize Vercel"** para permitir acesso aos seus repositórios
3. Você pode escolher dar acesso a todos os repositórios ou apenas específicos

### Passo 1.3: Importar Projeto

1. No dashboard da Vercel, clique no botão **"Add New..."** (canto superior direito)
2. Selecione **"Project"**
3. Na lista de repositórios, encontre e selecione: **`cafe-connect-sys-main`** (ou o nome do seu repositório)

### Passo 1.4: Configurar Framework e Build

Na tela de configuração do projeto, preencha:

#### **Framework Preset:**
- Selecione: **"Vite"** (ou deixe "Other" se Vite não aparecer)

#### **Root Directory:**
- Deixe como: **`./`** (raiz do projeto)

#### **Build and Output Settings:**
Clique em **"Override"** e configure:

- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

#### **Environment Variables:**
- Por enquanto, **pule esta parte** (vamos configurar na Etapa 2)

### Passo 1.5: Finalizar Importação

1. Clique em **"Deploy"** (botão no final da página)
2. Aguarde o primeiro deploy ser concluído (pode levar 2-5 minutos)
3. ✅ **Etapa 1 concluída!** O projeto foi importado na Vercel

---

## ETAPA 2: Configurar Variáveis de Ambiente

### Passo 2.1: Acessar Configurações do Projeto

1. No dashboard da Vercel, clique no seu projeto
2. Vá para a aba **"Settings"** (no topo)
3. No menu lateral esquerdo, clique em **"Environment Variables"**

### Passo 2.2: Adicionar Variáveis Obrigatórias

Adicione estas variáveis **uma por uma**:

#### **Variável 1: NODE_OPTIONS**
1. Clique em **"Add New"**
2. **Key:** `NODE_OPTIONS`
3. **Value:** `--max-old-space-size=4096`
4. Marque as opções:
   - ✅ **Production**
   - ✅ **Preview**
   - ✅ **Development**
5. Clique em **"Save"**

#### **Variável 2: NODE_ENV**
1. Clique em **"Add New"**
2. **Key:** `NODE_ENV`
3. **Value:** `production`
4. Marque as opções:
   - ✅ **Production**
   - ✅ **Preview**
5. Clique em **"Save"**

### Passo 2.3: Adicionar Variáveis da Aplicação (Opcionais)

**⚠️ IMPORTANTE:** Estas variáveis são necessárias apenas se você usar essas funcionalidades.

#### **Se você usa WhatsApp:**
- **Key:** `WHATSAPP_PHONE_NUMBER_ID`
- **Value:** (seu Phone Number ID do Meta)
- Marque: ✅ Production, ✅ Preview

- **Key:** `WHATSAPP_ACCESS_TOKEN`
- **Value:** (seu Access Token do Meta)
- Marque: ✅ Production, ✅ Preview

- **Key:** `WHATSAPP_WEBHOOK_TOKEN`
- **Value:** (um token secreto que você escolhe)
- Marque: ✅ Production, ✅ Preview

#### **Se você usa Instagram:**
- **Key:** `INSTAGRAM_PAGE_ID`
- **Value:** (seu Instagram Page ID)
- Marque: ✅ Production, ✅ Preview

- **Key:** `INSTAGRAM_ACCESS_TOKEN`
- **Value:** (seu Instagram Access Token)
- Marque: ✅ Production, ✅ Preview

#### **Se você usa JWT/Autenticação:**
- **Key:** `JWT_SECRET`
- **Value:** (gere um secret seguro - veja abaixo)
- Marque: ✅ Production, ✅ Preview

**Como gerar JWT_SECRET:**
```bash
# No terminal (Windows PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Ou use um gerador online: https://generate-secret.vercel.app/32
```

#### **Se você usa Database externa:**
- **Key:** `DATABASE_URL`
- **Value:** (sua URL de conexão do banco)
- Marque: ✅ Production, ✅ Preview

### Passo 2.4: Verificar Variáveis

Após adicionar todas, você deve ver uma lista como esta:

```
✅ NODE_OPTIONS = --max-old-space-size=4096
✅ NODE_ENV = production
✅ WHATSAPP_PHONE_NUMBER_ID = (seu valor)
✅ WHATSAPP_ACCESS_TOKEN = (seu valor)
... (outras variáveis)
```

### Passo 2.5: Fazer Novo Deploy

**⚠️ IMPORTANTE:** Após adicionar variáveis, você precisa fazer um novo deploy:

1. Vá para a aba **"Deployments"** (no topo)
2. Clique nos **3 pontos (...)** do último deploy
3. Selecione **"Redeploy"**
4. Aguarde o deploy concluir

✅ **Etapa 2 concluída!** Variáveis de ambiente configuradas.

---

## ETAPA 3: Habilitar Deploy Automático

### Passo 3.1: Acessar Configurações Git

1. No dashboard da Vercel, no seu projeto
2. Vá para **"Settings"** (no topo)
3. No menu lateral, clique em **"Git"**

### Passo 3.2: Verificar Configuração da Branch

Na seção **"Production Branch"**:

1. Verifique se está configurado: **`main`**
2. Se não estiver, clique em **"Edit"** e altere para `main`
3. Clique em **"Save"**

### Passo 3.3: Habilitar Auto-deploy

Na seção **"Auto-deploy"**:

1. Verifique se está **"Enabled"** (habilitado)
2. Se estiver "Disabled", clique no toggle para habilitar
3. ✅ Deve ficar verde/ativado

### Passo 3.4: Habilitar Preview Deployments

Na seção **"Preview Deployments"**:

1. Verifique se está **"Enabled"**
2. Se não estiver, habilite
3. Isso permite que cada Pull Request tenha seu próprio preview

### Passo 3.5: Verificar Integração GitHub

Na seção **"Connected Git Repository"**:

1. Deve mostrar: **`cafe-connect-sys-main`** (ou seu repositório)
2. Deve mostrar: **`github.com/[seu-usuario]/[seu-repositorio]`**
3. Se não estiver conectado, clique em **"Connect Git Repository"** e selecione

✅ **Etapa 3 concluída!** Deploy automático habilitado.

---

## ✅ Testar o Deploy Automático

Agora vamos testar se tudo está funcionando:

### Passo 4.1: Fazer uma Alteração

1. No seu projeto local, faça uma pequena alteração (ex: adicione um comentário em um arquivo)
2. Salve o arquivo

### Passo 4.2: Fazer Commit e Push

Abra o terminal no diretório do projeto e execute:

```bash
# Verificar status
git status

# Adicionar alterações
git add .

# Fazer commit
git commit -m "test: verificar deploy automático"

# Fazer push para main
git push origin main
```

### Passo 4.3: Verificar Deploy na Vercel

1. Acesse o dashboard da Vercel
2. Vá para o seu projeto
3. Na aba **"Deployments"**, você deve ver um novo deploy sendo criado automaticamente
4. Aguarde alguns minutos até o status ficar **"Ready"** (verde)

✅ **Se aparecer um novo deploy automaticamente, está funcionando!**

---

## 🔍 Verificar se Está Tudo Configurado

Use este checklist:

### Vercel
- [ ] Projeto importado na Vercel
- [ ] Framework: Vite
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] Variável `NODE_OPTIONS` configurada
- [ ] Variável `NODE_ENV` configurada
- [ ] Outras variáveis necessárias configuradas
- [ ] Production Branch: `main`
- [ ] Auto-deploy: Enabled
- [ ] Preview Deployments: Enabled
- [ ] Repositório GitHub conectado

### GitHub
- [ ] Repositório existe no GitHub
- [ ] Branch `main` existe
- [ ] Você tem permissão de push

### Teste
- [ ] Push para `main` aciona deploy automático
- [ ] Deploy é concluído com sucesso
- [ ] Aplicação funciona no domínio da Vercel

---

## 🆘 Problemas Comuns e Soluções

### Problema: "Deploy não é acionado automaticamente"

**Solução:**
1. Verifique se o repositório está conectado em Settings → Git
2. Verifique se Auto-deploy está habilitado
3. Verifique se você fez push para a branch `main`
4. Verifique os logs de integração na Vercel

### Problema: "Build falha"

**Solução:**
1. Teste o build localmente: `npm run build`
2. Verifique se todas as dependências estão no `package.json`
3. Verifique os logs do deploy na Vercel
4. Verifique se `NODE_OPTIONS` está configurado

### Problema: "Variáveis de ambiente não funcionam"

**Solução:**
1. Verifique se as variáveis estão configuradas no painel da Vercel
2. Verifique se estão marcadas para Production/Preview
3. Faça um novo deploy após adicionar variáveis
4. Variáveis que começam com `VITE_` são expostas no frontend

### Problema: "Não consigo conectar o repositório"

**Solução:**
1. Verifique se você autorizou a Vercel no GitHub
2. Verifique se você tem permissão de administrador no repositório
3. Tente desconectar e reconectar o repositório

---

## 📞 Próximos Passos

Após configurar tudo:

1. ✅ Faça um teste completo fazendo push para `main`
2. ✅ Verifique se o deploy foi acionado automaticamente
3. ✅ Acesse o link de produção fornecido pela Vercel
4. ✅ Configure domínio customizado (opcional) - veja `DOMINIOS_CUSTOMIZADOS.md`

---

## 🎉 Pronto!

Agora seu projeto está configurado para fazer deploy automático. Toda vez que você fizer push para `main`, a Vercel fará o deploy automaticamente!

**Comandos úteis:**
```bash
# Deploy manual (se necessário)
npm run deploy

# Ver logs
npm run deploy:logs

# Ver status
vercel list
```

---

**Última atualização:** 2024
