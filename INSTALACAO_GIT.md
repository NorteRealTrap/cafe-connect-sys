# Instalação do Git no Windows

## Opção 1: Instalador Oficial (Recomendado)

1. Acesse: https://git-scm.com/download/win
2. Baixe o instalador para Windows
3. Execute o instalador e siga as instruções (aceite as opções padrão)
4. Reinicie o terminal/PowerShell após a instalação

## Opção 2: Via Winget (Windows Package Manager)

Se você tiver o Winget instalado:

```powershell
winget install --id Git.Git -e --source winget
```

## Opção 3: Via Chocolatey

Se você tiver o Chocolatey instalado:

```powershell
choco install git
```

## Verificar Instalação

Após instalar, verifique se o Git foi instalado corretamente:

```bash
git --version
```

## Configuração Inicial

Após instalar o Git, configure seu nome e email:

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@exemplo.com"
```

## Próximos Passos

Depois de instalar o Git, você pode:

1. Inicializar o repositório neste projeto:
   ```bash
   git init
   git remote add origin https://github.com/NorteRealTrap/cafe-connect-sys.git
   ```

2. Ou clonar o repositório do GitHub:
   ```bash
   git clone https://github.com/NorteRealTrap/cafe-connect-sys.git
   cd cafe-connect-sys
   ```






