@echo off
echo ========================================
echo    MIGRACAO PARA AZURE STATIC WEB APPS
echo ========================================
echo.

echo [1/5] Fazendo backup do sistema atual...
if not exist "backup-local" mkdir backup-local
copy "script.js" "backup-local\script-local.js"
copy "index.html" "backup-local\index-local.html"
echo ✅ Backup criado em backup-local\

echo.
echo [2/5] Substituindo script.js pela versao Azure...
if exist "script-azure.js" (
    copy "script-azure.js" "script.js"
    echo ✅ Script Azure aplicado
) else (
    echo ❌ Arquivo script-azure.js nao encontrado!
    pause
    exit /b 1
)

echo.
echo [3/5] Atualizando index.html...
powershell -Command "(Get-Content 'index.html') -replace '\?v=1\.1', '' | Set-Content 'index.html'"
echo ✅ Cache-busting removido

echo.
echo [4/5] Verificando arquivos da API...
if not exist "api" (
    echo ❌ Pasta api nao encontrada!
    echo    Certifique-se de que os arquivos da API foram criados
    pause
    exit /b 1
)

if not exist "host.json" (
    echo ❌ Arquivo host.json nao encontrado!
    pause
    exit /b 1
)

if not exist "package.json" (
    echo ❌ Arquivo package.json nao encontrado!
    pause
    exit /b 1
)

echo ✅ Todos os arquivos da API encontrados

echo.
echo [5/5] Preparando para commit...
echo.
echo ========================================
echo    MIGRACAO CONCLUIDA!
echo ========================================
echo.
echo 📋 Proximos passos:
echo 1. Criar conta Azure (se nao tiver)
echo 2. Criar Cosmos DB
echo 3. Criar Azure Static Web Apps
echo 4. Configurar variaveis de ambiente
echo 5. Fazer commit e push
echo.
echo 📖 Consulte o arquivo AZURE_DEPLOY_GUIDE.md
echo    para instrucoes detalhadas
echo.
echo 💡 Para reverter: use os arquivos em backup-local\
echo.
pause 