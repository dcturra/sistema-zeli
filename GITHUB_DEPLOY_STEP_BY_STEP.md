# 🚀 Deploy no GitHub - Passo a Passo Completo

## ❌ **Problema Identificado: Git não está instalado**

Vamos resolver isso e fazer o deploy funcionar!

---

## 📥 **PASSO 1: Instalar o Git**

### **Opção A: Download Direto**
1. **Acesse**: https://git-scm.com/download/win
2. **Baixe** a versão para Windows
3. **Execute** o instalador
4. **Siga** as instruções (aceite as configurações padrão)
5. **Reinicie** o PowerShell/CMD

### **Opção B: Via Chocolatey (se tiver)**
```powershell
choco install git
```

### **Opção C: Via Winget (Windows 10/11)**
```powershell
winget install --id Git.Git -e --source winget
```

---

## ✅ **PASSO 2: Verificar Instalação**

Após instalar, abra um **novo** PowerShell e digite:
```powershell
git --version
```

Deve aparecer algo como: `git version 2.40.0.windows.1`

---

## 🔧 **PASSO 3: Configurar Git (Primeira vez)**

```powershell
# Configurar seu nome
git config --global user.name "Seu Nome"

# Configurar seu email
git config --global user.email "seu-email@exemplo.com"
```

---

## 📁 **PASSO 4: Preparar os Arquivos**

### **Verificar se todos os arquivos estão na pasta:**
- ✅ `index.html`
- ✅ `styles.css`
- ✅ `script.js`
- ✅ `manifest.json`
- ✅ `README.md`

---

## 🚀 **PASSO 5: Deploy Manual (Sem Script)**

### **Abra o PowerShell na pasta do projeto:**
```powershell
cd C:\Users\Adm\diario_zeli
```

### **1. Inicializar Git:**
```powershell
git init
```

### **2. Adicionar arquivos:**
```powershell
git add .
```

### **3. Fazer primeiro commit:**
```powershell
git commit -m "Primeira versão do Sistema Zeli"
```

### **4. Conectar ao seu repositório GitHub:**
```powershell
git remote add origin https://github.com/SEU-USUARIO/sistema-zeli.git
```
**⚠️ IMPORTANTE**: Substitua `SEU-USUARIO` pelo seu nome de usuário do GitHub

### **5. Enviar para GitHub:**
```powershell
git push -u origin main
```

---

## 🌐 **PASSO 6: Ativar GitHub Pages**

### **1. Vá para seu repositório no GitHub**
- Acesse: `https://github.com/SEU-USUARIO/sistema-zeli`

### **2. Clique em "Settings"**
- (Ícone de engrenagem no topo)

### **3. Role para baixo até "Pages"**
- (No menu lateral esquerdo)

### **4. Configure:**
- **Source**: "Deploy from a branch"
- **Branch**: "main"
- **Folder**: "/ (root)"
- **Clique em "Save"**

### **5. Aguarde alguns minutos**
- O GitHub vai fazer o deploy automaticamente

---

## 🎉 **PASSO 7: Acessar o Sistema**

### **URL do seu sistema:**
```
https://SEU-USUARIO.github.io/sistema-zeli
```

**⚠️ IMPORTANTE**: Substitua `SEU-USUARIO` pelo seu nome de usuário do GitHub

---

## 🔄 **PASSO 8: Atualizações Futuras**

### **Para fazer alterações:**
```powershell
# 1. Fazer alterações nos arquivos

# 2. Adicionar mudanças
git add .

# 3. Fazer commit
git commit -m "Descrição das mudanças"

# 4. Enviar para GitHub
git push
```

### **O GitHub Pages atualiza automaticamente!**

---

## ❓ **Problemas Comuns**

### **Erro: "fatal: not a git repository"**
```powershell
git init
```

### **Erro: "fatal: remote origin already exists"**
```powershell
git remote remove origin
git remote add origin https://github.com/SEU-USUARIO/sistema-zeli.git
```

### **Erro: "fatal: refusing to merge unrelated histories"**
```powershell
git pull origin main --allow-unrelated-histories
```

### **Erro: "fatal: The current branch main has no upstream branch"**
```powershell
git push -u origin main
```

---

## 📱 **Testar o Sistema**

### **1. Abra o link no navegador**
### **2. Teste todas as funcionalidades:**
- ✅ Preencher formulário
- ✅ Salvar registro
- ✅ Ver histórico
- ✅ Exportar dados
- ✅ Filtrar registros

### **3. Teste no celular:**
- ✅ Abrir no navegador mobile
- ✅ Testar responsividade
- ✅ Verificar se funciona offline

---

## 🎯 **Próximos Passos**

### **1. Compartilhar o link**
- Envie a URL para os técnicos
- Teste o acesso

### **2. Configurar backup**
- Exportar dados regularmente
- Salvar em local seguro

### **3. Monitorar uso**
- Verificar se está funcionando
- Coletar feedback

---

## 📞 **Precisa de Ajuda?**

### **Se algo não funcionar:**
1. **Verifique** se o Git está instalado
2. **Confirme** a URL do repositório
3. **Teste** os comandos um por um
4. **Verifique** as mensagens de erro

### **Recursos úteis:**
- **GitHub Docs**: https://docs.github.com/
- **Git Docs**: https://git-scm.com/doc
- **GitHub Pages**: https://pages.github.com/

---

**🎉 Com esses passos, seu sistema estará online em poucos minutos!** 