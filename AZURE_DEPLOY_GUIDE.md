# 🚀 Guia de Deploy no Azure Static Web Apps

## 📋 Pré-requisitos

1. **Conta Azure** (gratuita)
2. **GitHub** (já tem)
3. **Azure CLI** (opcional)

## 🎯 Passo a Passo Completo

### **Passo 1: Criar Conta Azure (se não tiver)**

1. Acesse [portal.azure.com](https://portal.azure.com)
2. Clique em "Criar uma conta gratuita"
3. Siga o processo de cadastro
4. **Benefícios gratuitos:**
   - 12 meses de serviços gratuitos
   - $200 de crédito
   - Sempre gratuito: Static Web Apps, Cosmos DB (limitado)

### **Passo 2: Criar Cosmos DB**

1. **No Portal Azure:**
   - Clique em "Criar um recurso"
   - Pesquise "Azure Cosmos DB"
   - Clique em "Criar"

2. **Configurações:**
   ```
   Assinatura: Sua assinatura
   Grupo de recursos: Criar novo (ex: zeli-rg)
   Nome da conta: zeli-cosmos-db
   API: Core (SQL)
   Localização: Brazil South
   Modo de capacidade: Provisioned throughput
   Throughput: 400 RU/s (gratuito)
   ```

3. **Criar banco de dados:**
   - Nome: `zeli-database`
   - Throughput: 400 RU/s

4. **Criar containers:**
   - Container 1: `records` (partition key: `/id`)
   - Container 2: `medications` (partition key: `/id`)
   - Container 3: `technicians` (partition key: `/id`)

5. **Obter credenciais:**
   - Vá em "Chaves"
   - Copie: **URI** e **Chave Primária**

### **Passo 3: Criar Azure Static Web Apps**

1. **No Portal Azure:**
   - Clique em "Criar um recurso"
   - Pesquise "Static Web Apps"
   - Clique em "Criar"

2. **Configurações básicas:**
   ```
   Assinatura: Sua assinatura
   Grupo de recursos: zeli-rg (mesmo do Cosmos DB)
   Nome: zeli-system
   Região: Brazil South
   Tipo de build: Custom
   ```

3. **Configurações de build:**
   ```
   Branch de origem: main
   Pasta de build: /
   Pasta de saída da API: api
   ```

4. **Configurações de API:**
   ```
   Runtime: Node 18
   ```

### **Passo 4: Configurar Variáveis de Ambiente**

1. **No Static Web Apps:**
   - Vá em "Configuração"
   - Clique em "Adicionar"
   - Adicione as variáveis:

   ```
   COSMOS_ENDPOINT: [URI do Cosmos DB]
   COSMOS_KEY: [Chave Primária do Cosmos DB]
   ```

### **Passo 5: Conectar ao GitHub**

1. **No Static Web Apps:**
   - Clique em "Gerenciar implantação"
   - Clique em "GitHub"
   - Autorize o Azure
   - Selecione seu repositório: `sistema-zeli`
   - Branch: `main`

### **Passo 6: Atualizar Arquivos**

1. **Substituir `script.js` por `script-azure.js`:**
   ```bash
   # Renomear o arquivo atual
   mv script.js script-local.js
   # Usar a versão Azure
   mv script-azure.js script.js
   ```

2. **Atualizar `index.html`:**
   - Remover cache-busting: `?v=1.1`
   - Manter apenas: `<script src="script.js"></script>`

### **Passo 7: Fazer Deploy**

1. **Commit e push:**
   ```bash
   git add .
   git commit -m "Migração para Azure Static Web Apps"
   git push origin main
   ```

2. **Monitorar deploy:**
   - No Azure Portal, vá em "Actions"
   - Acompanhe o progresso do build

### **Passo 8: Testar**

1. **Acesse o site:**
   - URL será: `https://zeli-system.azurestaticapps.net`

2. **Teste as funcionalidades:**
   - ✅ Salvar registro
   - ✅ Ver histórico
   - ✅ Gerenciar medicamentos
   - ✅ Gerenciar técnicos
   - ✅ Login admin

## 🔧 Configurações Adicionais

### **Configurar Domínio Personalizado (Opcional)**

1. **No Static Web Apps:**
   - Vá em "Domínios personalizados"
   - Adicione seu domínio

### **Configurar HTTPS**

- ✅ **Automático** no Azure Static Web Apps

### **Configurar Backup**

1. **Cosmos DB:**
   - Vá em "Backup e restauração"
   - Configure backup automático

## 💰 Custos Estimados

### **Gratuito (Sempre):**
- Static Web Apps: 2 aplicações, 100GB transferência/mês
- Cosmos DB: 1000 RU/s, 25GB armazenamento

### **Se crescer:**
- Static Web Apps: ~$10/mês
- Cosmos DB: ~$25/mês (1000 RU/s)

## 🚨 Troubleshooting

### **Erro: "API não encontrada"**
- Verificar se pasta `api/` existe
- Verificar se `host.json` está correto

### **Erro: "Cosmos DB connection failed"**
- Verificar variáveis de ambiente
- Verificar se Cosmos DB está ativo

### **Erro: "Build failed"**
- Verificar logs no Azure Portal
- Verificar sintaxe dos arquivos

## 📞 Suporte

- **Azure Support:** Portal Azure > Suporte
- **Documentação:** [docs.microsoft.com](https://docs.microsoft.com)
- **Community:** Stack Overflow, GitHub Issues

## 🎉 Próximos Passos

1. **Monitoramento:**
   - Configurar Application Insights
   - Configurar alertas

2. **Segurança:**
   - Configurar autenticação Azure AD
   - Configurar CORS

3. **Performance:**
   - Configurar CDN
   - Otimizar imagens

---

**🎯 Resultado Final:**
- ✅ Sistema online 24/7
- ✅ Dados centralizados
- ✅ Sincronização automática
- ✅ Backup automático
- ✅ Escalável
- ✅ Seguro 