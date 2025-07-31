# 🚀 Guia de Configuração - Vercel Backend

## 📋 Pré-requisitos

- Conta no GitHub (já tem)
- Conta no Vercel (gratuita)
- MongoDB Atlas configurado (já tem)

## 🔧 Passo a Passo

### 1. Criar conta no Vercel

1. Acesse: https://vercel.com
2. Clique em "Sign Up"
3. Escolha "Continue with GitHub"
4. Autorize o Vercel

### 2. Importar o repositório

1. No Vercel, clique em "New Project"
2. Clique em "Import Git Repository"
3. Clique em "Install" no GitHub
4. Selecione o repositório `dcturra/sistema-zeli`
5. Clique em "Import"

### 3. Configurar o projeto

**Nome do projeto:** `diario-zeli-backend`
**Framework Preset:** `Node.js`
**Root Directory:** (deixe vazio)
**Build Command:** `npm install`
**Output Directory:** (deixe vazio)

### 4. Configurar variáveis de ambiente

Antes de fazer deploy, clique em "Environment Variables" e adicione:

```
MONGODB_URI=mongodb://diario_zeli_user:Zeli2024!@atlas-sql-688a57e8cec7f830fac831e9-uji0pb.a.query.mongodb.net/diario_zeli?ssl=true&authSource=admin
JWT_SECRET=minha_chave_secreta_123
NODE_ENV=production
```

### 5. Fazer deploy

1. Clique em "Deploy"
2. Aguarde o deploy terminar
3. Copie a URL gerada (exemplo: `https://diario-zeli-backend.vercel.app`)

### 6. Atualizar o frontend

Após o deploy, atualize a URL no arquivo `script-vercel.js`:

```javascript
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:3000/api' 
    : 'https://SUA_URL_DO_VERCEL.vercel.app/api'; // Substitua pela sua URL
```

### 7. Fazer commit e push

```bash
git add .
git commit -m "Vercel: Configurando backend serverless"
git push origin main
```

## 📁 Estrutura de arquivos

```
diario_zeli/
├── index.html
├── styles.css
├── script-vercel.js          # Frontend para Vercel
├── package.json              # Dependências
├── vercel.json              # Configuração Vercel
└── api/
    ├── records.js           # API de registros
    ├── medications.js       # API de medicamentos
    └── technicians.js       # API de técnicos
```

## 🔍 Testando

1. Acesse: https://dcturra.github.io/sistema-zeli/
2. Faça login como admin (admin/admin123)
3. Teste adicionar um registro
4. Teste adicionar medicamentos
5. Teste adicionar técnicos

## 🛠️ Endpoints da API

- `GET /api/records` - Listar registros
- `POST /api/records` - Criar registro
- `DELETE /api/records` - Limpar todos os registros

- `GET /api/medications` - Listar medicamentos
- `POST /api/medications` - Criar medicamento
- `DELETE /api/medications?id=ID` - Deletar medicamento

- `GET /api/technicians` - Listar técnicos
- `POST /api/technicians` - Criar técnico
- `DELETE /api/technicians?id=ID` - Deletar técnico

## ⚠️ Problemas comuns

### Erro de CORS
- Verifique se a URL do frontend está na lista de origins permitidas

### Erro de conexão MongoDB
- Verifique se a string de conexão está correta
- Verifique se o IP está liberado no MongoDB Atlas

### Erro 404
- Verifique se os arquivos estão na pasta `api/`
- Verifique se o `vercel.json` está configurado

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs no Vercel Dashboard
2. Teste localmente primeiro
3. Verifique se todas as variáveis de ambiente estão configuradas 