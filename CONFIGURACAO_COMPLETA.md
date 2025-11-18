# ✅ Configuração do Git - Status

## ⚠️ Situação Atual

O Git **não está instalado** no seu sistema. Os comandos de configuração não puderam ser executados.

## 📋 Configurações Preparadas

As seguintes configurações estão prontas para serem aplicadas:

- **Nome de usuário:** `GabrielSp14`
- **Email:** `gbiel.sp@gmail.com`

## 🚀 Como Concluir a Configuração

### Opção 1: Instalação Manual (Recomendado)

1. **Instalar Git:**
   - Acesse: https://git-scm.com/download/win
   - Baixe o instalador
   - Execute e aceite as opções padrão
   - **IMPORTANTE:** Reinicie o PowerShell após a instalação

2. **Configurar Git:**
   ```powershell
   git config --global user.name "GabrielSp14"
   git config --global user.email "gbiel.sp@gmail.com"
   ```

3. **Verificar configuração:**
   ```powershell
   git config --global user.name
   git config --global user.email
   ```

### Opção 2: Usar Script Automatizado

Após instalar o Git e reiniciar o PowerShell:

```powershell
.\configurar-git.ps1
```

Este script irá:
- ✅ Verificar se o Git está instalado
- ✅ Configurar nome: `GabrielSp14`
- ✅ Configurar email: `gbiel.sp@gmail.com`
- ✅ Mostrar as configurações aplicadas

## 📝 Próximos Passos Após Configurar

### Inicializar Repositório Neste Projeto

```bash
git init
git remote add origin https://github.com/NorteRealTrap/cafe-connect-sys.git
git add .
git commit -m "Initial commit"
git branch -M main
git push -u origin main
```

### Ou Clonar o Repositório

```bash
cd ..
git clone https://github.com/NorteRealTrap/cafe-connect-sys.git
cd cafe-connect-sys
```

## 📁 Arquivos Criados

- ✅ `.gitignore` - Arquivos a serem ignorados pelo Git
- ✅ `configurar-git.ps1` - Script de configuração automática
- ✅ `setup-git.ps1` - Script de setup completo
- ✅ `README.md` - Documentação principal
- ✅ `INSTALACAO_GIT.md` - Guia de instalação
- ✅ `git-config.txt` - Comandos de configuração

---

**Status:** ⏳ Aguardando instalação do Git para concluir configuração




