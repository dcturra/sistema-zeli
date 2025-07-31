@echo off
echo ========================================
echo    DEPLOY SISTEMA ZELI - GITHUB PAGES
echo ========================================
echo.

echo 1. Verificando se o Git esta instalado...
git --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: Git nao encontrado!
    echo Por favor, instale o Git em: https://git-scm.com/
    pause
    exit /b 1
)
echo Git encontrado! ✓
echo.

echo 2. Inicializando repositorio Git...
if not exist .git (
    git init
    echo Repositorio inicializado! ✓
) else (
    echo Repositorio ja existe! ✓
)
echo.

echo 3. Adicionando arquivos...
git add .
echo Arquivos adicionados! ✓
echo.

echo 4. Fazendo commit...
git commit -m "Deploy Sistema Zeli - %date% %time%"
echo Commit realizado! ✓
echo.

echo 5. Configurando GitHub...
echo.
echo IMPORTANTE: Agora voce precisa:
echo 1. Criar um repositorio no GitHub chamado "sistema-zeli"
echo 2. Copiar a URL do repositorio
echo 3. Colar a URL quando solicitado
echo.
set /p repo_url="Cole a URL do seu repositorio GitHub: "

echo 6. Conectando ao GitHub...
git remote add origin %repo_url%
echo Conectado ao GitHub! ✓
echo.

echo 7. Enviando para GitHub...
git push -u origin main
echo Enviado para GitHub! ✓
echo.

echo ========================================
echo           DEPLOY CONCLUIDO!
echo ========================================
echo.
echo Proximos passos:
echo 1. Vá para seu repositorio no GitHub
echo 2. Settings > Pages
echo 3. Source: Deploy from a branch
echo 4. Branch: main
echo 5. Folder: / (root)
echo 6. Save
echo.
echo Seu site estará disponível em:
echo https://seu-usuario.github.io/sistema-zeli
echo.
pause 