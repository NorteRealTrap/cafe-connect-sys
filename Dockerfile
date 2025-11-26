FROM node:20-alpine AS base

# Instalar dependências necessárias
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# Copiar arquivos de dependências
COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Instalar dependências
RUN npm ci

# Gerar Prisma Client
RUN npx prisma generate

# Copiar todo o código
COPY . .

# Build da aplicação
RUN npm run build

# Remover devDependencies
RUN npm prune --production

# Expor porta
EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

# Comando de start
CMD ["npm", "start"]