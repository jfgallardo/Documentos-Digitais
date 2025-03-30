# 📜 Documentos Digitais

## 📌 Sobre o Projeto
Este repositório contém um protótipo simplificado de um sistema de gerenciamento e assinatura de documentos. O objetivo é permitir que usuários autenticados realizem o upload, listagem, visualização e assinatura digital simulada de documentos.

## 🏗 Estrutura do Repositório
O projeto está dividido em três principais diretórios:

- 📂 **frontend** - Interface do usuário desenvolvida em Next.js
- 📂 **backend** - Lógica de negócios e APIs para manipulação de documentos desenvolvida em NestJS
- 📂 **core** - Estado global compartilhado entre frontend e backend

## 🎯 Funcionalidades Principais
- Autenticação de usuários (e-mail/senha e OAuth) ✔
- Upload e listagem de documentos (PDF) ✔
- Visualização de documentos ✔
- Simulação de assinatura digital ✔
- Gerenciamento de sessão e proteção de rotas ✔

## 🛠 Tecnologias Utilizadas
### 🔹 **Frontend**
- Next.js (App Router)
- NextAuth.js 4 (Autenticação)
- TypeScript
- Formulários com validação
- Interfaces responsivas e acessíveis

### 🔹 **Backend**
- API Routes do Next.js
- Persistência básica de dados (Mongo)
- Upload de arquivos (.pdf, .jpg, .jpeg, .png )
- Edição de arquivos (PDF)

## 🚀 Como Executar o Projeto
1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/documentos-digitais.git
   cd documentos-digitais
   ```
2. Instale as dependências:
   ```bash
   yarn install
   ```
3. Configure as variáveis de ambiente:
   ```bash
   cp .env.example .env
   ```
4. Inicie o ambiente de desenvolvimento:
   ```bash
   yarn dev
   ```

## 📜 Scripts Disponíveis
No diretório raiz do projeto, você pode executar:

- `yarn dev` – Inicia o frontend e backend simultaneamente usando `concurrently`.
- `yarn format` – Formata o código usando Prettier.

## 📄 Licença
Este projeto está licenciado sob a ISC License - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

Feito por [Julio Gallardo](https://github.com/jfgallardo) 🚀

