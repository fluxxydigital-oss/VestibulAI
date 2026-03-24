# 🚀 FASE 2 - Guia de Testes das APIs

Data: 23/03/2026  
Status: ✅ Todas as 8 APIs implementadas  

---

## 📋 APIs Implementadas

| # | Endpoint | Método | Status |
|---|----------|--------|--------|
| 1 | `/api/auth/refresh` | POST | ✅ |
| 2 | `/api/auth/forgot-password` | POST | ✅ |
| 3 | `/api/questions` | GET | ✅ |
| 4 | `/api/questions/[id]/answer` | POST | ✅ |
| 5 | `/api/progress` | GET | ✅ |
| 6 | `/api/essays` | POST | ✅ |
| 7 | `/api/essays/[id]` | GET | ✅ |
| 8 | `/api/essays/[id]` | DELETE | ✅ |

---

## 🧪 Como Testar

### Pré-requisitos

1. **Servidor rodando**: `npm run dev`
2. **Banco de dados**: PostgreSQL conectado e com dados
3. **Tool de requisição**: cURL, Postman ou insomnia

### Setup Inicial

#### 1️⃣ Primeiro, registre um usuário (já existe via Fase 1)

```bash
# Ou use um usuário existente
EMAIL="joana.silva@email.com"
PASSWORD_HASH="$2a$12$..." # (já no banco)
```

#### 2️⃣ Faça login para obter tokens

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joana.silva@email.com",
    "password": "123456"
  }' \
  -v
```

**Resposta esperada:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "joana.silva@email.com",
      "name": "Joana Silva"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

## 🔑 Endpoints por Prioridade

### ALTA PRIORIDADE

#### 1. GET `/api/questions` - Listar Questões

```bash
# Sem filtros
curl -X GET "http://localhost:3000/api/questions?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -v

# Com filtros
curl -X GET "http://localhost:3000/api/questions?subjectId=SUBJECT_ID&difficulty=3&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -v
```

**Resposta esperada:**
```json
{
  "success": true,
  "data": {
    "questions": [
      {
        "id": "question-uuid",
        "statement": "Qual é a capital da França?",
        "options": [
          { "id": "opt1", "text": "Paris" },
          { "id": "opt2", "text": "Lyon" }
        ],
        "difficulty": 1,
        "subject": { "id": "subj-uuid", "name": "Geografia" }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 150,
      "totalPages": 15
    }
  }
}
```

---

#### 2. POST `/api/questions/[id]/answer` - Submeter Resposta

```bash
# Obtenha um ID de questão da lista acima
QUESTION_ID="question-uuid"

curl -X POST "http://localhost:3000/api/questions/${QUESTION_ID}/answer" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "selectedOptionId": "opt1"
  }' \
  -v
```

**Resposta esperada:**
```json
{
  "success": true,
  "data": {
    "isCorrect": true,
    "correctOptionId": "opt1",
    "correctOptionText": "Paris",
    "explanation": "ENEM 2023",
    "userProgress": {
      "questionsAnswered": 1,
      "correctAnswers": 1,
      "accuracy": "100.0"
    }
  }
}
```

---

#### 3. GET `/api/progress` - Obter Progresso do Usuário

```bash
curl -X GET "http://localhost:3000/api/progress" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -v
```

**Resposta esperada:**
```json
{
  "success": true,
  "data": {
    "bySubject": [
      {
        "subjectId": "subj-uuid",
        "subjectName": "Matemática",
        "questionsAnswered": 5,
        "correctAnswers": 4,
        "accuracy": 80.0,
        "estimatedLevel": 2.5,
        "lastActivityAt": "2026-03-23T10:30:00Z"
      }
    ],
    "overall": {
      "totalQuestionsAnswered": 15,
      "totalCorrectAnswers": 12,
      "overallAccuracy": 80.0,
      "averageLevel": 2.50,
      "subjectsWithProgress": 3
    }
  }
}
```

---

### MÉDIA PRIORIDADE

#### 4. POST `/api/essays` - Submeter Redação

```bash
curl -X POST "http://localhost:3000/api/essays" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "theme": "O Impacto da Tecnologia na Educação",
    "content": "A tecnologia tem revolucionado completamente a forma como aprendemos e ensinamos. Desde o surgimento da internet, as escolas e universidades vêm apresentando uma transformação significativa em suas metodologias de ensino. Neste contexto, é fundamental analisar como as ferramentas tecnológicas modificaram a educação e quais são os desafios dessa transição..."
  }' \
  -v
```

**Resposta esperada:**
```json
{
  "success": true,
  "data": {
    "essayId": "essay-uuid",
    "status": "SUBMITTED",
    "createdAt": "2026-03-23T10:30:00Z",
    "message": "Redação enviada com sucesso para avaliação"
  }
}
```

---

#### 5. GET `/api/essays/[id]` - Obter Detalhes da Redação

```bash
ESSAY_ID="essay-uuid"

curl -X GET "http://localhost:3000/api/essays/${ESSAY_ID}" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -v
```

**Resposta esperada:**
```json
{
  "success": true,
  "data": {
    "essay": {
      "id": "essay-uuid",
      "theme": "O Impacto da Tecnologia na Educação",
      "content": "A tecnologia tem revolucionado...",
      "status": "SUBMITTED",
      "score": null,
      "feedback": null,
      "createdAt": "2026-03-23T10:30:00Z",
      "updatedAt": "2026-03-23T10:30:00Z"
    }
  }
}
```

---

#### 6. DELETE `/api/essays/[id]` - Deletar Redação

```bash
ESSAY_ID="essay-uuid"

curl -X DELETE "http://localhost:3000/api/essays/${ESSAY_ID}" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -v
```

**Resposta esperada:**
```json
{
  "success": true,
  "data": {
    "message": "Redação deletada com sucesso"
  }
}
```

---

### OUTRAS APIs

#### 7. POST `/api/auth/refresh` - Renovar Access Token

```bash
curl -X POST "http://localhost:3000/api/auth/refresh" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_REFRESH_TOKEN" \
  -v
```

**Resposta esperada:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

#### 8. POST `/api/auth/forgot-password` - Recuperar Senha

```bash
curl -X POST "http://localhost:3000/api/auth/forgot-password" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joana.silva@email.com"
  }' \
  -v
```

**Resposta esperada:**
```json
{
  "success": true,
  "data": {
    "message": "Se o e-mail existir em nosso sistema, um link de recuperação será enviado",
    "demo": {
      "resetLink": "http://localhost:3000/reset-password?token=eyJhbGciOiJIUzI1NiIs..."
    }
  }
}
```

---

## ✅ Checklist de Testes Manuais

```
[ ] POST /api/auth/login - Obter tokens
[ ] GET /api/questions - Listar questões sem filtros
[ ] GET /api/questions - Listar com filtro de matéria
[ ] GET /api/questions - Listar com filtro de dificuldade
[ ] POST /api/questions/[id]/answer - Resposta correta
[ ] POST /api/questions/[id]/answer - Resposta incorreta
[ ] GET /api/progress - Progresso após respostas
[ ] POST /api/essays - Submeter redação válida
[ ] POST /api/essays - Submeter com conteúdo muito curto (erro)
[ ] GET /api/essays/[id] - Obter redação própria
[ ] GET /api/essays/[id] - Tentar obter redação de outro usuário (erro 403)
[ ] DELETE /api/essays/[id] - Deletar redação própria
[ ] DELETE /api/essays/[id] - Tentar deletar de outro usuário (erro 403)
[ ] POST /api/auth/refresh - Renovar token expirado
[ ] POST /api/auth/forgot-password - Solicitar reset de senha
[ ] GET /api/questions - Sem autenticação (erro 401)
```

---

## 🐛 Troubleshooting

### Erro: "Module has no exported member 'prisma'"
✅ **Resolvido**: Atualizamos para usar `getPrisma()`

### Erro: "Unauthorized"
- Verifique se o `Authorization` header está incluído
- Token pode estar expirado, use `/api/auth/refresh`

### Erro: "Not Found"
- Verifique se o `id` da questão/redação existe
- Use `/api/questions` para obter IDs válidos

### Erro de Validação
- Verifique o schema de validação
- Cumpra os requisitos mínimos (ex: redação > 100 caracteres)

---

## 📊 Resumo Fase 2

- ✅ 8 APIs implementadas
- ✅ Validação de inputs com Zod
- ✅ Autenticação em todos os endpoints protegidos
- ✅ Tratamento de erros consistente
- ✅ Integração com Prisma/PostgreSQL

**Próximo passo**: Integrar essas APIs ao frontend (Fase 3)

