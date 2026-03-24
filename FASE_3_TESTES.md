# 🚀 Fase 3 - Guia de Testes Integração Front com Dados Reais

## 📋 Status Atual

### ✅ Completado
- Data seed com questões reais do ENEM
- APIs de autenticação, questões e progresso
- Hooks React para comunicação com APIs
- Página de login funcional com integração
- Página de questões com dados reais

### 🔄 Em Progresso
- Integração completa do dashboard
- Testes E2E

---

## 🧪 Teste 1: Login com Dados Reais

### Credentials
```
Email: joana.silva@email.com
Senha: 123456
```

### Passos
1. Acesse `http://localhost:3000/login`
2. Insira email e senha
3. Clique em "Entrar no sistema"
4. ✅ Deve redirecionar para `/dashboard`

### Resultado Esperado
- Cookies com auth_token e refresh_token estabelecidos
- Usuário vê suas informações no dashboard
- Status: 200 OK

---

## 🧪 Teste 2: Listar Questões Reais

### Request
```bash
GET http://localhost:3000/api/questions
Headers: {Authorization: "Bearer <access_token>"}
```

### Resultado Esperado
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "subject": "Biologia",
      "topic": "Genética",
      "difficulty": "medium",
      "question": "...",
      "options": [
        {"id": "a", "text": "..."},
        {"id": "b", "text": "..."},
        ...
      ],
      "correctAnswer": "b",
      "explanation": "..."
    }
  ]
}
```

---

## 🧪 Teste 3: Responder Questão

### Request
```bash
POST http://localhost:3000/api/questions/:id/answer
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "answer": "b"
}
```

### Resultado Esperado
```json
{
  "success": true,
  "data": {
    "correct": true,
    "xpGained": 25,
    "explanation": "O alelo recessivo..."
  }
}
```

---

## 🧪 Teste 4: Página de Questões Funcional

### Passos
1. Login em `http://localhost:3000/login`
2. Acesse `/dashboard/questions`
3. Selecione uma matéria (ex: Biologia)
4. Clique "INICIAR DESAFIO"
5. ✅ Questões reais devem carregar
6. Selecione uma alternativa
7. Clique "Confirmar Resposta"
8. ✅ Deve validar e mostrar resultado

### Comportamentos Esperados
- ✅ Questões carregam da API
- ✅ Submit valida com backend
- ✅ Feedback visual (certo/errado)
- ✅ XP atualizado

---

## 🧪 Teste 5: Progresso do Usuário

### Request
```bash
GET http://localhost:3000/api/progress
Headers: {Authorization: "Bearer <access_token>"}
```

### Resultado Esperado
```json
{
  "success": true,
  "data": {
    "totalXP": 0,
    "level": 1,
    "completedQuestions": 0,
    "subjectsProgress": [
      {
        "subjectId": "...",
        "name": "Biologia",
        "questionsCompleted": 0,
        "accuracy": 0
      }
    ]
  }
}
```

---

## 🐛 Checklist de Debugging

Se algo não funcionar:

### Login retorna 500
- [ ] Verifique se PrismaClient está inicializado corretamente
- [ ] Confira DATABASE_URL no .env
- [ ] Cheque se o usuário de seed foi criado no banco

### API retorna 401
- [ ] Verifique se token está sendo enviado
- [ ] Confira expiração do token (JWT_SECRET)
- [ ] Teste com `/api/auth/me` para validar token atual

### Questões não carregam
- [ ] Data seed foi executado? `npm run db:seed:real`
- [ ] Banco tem questões? Verifique via SQL
- [ ] API retorna erro? Confira logs do servidor

### Resposta não valida
- [ ] Verifique questionId no POST
- [ ] Confira formato do envio (JSON)
- [ ] Teste com cURL direto na API

---

## 🚀 Próximos Passos Phase 3

### 1. **Completar Dashboard**
```
src/app/dashboard/
├── materia/page.tsx (Exibir materias com progresso)
├── trilha/page.tsx (Trilha de estudos personalizadas)
├── redacao/page.tsx (Upload e correção de redações)
├── simulados/page.tsx (Simulados completos)
├── perfil/page.tsx (Informações do usuário)
├── assinatura/page.tsx (Planos e pagamento)
└── configuracoes/page.tsx (Preferências)
```

### 2. **Integrar Essay API**
- [ ] Criar componente de envio de redação
- [ ] Conectar POST `/api/essays`
- [ ] Implementar feedback visual

### 3. **Implementar Cache**
- [ ] Next.js cache para questões
- [ ] Revalidation tags
- [ ] Cliente-side caching

### 4. **Performance**
- [ ] Lazy load de questões
- [ ] Virtualização de listas
- [ ] Image optimization

---

## 📊 Métricas de Sucesso (Phase 3)

- [x] Dados reais populando banco
- [x] Login com integração completa
- [x] API retornando questões reais
- [ ] Dashboard exibindo dados do usuário
- [ ] Resposta a questões atualizando progresso
- [ ] Redações sendo processadas
- [ ] Performance > 90 Lighthouse

---

## 📝 Notas Importantes

### Data de Seed
- Script: `prisma/seeds/real-data.ts`
- Matérias: 9 (Todas do ENEM)
- Questões: 10 questões reais do ENEM
- Usuário teste: joana.silva@email.com / 123456
- Progresso: Pré-inicializado para 3 matérias

### Variáveis de Ambiente Necessárias
```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=<sua-chave-secreta>
JWT_EXPIRATION=86400
REFRESH_TOKEN_EXPIRATION=2592000
NODE_ENV=development
```

---

## 🆘 Suporte

Se encontrar problemas:

1. **Veja logs**: `tail -f .next/logs/*`
2. **Teste API direto**: Use Postman ou cURL
3. **Verifique banco**: `npx prisma studio`
4. **Reinicie server**: Ctrl+C e `npm run dev`

---

## ✅ Fase 3 - Conclusão

Quando passar em todos os testes:
1. [ ] Commit: "feat: Phase 3 - Integração Front com dados reais"
2. [ ] Push para repositório
3. [ ] Update `PLANO_ACAO.md` com Phase 3 completo
4. [ ] Iniciar Phase 4: Performance e Deploy
