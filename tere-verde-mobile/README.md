# Terê Verde Mobile

# **Grupo polo-EAD-Teresópolis 07**

**Disciplina:** MVP Mobile Development – 2026.2 — UNIFESO
**Professor:** Antonio Pedrosa

# **Integrantes**

Iago Lima Guinossi - 01020841

Wesley de Souza Freire - 06012510

# **Situação-Problema #1: Circuito Terê Verde**

A geografia do território municipal de Teresópolis é caracterizada por terrenos montanhosos entremeados por vales. A área urbana encontra-se em um planalto a 869 metros acima do nível do mar e é delimitada por três unidades de conservação: o Parque Nacional da Serra dos Órgãos, o Parque Estadual dos Três Picos e o Parque Natural Municipal Montanhas de Teresópolis. A existência das unidades de conservação proporciona ao município o turismo ambiental, em especial de montanhismo, e também limitam o crescimento urbano.

Teresópolis é um destino turístico popular, atraindo visitantes em busca de belezas naturais e atividades ao ar livre, como trilhas e escaladas. A proposta do Circuito Terê Verde busca promover essas atrações, destacando a rica biodiversidade e as opções de ecoturismo disponíveis na região. A plataforma “Terê Verde Online” permite que os visitantes tenham acesso a informações atualizadas sobre a biodiversidade, trilhas, cachoeiras e eventos que ocorrem nesses espaços protegidos.

Nesta etapa, o projeto ganha uma **versão mobile**: um aplicativo para Android e iOS que consome a mesma API do site, levando as informações do Terê Verde para o celular do visitante — inclusive durante o passeio.

# **Possíveis Atores Envolvidos**

●     Visitantes: Usuários em busca de informações sobre ecoturismo, direto pelo celular.

●     Administradores: Responsáveis por manter o conteúdo atualizado, agora também pelo aplicativo.

# **Exigências**

● Navegação Mobile: Barra de navegação inferior com acesso rápido a Início, Trilhas, Eventos e demais seções.

● Conteúdo Atualizado: Todas as listagens vêm da API, sem dados duplicados no código do aplicativo.

● Interface Intuitiva: Cartões com imagem, título e informações resumidas; páginas de detalhe com galeria de fotos.

● Busca e Filtros: Busca por trilhas, cachoeiras e eventos e filtro por localização.

● Estados Claros: Mensagens de carregamento, lista vazia e falha de conexão, com opção de tentar novamente.

● Segurança de Dados: Login de administrador com token JWT guardado de forma segura no aparelho; a senha nunca é armazenada.

● Gestão pelo Celular: Administradores podem cadastrar, editar e excluir trilhas, cachoeiras e eventos (com fotos) e editar a temporada.

A lista completa de **requisitos funcionais e não funcionais** está no [README principal](../README.md#requisitos).

# **Funcionalidades**

| Tela | O que oferece |
|------|---------------|
| **Início** | Imagem de destaque de Teresópolis, busca, atalhos para as seções, trilhas em destaque, eventos e cachoeiras |
| **Trilhas** | Lista em cartões (imagem, nome, distância, local), busca e filtro por localização |
| **Eventos** | Lista com selo de data (ex.: 14–16 AGO), local e busca |
| **Cachoeiras** | Lista com busca e filtro por localização |
| **Detalhe** | Imagem principal, informações, descrição, mapa do Google Maps (quando cadastrado) e galeria de fotos em tela cheia |
| **Temporada** | Banner e texto da temporada atual |
| **Biodiversidade** | Conteúdo sobre a fauna e flora dos parques de Teresópolis |
| **Sobre** | Informações sobre o projeto e a equipe |
| **Área administrativa** | Login, painel, cadastro/edição/exclusão com até 5 fotos e mapa (colando o HTML de incorporação do Google Maps) e edição da temporada |

# **Tecnologia Utilizada**

| Biblioteca | Versão | Função |
|------------|--------|--------|
| **Expo** | SDK 58 | Plataforma para criar, rodar e gerar o app Android/iOS |
| **React Native** | 0.88 | Interface nativa com componentes React |
| **Expo Router** | 58.x | Navegação por arquivos (abas e pilhas de telas) |
| **expo-image** | 58.x | Exibição de imagens com cache e carregamento progressivo |
| **react-native-webview** | 14.x | Exibe o mapa do Google Maps no Android/iOS |
| **expo-image-picker** | 58.x | Escolha de fotos da galeria no cadastro (permissão pedida só ao usar) |
| **expo-secure-store** | 58.x | Armazenamento seguro do token JWT |
| **@expo/vector-icons** | 15.x | Ícones (Ionicons) |
| **expo-build-properties** | 58.x | Configuração nativa (libera HTTP para a API local no APK) |

O back-end é a API do projeto (`../mvp-back-end`): Node.js + Express 5 + Prisma (SQLite), com autenticação JWT e upload de imagens.

# **Como Funcionar projeto local**

**1. Suba a API** (em um terminal)

```bash
cd ../mvp-back-end
cp .env.example .env
npm i
npm start
```

No `.env` da API, defina `JWT_SECRET` com uma chave aleatória. O comando para gerar está no próprio arquivo.

A API roda em `http://localhost:3000` e já tem dados de exemplo em `prisma/dev.db`.

**2. Configure o endereço da API**

Copie `.env.example` para `.env` e ajuste:

- Navegador no PC: `EXPO_PUBLIC_API_URL=http://localhost:3000`
- Celular com Expo Go: `EXPO_PUBLIC_API_URL=http://IP_DO_PC:3000` (veja o IP com `ipconfig`)

**3. Instale as dependências e inicie o app** (em outro terminal)

```bash
npm i
npx expo start
```

- **Celular:** instale o **Expo Go** (Play Store / App Store) e leia o QR code. O celular precisa estar na mesma rede do PC — ou conectado ao **Hotspot Móvel** do Windows.
- **Navegador:** pressione `w` no terminal.

Depois de alterar o `.env`, reinicie com `npx expo start --clear`.

**Problemas de conexão no celular?** Teste `http://IP_DO_PC:3000/trilhas` no navegador do celular. Se não abrir, libere o **Node.js** no Firewall do Windows para redes Privadas e Públicas.

# **Gerar o APK (Android)**

O APK é gerado na nuvem pelo **EAS Build** (conta gratuita em https://expo.dev/signup). O endereço da API é gravado no APK durante a compilação, por isso há dois perfis no `eas.json`:

| Perfil | Para quê | API usada |
|--------|----------|-----------|
| `emulador` | Emulador do Android Studio no PC | `http://10.0.2.2:3000` |
| `celular` | Celular na mesma rede do PC | `http://192.168.1.13:3000` (troque pelo IP do seu PC) |

```bash
npx eas-cli@latest login
npx eas-cli@latest build -p android --profile emulador
```

Ao terminar, o EAS mostra o link para baixar o `.apk`. Para testar no PC, instale o **Android Studio**, inicie um emulador em *Device Manager* e arraste o `.apk` para a janela dele.

# **Estrutura do Projeto**

```
src/
├── app/                      → telas (cada arquivo é uma rota do Expo Router)
│   ├── (tabs)/               → abas: Início, Trilhas, Eventos, Mais
│   ├── detalhe/[tipo]/[id].js→ detalhe de trilha, cachoeira ou evento
│   ├── admin/                → área protegida por login (painel, listas, formulários)
│   └── login.js, busca.js, cachoeiras.js, temporada.js, biodiversidade.js, sobre.js
├── components/               → cartões, busca, filtros, galeria, botões, campos, estados
├── api.js                    → comunicação com a API (URL configurável, token, upload)
├── AuthContext.js            → login/logout e armazenamento seguro do token
├── useApi.js                 → carregamento de dados com loading, erro e atualização
├── utils.js                  → busca, datas de eventos e avisos
└── theme.js                  → cores, espaçamentos e tipografia (verde e branco)
```
