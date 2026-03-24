#!/usr/bin/env pwsh

Write-Host "=== TESTE CONEXÃO SUPABASE ===" -ForegroundColor Cyan

# Step 1: Install pg
Write-Host "`n[1/3] Instalando pg..." -ForegroundColor Yellow
npm install pg --legacy-peer-deps 2>&1 | Select-Object -Last 3

# Step 2: Run test
Write-Host "`n[2/3] Testando Conexão..." -ForegroundColor Yellow
node test-direct-connection.js

Write-Host "`n[3/3] Teste Concluído" -ForegroundColor Green
