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
2. Clique em **"Compare & pull request"**
3. Descreva suas alterações
4. Marque **@NorteRealTrap** para revisão

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

## Configurações Recomendadas

### Proteger a Branch Main (Opcional)

**Settings → Branches → Add branch protection rule**

- ✓ Require pull request reviews before merging
- ✓ Require status checks to pass

### Criar Issues para Organizar Tarefas

1. Vá em **Issues → New issue**
2. Atribua para colegas específicos
3. Use labels como "bug", "enhancement", "help wanted"

## Links Úteis

- [Repositório no GitHub](https://github.com/NorteRealTrap/cafe-connect-sys)

