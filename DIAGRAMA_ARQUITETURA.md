# 📐 Diagrama de Arquitetura e Fluxos

## 1. Fluxo Atual (Quebrado) ❌

```
┌─────────────────────────────────────────────────────────────────┐
│                     USUÁRIO (Browser)                           │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   │ (Tenta acessar /dashboard)
                   ▼
        ┌──────────────────────────┐
        │  Middleware              │
        │ isAuthenticated = false  │
        │ ⚠️ SEMPRE FALSO          │
        └──────────────────────────┘
                   │
                   ├─ Poderia bloquear ❌ (NOT IMPLEMENTED)
                   └─ Deixa passar ✅ (FUNCIONA MAS INSEGURO!)
                   
                   ▼
        ┌──────────────────────────┐
        │  Dashboard Page          │
        │  - Sem dados de usuário  │
        │  - Sem autenticação      │
        │  - UI apenas (NO API)    │
        └──────────────────────────┘
                   │
                   ▼
        ┌──────────────────────────┐
        │  Clica em "Questões"     │
        └──────────────────────────┘
                   │
                   │ (Tenta chamar API)
                   ▼
        ┌──────────────────────────┐
        │  GET /api/questions      │
        │  ❌ ROTA NÃO EXISTE      │
        │  Error 404               │
        └──────────────────────────┘

RESULTADO: Usuário vê UI bonita mas nada funciona ⚠️
```

---

## 2. Fluxo Desejado (Implementado) ✅

```
┌──────────────────────────────────────────────────────────────────┐
│                     USUÁRIO (Browser)                            │
└───────────────────┬────────────────────────────────────────────┬─┘
                    │                        │
          Novo usuário?              Usuário existente?
                    │                        │
     ┌──────────────▼──────────────┐  ┌──────▼───────────────────┐
     │  /register                   │  │  /login                   │
     │  ✉️ Email        ❌ BROKEN   │  │  ✉️ Email        ❓ BROKEN│
     │  🔑 Password                 │  │  🔑 Password              │
     │  👤 Name                     │  │                           │
     └────────────┬─────────────────┘  └────┬─────────────────────┘
                  │                         │
                  │ Valida com Zod          │ Valida com Zod
                  │ (❌ NÃO IMPLEMENTADO)   │ (❌ NÃO IMPLEMENTADO)
                  │                         │
                  ▼                         ▼
        ┌───────────────────────────────────────────┐
        │  POST /api/auth/register   ❌ NÃO EXISTE │
        │         ou                                 │
        │  POST /api/auth/login      ❌ NÃO EXISTE │
        └───────────────────────────┬───────────────┘
                                    │
                    Hash password com bcrypt
                    Salva no banco
                    Gera JWT Token ✅ (QUANDO FEITO)
                                    │
                                    ▼
                    ┌───────────────────────────┐
                    │  Retorna JWT no cookie    │
                    │  Set-Cookie: auth_token   │
                    └───────────────┬───────────┘
                                    │
                                    ▼
        ┌───────────────────────────────────────────┐
        │  Middleware Valida JWT                    │
        │  ✅ Token válido?  → Permite /dashboard  │
        │  ❌ Token inválido? → Redireciona /login  │
        └────────────────────┬──────────────────────┘
                             │
                             ▼
                    ┌──────────────────────┐
                    │  Dashboard           │
                    │  ✅ Usuário autenticado
                    │  ✅ Dados do BD      │
                    └──────────┬───────────┘
                               │
                   ┌───────────┼───────────┐
                   │           │           │
                Clica em   Clica em    Clica em
                Questões   Simulado    Redação
                   │           │           │
        ┌──────────▼──┐  ┌──────▼──┐  ┌────▼────────┐
        │GET /api/    │  │GET /api/│  │POST /api/   │
        │questions    │  │simulado │  │essays       │
        │✅ EXISTE    │  │❌ NA    │  │❌ NÃO       │
        │(QUANDO FEITO) │ │(QUANDO │  │EXISTE       │
        │             │  │FEITO)  │  │             │
        └─────────────┘  └─────────┘  └─────────────┘

RESULTADO: Sistema seguro e funcional ✅ (QUANDO IMPLEMENTADO)
```

---

## 3. Dependências Entre Tarefas

```
                           ┌─────────────────┐
                           │   START HERE    │
                           └────────┬────────┘
                                    │
                    Setup .env + PostgreSQL
                           │        │        │
                    ┌──────┴────────┴───┐
                    ▼                   ▼
              Prisma Schema      Database URL
              (✅ OK)            (❌ NÃO FEITO)
                    │                   │
                    └─────────┬─────────┘
                              ▼
                    Prisma Migrations
                    (❌ NÃO EXECUTADO)
                              │
                              ▼
            ┌─────────────────────────────────────┐
            │  BLOQUEADOR 1: Banco Funcionar      │
            │  ┌──────────────────────────────┐   │
            │  │ Implementar Auth Base        │   │
            │  │ - Register API ❌            │   │
            │  │ - Login API ❌               │   │
            │  │ - JWT Token ❌               │   │
            │  │ - Middleware ✅ PRONTO       │   │
            │  └──────────────────────────────┘   │
            └─────────────────────────────────────┘
                              │
                    ┌─────────┼─────────┐
                    │         │         │
                ┌───▼────┐ ┌──▼───┐ ┌──▼────┐
                │Validação│ │Testes│ │ APIs  │
                │(Zod) ❌ │ │❌    │ │❌     │
                └────────┘ └──────┘ └───────┘
                    │         │         │
                    └─────────┼─────────┘
                              ▼
                    ┌──────────────────────┐
                    │ MVP Funcional        │
                    │ (Semana 2 ou 3)      │
                    └──────┬───────────────┘
                           │
            ┌──────────────┼──────────────┐
            ▼              ▼              ▼
        Testes       Segurança      Logging
        (Jest) ❌    (Headers) ❌   (Winston) ❌
            │              │              │
            └──────────────┼──────────────┘
                           ▼
                    ┌──────────────────────┐
                    │ Qualidade de Código  │
                    │ (Semana 3)           │
                    └──────┬───────────────┘
                           │
            ┌──────────────┼──────────────┐
            ▼              ▼              ▼
        ESLint      Pre-commit    Dependency
        ❌          Hooks ❌      Check ❌
            │              │              │
            └──────────────┼──────────────┘
                           ▼
                    ┌──────────────────────┐
                    │ DevOps/CI-CD         │
                    │ (Semana 4)           │
                    └──────┬───────────────┘
                           │
            ┌──────────────┼──────────────┐
            ▼              ▼              ▼
        GitHub      Docker      Vercel
        Actions ❌  Config ❌   Deploy ❌
            │              │              │
            └──────────────┼──────────────┘
                           ▼
                    ┌──────────────────────┐
                    │ LGPD Compliance      │
                    │ (Semana 5)           │
                    └──────┬───────────────┘
                           │
            ┌──────────────┼──────────────┐
            ▼              ▼              ▼
        Privacy     Terms of       2FA
        Policy ❌   Use ❌         ❌
            │              │              │
            └──────────────┼──────────────┘
                           ▼
                    ┌──────────────────────┐
                    │ ✅ PRONTO PRODUÇÃO   │
                    └──────────────────────┘
```

---

## 4. Arquitetura de Segurança Desejada

```
                    ┌─────────────────────┐
                    │   Client Browser    │
                    └──────────┬──────────┘
                               │ HTTPS
                               ▼
              ┌────────────────────────────────┐
              │  Next.js Frontend              │
              │  ✅ Validar inputs (Zod)      │
              │  ✅ CSRF Protection            │
              │  ✅ Content Security Policy    │
              └────────────┬───────────────────┘
                           │
              ✅ JWT Token │ Cookies HttpOnly
              ✅ Refresh   │
                           ▼
            ┌───────────────────────────────────────┐
            │  Middleware                           │
            │  ✅ Valida JWT Token                 │
            │  ✅ Rate Limiting                    │
            │  ✅ CORS Check                       │
            │  ✅ Security Headers                 │
            │  ✅ Request Logging                  │
            └───────────────┬─────────────────────┘
                            │
        ┌───────────────────┴─────────────────────┐
        │                                         │
        ▼                                         ▼
    ┌──────────────────┐              ┌──────────────────┐
    │  Public Routes   │              │  Protected Routes│
    │  - /api/auth/*   │              │  - /api/profile  │
    │  - /api/public   │              │  - /api/essays   │
    └──────────────────┘              │  - /api/progress │
                                      └────────┬─────────┘
                                               │
                                    ✅ Autorização
                                    ✅ Validação
                                               │
                                               ▼
                            ┌──────────────────────────────┐
                            │  Business Logic              │
                            │  ✅ Input Validation (Zod)   │
                            │  ✅ Authorization Checks     │
                            │  ✅ Data Sanitization        │
                            │  ✅ Error Logging            │
                            └─────────────┬────────────────┘
                                          │
                                          ▼
                            ┌──────────────────────────────┐
                            │  Database Layer              │
                            │  ✅ Prisma ORM               │
                            │  ✅ Prepared Statements      │
                            │  ✅ SQL Injection Prevention  │
                            │  ✅ Query Auditing           │
                            └───────────┬──────────────────┘
                                        │
                                        ▼
                            ┌──────────────────────────────┐
                            │  PostgreSQL Database         │
                            │  ✅ Row Level Security       │
                            │  ✅ Encrypted Passwords      │
                            │  ✅ Audit Logs               │
                            │  ✅ Backups                  │
                            └──────────────────────────────┘

STATUS ATUAL: ⚠️ Apenas UI está implementada. Backend falta completamente.
```

---

## 5. Estado Atual vs Ideal

```
┌─────────────────┬──────────────────────┬──────────────────────┐
│  Componente     │  Estado Atual (❌)   │  Estado Ideal (✅)    │
├─────────────────┼──────────────────────┼──────────────────────┤
│ Authentication  │ Mockada               │ JWT + Refresh Token  │
│ Authorization   │ Faltando              │ Role-based Access    │
│ Inputs          │ Sem validação         │ Zod schemas          │
│ Database        │ Não configurada       │ PostgreSQL + Prisma  │
│ APIs            │ 0% implementadas      │ 100% implementadas   │
│ Error Handling  │ Nenhum (UI breaks)    │ Global Error Handler │
│ Logging         │ Nenhum                │ Winston + Sentry     │
│ Testing         │ 0% cobertura          │ 80%+ cobertura       │
│ Security Headers│ Nenhum                │ 10/10 headers        │
│ Rate Limiting   │ Nenhum                │ Global + por user    │
│ CORS            │ Não configurado       │ Configurado seguro   │
│ 2FA             │ Não existe            │ TOTP Support         │
│ Password Reset  │ Não existe            │ Email + Token        │
│ Session Mgmt    │ Não existe            │ Logout em devices    │
│ Image Opt       │ URLs externas         │ next/image           │
│ Performance     │ Não otimizado         │ Code splitting       │
│ CI/CD           │ Nenhum                │ GitHub Actions       │
│ Monitoring      │ Nenhum                │ Error tracking       │
│ LGPD Compliance │ Nenhum                │ Full compliance      │
└─────────────────┴──────────────────────┴──────────────────────┘
```

---

## 6. Timeline Visual

```
SEMANA 1 ██▓░░░░░░ [Banco + Auth Base]
SEMANA 2 ██████░░░ [APIs + Validação]
SEMANA 3 ████████░ [Testes + Qualidade]
SEMANA 4 ██████████ [Completo + DevOps]
SEMANA 5 ██████████ [LGPD + Segurança]
SEMANA 6 ██████████ [PRONTO PRODUÇÃO]

Componentes críticos:
  Semana 1: Banco ████ (Bloqueador de tudo)
  Semana 1: Auth ████ (Bloqueador de APIs)
  Semana 2: APIs ████ (Já começa a funcionar!)
  Semana 5: LGPD ██░░ (Obrigatório legal)
```

---

## 7. Matriz de Risco

```
                    IMPACTO
                High │
                     │  ⚫ Sem Auth      ⚫ Sem BD
                     │      (Crítico)       (Crítico)
    L               │
    I          Med  │  ⚫ Sem Testes   ⚫ Sem Logs
    K               │
    E          Low  │          ⚫ Sem CSS minify
    L               │
                    └───────────────────────────
                       Low    Med    High
                       PROBABILIDADE

RECOMENDAÇÃO: Focar em ⚫ de impacto HIGH primeiro
```

---

## 8. Checklist Rápido

```
DATABASE:
  ☐ .env.local criado
  ☐ PostgreSQL rodando
  ☐ DATABASE_URL configurada
  ☐ Prisma migrations rodadas

AUTENTICAÇÃO:
  ☐ Dependências NextAuth instaladas
  ☐ API /api/auth/register criada
  ☐ API /api/auth/login criada
  ☐ JWT Token gerado
  ☐ Middleware validando token
  ☐ Storage seguro de tokens

VALIDAÇÃO:
  ☐ Zod instalado
  ☐ Schemas criados
  ☐ Formulários validando
  ☐ APIs rejeitando inválidos

SEGURANÇA:
  ☐ Headers HTTP adicionados
  ☐ CORS configurado
  ☐ Rate limiting implementado
  ☐ SQL Injection prevenido
  ☐ XSS Protection ativada

TESTES:
  ☐ Jest instalado
  ☐ Testes de auth criados
  ☐ Testes de API criados
  ☐ Coverage 80%+

CI/CD:
  ☐ GitHub Actions configurado
  ☐ Testes rodam no push
  ☐ Lint verification
  ☐ Build verification

PRONTO PRODUÇÃO:
  ☐ Todos os itens acima ✅
  ☐ Teste de segurança passado
  ☐ Performance otimizada
  ☐ LGPD compliant
  ☐ Documentação completa
```

---

**Gerado**: 22/03/2026 | **Versão**: 1.0 | **Status**: Planejamento ⏳
