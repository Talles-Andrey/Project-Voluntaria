# Voluntariar

O Voluntariar é uma plataforma digital que conecta voluntários a organizações sem fins lucrativos, facilitando a busca por oportunidades alinhadas a interesses, habilidades e disponibilidade, promovendo engajamento social e impacto positivo na comunidade.

⸻

## 🎯 Finalidades

- **Para Voluntários**: encontrar facilmente vagas de voluntariado compatíveis com seus perfis.
- **Para Organizações**: captar, organizar e gerenciar voluntários de forma prática.
- **Para a Plataforma**: gerar impacto social e receita por meio de assinaturas, anúncios e parcerias.

⸻

## ⚙ Principais Funcionalidades

### Para Voluntários:
- **Cadastro e Autenticação**: Registro de usuário com email e senha, login/logout seguro
- **Perfil de Usuário**: Visualização e atualização de informações pessoais
- **Busca de Projetos**: Filtros por causa, localização e status
- **Inscrição em Projetos**: Sistema de join para participar de projetos voluntários
- **Busca de Oportunidades**: Filtros por causa, localização e status
- **Sistema de Avaliações**: Receber e dar avaliações para outros usuários e ONGs

### Para Organizações (ONGs):
- **Cadastro de ONG**: Registro com informações organizacionais, CNPJ e causas apoiadas
- **Autenticação**: Login específico para ONGs com validação de tipo de usuário
- **Gestão de Projetos**: Criação de projetos voluntários com detalhes e vagas
- **Gestão de Campanhas**: Criação de campanhas de doação e oportunidades
- **Filtros e Busca**: Sistema de filtros por cidade, estado e causas para encontrar voluntários
- **Controle de Acesso**: Guardas de autenticação específicos para operações de ONG

### Para a Plataforma:
- **API REST Completa**: Endpoints documentados com Swagger/OpenAPI
- **Sistema de Doações**: Processamento de doações para campanhas
- **Sistema de Ratings**: Avaliações bidirecionais entre usuários e organizações
- **Autenticação JWT**: Tokens seguros com controle de acesso por tipo de usuário
- **Validação de Dados**: DTOs com validação automática usando class-validator
- **Documentação Automática**: Swagger UI para testes e documentação da API

⸻

## 👥 Equipe de Desenvolvimento

- **Talles Andrey de Oliveira** - 22401830
- **Caio Duarte** - 22402764
- **Isabela Vasconcellos** - 22400770
- **Davi Barroso** - 22302158
- **Felipe Fonseca** - 22402055

⸻

## 🏗️ Estrutura de Diretórios

```
projeto/
├── src/                    # Código-fonte principal
│   ├── auth/              # Autenticação e autorização
│   ├── campaigns/         # Gestão de campanhas
│   ├── common/            # Utilitários e configurações comuns
│   ├── database/          # Configurações de banco de dados
│   ├── donations/         # Sistema de doações
│   ├── enrollments/       # Inscrições em oportunidades
│   ├── ngos/              # Gestão de ONGs
│   ├── opportunities/     # Oportunidades de voluntariado
│   ├── projects/          # Gestão de projetos
│   ├── ratings/           # Sistema de avaliações
│   ├── users/             # Gestão de usuários
│   ├── app.module.ts      # Módulo principal da aplicação
│   └── main.ts            # Ponto de entrada da aplicação
├── dist/                  # Código compilado
├── docs/                  # Documentação
├── tests/                 # Testes automatizados
├── .env.example           # Exemplo de variáveis de ambiente
├── package.json           # Dependências e scripts do projeto
├── tsconfig.json          # Configuração do TypeScript
├── nest-cli.json          # Configuração do NestJS CLI
└── README.md              # Este arquivo
```

⸻

## 🚀 Como Executar o Projeto

### 1. Pré-requisitos

- **Node.js** versão 18 ou superior
- **PostgreSQL** versão 12 ou superior
- **Yarn** ou **npm** para gerenciamento de dependências
- **Git** para clonar o repositório

### 2. Instalação

```bash
# Clone o repositório
git clone https://github.com/usuario/project-ong.git

# Acesse a pasta do projeto
cd project-ong

# Instale as dependências
yarn install
# ou
npm install
```

### 3. Configuração do Banco de Dados

```bash
# Crie um banco PostgreSQL chamado 'voluntariar'
createdb voluntariar

# Copie o arquivo de exemplo de variáveis de ambiente
cp .env.example .env

# Edite o arquivo .env com suas configurações de banco
nano .env
```

**Configurações necessárias no arquivo `.env`:**
```env
DATABASE_HOST=localhost
DATABASE_USERNAME=seu_usuario
DATABASE_PASSWORD=sua_senha
DATABASE_NAME=voluntariar
DATABASE_PORT=5432
JWT_SECRET=sua_chave_secreta_jwt
```

### 4. Execução

```bash
# Modo desenvolvimento (com hot-reload)
yarn start:dev
# ou
npm run start:dev

# Modo produção
yarn start:prod
# ou
npm run start:prod

# Build do projeto
yarn build
# ou
npm run build
```

### 5. Acesso

- **URL da API**: http://localhost:3333
- **Documentação Swagger**: http://localhost:3333/api (quando disponível)

### 6. Comandos Úteis

```bash
# Executar testes
yarn test

# Executar testes em modo watch
yarn test:watch

# Executar linting
yarn lint

# Formatar código
yarn format
```

⸻

## 🛠️ Tecnologias Utilizadas

- **Backend**: NestJS (Node.js + TypeScript)
- **Banco de Dados**: PostgreSQL com TypeORM
- **Autenticação**: JWT com bcrypt
- **Validação**: class-validator
- **Documentação**: Swagger/OpenAPI
- **Testes**: Jest

⸻

## 📋 Scripts Disponíveis

- `yarn start` - Inicia a aplicação
- `yarn start:dev` - Inicia em modo desenvolvimento com hot-reload
- `yarn start:debug` - Inicia em modo debug
- `yarn start:prod` - Inicia em modo produção
- `yarn build` - Compila o projeto
- `yarn test` - Executa os testes
- `yarn test:watch` - Executa testes em modo watch
- `yarn test:cov` - Executa testes com cobertura
- `yarn lint` - Executa o linter
- `yarn format` - Formata o código

⸻

## 🔧 Configurações Adicionais

### Variáveis de Ambiente

Certifique-se de configurar todas as variáveis necessárias no arquivo `.env`:

- `NODE_ENV`: Ambiente de execução (development, production, test)
- `PORT`: Porta onde a aplicação será executada
- `DATABASE_*`: Configurações do banco PostgreSQL
- `JWT_SECRET`: Chave secreta para tokens JWT

### Banco de Dados

O projeto utiliza PostgreSQL com TypeORM. Certifique-se de:

1. Ter o PostgreSQL instalado e rodando
2. Criar um banco de dados chamado `voluntariar`
3. Configurar as credenciais corretas no arquivo `.env`

⸻

## 📚 Documentação Adicional

- **NestJS**: https://nestjs.com/
- **TypeORM**: https://typeorm.io/
- **PostgreSQL**: https://www.postgresql.org/

⸻

## 🤝 Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

⸻

## 📄 Licença

Este projeto está sob a licença UNLICENSED.

---

## 📝 Observações

- **Desenvolvimento**: O projeto está configurado para desenvolvimento local
- **Banco de Dados**: Certifique-se de ter o PostgreSQL rodando antes de executar
- **Porta**: A aplicação roda na porta 3333 por padrão
- **Hot-reload**: Use `yarn start:dev` para desenvolvimento com recarregamento automático
- **Testes**: Execute `yarn test` para verificar se tudo está funcionando
- **Linting**: Use `yarn lint` para verificar a qualidade do código



