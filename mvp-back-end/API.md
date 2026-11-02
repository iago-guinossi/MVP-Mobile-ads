# Documentação da API — MVP Back-end

Base URL: `http://localhost:3000`

---

## Autenticação

As rotas protegidas exigem um token JWT no header da requisição:

```
Authorization: Bearer <token>
```

O token é obtido na rota de login e expira em **1 dia**.

Os tokens são assinados com a chave `JWT_SECRET`, definida no arquivo `.env` (modelo em `.env.example`). A chave nunca fica no código, e a API não inicia sem ela. Trocar a chave invalida os tokens já emitidos, e os administradores precisam fazer login de novo.

---

## Rotas de Autenticação

### `POST /register`
Cria um novo administrador.

**Body (JSON):**
```json
{
  "email": "admin@example.com",
  "password": "sua-senha"
}
```

**Resposta 200:**
```json
{
  "id": 1,
  "email": "admin@example.com",
  "password": "<hash>"
}
```

---

### `POST /login`
Autentica um administrador e retorna o token JWT.

**Body (JSON):**
```json
{
  "email": "admin@example.com",
  "password": "sua-senha"
}
```

**Resposta 200:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Resposta 401** — credenciais inválidas:
```json
{ "error": "Credenciais inválidas" }
```

---

## Trilhas

### `GET /trilhas`
Lista todas as trilhas com suas imagens.

**Resposta 200:**
```json
[
  {
    "id": 1,
    "name": "Pedra da Tartaruga",
    "summary": "Descrição da trilha...",
    "distance": "650 metros",
    "location": "Granja Florestal",
    "images": [
      { "id": 1, "src": "/uploads/arquivo.jpg", "trilhaId": 1 }
    ]
  }
]
```

---

### `GET /trilhas/:id`
Retorna uma trilha específica pelo ID.

**Resposta 200:** objeto da trilha (mesmo formato acima)

**Resposta 404:**
```json
{ "error": "Trilha não encontrada" }
```

**Resposta 400** — ID inválido:
```json
{ "error": "ID inválido" }
```

---

### `POST /trilhas` 🔒
Cria uma nova trilha. Aceita até **5 imagens**.

**Headers:** `Authorization: Bearer <token>`

**Body (multipart/form-data):**

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| `name` | texto | sim |
| `summary` | texto | sim |
| `distance` | texto | sim |
| `location` | texto | sim |
| `map` | texto | não — HTML de incorporação do Google Maps (ver "Mapa") |
| `images` | arquivo(s) (jpeg, jpg, png, webp — máx. 5MB cada) | não |

**Resposta 200:**
```json
{
  "id": 1,
  "name": "Pedra da Tartaruga",
  "summary": "Descrição...",
  "distance": "650 metros",
  "location": "Granja Florestal",
  "images": [
    { "id": 1, "src": "/uploads/1234567890-123456789.jpg", "trilhaId": 1 }
  ]
}
```

---

### `PUT /trilhas/:id` 🔒
Atualiza uma trilha. Permite alterar campos de texto e gerenciar imagens.

**Headers:** `Authorization: Bearer <token>`

**Body (multipart/form-data):**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `name` | texto | novo nome (opcional) |
| `summary` | texto | nova descrição (opcional) |
| `distance` | texto | nova distância (opcional) |
| `location` | texto | nova localização (opcional) |
| `map` | texto | opcional — novo HTML do mapa; vazio remove o mapa; ausente não altera |
| `imagesMantidas` | texto[] | srcs das imagens existentes a manter |
| `images` | arquivo(s) | novas imagens a adicionar (opcional) |

> Imagens não listadas em `imagesMantidas` serão **removidas do banco e do disco**.

**Resposta 200:** objeto atualizado da trilha

---

### `DELETE /trilhas/:id` 🔒
Remove uma trilha e todas as suas imagens do banco e do disco.

**Headers:** `Authorization: Bearer <token>`

**Resposta 200:**
```json
{ "message": "Trilha deletada com sucesso" }
```

---

## Eventos

### `GET /eventos`
Lista todos os eventos com suas imagens.

**Resposta 200:**
```json
[
  {
    "id": 1,
    "name": "XXII Encontro de Pesquisadores",
    "summary": "Descrição do evento...",
    "location": "Parque Nacional da Serra dos Órgãos",
    "date": "14 a 16 de Agosto 2025",
    "images": [
      { "id": 1, "src": "/uploads/arquivo.jpg", "eventoId": 1 }
    ]
  }
]
```

---

### `GET /eventos/:id`
Retorna um evento específico pelo ID.

**Resposta 200:** objeto do evento

**Resposta 404:**
```json
{ "error": "Evento não encontrado" }
```

---

### `POST /eventos` 🔒
Cria um novo evento. Aceita até **5 imagens**.

**Headers:** `Authorization: Bearer <token>`

**Body (multipart/form-data):**

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| `name` | texto | sim |
| `summary` | texto | sim |
| `location` | texto | sim |
| `map` | texto | não — HTML de incorporação do Google Maps (ver "Mapa") |
| `date` | texto | sim |
| `images` | arquivo(s) | não |

**Resposta 200:** objeto do evento criado

---

### `PUT /eventos/:id` 🔒
Atualiza um evento.

**Headers:** `Authorization: Bearer <token>`

**Body (multipart/form-data):**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `name` | texto | opcional |
| `summary` | texto | opcional |
| `location` | texto | opcional |
| `map` | texto | opcional — novo HTML do mapa; vazio remove o mapa; ausente não altera |
| `date` | texto | opcional |
| `imagesMantidas` | texto[] | srcs das imagens a manter |
| `images` | arquivo(s) | novas imagens (opcional) |

**Resposta 200:** objeto atualizado do evento

---

### `DELETE /eventos/:id` 🔒
Remove um evento e todas as suas imagens.

**Headers:** `Authorization: Bearer <token>`

**Resposta 200:**
```json
{ "message": "Evento deletado com sucesso" }
```

---

## Cachoeiras

### `GET /cachoeiras`
Lista todas as cachoeiras com suas imagens.

**Resposta 200:**
```json
[
  {
    "id": 1,
    "name": "Cachoeira dos Frades",
    "summary": "Descrição da cachoeira...",
    "location": "Parque Estadual dos Três Picos",
    "images": [
      { "id": 1, "src": "/uploads/arquivo.jpg", "cachoiraId": 1 }
    ]
  }
]
```

---

### `GET /cachoeiras/:id`
Retorna uma cachoeira específica pelo ID.

**Resposta 200:** objeto da cachoeira

**Resposta 404:**
```json
{ "error": "Cachoeira não encontrada" }
```

---

### `POST /cachoeiras` 🔒
Cria uma nova cachoeira. Aceita até **5 imagens**.

**Headers:** `Authorization: Bearer <token>`

**Body (multipart/form-data):**

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| `name` | texto | sim |
| `summary` | texto | sim |
| `location` | texto | sim |
| `map` | texto | não — HTML de incorporação do Google Maps (ver "Mapa") |
| `images` | arquivo(s) | não |

**Resposta 200:** objeto da cachoeira criada

---

### `PUT /cachoeiras/:id` 🔒
Atualiza uma cachoeira.

**Headers:** `Authorization: Bearer <token>`

**Body (multipart/form-data):**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `name` | texto | opcional |
| `summary` | texto | opcional |
| `location` | texto | opcional |
| `map` | texto | opcional — novo HTML do mapa; vazio remove o mapa; ausente não altera |
| `imagesMantidas` | texto[] | srcs das imagens a manter |
| `images` | arquivo(s) | novas imagens (opcional) |

**Resposta 200:** objeto atualizado da cachoeira

---

### `DELETE /cachoeiras/:id` 🔒
Remove uma cachoeira e todas as suas imagens.

**Headers:** `Authorization: Bearer <token>`

**Resposta 200:**
```json
{ "message": "Cachoeira deletada com sucesso" }
```

---

## Temporada

### `GET /temporada`
Lista todos os registros de temporada.

**Resposta 200:**
```json
[
  {
    "id": 1,
    "text": "Texto informativo da temporada...",
    "image": "/uploads/arquivo.jpg"
  }
]
```

---

### `GET /temporada/:id`
Retorna um registro de temporada pelo ID.

**Resposta 200:** objeto da temporada

**Resposta 404:**
```json
{ "error": "Temporada não encontrada" }
```

---

### `POST /temporada` 🔒
Cria um novo registro de temporada com **uma única imagem**.

**Headers:** `Authorization: Bearer <token>`

**Body (multipart/form-data):**

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| `text` | texto | sim |
| `image` | arquivo (jpeg, jpg, png, webp — máx. 5MB) | não |

**Resposta 200:**
```json
{
  "id": 1,
  "text": "Texto informativo...",
  "image": "/uploads/1234567890-123456789.jpg"
}
```

---

### `PUT /temporada/:id` 🔒
Atualiza o texto e/ou substitui a imagem. A imagem anterior é **removida do disco** ao enviar uma nova.

**Headers:** `Authorization: Bearer <token>`

**Body (multipart/form-data):**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `text` | texto | novo texto (opcional) |
| `image` | arquivo | nova imagem; substitui a anterior (opcional) |

**Resposta 200:** objeto atualizado da temporada

---

### `DELETE /temporada/:id` 🔒
Remove o registro e o arquivo de imagem do disco.

**Headers:** `Authorization: Bearer <token>`

**Resposta 200:**
```json
{ "message": "Temporada deletada com sucesso" }
```

---

## Mapa (Google Maps)

Trilhas, eventos e cachoeiras podem ter um mapa. O administrador envia no campo `map` o HTML que o Google Maps fornece em **Compartilhar → Incorporar um mapa → Copiar HTML**, por exemplo:

```html
<iframe src="https://www.google.com/maps/embed?pb=..." width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
```

A API recorta apenas o endereço do `src` e o devolve no campo `mapUrl` das respostas:

```json
{ "id": 2, "name": "Pedra da Tartaruga", "mapUrl": "https://www.google.com/maps/embed?pb=...", "images": [] }
```

- Também é aceita a URL pura (`https://www.google.com/maps/embed?...`).
- Qualquer outro conteúdo retorna `400 { "error": "Cole o HTML de incorporação do Google Maps (Compartilhar → Incorporar um mapa)" }`.
- Sem mapa, `mapUrl` é `null`.

---

## Imagens estáticas

As imagens enviadas ficam disponíveis diretamente pela URL:

```
GET /uploads/<nome-do-arquivo>
```

Exemplo: `http://localhost:3000/uploads/1234567890-123456789.jpg`

---

## Códigos de resposta

| Código | Significado |
|--------|-------------|
| `200` | Sucesso |
| `400` | ID inválido |
| `401` | Token ausente ou inválido |
| `404` | Recurso não encontrado |
| `500` | Erro interno do servidor |

---

## Restrições de upload

| Propriedade | Valor |
|-------------|-------|
| Formatos aceitos | `jpeg`, `jpg`, `png`, `webp` |
| Tamanho máximo por arquivo | 5 MB |
| Máximo de arquivos por requisição (multi-imagem) | 5 |
