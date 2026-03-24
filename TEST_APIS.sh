#!/usr/bin/env bash
# Test Phase 1 APIs

API_URL="http://localhost:3000/api"

echo "=== TESTE FASE 1 - APIs de Autenticação ==="
echo ""

# 1. Register
echo "1️⃣  POST /api/auth/register"
echo "Criando novo usuário..."
curl -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste Novo",
    "email": "novo@vestibulai.com",
    "password": "TestPassword123!"
  }' | jq '.' || echo "❌ Registro falhou"

echo ""
echo "---"
echo ""

# 2. Login
echo "2️⃣  POST /api/auth/login"
echo "Fazendo login com teste@vestibulai.com..."
# Note: Você precisará usar a senha hash correta
curl -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@vestibulai.com",
    "password": "TestPassword123!"
  }' | jq '.' || echo "❌ Login falhou"

echo ""
echo "---"
echo ""

# 3. Me (Get current user)
echo "3️⃣  GET /api/auth/me"
echo "Pegando dados do usuário atual (requer token)..."
curl -X GET "$API_URL/auth/me" \
  -H "Authorization: Bearer YOU_TOKEN_HERE" | jq '.' || echo "❌ Falhou (token necessário)"

echo ""
echo "---"
echo ""

# 4. Logout
echo "4️⃣  POST /api/auth/logout"
echo "Fazendo logout..."
curl -X POST "$API_URL/auth/logout" | jq '.' || echo "❌ Logout falhou"

echo ""
echo "✅ Testes Concluídos"
