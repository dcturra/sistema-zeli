# 🔄 Controle de Versão - Sistema Zeli

## 🎯 **Estratégia de Controle de Versão**

### **Antes de Fazer Alterações:**
1. **Sempre criar uma branch** para novas funcionalidades
2. **Fazer commits frequentes** com mensagens descritivas
3. **Criar tags** para versões estáveis
4. **Manter backup** dos arquivos importantes

---

## 📋 **Comandos Essenciais no GitHub Codespaces**

### **1. Verificar Status Atual**
```bash
git status
git log --oneline -10
```

### **2. Criar Branch para Nova Funcionalidade**
```bash
# Criar e mudar para nova branch
git checkout -b feature/nova-funcionalidade

# Ou criar branch sem mudar
git branch feature/nova-funcionalidade
git checkout feature/nova-funcionalidade
```

### **3. Fazer Commits Frequentes**
```bash
# Adicionar arquivos
git add .

# Commit com mensagem descritiva
git commit -m "Adicionar funcionalidade X - descrição detalhada"

# Enviar para GitHub
git push origin feature/nova-funcionalidade
```

### **4. Criar Tag para Versão Estável**
```bash
# Tag para versão atual (v1.0.0)
git tag -a v1.0.0 -m "Versão 1.0.0 - Sistema estável"

# Enviar tag para GitHub
git push origin v1.0.0
```

---

## 🔄 **Rollback - Como Voltar a Versões Anteriores**

### **Opção 1: Voltar ao Último Commit Estável**
```bash
# Ver histórico de commits
git log --oneline

# Voltar ao commit específico (substitua HASH pelo hash do commit)
git reset --hard HASH

# Forçar push (CUIDADO: isso apaga commits posteriores)
git push --force origin main
```

### **Opção 2: Voltar a uma Tag Específica**
```bash
# Ver todas as tags
git tag -l

# Voltar à tag específica
git checkout v1.0.0

# Criar branch a partir da tag
git checkout -b rollback-v1.0.0
```

### **Opção 3: Reverter Último Commit**
```bash
# Reverter último commit (mantém histórico)
git revert HEAD

# Push das alterações
git push origin main
```

---

## 🏷️ **Sistema de Versionamento**

### **Estrutura de Versões:**
- **v1.0.0** - Versão inicial estável
- **v1.1.0** - Novas funcionalidades (medicamentos)
- **v1.1.1** - Correções de bugs
- **v2.0.0** - Mudanças grandes

### **Criar Versão Atual:**
```bash
# No GitHub Codespaces
git tag -a v1.1.0 -m "Versão 1.1.0 - Sistema com medicamentos"
git push origin v1.1.0
```

---

## 📁 **Backup Manual dos Arquivos**

### **Antes de Fazer Alterações:**
1. **Copiar arquivos** para pasta de backup:
   ```bash
   # No seu computador
   mkdir backup-v1.1.0
   copy index.html backup-v1.1.0\
   copy styles.css backup-v1.1.0\
   copy script.js backup-v1.1.0\
   copy manifest.json backup-v1.1.0\
   ```

2. **Criar arquivo de backup** com timestamp:
   ```bash
   # Nome do arquivo: backup-YYYY-MM-DD-HH-MM.zip
   # Conteúdo: todos os arquivos do sistema
   ```

---

## 🔧 **Workflow Recomendado**

### **Para Novas Funcionalidades:**
```bash
# 1. Criar branch
git checkout -b feature/nova-funcionalidade

# 2. Fazer alterações
# 3. Testar localmente
# 4. Commit frequente
git add .
git commit -m "Implementar funcionalidade X"

# 5. Se tudo funcionar, merge para main
git checkout main
git merge feature/nova-funcionalidade

# 6. Criar tag
git tag -a v1.2.0 -m "Versão 1.2.0 - Nova funcionalidade"
git push origin main
git push origin v1.2.0
```

### **Se Algo Der Errado:**
```bash
# 1. Voltar à versão anterior
git reset --hard v1.1.0

# 2. Forçar push
git push --force origin main

# 3. Ou restaurar backup manual
# Copiar arquivos da pasta de backup
```

---

## 📊 **Monitoramento de Versões**

### **Arquivo de Changelog:**
Criar arquivo `CHANGELOG.md`:
```markdown
# Changelog - Sistema Zeli

## [1.1.0] - 2024-01-XX
### Adicionado
- Sistema de medicamentos com checkboxes
- Gerenciamento de medicamentos
- Campo "Outros" para medicações
- Seção de medicamentos no histórico

## [1.0.0] - 2024-01-XX
### Adicionado
- Sistema básico de sinais vitais
- Formulário de registro
- Histórico de registros
- Exportação de dados
```

---

## 🚨 **Procedimento de Emergência**

### **Se o Sistema Quebrar:**
1. **NÃO FAÇA MAIS ALTERAÇÕES**
2. **Vá para GitHub Codespaces**
3. **Execute rollback:**
   ```bash
   git log --oneline
   git reset --hard HASH_DO_ULTIMO_COMMIT_ESTAVEL
   git push --force origin main
   ```
4. **Teste o sistema**
5. **Se necessário, restaure backup manual**

---

## 💡 **Dicas de Segurança**

### **Antes de Cada Alteração:**
- ✅ Fazer commit da versão atual
- ✅ Criar tag se for versão estável
- ✅ Fazer backup manual dos arquivos
- ✅ Testar em ambiente local

### **Durante Desenvolvimento:**
- ✅ Commits pequenos e frequentes
- ✅ Mensagens descritivas
- ✅ Testar cada funcionalidade
- ✅ Não fazer push direto na main

### **Após Implementação:**
- ✅ Testar todas as funcionalidades
- ✅ Criar tag de versão
- ✅ Atualizar changelog
- ✅ Fazer backup final

---

## 🎯 **Comandos Rápidos para Rollback**

### **Voltar à Versão Anterior:**
```bash
# Ver commits
git log --oneline

# Voltar ao commit anterior
git reset --hard HEAD~1

# Forçar push
git push --force origin main
```

### **Voltar à Tag Específica:**
```bash
# Ver tags
git tag -l

# Voltar à tag
git reset --hard v1.0.0

# Forçar push
git push --force origin main
```

---

**🎉 Com esse controle de versão, você sempre terá uma opção de rollback!** 