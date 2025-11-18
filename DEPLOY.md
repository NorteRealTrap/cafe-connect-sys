# Deploy na Vercel - Café Connect Sys

## Passos para Deploy

### 1. Preparar o Repositório
```bash
git add .
git commit -m "Preparar para deploy na Vercel"
git push origin main
```

### 2. Deploy na Vercel

#### Opção A: Via CLI (Recomendado)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer login
vercel login

# Deploy
vercel --prod
```

#### Opção B: Via Interface Web
1. Acesse [vercel.com](https://vercel.com)
2. Conecte com GitHub
3. Importe o repositório `cafe-connect-sys`
4. Configure:
   - Framework Preset: **Other**
   - Root Directory: `./` (raiz)
   - Build Command: (deixar vazio)
   - Output Directory: `./` (raiz)

### 3. Configurações Automáticas
- ✅ `vercel.json` configurado
- ✅ `package.json` criado
- ✅ Roteamento SPA configurado
- ✅ Assets organizados

### 4. URL Final
Após o deploy: `https://cafe-connect-sys.vercel.app`

## Atualizações Futuras
Qualquer push para `main` fará deploy automático.