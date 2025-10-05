# 🏢 Sistema Multi-Tenant com Domínios Customizados

## 🎯 Objetivo

Permitir que cada empresa/usuário use seu **próprio domínio** no sistema, sem precisar registrar na Vercel.

**Exemplo:**
- Empresa A: `restauranteabc.com.br`
- Empresa B: `cafexyz.com`
- Empresa C: `lanchonete123.com.br`

Todos usando o **mesmo sistema**, mas com domínios diferentes.

---

## 🏗️ Arquitetura da Solução

### Opção 1: Subdomínios Dinâmicos (Mais Simples)

Cada empresa recebe um subdomínio:

```
empresa-a.cafeconnect.app
empresa-b.cafeconnect.app
empresa-c.cafeconnect.app
```

**Vantagens:**
- ✅ Configuração automática
- ✅ SSL automático
- ✅ Sem custo adicional
- ✅ Fácil de gerenciar

**Desvantagens:**
- ❌ Não é domínio próprio da empresa

---

### Opção 2: CNAME com Domínio Próprio (Recomendado)

Cada empresa aponta seu domínio para o sistema:

```
restauranteabc.com.br → CNAME → empresa-a.cafeconnect.app
cafexyz.com           → CNAME → empresa-b.cafeconnect.app
```

**Vantagens:**
- ✅ Domínio próprio da empresa
- ✅ SSL automático (Vercel)
- ✅ Branding personalizado
- ✅ Profissional

**Desvantagens:**
- ⚠️ Empresa precisa configurar DNS
- ⚠️ Precisa adicionar domínio na Vercel

---

### Opção 3: Proxy Reverso (Avançado)

Sistema detecta domínio e roteia automaticamente:

```
restauranteabc.com.br → Cloudflare → Vercel → Empresa A
cafexyz.com           → Cloudflare → Vercel → Empresa B
```

**Vantagens:**
- ✅ Totalmente automático
- ✅ SSL gerenciado
- ✅ Cache e proteção DDoS
- ✅ Sem limite de domínios

**Desvantagens:**
- ⚠️ Requer Cloudflare Workers
- ⚠️ Configuração mais complexa

---

## 🚀 Implementação Recomendada

### Passo 1: Sistema de Identificação por Domínio

```typescript
// src/lib/tenant-resolver.ts
export const getTenantFromDomain = (hostname: string) => {
  // Remover porta se houver
  const domain = hostname.split(':')[0];
  
  // Verificar se é subdomínio do sistema
  if (domain.endsWith('.cafeconnect.app')) {
    const subdomain = domain.split('.')[0];
    return { type: 'subdomain', tenantId: subdomain };
  }
  
  // Verificar se é domínio customizado
  const tenants = JSON.parse(localStorage.getItem('custom-domains') || '{}');
  const tenantId = tenants[domain];
  
  if (tenantId) {
    return { type: 'custom', tenantId };
  }
  
  // Domínio padrão
  return { type: 'default', tenantId: 'demo' };
};

// Usar no App
export const getCurrentTenant = () => {
  if (typeof window === 'undefined') return null;
  return getTenantFromDomain(window.location.hostname);
};
```

### Passo 2: Painel de Configuração de Domínio

```typescript
// src/components/settings/DomainSettings.tsx
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const DomainSettings = ({ tenantId }: { tenantId: string }) => {
  const [customDomain, setCustomDomain] = useState('');
  const subdomain = `${tenantId}.cafeconnect.app`;

  const handleAddDomain = () => {
    // Salvar domínio customizado
    const domains = JSON.parse(localStorage.getItem('custom-domains') || '{}');
    domains[customDomain] = tenantId;
    localStorage.setItem('custom-domains', JSON.stringify(domains));
    
    toast.success('Domínio adicionado! Configure o DNS.');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuração de Domínio</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="font-medium">Seu Subdomínio (Gratuito)</label>
          <div className="flex gap-2 mt-2">
            <Input value={subdomain} readOnly />
            <Button onClick={() => {
              navigator.clipboard.writeText(`https://${subdomain}`);
              toast.success('Link copiado!');
            }}>
              Copiar
            </Button>
          </div>
        </div>

        <div>
          <label className="font-medium">Domínio Customizado (Opcional)</label>
          <Input
            placeholder="meurestaurante.com.br"
            value={customDomain}
            onChange={(e) => setCustomDomain(e.target.value)}
            className="mt-2"
          />
          <Button onClick={handleAddDomain} className="mt-2">
            Adicionar Domínio
          </Button>
        </div>

        <div className="bg-blue-50 p-4 rounded text-sm">
          <p className="font-medium mb-2">📋 Instruções DNS:</p>
          <p>1. Acesse o painel do seu domínio</p>
          <p>2. Adicione um registro CNAME:</p>
          <code className="block bg-white p-2 mt-2 rounded">
            Tipo: CNAME<br/>
            Nome: @ ou www<br/>
            Valor: {subdomain}
          </code>
          <p className="mt-2">3. Aguarde propagação (até 48h)</p>
        </div>
      </CardContent>
    </Card>
  );
};
```

### Passo 3: Middleware de Roteamento

```typescript
// src/middleware/tenant-middleware.ts
import { getCurrentTenant } from '@/lib/tenant-resolver';

export const initializeTenant = () => {
  const tenant = getCurrentTenant();
  
  if (!tenant) return;
  
  // Salvar tenant atual
  localStorage.setItem('current-tenant-id', tenant.tenantId);
  
  // Carregar configurações do tenant
  const tenantConfig = JSON.parse(
    localStorage.getItem(`tenant-${tenant.tenantId}`) || '{}'
  );
  
  // Aplicar tema/branding
  if (tenantConfig.primaryColor) {
    document.documentElement.style.setProperty(
      '--primary',
      tenantConfig.primaryColor
    );
  }
  
  if (tenantConfig.logo) {
    // Aplicar logo customizado
  }
  
  return tenant;
};
```

---

## 📋 Fluxo de Configuração para Empresa

### 1. Empresa se Cadastra
```
1. Acessa: cafeconnect.app
2. Cria conta: "Restaurante ABC"
3. Recebe subdomínio: restaurante-abc.cafeconnect.app
```

### 2. Empresa Configura Domínio Próprio (Opcional)
```
1. Vai em Configurações → Domínio
2. Adiciona: restauranteabc.com.br
3. Recebe instruções DNS
4. Configura no registrador do domínio
5. Aguarda propagação
6. Pronto! restauranteabc.com.br funciona
```

### 3. Sistema Identifica Automaticamente
```
Acesso via restauranteabc.com.br
  ↓
Sistema detecta domínio
  ↓
Carrega dados da empresa "Restaurante ABC"
  ↓
Mostra interface personalizada
```

---

## 🔧 Configuração na Vercel

### Adicionar Domínios Wildcard

Na Vercel, adicione:

```
*.cafeconnect.app
```

Isso permite subdomínios ilimitados automaticamente.

### Adicionar Domínios Customizados

Quando uma empresa adicionar domínio customizado:

**Opção A: Manual (Simples)**
1. Empresa informa domínio no sistema
2. Admin adiciona na Vercel manualmente
3. SSL configurado automaticamente

**Opção B: API Vercel (Automático)**
```typescript
// Adicionar domínio via API
const addDomainToVercel = async (domain: string) => {
  const response = await fetch(
    `https://api.vercel.com/v9/projects/${projectId}/domains`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: domain })
    }
  );
  return response.json();
};
```

---

## 💰 Modelo de Negócio

### Planos Sugeridos

**Gratuito**
- ✅ Subdomínio: `empresa.cafeconnect.app`
- ✅ Funcionalidades básicas
- ❌ Sem domínio customizado

**Básico - R$ 29/mês**
- ✅ Subdomínio
- ✅ 1 domínio customizado
- ✅ Todas funcionalidades
- ✅ Suporte email

**Pro - R$ 79/mês**
- ✅ Subdomínio
- ✅ 3 domínios customizados
- ✅ Branding personalizado
- ✅ Suporte prioritário
- ✅ Analytics avançado

**Enterprise - R$ 199/mês**
- ✅ Domínios ilimitados
- ✅ White-label completo
- ✅ API dedicada
- ✅ Suporte 24/7

---

## 🎨 Personalização por Tenant

```typescript
// Configuração por empresa
interface TenantConfig {
  id: string;
  name: string;
  subdomain: string;
  customDomains: string[];
  branding: {
    logo: string;
    primaryColor: string;
    secondaryColor: string;
    favicon: string;
  };
  features: {
    webOrders: boolean;
    delivery: boolean;
    tables: boolean;
    inventory: boolean;
  };
  plan: 'free' | 'basic' | 'pro' | 'enterprise';
}
```

---

## 🔒 Isolamento de Dados

```typescript
// Cada tenant tem seus próprios dados
const getTenantData = (tenantId: string, dataType: string) => {
  return JSON.parse(
    localStorage.getItem(`tenant-${tenantId}-${dataType}`) || '[]'
  );
};

const saveTenantData = (tenantId: string, dataType: string, data: any) => {
  localStorage.setItem(
    `tenant-${tenantId}-${dataType}`,
    JSON.stringify(data)
  );
};

// Uso
const orders = getTenantData('restaurante-abc', 'orders');
const products = getTenantData('restaurante-abc', 'products');
```

---

## 📊 Dashboard Admin

Painel para gerenciar todos os tenants:

```
admin.cafeconnect.app
  ↓
- Lista de empresas
- Domínios configurados
- Uso de recursos
- Planos ativos
- Adicionar/remover domínios
```

---

## ✅ Checklist de Implementação

- [ ] Sistema de identificação por domínio
- [ ] Painel de configuração de domínio
- [ ] Isolamento de dados por tenant
- [ ] Wildcard domain na Vercel (*.cafeconnect.app)
- [ ] API para adicionar domínios customizados
- [ ] Personalização de branding
- [ ] Sistema de planos
- [ ] Dashboard admin
- [ ] Documentação para clientes

---

## 🎯 Resultado Final

**Empresa A:**
- Acessa: `restauranteabc.com.br`
- Vê: Seus pedidos, cardápio, configurações
- Branding: Logo e cores personalizadas

**Empresa B:**
- Acessa: `cafexyz.com`
- Vê: Seus pedidos, cardápio, configurações
- Branding: Logo e cores personalizadas

**Totalmente isolados, mesmo sistema!** 🚀
