# Sistema de Acompanhamento dos Sinais Vitais - Paciente Zeli

## 📋 Descrição

Sistema web desenvolvido para o acompanhamento dos sinais vitais da paciente Zeli. Permite aos técnicos de saúde registrar e acompanhar os dados vitais da paciente de forma organizada e eficiente.

## 🚀 Funcionalidades

### ✅ Formulário de Registro
- **Data e Hora**: Registro automático da data e hora atual
- **Técnico Responsável**: Campo para identificar quem fez o registro
- **Sinais Vitais**:
  - Pressão Arterial (obrigatório)
  - Saturação de Oxigênio (obrigatório)
  - Frequência Cardíaca (obrigatório)
  - Temperatura (opcional)
- **Evacuação**: Registro se houve ou não evacuação
- **Observações**: Campo livre para observações adicionais
- **Intercorrências**: Classificação de gravidade (Nenhuma, Leve, Moderada, Grave)
- **Detalhes da Intercorrência**: Campo obrigatório quando há intercorrência

### 📊 Histórico e Relatórios
- **Visualização em Tempo Real**: Todos os registros são exibidos instantaneamente
- **Filtros**: 
  - Por data específica
  - Por tipo de intercorrência
- **Detalhes Completos**: Clique em qualquer registro para ver todos os detalhes
- **Exportação**: Download dos dados em formato JSON
- **Responsivo**: Funciona em desktop, tablet e celular

### 🔒 Armazenamento
- **LocalStorage**: Dados salvos localmente no navegador
- **Persistência**: Dados permanecem mesmo após fechar o navegador
- **Backup**: Possibilidade de exportar dados para backup

## 🛠️ Como Usar

### 1. Abertura do Sistema
1. Abra o arquivo `index.html` em qualquer navegador moderno
2. O sistema carregará automaticamente

### 2. Registro de Sinais Vitais
1. **Preencha o Formulário**:
   - A data e hora são preenchidas automaticamente
   - Digite o nome do técnico responsável
   - Preencha os sinais vitais obrigatórios
   - Adicione temperatura se necessário
   - Selecione se houve evacuação
   - Adicione observações se necessário
   - Selecione o tipo de intercorrência

2. **Intercorrências**:
   - Se selecionar "Nenhuma", o campo de detalhes fica oculto
   - Se selecionar qualquer outro tipo, o campo de detalhes aparece automaticamente

3. **Salvar**:
   - Clique em "Salvar Registro"
   - O sistema validará os dados
   - Uma notificação confirmará o sucesso

### 3. Visualização do Histórico
- **Registros Recentes**: Aparecem no painel direito
- **Filtros**: Use os filtros no topo para buscar registros específicos
- **Detalhes**: Clique em qualquer registro para ver informações completas
- **Modal**: Janela pop-up com todos os detalhes do registro

### 4. Exportação de Dados
1. Clique no botão "Exportar" no painel de histórico
2. O arquivo será baixado automaticamente
3. Formato: JSON com todos os dados da paciente

### 5. Limpeza de Dados
- **Limpar Formulário**: Remove apenas os dados do formulário atual
- **Limpar Tudo**: Remove todos os registros (com confirmação)

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- **Desktop**: Layout em duas colunas
- **Tablet**: Layout adaptado para telas médias
- **Celular**: Layout em coluna única, otimizado para toque

## 🔧 Validações

O sistema inclui validações automáticas:
- **Campos Obrigatórios**: Pressão, saturação e frequência cardíaca
- **Ranges Válidos**:
  - Saturação: 0-100%
  - Frequência Cardíaca: 0-300 bpm
  - Temperatura: 30-45°C
- **Intercorrências**: Detalhes obrigatórios quando há intercorrência

## 📁 Estrutura de Arquivos

```
diario_zeli/
├── index.html          # Página principal
├── styles.css          # Estilos e design
├── script.js           # Lógica da aplicação
└── README.md           # Este arquivo
```

## 🎨 Design

- **Interface Moderna**: Design limpo e profissional
- **Cores Médicas**: Paleta de cores apropriada para área da saúde
- **Ícones Intuitivos**: Font Awesome para melhor usabilidade
- **Animações Suaves**: Transições e efeitos visuais
- **Notificações**: Feedback visual para ações do usuário

## 🔒 Privacidade e Segurança

- **Dados Locais**: Todas as informações ficam armazenadas localmente
- **Sem Servidor**: Não há envio de dados para servidores externos
- **Controle Total**: Você tem controle completo sobre os dados

## 🚀 Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Estilos modernos com Flexbox e Grid
- **JavaScript ES6+**: Lógica da aplicação
- **LocalStorage**: Armazenamento local
- **Font Awesome**: Ícones
- **Google Fonts**: Tipografia

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique se está usando um navegador atualizado
2. Certifique-se de que o JavaScript está habilitado
3. Tente limpar o cache do navegador se necessário

## 🔄 Atualizações Futuras

Possíveis melhorias:
- Gráficos de evolução dos sinais vitais
- Relatórios em PDF
- Backup na nuvem
- Múltiplos pacientes
- Integração com sistemas hospitalares

---

**Desenvolvido com ❤️ para o cuidado da paciente Zeli** 