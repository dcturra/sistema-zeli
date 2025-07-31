@echo off
echo ========================================
echo    MIGRACAO PARA MONGODB - DIARIO ZELI
echo ========================================
echo.

echo [1/6] Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: Node.js nao encontrado!
    echo Por favor, instale o Node.js de: https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js encontrado!

echo.
echo [2/6] Instalando dependencias...
npm install
if errorlevel 1 (
    echo ERRO: Falha ao instalar dependencias!
    pause
    exit /b 1
)
echo Dependencias instaladas com sucesso!

echo.
echo [3/6] Criando arquivo .env...
if not exist .env (
    echo MONGODB_URI=mongodb+srv://seu_usuario:sua_senha@seu_cluster.mongodb.net/diario_zeli?retryWrites=true&w=majority > .env
    echo PORT=3000 >> .env
    echo JWT_SECRET=sua_chave_secreta_aqui >> .env
    echo NODE_ENV=development >> .env
    echo Arquivo .env criado!
    echo IMPORTANTE: Configure sua string de conexao do MongoDB no arquivo .env
) else (
    echo Arquivo .env ja existe!
)

echo.
echo [4/6] Atualizando index.html...
powershell -Command "(Get-Content index.html) -replace 'script\.js\?v=1\.1', 'script-mongodb.js?v=1.2' | Set-Content index.html"
echo index.html atualizado!

echo.
echo [5/6] Criando backup dos dados atuais...
if exist backup-mongodb-migration.zip (
    del backup-mongodb-migration.zip
)
powershell -Command "Compress-Archive -Path '*.html', '*.css', '*.js', '*.json', '*.md' -DestinationPath 'backup-mongodb-migration.zip' -Force"
echo Backup criado: backup-mongodb-migration.zip

echo.
echo [6/6] Verificando estrutura...
if exist server.js (
    echo Servidor Node.js: OK
) else (
    echo ERRO: server.js nao encontrado!
    pause
    exit /b 1
)

if exist script-mongodb.js (
    echo Script MongoDB: OK
) else (
    echo ERRO: script-mongodb.js nao encontrado!
    pause
    exit /b 1
)

echo.
echo ========================================
echo    MIGRACAO CONCLUIDA COM SUCESSO!
echo ========================================
echo.
echo PROXIMOS PASSOS:
echo 1. Configure sua string de conexao do MongoDB no arquivo .env
echo 2. Execute: npm start
echo 3. Acesse: http://localhost:3000
echo.
echo Para mais detalhes, consulte: MONGODB_SETUP_GUIDE.md
echo.
pause 