# Script de Deploy para Sistema Zeli - PowerShell
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    DEPLOY SISTEMA ZELI - GITHUB PAGES" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se o Git está instalado
Write-Host "1. Verificando se o Git está instalado..." -ForegroundColor Yellow
try {
    $gitVersion = git --version 2>$null
    if ($gitVersion) {
        Write-Host "Git encontrado: $gitVersion" -ForegroundColor Green
    } else {
        throw "Git não encontrado"
    }
} catch {
    Write-Host "ERRO: Git não está instalado!" -ForegroundColor Red
    Write-Host "Por favor, instale o Git em: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host "Após instalar, reinicie o PowerShell e execute este script novamente." -ForegroundColor Yellow
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host ""

# Verificar se estamos na pasta correta
Write-Host "2. Verificando arquivos do projeto..." -ForegroundColor Yellow
$requiredFiles = @("index.html", "styles.css", "script.js", "manifest.json")
$missingFiles = @()

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "✓ $file encontrado" -ForegroundColor Green
    } else {
        Write-Host "✗ $file não encontrado" -ForegroundColor Red
        $missingFiles += $file
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Host ""
    Write-Host "ERRO: Alguns arquivos estão faltando!" -ForegroundColor Red
    Write-Host "Arquivos faltando: $($missingFiles -join ', ')" -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host ""

# Inicializar Git
Write-Host "3. Inicializando repositório Git..." -ForegroundColor Yellow
if (-not (Test-Path ".git")) {
    git init
    Write-Host "Repositório inicializado!" -ForegroundColor Green
} else {
    Write-Host "Repositório já existe!" -ForegroundColor Green
}

Write-Host ""

# Adicionar arquivos
Write-Host "4. Adicionando arquivos..." -ForegroundColor Yellow
git add .
Write-Host "Arquivos adicionados!" -ForegroundColor Green

Write-Host ""

# Fazer commit
Write-Host "5. Fazendo commit..." -ForegroundColor Yellow
$commitMessage = "Deploy Sistema Zeli - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
git commit -m $commitMessage
Write-Host "Commit realizado!" -ForegroundColor Green

Write-Host ""

# Configurar GitHub
Write-Host "6. Configurando GitHub..." -ForegroundColor Yellow
Write-Host ""
Write-Host "IMPORTANTE: Agora você precisa:" -ForegroundColor Cyan
Write-Host "1. Criar um repositório no GitHub chamado 'sistema-zeli'" -ForegroundColor White
Write-Host "2. Copiar a URL do repositório" -ForegroundColor White
Write-Host "3. Colar a URL quando solicitado" -ForegroundColor White
Write-Host ""

$repoUrl = Read-Host "Cole a URL do seu repositório GitHub"

# Conectar ao GitHub
Write-Host ""
Write-Host "7. Conectando ao GitHub..." -ForegroundColor Yellow
try {
    git remote add origin $repoUrl
    Write-Host "Conectado ao GitHub!" -ForegroundColor Green
} catch {
    Write-Host "Aviso: Remote já existe, tentando atualizar..." -ForegroundColor Yellow
    git remote set-url origin $repoUrl
    Write-Host "Remote atualizado!" -ForegroundColor Green
}

Write-Host ""

# Enviar para GitHub
Write-Host "8. Enviando para GitHub..." -ForegroundColor Yellow
try {
    git push -u origin main
    Write-Host "Enviado para GitHub!" -ForegroundColor Green
} catch {
    Write-Host "Tentando com branch master..." -ForegroundColor Yellow
    git push -u origin master
    Write-Host "Enviado para GitHub!" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "           DEPLOY CONCLUÍDO!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Yellow
Write-Host "1. Vá para seu repositório no GitHub" -ForegroundColor White
Write-Host "2. Settings > Pages" -ForegroundColor White
Write-Host "3. Source: Deploy from a branch" -ForegroundColor White
Write-Host "4. Branch: main (ou master)" -ForegroundColor White
Write-Host "5. Folder: / (root)" -ForegroundColor White
Write-Host "6. Save" -ForegroundColor White
Write-Host ""
Write-Host "Seu site estará disponível em:" -ForegroundColor Yellow
$userName = $repoUrl -replace "https://github.com/", "" -replace "/sistema-zeli.git", ""
Write-Host "https://$userName.github.io/sistema-zeli" -ForegroundColor Green
Write-Host ""
Read-Host "Pressione Enter para sair" 