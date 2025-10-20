# 🚀 Voluntariar Platform

## 📖 Descrição

O **Voluntariar** é uma plataforma digital que conecta voluntários a organizações sem fins lucrativos, facilitando a busca por oportunidades alinhadas a interesses, habilidades e disponibilidade, promovendo engajamento social e impacto positivo na comunidade.

---

## 🎯 Finalidades

- **Para Voluntários**: encontrar facilmente vagas de voluntariado compatíveis com seus perfis.
- **Para Organizações**: captar, organizar e gerenciar voluntários de forma prática.
- **Para a Plataforma**: gerar impacto social e receita por meio de assinaturas, anúncios e parcerias.

---

## ⚙️ Principais Funcionalidades

### Para Voluntários:
- Cadastro de perfil (interesses, habilidades e disponibilidade).
- Busca e inscrição em vagas com filtros.
- Histórico de participação e emissão de certificados digitais.
- Espaço de comunidade e notificações sobre novas oportunidades.

### Para Organizações:
- Perfil da instituição com missão e causas apoiadas.
- Publicação e gestão de vagas.
- Controle de voluntários e comunicação direta.
- Relatórios de impacto e engajamento.
- Opção de planos premium para maior visibilidade.

### Para a Plataforma:
- Painel administrativo para gestão geral.
- Emissão automatizada de certificados.
- Espaço de publicidade e planos de assinatura.

---

## 👥 Equipe de Desenvolvimento

- **Talles Andrey de Oliveira** - 22401830
- **Caio Duarte** - 22402764
- **Isabela Vasconcellos** - 22400770
- **Davi Barroso** - 22302158
- **Felipe Fonseca** - 22402055

---

## 🏗️ Estrutura do Projeto

Este repositório contém **dois projetos separados** que trabalham em conjunto:

```
free/
├── voluntariar-platform/     # 🎨 Frontend (Next.js)
│   ├── app/                  # Páginas da aplicação
│   ├── components/           # Componentes reutilizáveis
│   ├── hooks/               # Hooks customizados
│   ├── lib/                 # Utilitários e serviços
│   └── README.md            # Documentação do frontend
│
└── voluntariar-backend/      # ⚙️ Backend (NestJS)
    ├── src/                  # Código fonte
    ├── dist/                 # Arquivos compilados
    ├── package.json          # Dependências
    └── README.md            # Documentação do backend
```

---

## 🎨 Frontend (voluntariar-platform)

### 1. Pré-requisitos
- **Node.js** 18+
- **npm** ou **yarn**
- **Backend** rodando em `http://localhost:3333`

### 2. Instalação
```bash
# Acesse a pasta do frontend
cd voluntariar-platform

# Instale as dependências
npm install
# ou
yarn install
```

### 3. Configuração
Crie um arquivo `.env.local` na pasta `voluntariar-platform`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3333/api
```

### 4. Execução
```bash
# Execute o projeto
npm run dev
# ou
yarn dev
```

### 5. Acesso
Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## Checklist das 20 Funcionalidades


1.  [✔ ] O sistema deve permitir a o cadrasto de usuários
2.  [✔  ] O sistema deve permitir que o usuário redefina dados 
3.  [✔  ]  Sistema de autenticação e autorização 
4.  [✔  ] Cadastro e gestão de ONGs 
5.  [✔  ] Painel administrativo para gestão das ONGs
6.  [✔  ] Associação de representantes às ONGs
7.  [✔  ] Publicação de oportunidades de voluntariado com descrição, requisitos e atividades
8.  [✔  ]  Busca por oportunidades com filtros 
9.  [✔  ] Inscrição de voluntários nas oportunidades de voluntariado
10. [✔  ]  Publicação de campanhas de arrecadação ou doações vinculadas ao voluntariado
11. [✔  ] Avaliação dos voluntários pelas ONGs após conclusão das atividades
12. [✔  ] Avaliação das ONGs pelos voluntários com comentários sobre a experiência
13. [✔  ] Feedback e sugestões de melhorias após término das atividades
14. [✔  ] Avaliação das ONGs pelos voluntários com comentários sobre a experiência
15. [✔  ] Visualização do impacto das ações voluntárias
16. [✔  ] Suporte tecnico em caso de problemas (e-mail)
17. [✔  ] Visualização do histórico de atividades realizadas por voluntários
18. [✔  ]  Visualização das habilidades e disponibilidades dos voluntários antes de convidá-los para um projeto
19. [✔  ] Busca por oportunidades com filtros (localização, tipo de causa, disponibilidade, etc.)
20. [✔  ] Integração com plataformas de redes

## ⚙️ Backend (voluntariar-backend)

### 1. Pré-requisitos
- **Node.js** 18+
- **npm** ou **yarn**
- **PostgreSQL** ou **MySQL** (banco de dados)
- **TypeScript** (compilador)

### 2. Instalação
```bash
# Acesse a pasta do backend
cd voluntariar-backend

# Instale as dependências
npm install
# ou
yarn install
```

### 3. Configuração do Banco de Dados
Configure as variáveis de ambiente no arquivo `.env`:
```env
# Banco de dados
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=seu_usuario
DB_PASSWORD=sua_senha
DB_DATABASE=voluntariar_db

# JWT
JWT_SECRET=sua_chave_secreta
JWT_EXPIRES_IN=7d

# Porta da aplicação
PORT=3333
```

### 4. Execução
```bash
# Desenvolvimento
npm run start:dev
# ou
yarn start:dev

# Produção
npm run build
npm run start:prod
```

### 5. Acesso
A API estará disponível em `http://localhost:3333`

---

## 🔄 Fluxo de Desenvolvimento

### 1. **Inicie o Backend Primeiro**
```bash
cd voluntariar-backend
npm run start:dev
```

### 2. **Em Outro Terminal, Inicie o Frontend**
```bash
cd voluntariar-platform
npm run dev
```

### 3. **Verifique se Ambos Estão Rodando**
- **Backend**: `http://localhost:3333` ✅
- **Frontend**: `http://localhost:3000` ✅

---

## 🚨 Solução de Problemas

### Backend não Inicia
- Verifique se o banco de dados está rodando
- Confirme as variáveis de ambiente
- Verifique se a porta 3333 está livre

### Frontend não Conecta com Backend
- Confirme se o backend está rodando
- Verifique a URL da API em `.env.local`
- Confirme se não há problemas de CORS

### Erros de Banco de Dados
- Verifique se o banco existe
- Confirme as credenciais de acesso
- Execute as migrações se necessário

---

## 📚 Documentação Detalhada

> **⚠️ IMPORTANTE**: Cada projeto possui seu próprio README com instruções detalhadas de uso, funcionalidades e desenvolvimento. Sempre consulte a documentação específica de cada projeto para informações completas.

- **Frontend**: Veja `voluntariar-platform/README.md` para documentação completa
- **Backend**: Veja `voluntariar-backend/README.md` para documentação da API

### 📖 O que encontrar em cada README:

#### **Frontend (`voluntariar-platform/README.md`)**
- Navegação completa pela aplicação
- Funcionalidades por tipo de usuário
- Guia de uso passo a passo
- Solução de problemas específicos
- Estrutura de componentes e hooks

#### **Backend (`voluntariar-backend/README.md`)**
- Documentação completa da API
- Endpoints disponíveis
- Estrutura do banco de dados
- Configurações de ambiente
- Comandos de desenvolvimento

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Shadcn/ui** - Componentes de UI modernos
- **Lucide React** - Ícones SVG

### Backend
- **NestJS** - Framework Node.js para APIs
- **TypeScript** - Tipagem estática
- **TypeORM** - ORM para banco de dados
- **JWT** - Autenticação e autorização
- **Class-validator** - Validação de dados
- **Swagger** - Documentação da API

---

## 🚀 Deploy

### Frontend (Vercel)
```bash
cd voluntariar-platform
npm run build
# Deploy automático via Vercel
```

### Backend (Heroku/DigitalOcean)
```bash
cd voluntariar-backend
npm run build
# Configure as variáveis de ambiente no servidor
```

---

## 🤝 Contribuição

1. **Fork** o repositório
2. **Crie** uma branch para sua feature
3. **Faça** as alterações necessárias
4. **Teste** todas as funcionalidades
5. **Envie** um Pull Request

---

## 📄 Licença

Este projeto está sob a licença **MIT**.

---

## 🎉 Agradecimentos

Agradecemos a todos os voluntários e organizações que contribuem para tornar o mundo um lugar melhor através da **Voluntariar Platform**.

**Juntos fazemos a diferença! 🌟**
