# 🤝 Guia de Contribuição - Cafe Connect Sys

## Bem-vindo!

Obrigado por considerar contribuir para o Cafe Connect Sys! Este documento fornece diretrizes para contribuir com o projeto.

## 📋 Índice

- [Código de Conduta](#código-de-conduta)
- [Como Contribuir](#como-contribuir)
- [Padrões de Código](#padrões-de-código)
- [Processo de Pull Request](#processo-de-pull-request)
- [Reportar Bugs](#reportar-bugs)
- [Sugerir Melhorias](#sugerir-melhorias)

## 📜 Código de Conduta

### Nossos Compromissos

- Ser respeitoso e inclusivo
- Aceitar críticas construtivas
- Focar no que é melhor para a comunidade
- Mostrar empatia com outros membros

### Comportamentos Inaceitáveis

- Linguagem ou imagens sexualizadas
- Trolling, insultos ou comentários depreciativos
- Assédio público ou privado
- Publicar informações privadas de terceiros

## 🚀 Como Contribuir

### 1. Fork o Repositório

```bash
# Clone seu fork
git clone https://github.com/seu-usuario/cafe-connect-sys.git
cd cafe-connect-sys

# Adicione o repositório original como upstream
git remote add upstream https://github.com/NorteRealTrap/cafe-connect-sys.git
```

### 2. Crie uma Branch

```bash
# Atualize sua main
git checkout main
git pull upstream main

# Crie uma branch para sua feature/fix
git checkout -b feature/nome-da-feature
# ou
git checkout -b fix/nome-do-bug
```

### 3. Faça suas Alterações

Siga os [Padrões de Código](#padrões-de-código) descritos abaixo.

### 4. Commit suas Mudanças

```bash
# Adicione os arquivos
git add .

# Commit com mensagem descritiva
git commit -m "feat: adiciona funcionalidade X"
```

### 5. Push para seu Fork

```bash
git push origin feature/nome-da-feature
```

### 6. Abra um Pull Request

Vá para o repositório original e clique em "New Pull Request".

## 💻 Padrões de Código

### TypeScript

```typescript
// ✅ BOM - Tipos explícitos
interface User {
  id: string;
  name: string;
  email: string;
}

const getUser = (id: string): User => {
  // implementação
};

// ❌ RUIM - Sem tipos
const getUser = (id) => {
  // implementação
};
```

### Componentes React

```typescript
// ✅ BOM - Functional component com tipos
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button = ({ label, onClick, variant = 'primary' }: ButtonProps) => {
  return (
    <button onClick={onClick} className={variant}>
      {label}
    </button>
  );
};

// ❌ RUIM - Sem tipos, class component
export class Button extends React.Component {
  render() {
    return <button>{this.props.label}</button>;
  }
}
```

### Nomenclatura

```typescript
// Componentes: PascalCase
export const OrdersPanel = () => {};

// Hooks: camelCase com prefixo 'use'
export const useOrders = () => {};

// Funções: camelCase
export const calculateTotal = () => {};

// Constantes: UPPER_SNAKE_CASE
export const MAX_ORDERS = 100;

// Interfaces: PascalCase
interface OrderData {}
```

### Imports

```typescript
// ✅ BOM - Ordem correta
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useOrders } from '@/hooks/useDatabase';
import { calculateTotal } from '@/lib/utils';

// ❌ RUIM - Desordenado
import { calculateTotal } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useOrders } from '@/hooks/useDatabase';
```

### Comentários

```typescript
// ✅ BOM - Comentários úteis
// Calcula o total considerando descontos e taxas
const calculateTotal = (items: Item[], discount: number) => {
  // implementação
};

// ❌ RUIM - Comentários óbvios
// Esta função soma os números
const sum = (a: number, b: number) => a + b;
```

## 🔄 Processo de Pull Request

### Checklist antes de Submeter

- [ ] Código segue os padrões do projeto
- [ ] Testes foram adicionados/atualizados
- [ ] Documentação foi atualizada
- [ ] Build passa sem erros (`npm run build`)
- [ ] Linter passa sem erros (`npm run lint`)
- [ ] Commits seguem o padrão Conventional Commits

### Padrão de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Features
git commit -m "feat: adiciona sistema de notificações"

# Bug fixes
git commit -m "fix: corrige cálculo de total no checkout"

# Documentação
git commit -m "docs: atualiza README com instruções de deploy"

# Refatoração
git commit -m "refactor: melhora performance do componente Orders"

# Testes
git commit -m "test: adiciona testes para OrdersPanel"

# Estilo
git commit -m "style: formata código com prettier"

# Chore
git commit -m "chore: atualiza dependências"
```

### Template de Pull Request

```markdown
## Descrição
Breve descrição das mudanças

## Tipo de Mudança
- [ ] Bug fix
- [ ] Nova feature
- [ ] Breaking change
- [ ] Documentação

## Como Testar
1. Passo 1
2. Passo 2
3. Passo 3

## Screenshots (se aplicável)
[Adicione screenshots aqui]

## Checklist
- [ ] Código segue os padrões
- [ ] Testes passam
- [ ] Documentação atualizada
```

## 🐛 Reportar Bugs

### Antes de Reportar

1. Verifique se o bug já foi reportado
2. Verifique se está usando a versão mais recente
3. Tente reproduzir o bug

### Template de Bug Report

```markdown
**Descrição do Bug**
Descrição clara e concisa do bug

**Como Reproduzir**
1. Vá para '...'
2. Clique em '...'
3. Role até '...'
4. Veja o erro

**Comportamento Esperado**
O que deveria acontecer

**Screenshots**
Se aplicável, adicione screenshots

**Ambiente**
- OS: [e.g. Windows 11]
- Browser: [e.g. Chrome 120]
- Versão: [e.g. 1.0.0]

**Contexto Adicional**
Qualquer outra informação relevante
```

## 💡 Sugerir Melhorias

### Template de Feature Request

```markdown
**A feature está relacionada a um problema?**
Descrição clara do problema

**Descreva a solução desejada**
Descrição clara da solução

**Descreva alternativas consideradas**
Outras soluções que você considerou

**Contexto Adicional**
Screenshots, mockups, etc.
```

## 🧪 Testes

### Executar Testes

```bash
# Executar todos os testes
npm test

# Executar testes em watch mode
npm test -- --watch

# Executar testes com coverage
npm test -- --coverage
```

### Escrever Testes

```typescript
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renderiza com label correto', () => {
    render(<Button label="Clique aqui" onClick={() => {}} />);
    expect(screen.getByText('Clique aqui')).toBeInTheDocument();
  });

  it('chama onClick quando clicado', () => {
    const handleClick = jest.fn();
    render(<Button label="Clique" onClick={handleClick} />);
    
    screen.getByText('Clique').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## 📚 Recursos

### Documentação
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)

### Ferramentas
- [VS Code](https://code.visualstudio.com/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)

## 🎯 Áreas que Precisam de Ajuda

### Alta Prioridade
- [ ] Implementar bcrypt para senhas
- [ ] Adicionar testes unitários
- [ ] Melhorar documentação da API
- [ ] Otimizar bundle size

### Média Prioridade
- [ ] Adicionar testes E2E
- [ ] Implementar PWA
- [ ] Melhorar acessibilidade
- [ ] Adicionar i18n

### Baixa Prioridade
- [ ] Melhorar UI/UX
- [ ] Adicionar animações
- [ ] Temas customizáveis
- [ ] Dark mode melhorado

## 💬 Comunicação

### Canais
- **Issues**: Para bugs e features
- **Discussions**: Para perguntas e ideias
- **Pull Requests**: Para contribuições de código

### Tempo de Resposta
- Issues: 1-3 dias úteis
- Pull Requests: 2-5 dias úteis
- Discussions: 1-7 dias úteis

## 🏆 Reconhecimento

Contribuidores serão listados no README.md e terão seus commits reconhecidos no histórico do projeto.

## 📝 Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a mesma licença do projeto.

---

**Obrigado por contribuir! 🎉**
