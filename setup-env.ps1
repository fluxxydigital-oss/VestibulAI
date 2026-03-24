# Deletar .env.local
Remove-Item -Path ".env.local" -Force -ErrorAction SilentlyContinue

# Exibir DATABASE_URL atual
$env:DATABASE_URL = Get-Content .env | Select-String 'DATABASE_URL' | % { $_.Line.Split('=')[1].Trim('"') }
Write-Host "DATABASE_URL now: $($env:DATABASE_URL)"
