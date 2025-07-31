# Guia de Configuração MongoDB para Diário Zeli

## 📋 Pré-requisitos

1. **Node.js** instalado (versão 14 ou superior)
2. **Conta no MongoDB Atlas** (gratuita)
3. **Git** (para controle de versão)

## 🚀 Passo a Passo

### 1. Configurar MongoDB Atlas

#### 1.1 Criar conta no MongoDB Atlas
1. Acesse [mongodb.com/atlas](https://mongodb.com/atlas)
2. Clique em "Try Free"
3. Preencha os dados e crie sua conta

#### 1.2 Criar um cluster
1. Após fazer login, clique em "Build a Database"
2. Escolha "FREE" (M0)
3. Selecione um provedor (AWS, Google Cloud ou Azure)
4. Escolha uma região próxima ao Brasil
5. Clique em "Create"

#### 1.3 Configurar acesso ao banco
1. Em "Security" → "Database Access", clique em "Add New Database User"
2. Username: `diario_zeli_user`
3. Password: crie uma senha forte
4. Role: "Read and write to any database"
5. Clique em "Add User"

#### 1.4 Configurar acesso de rede
1. Em "Security" → "Network Access", clique em "Add IP Address"
2. Para desenvolvimento: clique em "Allow Access from Anywhere" (0.0.0.0/0)
3. Para produção: adicione apenas os IPs necessários
4. Clique em "Confirm"

#### 1.5 Obter string de conexão
1. Em "Database" → "Connect", clique em "Connect"
2. Escolha "Connect your application"
3. Copie a string de conexão
4. Substitua `<password>` pela senha do usuário criado
5. Substitua `<dbname>` por `diario_zeli`

### 2. Configurar o Projeto

#### 2.1 Instalar dependências
```bash
npm install
```

#### 2.2 Criar arquivo .env
Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
MONGODB_URI=mongodb+srv://diario_zeli_user:sua_senha@seu_cluster.mongodb.net/diario_zeli?retryWrites=true&w=majority
PORT=3000
JWT_SECRET=sua_chave_secreta_aqui
NODE_ENV=development
```

**⚠️ IMPORTANTE:** Substitua `sua_senha` pela senha real do usuário e `seu_cluster` pelo nome do seu cluster.

#### 2.3 Atualizar o HTML
No arquivo `index.html`, altere a linha que carrega o script:

```html
<!-- De: -->
<script src="script.js?v=1.1"></script>

<!-- Para: -->
<script src="script-mongodb.js?v=1.2"></script>
```

### 3. Executar o Sistema

#### 3.1 Iniciar o servidor
```bash
npm start
```

#### 3.2 Acessar o sistema
Abra o navegador e acesse: `http://localhost:3000`

### 4. Deploy em Produção

#### 4.1 Opções de hospedagem

**Opção 1: Heroku (Recomendado para iniciantes)**
1. Crie conta no [Heroku](https://heroku.com)
2. Instale o Heroku CLI
3. Execute os comandos:
```bash
heroku create diario-zeli-app
git add .
git commit -m "Initial commit"
git push heroku main
```

**Opção 2: Railway**
1. Crie conta no [Railway](https://railway.app)
2. Conecte seu repositório GitHub
3. Configure as variáveis de ambiente
4. Deploy automático

**Opção 3: Render**
1. Crie conta no [Render](https://render.com)
2. Conecte seu repositório GitHub
3. Configure como "Web Service"
4. Configure as variáveis de ambiente

#### 4.2 Configurar variáveis de ambiente em produção
No painel da sua plataforma de hospedagem, configure:

```
MONGODB_URI=mongodb+srv://diario_zeli_user:sua_senha@seu_cluster.mongodb.net/diario_zeli?retryWrites=true&w=majority
NODE_ENV=production
JWT_SECRET=sua_chave_secreta_muito_segura
```

### 5. Migração de Dados (Opcional)

Se você já tem dados no localStorage, pode migrá-los:

#### 5.1 Exportar dados do localStorage
1. Abra o console do navegador (F12)
2. Execute:
```javascript
const data = {
    records: JSON.parse(localStorage.getItem('records') || '[]'),
    medications: JSON.parse(localStorage.getItem('medicationsList') || '[]'),
    technicians: JSON.parse(localStorage.getItem('techniciansList') || '[]')
};
console.log(JSON.stringify(data, null, 2));
```
3. Copie o resultado

#### 5.2 Importar no MongoDB
1. Acesse o MongoDB Atlas
2. Vá em "Browse Collections"
3. Crie as coleções: `records`, `medications`, `technicians`
4. Importe os dados JSON

### 6. Estrutura do Banco de Dados

O sistema criará automaticamente as seguintes coleções:

#### `records` (Registros de sinais vitais)
```json
{
  "_id": "ObjectId",
  "date": "2024-01-15T10:30:00.000Z",
  "technician": "Silvana",
  "pressureSystolic": 120,
  "pressureDiastolic": 80,
  "saturation": 98,
  "heartRate": 72,
  "temperature": 36.5,
  "bowelMovement": "Normal",
  "observations": "Paciente bem disposta",
  "complications": "Não",
  "administeredMedications": ["Paracetamol - 08:00"],
  "otherMedications": ""
}
```

#### `medications` (Medicamentos)
```json
{
  "_id": "ObjectId",
  "name": "Paracetamol",
  "time": "08:00",
  "isFreeTime": false
}
```

#### `technicians` (Técnicos)
```json
{
  "_id": "ObjectId",
  "name": "Silvana"
}
```

### 7. Backup e Segurança

#### 7.1 Backup automático
O MongoDB Atlas oferece backup automático gratuito:
- Backup diário
- Retenção de 7 dias
- Restauração pontual

#### 7.2 Segurança adicional
1. Use senhas fortes
2. Configure IP whitelist em produção
3. Use HTTPS em produção
4. Monitore logs de acesso

### 8. Monitoramento

#### 8.1 Logs do servidor
O sistema registra:
- Conexões com o banco
- Erros de API
- Operações de CRUD

#### 8.2 Métricas do MongoDB Atlas
- Uso de CPU e memória
- Operações por segundo
- Conexões ativas
- Tamanho do banco

### 9. Troubleshooting

#### Problema: "Connection failed"
**Solução:**
1. Verifique a string de conexão
2. Confirme se o IP está liberado
3. Verifique se o usuário tem permissões

#### Problema: "Cannot read property of undefined"
**Solução:**
1. Verifique se o MongoDB está conectado
2. Confirme se as coleções existem
3. Verifique os logs do servidor

#### Problema: "CORS error"
**Solução:**
1. Verifique se o CORS está configurado
2. Confirme se o domínio está correto
3. Verifique se o servidor está rodando

### 10. Próximos Passos

1. **Teste o sistema** localmente
2. **Configure o deploy** em produção
3. **Migre os dados** existentes (se houver)
4. **Configure monitoramento**
5. **Teste em diferentes dispositivos**

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs do servidor
2. Consulte a documentação do MongoDB
3. Verifique a configuração de rede
4. Teste a conexão com o banco

## 🔄 Atualizações

Para atualizar o sistema:
1. Faça backup dos dados
2. Atualize o código
3. Teste localmente
4. Deploy em produção
5. Verifique se tudo funciona

---

**🎉 Parabéns!** Seu sistema Diário Zeli agora está usando MongoDB e pode ser acessado de qualquer lugar do mundo! 