# Instruções Rápidas - Configuração do Git

## ⚠️ IMPORTANTE: Instalar Git Primeiro

O Git ainda não está instalado no seu sistema. Siga estes passos:

### 1. Instalar Git

**Opção mais rápida:**
- Acesse: https://git-scm.com/download/win
- Baixe o instalador
- Execute e aceite as opções padrão
- **Reinicie o PowerShell** após a instalação

### 2. Configurar Git

Após instalar e reiniciar o PowerShell, execute:

```powershell
.\configurar-git.ps1
```

Ou configure manualmente:

```bash
git config --global user.name "GabrielSp14"
git config --global user.email "gbiel.sp@gmail.com"
```

### 3. Verificar Configuração

```bash
git config --global user.name
git config --global user.email
```

### 4. Inicializar Repositório (neste projeto)

```bash
git init
git remote add origin https://github.com/NorteRealTrap/cafe-connect-sys.git
git add .
git commit -m "Initial commit"
git branch -M main
git push -u origin main
```

### 5. Ou Clonar Repositório (criar nova pasta)

```bash
cd ..
git clone https://github.com/NorteRealTrap/cafe-connect-sys.git
cd cafe-connect-sys
```

---

## Status Atual

- ✅ Arquivos do projeto preparados
- ✅ `.gitignore` criado
- ✅ Scripts de configuração criados
- ⏳ **Aguardando instalação do Git**




