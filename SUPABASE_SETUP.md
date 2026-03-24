# 🚀 Guia Rápido - Setup Supabase + VestibulAI

## ⏱️ Tempo Total: 15 minutos

---

## 1️⃣ Criar Conta Supabase (3 min)

```
1. Acesse: https://supabase.com
2. Clique em "Sign Up"
3. Use GitHub / Google / Email
4. Confirme seu email
```

---

## 2️⃣ Criar Projeto (5 min)

```
1. Clique em "New Project"
2. Preencha:
   ├─ Name: VestibulAI
   ├─ Password: SenhaForte123! (guarde isso!)
   ├─ Region: Escolha próximo (ex: São Paulo se disponível)
   └─ Plano: Free (gratuito para dev)

3. Clique "Create new project"
4. Aguarde ~1-2 minutos (processando...)
```

---

## 3️⃣ Copiar Connection String (5 min)

### ⭐ Forma RÁPIDA (Recomendada):

```
1. No Dashboard do Supabase, clique em "Home" (ou vá à página inicial do projeto)
2. Procure pela seção "CONNECTION STRINGS" ou "Quick start"
3. Você verá várias opções:
   - JavaScript
   - Python
   - URI        ← ⭐ PEGUE DESTA!
   - PSQL
   
4. Clique no ícone de copiar (copy icon) ao lado de URI
5. Você copiou! ✅

6. Cole em .env.local:
   DATABASE_URL="<string-que-copiou>"
```

### 📍 Forma ALTERNATIVA (Se não achou):

```
1. Clique em Settings (engrenagem no canto superior)
2. Vá em "Database" (menu lateral esquerdo)
3. Procure por "Connection pooling"
4. Copie a string (já está pronta)
```

### ⚠️ IMPORTANTE - Substituições Necessárias:

```
ANTES:
postgresql://postgres:YOUR_PASSWORD@db.xxxxxx.supabase.co:6543/postgres?schema=public

DEPOIS:
postgresql://postgres:SenhaQueVoceCriou@db.xxxxxx.supabase.co:6543/postgres?schema=public
```

❌ **NÃO coloque [PASSWORD]** - substitua pelo texto real!

Exemplo:
```
DATABASE_URL="postgresql://postgres:SenhaForte123!@db.abcd1234.supabase.co:6543/postgres?schema=public&sslmode=require"
```

---

## 4️⃣ Setup do Projeto (2 min)

```bash
cd "c:\Users\Leo\Documents\Projetos\VestibulAI"

# Crie as tabelas no Supabase
npm run db:push

# Popule com dados de teste
npm run db:seed

# Inicie o servidor
npm run dev
```

✅ **Pronto!** Seu banco está na nuvem

---

## 🔑 Como Encontrar Seus Dados no Supabase

**Project ID:**
- Settings > Project Settings > Reference ID

**Password:**
- A senha que você criou no início

**Confirmar Conexão:**
```
1. Vá em: https://supabase.com/dashboard
2. Seu projeto > SQL Editor
3. Clique em "New Query"
4. Escreva: SELECT * FROM "User";
5. Clique "Run"
6. Se vir a tabela, conectou com sucesso! ✅
```

---

## 💡 Dicas

| O que fazer | Como |
|-----------|------|
| Ver todos os dados | SQL Editor > New Query > SELECT * FROM table_name; |
| Resetar banco | SQL Editor > Run: DELETE FROM "Essay" CASCADE; etc |
| Fazer backup | Backups (menu lateral) > Back up now |
| Adicionar usuário | Auth > Users > Add user |
| Ver logs | Logs > Database logs |

---

## ✅ Verificação

Seu setup está 100% pronto quando:

- [x] Conta Supabase criada
- [x] Projeto criado
- [x] Connection String copiada para .env.local
- [x] `npm run db:push` executado sem erros
- [x] `npm run db:seed` executado sem erros
- [x] `npm run dev` rodando em http://localhost:3000
- [x] Pode fazer login/register e dados salvam no Supabase ✅

---

## 🆘 Problemas?

**"Invalid connection string"**
- Verifique se copiou completo
- Substitua [PASSWORD] pela senha real
- Substitua [PROJECT_ID] pelo ID real

**"Cannot connect to database"**
- Verifique se DATABASE_URL está em .env.local
- Reinicie o server: Ctrl+C e npm run dev

**"Syntax error in connection string"**
- Certifique-se de incluir: ?schema=public
- Não adicione caracteres extras

---

## 📞 Próximo

Depois de pronto:
1. Teste as APIs: [LEIA_PRIMEIRO.md](./LEIA_PRIMEIRO.md)
2. Comece FASE 2: [FASE_2_PLANO.md](./FASE_2_PLANO.md)

---

**Feito? Parabéns! 🎉 Banco na nuvem pronto!**
