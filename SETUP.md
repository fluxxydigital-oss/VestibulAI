# 🚀 Guia de Setup - VestibulAI (Fase 1)

## ✅ Pré-requisitos

- Node.js 18+ ([Baixar](https://nodejs.org/))
- npm ou yarn
- PostgreSQL 14+ (local ou remoto)
- Git

## 📋 Passo 1: Clone e Instale Dependências

```bash
# Clone o repositório
git clone https://seu-repo.git
cd VestibulAI

# Instale as dependências
npm install

# Ou com yarn
yarn install
```

## 🗄️ Passo 2: Configure o Banco de Dados com Supabase

### Setup Supabase (Recomendado para desenvolvimento e produção)

```bash
# 1. Crie uma conta gratuita em https://supabase.com
# 2. Crie um novo projeto:
#    - Clique em "New Project"
#    - Nome: VestibulAI
#    - Senha: Guarde com segurança (admin password)
#    - Região: Escolha a mais próxima de você
#    - Plano: Free (para desenvolvimento)

# 3. Aguarde o projeto ser criado (~1-2 min)

# 4. Copie a Connection String:
#    - Vá em: Project Settings (ícone de engrenagem)
#    - Database > Connection pooling
#    - Modo: Transaction (padrão)
#    - Copie a string URI

# 5. Adicione ao .env.local:
DATABASE_URL="postgresql://postgres.[YOUR_PROJECT_ID]:[YOUR_PASSWORD]@db.[YOUR_PROJECT_ID].supabase.co:6543/postgres?schema=public"

# ✅ Seu banco está pronto na nuvem!
```

### Alternativa Local (Apenas para testes)

Se preferir PostgreSQL local para testes:

```bash
# 1. Instale PostgreSQL: https://www.postgresql.org/download/
# 2. Crie banco:
psql -U postgres
CREATE DATABASE vestibulai_dev;
\q

# 3. Use em .env.local:
DATABASE_URL="postgresql://postgres:password@localhost:5432/vestibulai_dev"
```

## 🔑 Passo 3: Configure Variáveis de Ambiente

### Copie e customize:

```bash
# 1. Copie .env.example para .env.local
cp .env.example .env.local

# 2. Edite .env.local com suas configurações
# Importante:
# - DATABASE_URL: sua string de conexão PostgreSQL
# - NEXTAUTH_SECRET: gere com:
openssl rand -base64 32
# - NEXTAUTH_URL: http://localhost:3000 (ou seu domínio)
```

## 📊 Passo 4: Configure o Prisma

```bash
# 1. Gere o cliente Prisma
npm run db:generate

# 2. Execute as migrations
npm run db:push

# 3. (Opcional) Abra Prisma Studio para visualizar dados
npm run prisma:studio
```

## 🎯 Passo 5: Inicie o Servidor de Desenvolvimento

```bash
# Inicie o Next.js em modo desenvolvimento
npm run dev

# Ou com yarn
yarn dev
```

Acesse em: **http://localhost:3000**

✅ **Verificação**: Se vir a página sem erros de conexão, seu banco Supabase está funcionando!

## 🧪 Testando as APIs de Autenticação

### Com Postman, Insomnia ou cURL

#### 1. Registrar um novo usuário

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@exemplo.com",
    "password": "SenhaForte123!",
    "confirmPassword": "SenhaForte123!",
    "targetCourse": "Medicina"
  }'
```

**Resposta esperada (201)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-aqui",
      "name": "João Silva",
      "email": "joao@exemplo.com",
      "targetCourse": "Medicina"
    },
    "accessToken": "jwt-token-aqui",
    "refreshToken": "jwt-refresh-token-aqui"
  }
}
```

#### 2. Fazer login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@exemplo.com",
    "password": "SenhaForte123!"
  }'
```

#### 3. Obter dados do usuário autenticado

```bash
# O token é salvo automaticamente em cookie
# Mas você também pode passar no header:
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer SEU-JWT-TOKEN"
```

#### 4. Fazer logout

```bash
curl -X POST http://localhost:3000/api/auth/logout
```

## ⚡ Comandos Úteis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor dev
npm run build            # Build para produção
npm start                # Inicia servidor produção

# Database
npm run db:generate      # Regenera cliente Prisma
npm run db:push          # Sincroniza schema com DB
npm run db:migrate       # Cria migration
npm run db:reset         # Reseta banco (CUIDADO!)
npm run db:seed          # Popula com dados de teste
npm run prisma:studio    # Abre GUI do Prisma

# Linting
npm run lint             # Verifica estilo de código
```

## 📁 Estrutura de Arquivos Criados (Fase 1)

```
src/
├── lib/
│   ├── auth.ts          ✅ Funções de autenticação
│   ├── schemas.ts       ✅ Validação com Zod
│   └── api-error.ts     ✅ Error handling
├── app/
│   └── api/
│       └── auth/
│           ├── register/   ✅ POST /api/auth/register
│           ├── login/      ✅ POST /api/auth/login
│           ├── me/         ✅ GET /api/auth/me
│           └── logout/     ✅ POST /api/auth/logout
├── middleware.ts        ✅ Validação JWT
└── ...

Raiz/
├── .env.example         ✅ Template de variáveis
├── .env.local           ✅ Configuração local
├── next.config.ts       ✅ Headers de segurança
└── package.json         ✅ Scripts atualizados
```

## 🐛 Troubleshooting

### "Erro: Cannot connect to database"
- [ ] Verifique se DATABASE_URL está correto em .env.local
- [ ] Certifique-se que copiou a CONNECTION STRING corretamente do Supabase
- [ ] Verifique se o projeto Supabase está ativo
- [ ] Entrar em supabase.com > seu projeto > Health para verificar status

### "Erro: NEXTAUTH_SECRET is not defined"
- [ ] Gere com: `openssl rand -base64 32`
- [ ] Adicione ao .env.local

### "Erro: Module not found '@prisma/client'"
- [ ] Execute: `npm run db:generate`
- [ ] Delete node_modules: `rm -rf node_modules`
- [ ] Reinstale: `npm install`

### "Erro: EADDRINUSE: port 3000 already in use"
```bash
# Libere a porta (ou use outra com PORT=3001)
lsof -i :3000          # Ver o processo
kill -9 <PID>          # Matar o processo
```

## 📚 Documentação Relacionada

- [ANALISE_PONTOS_FALHA.md](../ANALISE_PONTOS_FALHA.md) - Problemas identificados
- [PLANO_ACAO.md](../PLANO_ACAO.md) - Roadmap completo
- [Supabase Docs](https://supabase.com/docs) - Database documentation
- [Prisma Docs](https://www.prisma.io/docs/)
- [Next.js Docs](https://nextjs.org/docs)
- [JWT Docs](https://jwt.io/introduction)

## 🎓 Próximos Passos (Fase 2)

Depois que Fase 1 estiver pronta:

1. [ ] Criar mais APIs (questões, essays, progresso)
2. [ ] Implementar testes unitários
3. [ ] Completar páginas do dashboard
4. [ ] Conectar frontend com backend

---

**Status**: ✅ Fase 1 - Completa
**Última atualização**: 22/03/2026
**Próxima fase**: Semana 3
