# 📋 FASE 2 - Plano de Implementação (APIs Complementares)

⏱️ **Duração Estimada**: 1 semana (5 dias de trabalho)  
📅 **Início Recomendado**: 23/03/2026  
🎯 **Bloqueadores**: Nenhum (Fase 1 completa)

---

## 📊 Visão Geral

Fase 2 vai focar em implementar as APIs faltantes para que o aplicativo comece a funcionar de verdade.

| APIs a Implementar | Prioridade | Complexidade | Tempo |
|-------------------|-----------|-------------|-------|
| POST `/api/auth/refresh` | 🔴 ALTA | ⭐⭐ | 1h |
| POST `/api/auth/forgot-password` | 🟠 MÉDIA | ⭐⭐⭐ | 3h |
| GET `/api/questions` | 🔴 ALTA | ⭐⭐ | 2h |
| POST `/api/questions/:id/answer` | 🔴 ALTA | ⭐⭐ | 2h |
| GET `/api/progress` | 🔴 ALTA | ⭐⭐ | 2h |
| POST `/api/essays` | 🟠 MÉDIA | ⭐ | 1h |
| GET `/api/essays/:id` | 🟠 MÉDIA | ⭐ | 1h |
| DELETE `/api/essays/:id` | 🟢 BAIXA | ⭐ | 1h |

**Total**: ~13 horas = 1.6 dias

---

## 🔧 Tarefa 1: POST `/api/auth/refresh` (1h)

Renovar access token usando refresh token.

```typescript
// src/app/api/auth/refresh/route.ts
// Input: refresh_token (via cookie)
// Output: novo access_token
// Erro: 401 se refresh token inválido

async function POST() {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) throw new AuthenticationError();
  
  const newAccessToken = await refreshAccessToken();
  return successResponse({ accessToken: newAccessToken });
}
```

---

## 🔧 Tarefa 2: POST `/api/auth/forgot-password` (3h)

Iniciar processo de reset de senha via email.

```typescript
// src/app/api/auth/forgot-password/route.ts
// Input: { email }
// Output: { message: "Email enviado" }

// Pré-requisito: Instalar nodemailer para envio de email

async function POST(request) {
  const { email } = forgotPasswordSchema.parse(await request.json());
  
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return successResponse({}); // Não revelar se existe
  
  // Gerar token temporário
  const resetToken = generateToken({ userId: user.id }, false);
  
  // Salvar token no DB com expiração
  // Enviar email com link: /reset-password?token=...
  
  return successResponse({ message: "Email enviado" });
}
```

---

## 🔧 Tarefa 3: GET `/api/questions` (2h)

Listar questões com filtros.

```typescript
// src/app/api/questions/route.ts
// Input: { subjectId?, difficulty?, page?, limit? }
// Output: { questions: [...], total, pages }

async function GET(request) {
  const session = await getSession();
  if (!session) throw new AuthenticationError();
  
  const { subjectId, difficulty, page = 1, limit = 10 } = 
    questionFilterSchema.parse(request.nextUrl.searchParams);
  
  const questions = await prisma.question.findMany({
    where: {
      ...(subjectId && { subjectId }),
      ...(difficulty && { difficulty }),
    },
    skip: (page - 1) * limit,
    take: limit,
  });
  
  return successResponse({ questions });
}
```

---

## 🔧 Tarefa 4: POST `/api/questions/:id/answer` (2h)

Submeter resposta de questão e calcular progresso.

```typescript
// src/app/api/questions/[id]/answer/route.ts
// Input: { selectedOptionId }
// Output: { isCorrect, correctOption, explanation }

async function POST(request, { params }) {
  const session = await getSession();
  if (!session) throw new AuthenticationError();
  
  const { selectedOptionId } = submitQuestionAnswerSchema.parse(
    await request.json()
  );
  
  const question = await prisma.question.findUnique({
    where: { id: params.id }
  });
  
  const isCorrect = selectedOptionId === question.correctOption;
  
  // Atualizar progresso do usuário
  await prisma.userProgress.updateMany({
    where: { userId: session.userId },
    data: {
      questionsAnswered: { increment: 1 },
      correctAnswers: isCorrect ? { increment: 1 } : undefined,
    }
  });
  
  return successResponse({ isCorrect, correctOption: question.correctOption });
}
```

---

## 🔧 Tarefa 5: GET `/api/progress` (2h)

Obter progresso completo do usuário por matéria.

```typescript
// src/app/api/progress/route.ts
// Output: { bySubject: {...}, average: X, totalAnswered: Y }

async function GET(request) {
  const session = await getSession();
  if (!session) throw new AuthenticationError();
  
  const progress = await prisma.userProgress.findMany({
    where: { userId: session.userId },
    include: { subject: true },
  });
  
  const stats = {
    bySubject: progress.map(p => ({
      subjectId: p.subjectId,
      subjectName: p.subject.name,
      correctly: p.correctAnswers,
      total: p.questionsAnswered,
      percentage: (p.correctAnswers / p.questionsAnswered) * 100,
      level: p.estimatedLevel,
    })),
    average: calculateAverage(progress),
    totalAnswered: sum(progress.map(p => p.questionsAnswered)),
  };
  
  return successResponse(stats);
}
```

---

## 🔧 Tarefa 6: POST `/api/essays` (1h)

Submeter redação para correção.

```typescript
// src/app/api/essays/route.ts
// Input: { theme, content }
// Output: { essayId, status: "SUBMITTED" }

async function POST(request) {
  const session = await getSession();
  const { theme, content } = submitEssaySchema.parse(
    await request.json()
  );
  
  const essay = await prisma.essay.create({
    data: {
      userId: session.userId,
      theme,
      content,
      status: "SUBMITTED",
    }
  });
  
  // TODO: Integrar com API de IA para correção automática
  
  return successResponse({ essayId: essay.id }, 201);
}
```

---

## 🔧 Tarefa 7: GET `/api/essays/:id` (1h)

Obter detalhes da redação (incluindo feedback).

```typescript
// src/app/api/essays/[id]/route.ts
// Output: { essay: {...}, feedback: "...", score: {...} }

async function GET(request, { params }) {
  const session = await getSession();
  
  const essay = await prisma.essay.findUnique({
    where: { id: params.id }
  });
  
  if (!essay || essay.userId !== session.userId) {
    throw new AuthorizationError();
  }
  
  return successResponse({ essay });
}
```

---

## 🔧 Tarefa 8: DELETE `/api/essays/:id` (1h)

Deletar redação (soft delete).

```typescript
// src/app/api/essays/[id]/route.ts
// Output: { message: "Redação deletada" }

async function DELETE(request, { params }) {
  const session = await getSession();
  
  const essay = await prisma.essay.findUnique({
    where: { id: params.id }
  });
  
  if (!essay || essay.userId !== session.userId) {
    throw new AuthorizationError();
  }
  
  // Para verdadeiro soft delete, seria: status: "DELETED"
  await prisma.essay.delete({
    where: { id: params.id }
  });
  
  return successResponse({ message: "Deletado" });
}
```

---

## 📋 Checklist Fase 2

```
Antes de começar:
- [ ] Fase 1 completamente funcional
- [ ] PostgreSQL rodando
- [ ] npm install já executado

Implementação:
- [ ] POST /api/auth/refresh
- [ ] POST /api/auth/forgot-password (com schema)
- [ ] GET /api/questions (com paginação)
- [ ] POST /api/questions/[id]/answer
- [ ] GET /api/progress
- [ ] POST /api/essays
- [ ] GET /api/essays/[id]
- [ ] DELETE /api/essays/[id]

Testes:
- [ ] Testar cada endpoint com cURL/Postman
- [ ] Verificar validação de inputs
- [ ] Verificar autorização (não outro usuário)
- [ ] Verificar integração com banco de dados

Documentação:
- [ ] Adicionar comentários nas APIs
- [ ] Atualizar swagger/postman collection
```

---

## 🚀 Como Começar Fase 2

```bash
# 1. Crie pasta para APIs de questões
mkdir -p src/app/api/questions
mkdir -p src/app/api/essays
mkdir -p src/app/api/progress

# 2. Começe com a mais simples: POST /auth/refresh

# 3. Teste cada uma conforme implementa

# 4. Depois integre no frontend (Fase 3)
```

---

## 📊 Dependências Adicionais (se necessário)

```bash
# Email (para forgot-password)
npm install nodemailer
npm install -D @types/nodemailer

# Opcional: Rate limiting avançado
npm install redis

# Opcional: Job queue para envio de email
npm install bull
```

---

## 🎯 Próxima Fase (Fase 3)

Depois de Fase 2 completa:

- [ ] Conectar formulários de login/register às APIs
- [ ] Implementar loading states
- [ ] Adicionar error handling no frontend
- [ ] Testar fluxo completo de autenticação
- [ ] Popuar dashboard com dados reais

---

**Pré-requisito**: Fase 1 100% completa
**Estimado**: 1 semana
**Próximo Review**: 30/03/2026
