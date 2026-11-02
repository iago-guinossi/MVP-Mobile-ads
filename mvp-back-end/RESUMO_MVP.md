# MVP — Back-end da API

## Visão Geral

API REST desenvolvida em Node.js para gerenciar os conteúdos de um parque natural, incluindo trilhas, eventos, cachoeiras e informações de temporada. Permite cadastro, edição, remoção e listagem de cada recurso, com suporte a upload de imagens e autenticação de administrador via token JWT.

---

## Stack Tecnológica

### Servidor

| Biblioteca | Versão | Função |
|------------|--------|--------|
| **Express** | 5.x | Framework web — define rotas, middlewares e responde às requisições HTTP |
| **CORS** | 2.x | Permite que o front-end (em outro domínio/porta) consuma a API |

### Banco de Dados

| Biblioteca | Versão | Função |
|------------|--------|--------|
| **Prisma ORM** | 7.x | Mapeamento de modelos para tabelas, migrações automáticas e queries tipadas |
| **Better-SQLite3** | 12.x | Driver SQLite em JavaScript puro — banco de dados embutido, sem servidor externo |
| **@prisma/adapter-better-sqlite3** | 7.x | Adaptador que conecta o Prisma ao driver SQLite JS |

### Autenticação

| Biblioteca | Versão | Função |
|------------|--------|--------|
| **jsonwebtoken** | 9.x | Gera e valida tokens JWT para proteger rotas de administrador |
| **bcrypt** | 6.x | Criptografia de senhas com hash seguro (salt rounds) |

### Upload de Imagens

| Biblioteca | Versão | Função |
|------------|--------|--------|
| **Multer** | 2.x | Recebe arquivos `multipart/form-data`, valida tipo/tamanho e salva no disco |

### Testes

| Biblioteca | Versão | Função |
|------------|--------|--------|
| **Jest** | 30.x | Framework de testes unitários — executa mocks de banco e filesystem sem dependências reais |

---

## Recursos da API

| Rota | Descrição | Autenticação |
|------|-----------|:------------:|
| `POST /register` | Cadastra um administrador | — |
| `POST /login` | Autentica e retorna token JWT | — |
| `GET /trilhas` | Lista todas as trilhas | — |
| `POST /trilhas` | Cria trilha com imagens | JWT |
| `PUT /trilhas/:id` | Atualiza trilha e gerencia imagens | JWT |
| `DELETE /trilhas/:id` | Remove trilha e arquivos do disco | JWT |
| `GET /eventos` | Lista todos os eventos | — |
| `POST /eventos` | Cria evento com imagens | JWT |
| `PUT /eventos/:id` | Atualiza evento | JWT |
| `DELETE /eventos/:id` | Remove evento | JWT |
| `GET /cachoeiras` | Lista todas as cachoeiras | — |
| `POST /cachoeiras` | Cria cachoeira com imagens | JWT |
| `PUT /cachoeiras/:id` | Atualiza cachoeira | JWT |
| `DELETE /cachoeiras/:id` | Remove cachoeira | JWT |
| `GET /temporada` | Lista registros de temporada | — |
| `POST /temporada` | Cria registro com imagem única | JWT |
| `PUT /temporada/:id` | Atualiza texto e/ou imagem | JWT |
| `DELETE /temporada/:id` | Remove registro | JWT |

> **Total: 18 endpoints** — leitura pública, escrita protegida por JWT

---

## Arquitetura do Projeto

```
src/
├── app.js              → configuração do Express e middlewares globais
├── server.js           → inicialização do servidor (porta 3000)
├── lib/
│   └── prisma.js       → instância única do banco de dados
├── config/
│   └── multer.js       → regras de upload (tipo, tamanho, destino)
├── middleware/
│   └── auth.js         → verificação do token JWT
├── controllers/        → lógica de cada recurso (5 arquivos)
└── routes/             → definição das rotas HTTP (6 arquivos)
```

---

## Destaques Técnicos

- **Upload com validação** — aceita apenas JPEG, PNG e WebP, com limite de 5 MB por arquivo
- **Gerenciamento de imagens** — ao atualizar ou deletar um registro, os arquivos físicos são removidos automaticamente do disco
- **Banco embutido** — SQLite via Prisma, sem necessidade de instalar banco externo
- **71 testes unitários** — cobertura completa de todos os controllers e do middleware de autenticação, com banco e filesystem mockados
- **Documentação** — `API.md` com todos os endpoints, campos e exemplos de resposta

---

## Como Executar

```bash
npm install          # instala dependências
npm start            # inicia o servidor em localhost:3000
npm test             # executa os 71 testes unitários
```
