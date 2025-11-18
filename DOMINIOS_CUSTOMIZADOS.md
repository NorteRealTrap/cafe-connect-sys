# 🌐 Guia de Domínios Customizados na Vercel

## ✅ Sim, é Totalmente Possível!

A Vercel oferece suporte completo e gratuito para domínios customizados.

---

## 📋 Opções de Domínio

### 1. Domínio Vercel Gratuito
- **Formato**: `seu-projeto.vercel.app`
- **Custo**: Gratuito
- **SSL**: Automático
- **Configuração**: Automática

### 2. Domínio Próprio
- **Exemplos**: 
  - `cafeconnect.com.br`
  - `meurestaurante.com`
  - `pdv.minhaempresa.com.br`
- **Custo**: Apenas o registro do domínio (R$ 40-60/ano)
- **SSL**: Gratuito (Let's Encrypt)
- **Configuração**: 5 minutos

---

## 🚀 Como Adicionar Domínio Customizado

### Passo 1: Acessar Configurações do Projeto

1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** → **Domains**

### Passo 2: Adicionar Domínio

1. Clique em **Add Domain**
2. Digite seu domínio: `cafeconnect.com.br`
3. Clique em **Add**

### Passo 3: Configurar DNS

A Vercel mostrará as configurações necessárias:

#### Opção A: Usar Nameservers da Vercel (Recomendado)

```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

**Vantagens:**
- ✅ Configuração automática
- ✅ SSL automático
- ✅ Melhor performance
- ✅ Sem configuração manual

**Como fazer:**
1. Acesse o painel do seu registrador (Registro.br, GoDaddy, etc)
2. Vá em "Nameservers" ou "DNS"
3. Altere para os nameservers da Vercel
4. Aguarde propagação (até 48h, geralmente 1-2h)

#### Opção B: Configurar Registros DNS Manualmente

**Para domínio raiz** (`cafeconnect.com.br`):
```
Tipo: A
Nome: @
Valor: 76.76.21.21
```

**Para subdomínio** (`www.cafeconnect.com.br`):
```
Tipo: CNAME
Nome: www
Valor: cname.vercel-dns.com
```

---

## 🌍 Onde Comprar Domínios

### Brasil
- **Registro.br** (domínios .br)
  - Site: https://registro.br
  - Custo: ~R$ 40/ano
  - Melhor para: .com.br, .net.br

- **GoDaddy Brasil**
  - Site: https://godaddy.com/pt-br
  - Custo: ~R$ 50-80/ano
  - Melhor para: .com, .net

- **HostGator Brasil**
  - Site: https://hostgator.com.br
  - Custo: ~R$ 40-60/ano

### Internacional
- **Namecheap**
  - Site: https://namecheap.com
  - Custo: $8-15/ano
  - Melhor para: .com, .io

- **Google Domains**
  - Site: https://domains.google
  - Custo: $12/ano

---

## 🔧 Configurações Avançadas

### Múltiplos Domínios

Você pode adicionar vários domínios para o mesmo projeto:

```
cafeconnect.com.br          → Principal
www.cafeconnect.com.br      → Redireciona para principal
pedidos.cafeconnect.com.br  → Página de pedidos
admin.cafeconnect.com.br    → Painel admin
```

### Redirecionamentos

Configure no arquivo `vercel.json`:

```json
{
  "redirects": [
    {
      "source": "/pedido",
      "destination": "/web-order",
      "permanent": true
    },
    {
      "source": "/rastreamento",
      "destination": "/order-tracking",
      "permanent": true
    }
  ]
}
```

### Subdomínios por Ambiente

```
producao.cafeconnect.com.br  → Branch main
teste.cafeconnect.com.br     → Branch staging
dev.cafeconnect.com.br       → Branch development
```

---

## 📱 Exemplos de Uso

### Para Restaurante
```
Principal:     restauranteabc.com.br
Pedidos:       pedidos.restauranteabc.com.br
Cardápio:      cardapio.restauranteabc.com.br
Rastreamento:  rastreamento.restauranteabc.com.br
```

### Para Café
```
Principal:     cafexyz.com.br
Delivery:      delivery.cafexyz.com.br
Menu:          menu.cafexyz.com.br
```

### Para Franquia
```
Principal:     minharede.com.br
Loja 1:        loja1.minharede.com.br
Loja 2:        loja2.minharede.com.br
Admin:         admin.minharede.com.br
```

---

## 🔒 SSL/HTTPS

### Certificado Automático

A Vercel gera certificados SSL **gratuitos** automaticamente:

- ✅ Let's Encrypt
- ✅ Renovação automática
- ✅ Sem configuração manual
- ✅ HTTPS forçado

### Forçar HTTPS

Adicione no `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains"
        }
      ]
    }
  ]
}
```

---

## ⚡ Performance

### CDN Global

Todos os domínios na Vercel usam CDN global:

- 🌍 Edge Network em 70+ cidades
- ⚡ Latência < 50ms
- 🚀 Cache automático
- 📊 Analytics incluído

### Otimizações Automáticas

- ✅ Compressão Brotli/Gzip
- ✅ Image Optimization
- ✅ Code Splitting
- ✅ Lazy Loading

---

## 💰 Custos

### Vercel (Hospedagem)
- **Hobby (Gratuito)**:
  - Domínios ilimitados
  - SSL gratuito
  - 100GB bandwidth/mês
  - Perfeito para começar

- **Pro ($20/mês)**:
  - Tudo do Hobby +
  - 1TB bandwidth/mês
  - Analytics avançado
  - Suporte prioritário

### Domínio (Registro)
- **.com.br**: R$ 40/ano
- **.com**: R$ 50-80/ano
- **.io**: R$ 150-200/ano

**Total Mínimo**: R$ 40/ano (apenas domínio)

---

## 🛠️ Troubleshooting

### Domínio não funciona após 48h

1. Verifique nameservers:
   ```bash
   nslookup -type=NS cafeconnect.com.br
   ```

2. Verifique propagação:
   - https://dnschecker.org

3. Limpe cache DNS local:
   ```bash
   # Windows
   ipconfig /flushdns
   
   # Mac/Linux
   sudo dscacheutil -flushcache
   ```

### SSL não ativa

1. Aguarde até 24h após configuração DNS
2. Verifique se DNS está correto
3. Remova e adicione domínio novamente na Vercel

### Erro "Invalid Configuration"

1. Verifique se domínio não está em uso em outro projeto
2. Confirme que DNS aponta para Vercel
3. Tente usar nameservers da Vercel

---

## 📚 Recursos Úteis

- [Documentação Vercel Domains](https://vercel.com/docs/concepts/projects/domains)
- [Verificador DNS](https://dnschecker.org)
- [Teste SSL](https://ssllabs.com/ssltest/)
- [Registro.br](https://registro.br)

---

## ✅ Checklist de Configuração

- [ ] Projeto deployado na Vercel
- [ ] Domínio registrado
- [ ] Domínio adicionado na Vercel
- [ ] DNS configurado (nameservers ou registros)
- [ ] Aguardar propagação (1-48h)
- [ ] SSL ativado automaticamente
- [ ] Testar acesso pelo domínio
- [ ] Configurar redirecionamentos (opcional)
- [ ] Adicionar subdomínios (opcional)

---

## 🎉 Pronto!

Seu sistema estará acessível em:
- `https://cafeconnect.com.br` ✅
- `https://www.cafeconnect.com.br` ✅
- `https://seu-projeto.vercel.app` ✅

**Todos com SSL gratuito e CDN global!** 🚀
