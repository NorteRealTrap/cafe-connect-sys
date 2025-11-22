# 🔒 Guia de Segurança - CCPServices PDV

## ✅ Correções Implementadas

### 1. Hash de Senhas Seguro ✅
- ✅ Implementado bcrypt com 12 rounds
- ✅ Senhas nunca mais armazenadas em texto plano
- ✅ Funções `hashPassword()` e `verifyPassword()` seguras

### 2. Autenticação JWT ✅
- ✅ Tokens JWT com expiração de 24h
- ✅ Validação de tokens implementada
- ✅ Sistema de refresh tokens preparado

### 3. Rate Limiting ✅
- ✅ Proteção contra força bruta (5 tentativas por 15 minutos)
- ✅ Bloqueio automático após tentativas excessivas
- ✅ Implementado no frontend e backend

### 4. CORS Restrito ✅
- ✅ CORS configurado apenas para domínios permitidos
- ✅ Variável de ambiente `ALLOWED_ORIGINS`
- ✅ Headers de segurança adicionados

### 5. Validação de Entrada ✅
- ✅ Sanitização de strings (prevenção XSS)
- ✅ Validação de email
- ✅ Limitação de tamanho de campos

### 6. Webhook Seguro ✅
- ✅ Validação de assinatura X-Hub-Signature-256
- ✅ Verificação de origem
- ✅ Logs sanitizados (sem dados sensíveis)

### 7. Logs Seguros ✅
- ✅ Remoção de informações sensíveis dos logs
- ✅ Mensagens de erro genéricas para usuários
- ✅ Detalhes apenas em logs do servidor

### 8. Credenciais Removidas ✅
- ✅ Senhas padrão removidas do código
- ✅ Sistema de inicialização seguro
- ✅ Forçar alteração de senha no primeiro login

---

## 🚀 Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto (ou configure no Vercel):

```bash
# Gerar JWT Secret seguro
openssl rand -base64 32

# Adicionar ao .env
JWT_SECRET=seu-secret-gerado-aqui
ALLOWED_ORIGINS=https://seu-dominio.com,https://www.seu-dominio.com
```

### 2. Instalar Dependências

```bash
npm install
# ou
bun install
```

### 3. Configurar CORS

No Vercel, adicione a variável `ALLOWED_ORIGINS` com seus domínios:

```
ALLOWED_ORIGINS=https://seu-dominio.vercel.app,https://seu-dominio.com
```

### 4. Senha Padrão

**IMPORTANTE:** A senha padrão do administrador é: `Admin@123!`

**Você DEVE alterar esta senha no primeiro login!**

---

## 🔐 Boas Práticas Implementadas

### Autenticação
- ✅ Senhas com hash bcrypt (12 rounds)
- ✅ Tokens JWT com expiração
- ✅ Rate limiting em todas as rotas de autenticação
- ✅ Validação de email e sanitização de entrada

### APIs
- ✅ CORS restrito a domínios permitidos
- ✅ Validação de entrada em todas as rotas
- ✅ Sanitização de dados antes de processar
- ✅ Mensagens de erro genéricas (sem expor detalhes)

### Webhooks
- ✅ Validação de assinatura HMAC-SHA256
- ✅ Verificação de origem
- ✅ Logs sanitizados

### Armazenamento
- ✅ Tokens armazenados no localStorage (considerar httpOnly cookies em produção)
- ✅ Dados sensíveis nunca em logs
- ✅ Sanitização antes de salvar

---

## ⚠️ Ações Necessárias Antes de Produção

### Prioridade ALTA
1. ✅ **Alterar JWT_SECRET** - Use um secret forte e único
2. ✅ **Configurar ALLOWED_ORIGINS** - Adicione seus domínios
3. ✅ **Alterar senha padrão** - Use senha forte no primeiro login
4. ✅ **Configurar variáveis de ambiente** - Todas no Vercel

### Prioridade MÉDIA
5. ⚠️ **Implementar banco de dados real** - Substituir localStorage
6. ⚠️ **Adicionar HTTPS enforcement** - Forçar HTTPS em produção
7. ⚠️ **Implementar CSP headers** - Content Security Policy
8. ⚠️ **Adicionar monitoramento** - Logs e alertas de segurança

### Prioridade BAIXA
9. ⚠️ **Implementar 2FA** - Autenticação de dois fatores
10. ⚠️ **Auditoria de segurança** - Revisão periódica
11. ⚠️ **Backup automático** - Sistema de backup de dados

---

## 📋 Checklist de Deploy

Antes de fazer deploy em produção, verifique:

- [ ] JWT_SECRET configurado e seguro
- [ ] ALLOWED_ORIGINS configurado com seus domínios
- [ ] Senha padrão alterada
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] HTTPS habilitado
- [ ] Testes de autenticação funcionando
- [ ] Rate limiting testado
- [ ] CORS funcionando corretamente
- [ ] Webhooks validando assinaturas
- [ ] Logs não expõem informações sensíveis

---

## 🛠️ Comandos Úteis

### Gerar JWT Secret
```bash
openssl rand -base64 32
```

### Testar Rate Limiting
```bash
# Fazer múltiplas requisições para testar bloqueio
for i in {1..10}; do
  curl -X POST https://seu-dominio.com/api/auth \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
done
```

### Verificar CORS
```bash
curl -H "Origin: https://site-malicioso.com" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     https://seu-dominio.com/api/auth
```

---

## 📚 Recursos Adicionais

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [JWT Best Practices](https://datatracker.ietf.org/doc/html/rfc8725)
- [Vercel Security](https://vercel.com/docs/security)
- [bcrypt Documentation](https://www.npmjs.com/package/bcryptjs)

---

## 🆘 Suporte

Em caso de problemas de segurança:
1. Revise os logs do servidor
2. Verifique as variáveis de ambiente
3. Teste localmente com `npm run dev`
4. Consulte o relatório de segurança: `RELATORIO_SEGURANCA.md`

---

**Última atualização:** $(date)
**Versão:** 1.0.0


