# 📋 Diário Zeli - Sistema de Acompanhamento de Sinais Vitais

## 🎯 Sobre o Projeto

Sistema web para acompanhamento dos sinais vitais da paciente Zeli, desenvolvido com **MongoDB** para sincronização global de dados entre dispositivos.

## ✨ Funcionalidades

### 📊 Registro de Sinais Vitais
- **Pressão Arterial**: Sistólica e Diastólica
- **Saturação de Oxigênio**: 70-100%
- **Frequência Cardíaca**: 40-200 bpm
- **Temperatura**: 35-42°C
- **Evacuação**: Normal, Diarreia, Não
- **Observações**: Campo de texto livre
- **Intercorrências**: Sim/Não (com observações obrigatórias)

### 💊 Gerenciamento de Medicamentos
- **Adicionar/Remover** medicamentos
- **Horários fixos** ou **horário livre**
- **Divisão por período**: Manhã (até 12h) e Tarde/Noite (após 12h)
- **Alteração de horário** com confirmação
- **Campo de observações** para horários alterados

### 👥 Gerenciamento de Técnicos
- **Adicionar/Remover** técnicos responsáveis
- **Dropdown dinâmico** no formulário
- **Opção "Outro"** com campo de texto

### 🔐 Sistema de Administração
- **Login admin**: usuário `admin`, senha `admin123`
- **Acesso restrito** a gerenciamento
- **Limpeza de registros** (apenas admin)
- **Logout seguro**

### 📱 Interface Responsiva
- **Design mobile-first**
- **Layout adaptativo**
- **Navegação intuitiva**
- **Feedback visual**

## 🏗️ Arquitetura

```
Frontend (Browser) ←→ Backend (Node.js) ←→ MongoDB Atlas
     HTML/CSS/JS         Express/Mongoose      Cloud Database
```

## 🚀 Tecnologias

### Frontend
- **HTML5** - Estrutura semântica
- **CSS3** - Estilos responsivos
- **JavaScript ES6+** - Lógica interativa

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Mongoose** - ODM para MongoDB
- **CORS** - Cross-Origin Resource Sharing

### Banco de Dados
- **MongoDB Atlas** - Banco de dados na nuvem
- **MongoDB** - Banco NoSQL

## 📦 Instalação

### Pré-requisitos
- Node.js (versão 14 ou superior)
- Conta no MongoDB Atlas
- Git (opcional)

### Passo a Passo

1. **Clone ou baixe o projeto**
```bash
git clone <url-do-repositorio>
cd diario_zeli
```

2. **Execute o script de migração**
```bash
migrate-to-mongodb.bat
```

3. **Configure o MongoDB**
   - Crie conta no [MongoDB Atlas](https://mongodb.com/atlas)
   - Crie um cluster gratuito
   - Configure usuário e rede
   - Obtenha a string de conexão

4. **Configure as variáveis de ambiente**
   - Edite o arquivo `.env`
   - Substitua a string de conexão do MongoDB

5. **Instale as dependências**
```bash
npm install
```

6. **Inicie o servidor**
```bash
npm start
```

7. **Acesse o sistema**
   - Abra: `http://localhost:3000`

## 🔧 Configuração

### Variáveis de Ambiente (.env)
```env
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/diario_zeli
PORT=3000
JWT_SECRET=sua_chave_secreta
NODE_ENV=development
```

### Estrutura do Banco
- **Coleção `records`**: Registros de sinais vitais
- **Coleção `medications`**: Lista de medicamentos
- **Coleção `technicians`**: Lista de técnicos

## 📱 Como Usar

### Para Técnicos
1. Acesse o sistema
2. Preencha o formulário de sinais vitais
3. Selecione medicamentos administrados
4. Adicione observações se necessário
5. Salve o registro

### Para Administradores
1. Faça login com credenciais admin
2. Gerencie medicamentos na seção admin
3. Gerencie técnicos na seção admin
4. Use "Limpar Registros" se necessário

## 🌐 Deploy em Produção

### Opções Recomendadas

#### Heroku
```bash
heroku create diario-zeli-app
git push heroku main
```

#### Railway
1. Conecte repositório GitHub
2. Configure variáveis de ambiente
3. Deploy automático

#### Render
1. Crie "Web Service"
2. Conecte repositório
3. Configure variáveis

### Variáveis de Produção
```env
MONGODB_URI=sua_string_de_conexao
NODE_ENV=production
JWT_SECRET=chave_super_secreta
```

## 📊 Estrutura de Dados

### Registro de Sinais Vitais
```json
{
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

### Medicamento
```json
{
  "name": "Paracetamol",
  "time": "08:00",
  "isFreeTime": false
}
```

### Técnico
```json
{
  "name": "Silvana"
}
```

## 🔄 Migração de Dados

Se você tem dados no localStorage:

1. **Exporte os dados atuais**:
```javascript
// No console do navegador
const data = {
    records: JSON.parse(localStorage.getItem('records') || '[]'),
    medications: JSON.parse(localStorage.getItem('medicationsList') || '[]'),
    technicians: JSON.parse(localStorage.getItem('techniciansList') || '[]')
};
console.log(JSON.stringify(data, null, 2));
```

2. **Importe no MongoDB Atlas**:
   - Acesse o painel do MongoDB Atlas
   - Vá em "Browse Collections"
   - Importe os dados JSON

## 🛠️ Manutenção

### Backup
- **Automático**: MongoDB Atlas faz backup diário
- **Retenção**: 7 dias
- **Restauração**: Pontual disponível

### Monitoramento
- **Logs**: Console do servidor
- **Métricas**: MongoDB Atlas
- **Alertas**: Configuráveis

### Atualizações
```bash
git pull origin main
npm install
npm start
```

## 🐛 Troubleshooting

### Problemas Comuns

#### "Connection failed"
- Verifique a string de conexão
- Confirme se o IP está liberado
- Verifique permissões do usuário

#### "Cannot read property of undefined"
- Verifique se o MongoDB está conectado
- Confirme se as coleções existem
- Verifique logs do servidor

#### "CORS error"
- Verifique configuração CORS
- Confirme domínio correto
- Verifique se servidor está rodando

## 📞 Suporte

### Documentação
- `MONGODB_SETUP_GUIDE.md` - Guia completo
- `MONGODB_MIGRATION_SUMMARY.md` - Resumo da migração
- Comentários no código

### Recursos
- [MongoDB Atlas](https://mongodb.com/atlas)
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Autores

- **Equipe Diário Zeli** - Desenvolvimento inicial
- **Contribuidores** - Melhorias e correções

## 🙏 Agradecimentos

- MongoDB Atlas pela infraestrutura gratuita
- Comunidade Node.js pelo suporte
- Técnicos de saúde pelo feedback

---

**🎉 Obrigado por usar o Diário Zeli!**

Para dúvidas ou suporte, consulte a documentação ou entre em contato. 