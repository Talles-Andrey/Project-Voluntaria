# 🚀 Voluntariar Platform

Uma plataforma completa para conectar voluntários e organizações não-governamentais (ONGs), facilitando a criação de projetos sociais, campanhas de doação e gestão de voluntários.

## 🎯 Visão Geral

A **Voluntariar Platform** é uma aplicação web desenvolvida em **Next.js** que permite:
- **ONGs** criarem e gerenciarem projetos sociais
- **Voluntários** se inscreverem em projetos e fazerem doações
- **Campanhas** de arrecadação para causas sociais
- **Sistema administrativo** para gestão completa

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Shadcn/ui** - Componentes de UI modernos
- **Lucide React** - Ícones SVG

### Backend (Integração)
- **NestJS** - API REST
- **JWT** - Autenticação
- **TypeORM** - Banco de dados

## 🚀 Como Executar o Projeto

### Pré-requisitos
- **Node.js** 18+ 
- **npm** ou **yarn**
- **Backend** rodando em `http://localhost:3333`

### 1. Clone o Repositório
```bash
git clone <url-do-repositorio>
cd voluntariar-platform
```

### 2. Instale as Dependências
```bash
npm install
# ou
yarn install
```

### 3. Configure as Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz do projeto:
```env
NEXT_PUBLIC_API_URL=http://localhost:3333/api
```

### 4. Execute o Projeto
```bash
npm run dev
# ou
yarn dev
```

### 5. Acesse a Aplicação
Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🗺️ Navegação pela Aplicação

### 📱 Páginas Principais

#### **1. Página Inicial (`/`)**
- **Apresentação** da plataforma
- **Estatísticas** gerais
- **Links** para cadastro e login
- **Navegação** para todas as funcionalidades

#### **2. Cadastro (`/cadastro`)**
- **Formulário** de cadastro para voluntários e ONGs
- **Validação** de campos obrigatórios
- **Seleção** de tipo de usuário (Voluntário/ONG)
- **Redirecionamento** automático após cadastro

#### **3. Login (`/login`)**
- **Autenticação** para voluntários e ONGs
- **Validação** de credenciais
- **Redirecionamento** baseado no tipo de usuário
- **Persistência** de sessão

### 🎯 Funcionalidades por Tipo de Usuário

#### **👥 Voluntários**

##### **Projetos (`/projetos`)**
- **Listagem** de todos os projetos disponíveis
- **Filtros** por:
  - Título/descrição
  - Cidade/estado
  - Causa
  - Status
- **Inscrição** em projetos
- **Visualização** de detalhes completos
- **Status** de inscrição (Inscrito/Participar)

##### **Detalhes do Projeto (`/projetos/[id]`)**
- **Informações completas** do projeto
- **Dados da ONG** responsável
- **Lista de voluntários** inscritos
- **Botão de inscrição** (se não inscrito)
- **Status atual** da inscrição

##### **Campanhas (`/campanhas`)**
- **Listagem** de campanhas de doação
- **Filtros** por título, status e categoria
- **Estatísticas** de arrecadação
- **Detalhes** de cada campanha
- **Sistema de doação** anônima ou identificada

##### **Dashboard (`/dashboard`)**
- **Visão geral** das atividades
- **Projetos** em que está inscrito
- **Histórico** de participações
- **Perfil** e configurações

#### **🏢 ONGs**

##### **Admin (`/admin`)**
- **Painel administrativo** completo
- **Gestão de projetos**:
  - Criação de novos projetos
  - Edição de projetos existentes
  - Aprovação de inscrições
  - Monitoramento de status
- **Gestão de campanhas**:
  - Criação de campanhas
  - Acompanhamento de doações
  - Relatórios de arrecadação
- **Gestão de usuários**:
  - Visualização de voluntários
  - Aprovação de inscrições
  - Comunicação com voluntários

### 🔧 Funcionalidades Técnicas

#### **Sistema de Autenticação**
- **JWT** para sessões seguras
- **Persistência** em localStorage
- **Proteção** de rotas
- **Logout** com limpeza de dados

#### **Gestão de Estado**
- **Context API** para autenticação
- **useState** para estado local
- **useEffect** para side effects
- **Persistência** de dados entre sessões

#### **Integração com API**
- **ApiService** centralizado
- **Tratamento** de erros
- **Loading states** para UX
- **Fallbacks** para dados ausentes

## 📱 Como Usar a Aplicação

### **Para Voluntários**

#### **1. Primeiro Acesso**
1. Acesse `/cadastro`
2. Selecione "Voluntário"
3. Preencha todos os campos obrigatórios
4. Faça login com suas credenciais

#### **2. Explorar Projetos**
1. Vá para `/projetos`
2. Use os filtros para encontrar projetos de interesse
3. Clique em "Ver Detalhes" para mais informações
4. Clique em "Participar" para se inscrever

#### **3. Fazer Doações**
1. Acesse `/campanhas`
2. Escolha uma campanha de interesse
3. Clique em "Doar Agora"
4. Preencha os dados da doação
5. Confirme a doação

#### **4. Acompanhar Atividades**
1. Acesse `/dashboard`
2. Veja projetos em que está inscrito
3. Acompanhe seu histórico de participações

### **Para ONGs**

#### **1. Primeiro Acesso**
1. Acesse `/cadastro`
2. Selecione "ONG"
3. Preencha todos os campos obrigatórios
4. Faça login com suas credenciais

#### **2. Criar Projetos**
1. Acesse `/admin`
2. Clique na aba "Projetos"
3. Clique em "Novo Projeto"
4. Preencha todos os campos
5. Salve o projeto

#### **3. Gerenciar Campanhas**
1. Acesse `/admin`
2. Clique na aba "Campanhas"
3. Crie novas campanhas de doação
4. Acompanhe arrecadações

#### **4. Aprovar Voluntários**
1. Acesse `/admin`
2. Clique na aba "Projetos"
3. Veja inscrições pendentes
4. Aprove ou rejeite voluntários

## 🔍 Funcionalidades Especiais

### **Sistema de Filtros Inteligentes**
- **Busca por texto** em múltiplos campos
- **Filtros combinados** para resultados precisos
- **Persistência** de filtros durante navegação

### **Sistema de Inscrições**
- **Verificação** de duplicatas
- **Status** de inscrição em tempo real
- **Notificações** de sucesso/erro

### **Sistema de Doações**
- **Doações anônimas** ou identificadas
- **Validação** de valores
- **Mensagens** personalizadas
- **Histórico** completo

### **Responsividade**
- **Design mobile-first**
- **Adaptação** para todos os dispositivos
- **Navegação** otimizada para touch

## 🚨 Solução de Problemas

### **Erro de Hidratação**
- **Recarregue** a página
- **Limpe** o cache do navegador
- **Verifique** se o backend está rodando

### **Problemas de Autenticação**
- **Faça logout** e login novamente
- **Verifique** se o token não expirou
- **Limpe** o localStorage



## 📚 Estrutura do Projeto

```
voluntariar-platform/
├── app/                    # Páginas da aplicação
│   ├── admin/             # Painel administrativo
│   ├── campanhas/         # Sistema de campanhas
│   ├── cadastro/          # Cadastro de usuários
│   ├── login/             # Sistema de login
│   ├── projetos/          # Sistema de projetos
│   └── dashboard/         # Dashboard do usuário
├── components/            # Componentes reutilizáveis
│   ├── ui/               # Componentes base (Shadcn)
│   ├── navigation.tsx    # Navegação principal
│   └── logout-button.tsx # Botão de logout
├── hooks/                # Hooks customizados
│   └── useAuth.tsx       # Hook de autenticação
├── lib/                  # Utilitários e serviços
│   └── api.ts           # Serviço de API
├── public/               # Arquivos estáticos
└── README.md             # Este arquivo
```


