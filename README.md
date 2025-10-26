Mini-Projeto: API de Autenticação (Node.js, Express, TS, MongoDB)
Uma API backend completa para autenticação de usuários, construída com Node.js, Express e TypeScript. Este projeto implementa um sistema de registro e login seguro usando JSON Web Tokens (JWT) e hash de senhas com bcrypt.

A aplicação é configurada para se conectar tanto a um banco de dados MongoDB local (gerenciado por Podman/Docker) quanto a um banco na nuvem (MongoDB Atlas), e está pronta para deploy na Vercel.

🎥 Demonstração do Projeto
Assista a uma demonstração completa ou um tutorial deste projeto no YouTube:

(https://youtu.be/2CrnVlwn1FM?si=VLXBNsBpMbSh8I5d)

✨ Features
Registro de Usuário: Criação de novos usuários com senha criptografada (bcrypt).

Login de Usuário: Autenticação de usuários existentes, retornando um token JWT.

Rotas Protegidas: Middlewares que verificam a validade do token JWT para proteger rotas específicas.

Ambiente Duplo: Configurado para rodar em desenvolvimento (com MONGO_URI_LOCAL) e produção (com MONGO_URI_CLOUD).

Pronto para Deploy: Totalmente configurado para deploy contínuo na Vercel.

🛠️ Tecnologias Utilizadas
Backend: Node.js, Express, TypeScript

Banco de Dados: MongoDB (com Mongoose)

Autenticação: JSON Web Token (JWT), bcrypt.js

Ambiente Local: Podman (ou Docker) com docker-compose.yaml (serviços: mongo, mongo-express)

Deploy: Vercel

Desenvolvimento: ts-node-dev (para live-reload)

Validação: cors (para permitir requisições de frontends)

🚀 Começando
Siga estas instruções para obter uma cópia do projeto e executá-la em sua máquina local para desenvolvimento e testes.

Pré-requisitos
Node.js (v18 ou superior)

Git

Podman (ou Docker) para o ambiente de banco de dados local.

1. Instalação Local
Clone o repositório:

Bash

git clone https://github.com/SEU-USUARIO/NOME-DO-SEU-REPOSITORIO.git
cd NOME-DO-SEU-REPOSITORIO
Instale as dependências:

Bash

npm install
Configure as Variáveis de Ambiente: Crie um arquivo chamado .env na raiz do projeto e adicione as seguintes variáveis. Você pode usar o .env.example (se existir) como base.

Snippet de código

# Variável para o ambiente LOCAL (usada pelo `npm run dev`)
MONGO_URI_LOCAL=mongodb://bia:examplepass@localhost:27017/minhaapi?authSource=admin

# Variável para o ambiente de PRODUÇÃO (usada pela Vercel)
MONGO_URI_CLOUD=mongodb+srv://SEU_USUARIO_ATLAS:SUA_SENHA_ATLAS@cluster0.../minhaapi-cloud

# Segredo para o JWT
JWT_SECRET=MINHA_CHAVE_SUPER_SECRETA_PARA_PROJETO
JWT_EXPIRES_IN=1h

# Porta do servidor
PORT=3000
2. Rodando o Banco de Dados Local (Podman/Docker)
Este projeto usa um docker-compose.yaml para subir um banco MongoDB e uma interface gráfica (Mongo Express) localmente.

Inicie os contêineres:

Bash

podman compose up -d
Serviços disponíveis:

MongoDB: localhost:27017

Mongo Express: http://localhost:8081 (Login: mongoexpressuser / mongoexpresspass)

3. Rodando a Aplicação (Modo de Desenvolvimento)
Com o banco de dados local rodando, inicie a API:

Bash

npm run dev
O servidor estará no ar em http://localhost:3000. A API usará automaticamente a variável MONGO_URI_LOCAL.

📦 API Endpoints
Todas as rotas são prefixadas com /api.

Autenticação
POST /api/register
Registra um novo usuário.

Body (JSON):

JSON

{
  "name": "Bia Teste",
  "email": "bia@teste.com",
  "password": "senha123"
}
Resposta (201 Created):

JSON

{
  "user": {
    "name": "Bia Teste",
    "email": "bia@teste.com",
    "id": "..."
  }
}
POST /api/login
Autentica um usuário existente e retorna um token JWT.

Body (JSON):

JSON

{
  "email": "bia@teste.com",
  "password": "senha123"
}
Resposta (200 OK):

JSON

{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
Rotas Protegidas
GET /api/protected
Exemplo de uma rota que requer autenticação.

Headers:

Authorization: Bearer <seu_token_jwt>

Resposta (200 OK):

JSON

{
  "message": "Esta é uma rota protegida.",
  "userId": "..."
}

CRUD de Contatos (/api/contacts)
Todas as rotas de contatos são protegidas e exigem um token JWT no cabeçalho Authorization: Bearer <seu_token>.

POST /api/contacts
Cria um novo contato para o usuário autenticado.

Body (JSON):

JSON

{
  "name": "Primeiro Contato",
  "email": "contato@email.com",
  "phone": "99999-8888"
}
Resposta (201 Created): Retorna o objeto do contato criado, incluindo seu _id e o user (ID do dono).

GET /api/contacts
Lista todos os contatos pertencentes ao usuário autenticado.

Query Params (Opcional para filtro):

GET /api/contacts?name=Primeiro (Busca por nome, case-insensitive)

GET /api/contacts?email=contato (Busca por email, case-insensitive)

Resposta (200 OK):

JSON

[
  { "_id": "...", "name": "Primeiro Contato", "email": "contato@email.com", ... },
  { "_id": "...", "name": "Segundo Contato", "email": "outro@email.com", ... }
]
GET /api/contacts/:id
Busca um contato específico pelo ID.

Resposta (200 OK): Retorna o objeto do contato.

Resposta de Erro (404 Not Found): Se o contato não for encontrado ou não pertencer ao usuário logado.

PUT /api/contacts/:id
Substitui todos os dados de um contato existente. (Campos omitidos serão definidos como nulos).

Body (JSON):

JSON

{
  "name": "Contato Atualizado (PUT)",
  "phone": "1122223333"
}
Resposta (200 OK): Retorna o objeto do contato com os dados atualizados.

Resposta de Erro (404 Not Found): Se o contato não pertencer ao usuário.

PATCH /api/contacts/:id
Atualiza parcialmente um contato existente. (Apenas os campos enviados são modificados).

Body (JSON):

JSON

{
  "email": "email-novo@patch.com"
}
Resposta (200 OK): Retorna o objeto do contato com o campo atualizado.

Resposta de Erro (404 Not Found): Se o contato não pertencer ao usuário.

DELETE /api/contacts/:id
Deleta um contato.

Resposta (204 No Content): Resposta de sucesso sem corpo.

Resposta de Erro (404 Not Found): Se o contato não pertencer ao usuários


🌐 Deploy na Vercel
Este projeto está configurado para deploy contínuo na Vercel através do arquivo vercel.json.

URL da Aplicação: (https://cadastro.beatrizrosa.me/)

Configuração na Vercel
Para o deploy funcionar, você deve configurar as seguintes variáveis de ambiente no painel do seu projeto na Vercel:

MONGO_URI_CLOUD: (A sua string de conexão completa do MongoDB Atlas)

JWT_SECRET: (O mesmo segredo que você usa localmente)

JWT_EXPIRES_IN: (Ex: 1h ou 7d)

O código (src/database/index.ts) está configurado para usar automaticamente a MONGO_URI_CLOUD quando estiver no ambiente de produção (como o da Vercel).
