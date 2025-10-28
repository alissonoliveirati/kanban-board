# Desafio Prático: Sistema de Controle de Atividades (Kanban Board)

Este projeto é uma solução para o desafio prático de desenvolvimento de um sistema web de controle de atividades, similar a um quadro Kanban.

O sistema permite ao usuário criar grupos de atividades, criar e editar atividades, e movê-las entre os grupos com funcionalidade "arrastar e soltar" (drag and drop).

---

## 🚀 Recursos Implementados

* **Grupos (Colunas):**
    * Criação de novos grupos.
    * Edição do título do grupo (clicando no título).
* **Atividades (Cards):**
    * Criação de novas atividades (via modal).
    * Edição de atividades (descrição, data de entrega, status "concluído").
* **Funcionalidades Principais:**
    * **Drag and Drop:** Mover atividades entre grupos.
    * **Persistência:** Todas as mudanças (criação, edição, movimento) são salvas no banco de dados.
    * **Datas e Status:**
        * Atividades concluídas são destacadas em **verde**.
        * Atividades atrasadas são destacadas em **vermelho**.
    * **Busca:** Filtragem de atividades em tempo real pelo campo de busca.
    * **Notificações:** Contagem de atividades em atraso exibida no cabeçalho.

---

## 🛠️ Tecnologias Utilizadas

* **Frontend:**
    * **React.js**
    * **@dnd-kit:** Para a funcionalidade de "arrastar e soltar".
    * CSS puro para estilização.
* **Backend (Serverless):**
    * **AWS Lambda:** Para a lógica de negócio (escrito em Python 3).
    * **AWS API Gateway:** Para expor os endpoints HTTP.
    * **AWS DynamoDB:** Como banco de dados NoSQL para persistir os dados.
    * **AWS SAM:** (Serverless Application Model) Para facilitar o build e deploy da infraestrutura serverless.

---

## ⚙️ Como Executar o Projeto

Para executar este projeto, você precisará de **dois terminais**: um para o backend e um para o frontend.

### 1. Executando o Backend (AWS)

O backend é serverless e precisa ser "deployado" na AWS.

1.  Navegue até a pasta do backend: `cd backend`
2.  Siga as instruções detalhadas no arquivo `backend/README.md` para fazer o deploy da sua própria API na AWS usando o SAM.
3.  Após o deploy, a AWS fornecerá uma **URL da API** (ex: `https://xxxxxx.execute-api.us-east-1.amazonaws.com/Prod/`). **Copie esta URL.**

### 2. Executando o Frontend (Local)

1.  Navegue até a pasta do frontend (ex: `cd frontend/kanban-board`).
2.  **IMPORTANTE:** Abra o arquivo `src/components/Board.jsx`.
3.  Localize a variável `API_URL` (no topo do arquivo) e **cole a URL da API** que você copiou do passo anterior.
4.  Instale as dependências: `npm install`
5.  Inicie o servidor de desenvolvimento: `npm run dev`

Agora, o seu frontend local estará rodando e se comunicando com a sua API na nuvem.

---

## 📖 Aprendizados

- Implementação de uma **API serverless** completa com serviços da AWS (Lambda, API Gateway e DynamoDB).
- Conexão de um frontend React a uma API REST na nuvem, tratando requisições assíncronas (fetch).
- Gerenciamento de estado complexo no React (`useState`, `useEffect`) para uma aplicação interativa.
- Implementação de interações de UI avançadas, como **"Arrastar e Soltar" (Drag and Drop)** usando a biblioteca `@dnd-kit`.
- Aplicação da técnica de **"Atualização Otimista" (Optimistic Update)** com lógica de *rollback* para criar uma experiência de usuário rápida e resiliente.
- Debugging full-stack, analisando erros desde a UI no navegador, passando pela aba "Network", até os logs da função Lambda (CloudWatch).
- Configuração e deploy de infraestrutura como código (IaC) usando o **AWS SAM**.

---

## 👨‍💻 Autor
Projeto desenvolvido por Alisson Oliveira como parte do aprendizado em React, Python, AWS e boas práticas de desenvolvimento.