@echo off
echo ========================================
echo    BACKUP AUTOMATICO - SISTEMA ZELI
echo ========================================
echo.

:: Criar pasta de backup com timestamp
set timestamp=%date:~-4,4%-%date:~-10,2%-%date:~-7,2%_%time:~0,2%-%time:~3,2%-%time:~6,2%
set timestamp=%timestamp: =0%
set backup_folder=backup-v%timestamp%

echo 1. Criando pasta de backup: %backup_folder%
mkdir %backup_folder%

echo 2. Copiando arquivos do sistema...
copy index.html %backup_folder%\
copy styles.css %backup_folder%\
copy script.js %backup_folder%\
copy manifest.json %backup_folder%\
copy README.md %backup_folder%\

echo 3. Criando arquivo de informações...
echo Backup criado em: %date% %time% > %backup_folder%\backup-info.txt
echo Versao do sistema: 1.1.0 >> %backup_folder%\backup-info.txt
echo Arquivos incluidos: >> %backup_folder%\backup-info.txt
dir %backup_folder%\*.html %backup_folder%\*.css %backup_folder%\*.js %backup_folder%\*.json %backup_folder%\*.md >> %backup_folder%\backup-info.txt

echo 4. Criando arquivo ZIP...
powershell Compress-Archive -Path "%backup_folder%\*" -DestinationPath "%backup_folder%.zip" -Force

echo 5. Limpando pasta temporaria...
rmdir /s /q %backup_folder%

echo.
echo ========================================
echo           BACKUP CONCLUIDO!
echo ========================================
echo.
echo Arquivo de backup: %backup_folder%.zip
echo.
echo Para restaurar:
echo 1. Extrair o arquivo ZIP
echo 2. Copiar os arquivos para a pasta do projeto
echo 3. Substituir os arquivos existentes
echo.
pause 