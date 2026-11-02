# Terê Verde Online — MVP Mobile

**Disciplina:** MVP Mobile Development – 2026.2 — UNIFESO
**Professor:** Antonio Pedrosa
**Grupo polo-EAD-Teresópolis 07:** Iago Lima Guinossi (01020841) e Wesley de Souza Freire (06012510)

Aplicativo mobile do **Circuito Terê Verde**, que reúne trilhas, cachoeiras, eventos, temporada e biodiversidade dos parques de Teresópolis, com área administrativa para manter o conteúdo atualizado.

## Estrutura do repositório

| Pasta | O que é |
|-------|---------|
| [`tere-verde-mobile/`](tere-verde-mobile/README.md) | App mobile (React Native + Expo) — Android, iOS e web |
| [`mvp-back-end/`](mvp-back-end/API.md) | API REST (Node.js + Express + Prisma/SQLite) com JWT e upload de imagens |

Documentos da disciplina na raiz: `requisitos_mobile_tere_verde.pdf`, `Projetos Disponíveis - Disciplina MVP MOBILE DEVELOPMENT-1 (1).pdf` e os protótipos de tela (`WhatsApp Image ….jpeg`).

## Requisitos

Baseados no documento `requisitos_mobile_tere_verde.pdf` e adaptados ao que foi implementado. Os filtros e campos seguem os dados que a API realmente tem.

### Requisitos Funcionais (RF)

| ID | Descrição |
|----|-----------|
| RF01 | O app deve ter uma página inicial com imagem de destaque de Teresópolis, campo de busca, atalhos para as seções e destaques de trilhas, eventos e cachoeiras. |
| RF02 | O app deve ter navegação por barra inferior (Início, Trilhas, Eventos e Mais), com a aba atual destacada. |
| RF03 | O app deve listar as trilhas em cartões com imagem, nome, distância e localização. |
| RF04 | O app deve listar as cachoeiras em cartões com imagem, nome e localização. |
| RF05 | O app deve listar os eventos em cartões com imagem, nome, selo de data e local. |
| RF06 | O usuário deve poder abrir os detalhes de uma trilha, cachoeira ou evento, com imagem principal, descrição e informações (distância, data, local). |
| RF07 | O app deve exibir as fotos de cada conteúdo em uma galeria, com visualização em tela cheia. |
| RF08 | O detalhe deve mostrar o mapa do Google Maps do local, quando cadastrado. |
| RF09 | O app deve exibir a temporada atual, com banner e texto. |
| RF10 | O app deve ter as páginas Biodiversidade e Sobre o projeto. |
| RF11 | O usuário deve poder buscar trilhas, cachoeiras e eventos por nome, local ou descrição. |
| RF12 | As listas devem permitir filtrar por localização. |
| RF13 | O usuário deve poder atualizar as listas arrastando a tela para baixo. |
| RF14 | O administrador deve poder entrar com e-mail e senha, recebendo um token JWT. |
| RF15 | A área administrativa só deve ser acessível com login. Sem login, o usuário é levado para a tela de entrada. |
| RF16 | O administrador deve poder cadastrar, editar e excluir trilhas, cachoeiras e eventos, com até 5 fotos (1 para eventos). |
| RF17 | O administrador deve poder cadastrar o mapa colando o HTML de incorporação do Google Maps. A API recorta e guarda apenas a URL. |
| RF18 | O administrador deve poder editar a temporada (texto e banner). |
| RF19 | O administrador deve poder sair da conta. Quando a sessão expira, o app pede um novo login. |
| RF20 | As listas devem mostrar as alterações feitas pelo administrador assim que ele salva. |

### Requisitos Não Funcionais (RNF)

| ID | Descrição |
|----|-----------|
| RNF01 | O app deve funcionar em Android e iOS (Expo) e também no navegador. |
| RNF02 | A interface deve se adaptar ao tamanho da tela: uma coluna no celular e duas em tablets ou na horizontal, sem rolagem lateral. |
| RNF03 | Botões e links devem ter área de toque de pelo menos 44px, nomes acessíveis para leitores de tela e textos alternativos nas imagens. |
| RNF04 | A interface deve manter a identidade verde e branca do Terê Verde, com componentes reutilizáveis (cartões, botões, campos, estados). |
| RNF05 | O app deve mostrar estados claros de carregamento, lista vazia e erro, com opção de tentar novamente. Falhas de conexão não podem travar a navegação. |
| RNF06 | As imagens devem ter cache e carregamento progressivo, para economizar dados móveis. |
| RNF07 | Todo o conteúdo deve vir da API, sem dados duplicados no código do app. |
| RNF08 | O token JWT deve ficar no armazenamento seguro do aparelho (SecureStore). A senha nunca é guardada no app, e no servidor é salva com hash bcrypt. |
| RNF09 | A chave de assinatura do JWT deve ficar no `.env`, fora do código. O token deve expirar em 1 dia. |
| RNF10 | Os formulários devem validar campos obrigatórios, fotos (JPG, PNG ou WEBP, até 5 MB) e o HTML do mapa antes de enviar. A API repete essas validações. |
| RNF11 | O acesso às fotos do aparelho só deve ser pedido quando o administrador for adicionar uma foto. |
| RNF12 | O endereço da API deve ser configurável por ambiente (`EXPO_PUBLIC_API_URL`), para desenvolvimento local e produção. |
| RNF13 | A API deve ter testes automatizados (Jest) cobrindo autenticação, cadastros e o recorte do mapa. |
| RNF14 | Em produção, a comunicação com a API deve usar HTTPS. O HTTP fica liberado apenas para testes locais. |

## Como rodar

**1. API** (terminal 1)

```bash
cd mvp-back-end
cp .env.example .env
npm install
npm start
```

No `.env`, troque `JWT_SECRET` por uma chave aleatória. O próprio arquivo mostra o comando para gerar uma. Sem essa chave a API não inicia. É preciso Node.js 22.9 ou mais recente.

A API sobe em `http://localhost:3000` e já vem com dados de exemplo (`prisma/dev.db` e as fotos em `uploads/`).

**2. App** (terminal 2)

```bash
cd tere-verde-mobile
cp .env.example .env
npm install
npx expo start
```

No `.env`, ajuste `EXPO_PUBLIC_API_URL` para `http://IP_DO_PC:3000` (veja o IP com `ipconfig`). Depois leia o QR code com o **Expo Go** no celular, na mesma rede do PC, ou pressione `w` para abrir no navegador.

Mais detalhes — funcionalidades, tecnologias, geração do APK e estrutura de pastas — estão no [README do app](tere-verde-mobile/README.md) e na [documentação da API](mvp-back-end/API.md).

## Testes da API

```bash
cd mvp-back-end
npm test
```
