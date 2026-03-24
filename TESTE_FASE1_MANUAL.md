# TEST FASE 1 - API REST Manual

## 🚀 Iniciar servidor de desenvolvimento

```powershell
npm run dev
```

O servidor estará em `http://localhost:3000`

---

## 1️⃣ TESTE: POST /api/auth/register

**Criar novo usuário**

```powershell
$body = @{
    name = "Novo Usuário"
    email = "novo123@vestibulai.com"
    password = "TestPassword123!"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/auth/register" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

**Resposta esperada:**
- **Status**: 201 Created
- **Body**: `{ user: { id, email, name }, accessToken, refreshToken }`

---

## 2️⃣ TESTE: POST /api/auth/login

**Fazer login com credenciais**

```powershell
$body = @{
    email = "teste@vestibulai.com"
    password = "TestPassword123!"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:3000/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body

$response.Content | ConvertFrom-Json
```

**Resposta esperada:**
- **Status**: 200 OK
- **Body**: `{ user, accessToken, refreshToken }`
- **Headers**: Set-Cookie com HTTP-only token

---

## 3️⃣ TESTE: GET /api/auth/me

**Recuperar usuário atual (com token)**

```powershell
# Copie o accessToken do login acima
$token = "YOUR_ACCESS_TOKEN"

Invoke-WebRequest -Uri "http://localhost:3000/api/auth/me" `
  -Method GET `
  -Headers @{ Authorization = "Bearer $token" }
```

**Resposta esperada:**
- **Status**: 200 OK
- **Body**: `{ id, email, name, createdAt, updatedAt }`

---

## 4️⃣ TESTE: POST /api/auth/logout

**Fazer logout (limpar cookies)**

```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/auth/logout" `
  -Method POST `
  -UseBasicParsing
```

**Resposta esperada:**
- **Status**: 200 OK
- **Headers**: Set-Cookie com token expirado

---

## 📊 Dados de Teste Disponíveis

**Usuários:**
- Email: `teste@vestibulai.com`
- Email: `joao@vestibulai.com`
- Email: `maria@vestibulai.com`

**Matérias:**
- Matemática, Português, Biologia, História, Física

**Questões:**
- 4 questões de exemplo inseridas

---

## ✅ Checklist de Funcionamento

- [ ] Register retorna 201 Created com tokens
- [ ] Login retorna 200 OK e tokens validos
- [ ] Me retorna 200 OK com dados do usuário
- [ ] Me retorna 401 sem token válido
- [ ] Logout retorna 200 OK e limpa session

---

## 🔍 Verificar Database

```powershell
# Listar usuários
SELECT * FROM "User";

# Listar matérias
SELECT * FROM "Subject";

# Listar questões
SELECT * FROM "Question";
```

Use o SQL Editor do Supabase em: https://supabase.com/dashboard
