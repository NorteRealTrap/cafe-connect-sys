# Guia de Segurança - Cafe Connect System

## Configuração Inicial

### 1. Variáveis de Ambiente
Copie o arquivo `.env.example` para `.env` e configure:

```bash
cp .env.example .env
```

### 2. Credenciais Padrão
**IMPORTANTE**: Altere as credenciais padrão antes de usar em produção!

Usuários de desenvolvimento:
- **Admin**: admin@system.local / (ver VITE_DEFAULT_PASSWORD no .env)
- **Caixa**: caixa@system.local / (ver VITE_DEFAULT_PASSWORD no .env)
- **Atendente**: atendente@system.local / (ver VITE_DEFAULT_PASSWORD no .env)

### 3. Configurações Obrigatórias para Produção

#### Backend (api/auth.ts)
- ✅ Configure `JWT_SECRET` com valor forte e único
- ✅ Configure `ALLOWED_ORIGINS` com domínios permitidos
- ✅ Implemente banco de dados real (substituir validUsers hardcoded)
- ✅ Use bcrypt para hash de senhas (já implementado)

#### Frontend
- ✅ Configure `VITE_DEFAULT_PASSWORD` ou remova credenciais padrão
- ✅ Implemente autenticação via API
- ✅ Use HTTPS em produção

## Checklist de Segurança

### Antes de Deploy em Produção

- [ ] Alterar todas as senhas padrão
- [ ] Configurar JWT_SECRET único e forte (mínimo 32 caracteres)
- [ ] Configurar ALLOWED_ORIGINS com domínios reais
- [ ] Remover ou proteger endpoint de reset de banco de dados
- [ ] Implementar rate limiting no backend
- [ ] Configurar HTTPS/SSL
- [ ] Implementar logs de auditoria
- [ ] Configurar backup automático do banco de dados
- [ ] Revisar permissões de usuários
- [ ] Testar recuperação de senha

### Boas Práticas

1. **Senhas**
   - Mínimo 8 caracteres
   - Incluir maiúsculas, minúsculas, números e símbolos
   - Usar bcrypt com salt rounds >= 12

2. **Tokens JWT**
   - Expiração máxima de 24h
   - Renovação automática
   - Armazenamento seguro (httpOnly cookies)

3. **API**
   - Validar todas as entradas
   - Sanitizar dados do usuário
   - Implementar CORS restritivo
   - Rate limiting por IP/usuário

4. **Dados Sensíveis**
   - Nunca commitar .env
   - Usar variáveis de ambiente
   - Criptografar dados sensíveis no banco

## Vulnerabilidades Conhecidas

### Resolvidas
- ✅ CWE-798: Credenciais hardcoded movidas para variáveis de ambiente
- ✅ Acessibilidade: Select sem aria-label corrigido
- ✅ Estilos inline removidos

### Em Desenvolvimento
- ⚠️ Implementar autenticação 2FA
- ⚠️ Adicionar logs de auditoria
- ⚠️ Implementar política de senha forte

## Contato

Para reportar vulnerabilidades de segurança, entre em contato através de:
- Email: security@cafeconnect.com
- Não divulgue vulnerabilidades publicamente antes de correção
