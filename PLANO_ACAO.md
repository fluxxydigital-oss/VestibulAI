# 🎯 Plano de Ação - VestibulAI

## FASE 1: CRÍTICO (Semana 1-2)

### 1️⃣ Configuração de Ambiente e Banco de Dados
- [x] Criar `.env.example` com variáveis necessárias ✅
- [x] Documentar como configurar `.env.local` ✅
- [x] Setup Supabase (recomendado) - PostgreSQL gerenciado na nuvem ✅
- [x] Executar migrations iniciais do Prisma ✅
- [x] Testar conexão com banco de dados ✅

**Próximos passos**:
1. Crie conta gratuita em [Supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Copie a Connection String (Database > Connection Pooling)
4. Cole em `.env.local` como `DATABASE_URL`
5. Execute: `npm run db:push`

### 2️⃣ Autenticação Base
- [ ] Adicionar dependências: `next-auth` ou `jsonwebtoken`
- [ ] Implementar hash de senha com `bcrypt`
- [ ] Criar API route: `POST /api/auth/register`
- [ ] Criar API route: `POST /api/auth/login`
- [ ] Criar API route: `POST /api/auth/logout`
- [ ] Implementar middleware de autenticação real
- [ ] Atualizar funções de proteção de rotas

**Arquivos a criar**:
```
src/app/api/auth/register/route.ts
src/app/api/auth/login/route.ts
src/app/api/auth/logout/route.ts
src/lib/auth.ts (helpers)
src/middleware.ts (atualizar)
```

### 3️⃣ Validação de Inputs
- [ ] Instalar `zod` para validação de schemas
- [ ] Criar schemas para User, Question, Essay
- [ ] Validar todos os formulários no frontend
- [ ] Validar todos os inputs nas APIs

**Arquivo a criar**: `src/lib/schemas.ts`

### 4️⃣ Headers de Segurança
- [ ] Atualizar `next.config.ts` com headers de segurança
- [ ] Adicionar CORS adequado
- [ ] Adicionar CSP (Content Security Policy)
- [ ] Implementar rate limiting básico

**Arquivo a atualizar**: `next.config.ts`

---

## FASE 2: ALTO (Semana 3-4)

### 5️⃣ APIs Complementares
- [ ] Criar `GET /api/auth/me` - dados do usuário autenticado
- [ ] Criar `GET /api/questions` - listar questões com filtros
- [ ] Criar `POST /api/questions/:id/answer` - responder questão
- [ ] Criar `GET /api/progress` - dados de progresso do usuário
- [ ] Criar `POST /api/essays` - submeter redação
- [ ] Adicionar error handling em todas as rotas

**Arquivos a criar**:
```
src/app/api/questions/route.ts
src/app/api/questions/[id]/answer/route.ts
src/app/api/progress/route.ts
src/app/api/essays/route.ts
src/lib/api-error.ts (error handler)
```

### 6️⃣ Testes Iniciais
- [ ] Instalar Jest e `@testing-library/react`
- [ ] Escrever testes unitários para validations
- [ ] Escrever testes para APIs de autenticação
- [ ] Configurar coverage mínimo de 80%

**Arquivos a criar**:
```
__tests__/auth.test.ts
__tests__/validation.test.ts
jest.config.js
```

### 7️⃣ Completar UI do Dashboard
- [ ] Implementar todas as páginas de dashboard
- [ ] Adicionar formulários funcionais
- [ ] Conectar ao APIs de backend
- [ ] Adicionar loading states e error handling

**Páginas a completar**:
```
src/app/dashboard/assinatura/page.tsx
src/app/dashboard/configuracoes/page.tsx
src/app/dashboard/perfil/page.tsx
src/app/dashboard/trilha/page.tsx
src/app/dashboard/materia/page.tsx
... todas as outras
```

### 8️⃣ Logging e Monitoramento
- [ ] Instalar `winston` para logs
- [ ] Criar logger centralizado
- [ ] Adicionar logging em todas as APIs
- [ ] Integrar Sentry para error tracking
- [ ] Configurar logs de auditoria para ações sensíveis

**Arquivo a criar**: `src/lib/logger.ts`

---

## FASE 3: MÉDIO (Semana 5)

### 9️⃣ Performance
- [ ] Implementar `next/image` em todas as imagens
- [ ] Adicionar lazy loading para componentes pesados
- [ ] Implementar caching com revalidate tags
- [ ] Otimizar bundle size
- [ ] Adicionar Web Vitals monitoring

### 🔟 CI/CD e Deploy
- [ ] Criar `.github/workflows/test.yml` para testes
- [ ] Criar `.github/workflows/lint.yml` para linting
- [ ] Criar `.github/workflows/deploy.yml` para deploy
- [ ] Configurar variáveis de ambiente no GitHub
- [ ] Testar deploy em staging

**Arquivo a criar**: `.github/workflows/*.yml`

### 1️⃣1️⃣ Documentação Completa
- [ ] Atualizar README.md
- [ ] Criar CONTRIBUTING.md
- [ ] Documentar API endpoints em Swagger/OpenAPI
- [ ] Criar guia de setup local
- [ ] Documentar estrutura do projeto

---

## FASE 4: LEGAL E COMPLIANCE (Antes de Produção)

### 1️⃣2️⃣ LGPD Compliance
- [ ] Escrever Política de Privacidade real
- [ ] Escrever Termos de Uso reais
- [ ] Implementar direito ao esquecimento: `DELETE /api/users/:id`
- [ ] Implementar exportação de dados: `GET /api/users/:id/export`
- [ ] Adicionar consentimento granular para cookies
- [ ] Documentar data retention policies

**Modelos necessários**:
- src/app/politica-de-privacidade/page.tsx (com conteúdo real)
- src/app/termos-de-uso/page.tsx (com conteúdo real)

### 1️⃣3️⃣ Segurança Avançada
- [ ] Implementar 2FA (Two-Factor Authentication)
- [ ] Adicionar password reset functionality
- [ ] Implementar email verification
- [ ] Adicionar session management/logout em todos os dispositivos
- [ ] Implementar audit logs
- [ ] Penetration testing básico

---

## CHECKLISTS POR ARQUIVO

### `.env.example` (Criar)
```
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_PROVIDERS_GITHUB_ID=
NEXTAUTH_PROVIDERS_GITHUB_SECRET=
SENTRY_DSN=
DATABASE_PROVIDER=postgresql
```

### `next.config.ts` (Atualizar)
```typescript
{
  images: {
    remotePatterns: [
      { hostname: 'images.unsplash.com' }
    ]
  },
  headers: async () => [...]
}
```

### `package.json` (Adicionar scripts)
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "test": "jest",
    "test:watch": "jest --watch",
    "db:migrate": "prisma migrate dev",
    "db:push": "prisma db push",
    "db:generate": "prisma generate",
    "db:seed": "node prisma/seed.ts"
  }
}
```

### `tsconfig.json` (Stricter)
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

### `.eslintrc.json` (Criar)
```json
{
  "extends": ["next/core-web-vitals"],
  "rules": {
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

---

## DEPENDÊNCIAS A ADICIONAR

### Fase 1
```bash
npm install zod bcryptjs jsonwebtoken
npm install -D @types/jsonwebtoken @types/bcryptjs
```

### Fase 2
```bash
npm install winston
npm install -D jest @testing-library/react @testing-library/jest-dom
```

### Fase 3
```bash
npm install @sentry/nextjs
```

### Fase 4
```bash
npm install speakeasy qrcode
npm install nodemailer
npm install -D @types/nodemailer
```

---

## TIMELINE ESTIMADA

| Fase | Duração | Status |
|-----|---------|--------|
| Fase 1 (Crítico) | 2 semanas | ⏳ TODO |
| Fase 2 (Alto) | 2 semanas | ⏳ TODO |
| Fase 3 (Médio) | 1 semana | ⏳ TODO |
| Fase 4 (Legal) | 1 semana | ⏳ TODO |
| **TOTAL** | **6 semanas** | |

---

## CONCLUSÃO

Depois de completar este plano:
✅ Projeto pronto para produção
✅ Segurança implementada
✅ Testes em place
✅ CI/CD configurado
✅ LGPD compliant
✅ Performance otimizada
✅ Documentação completa

**Status Pré-Implementação**: Começa após aprovação do plano.
