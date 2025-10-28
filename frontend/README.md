# Frontend - Interface React (Kanban Board)

Esta pasta contém o código-fonte da interface do usuário (UI) para o sistema de controle de atividades, construído em React.js.

## 🛠️ Tecnologias e Bibliotecas
* React.js
* Vite (ambiente de desenvolvimento)
* `@dnd-kit/core`: Para a funcionalidade de "arrastar e soltar" (drag and drop).
* `@dnd-kit/sortable`: (Embora tenhamos usado apenas o `core` para mover entre colunas).

## 📦 Instalação e Execução

1.  **Navegar para a pasta:**
    * `cd frontend/kanban-board` (ou o nome da sua pasta)

2.  **Instalar Dependências:**
    * `npm install`

3.  **Configurar a API (IMPORTANTE!)**
    * Este projeto frontend *precisa* de um backend para funcionar.
    * Abra o arquivo `src/components/Board.jsx`.
    * No topo do arquivo, localize a constante `API_URL`.
    * `const API_URL = "https://xxxxxx.execute-api.us-east-1.amazonaws.com/Prod/";`
    * Altere o valor desta string para a URL da API que você obteve ao fazer o deploy do backend.

4.  **Iniciar o Servidor Local:**
    * `npm run dev`
    * Abra o navegador no endereço [http://localhost:5173](http://localhost:5173) (ou o que for indicado no seu terminal).

## 🏗️ Estrutura dos Componentes

* **`App.jsx`**: Componente raiz, gerencia o estado da busca e o contador de atrasos.
* **`Board.jsx`**: O componente principal. Gerencia todo o estado do quadro (grupos, atividades), a lógica de `fetch` (comunicação com a API) e a lógica do `DndContext` (drag and drop).
* **`GroupColumn.jsx`**: Renderiza uma coluna (grupo) e suas atividades. É uma área "soltável" (droppable).
* **`ActivityCard.jsx`**: Renderiza um card de atividade. É um item "arrastável" (draggable).
* **`ActivityModal.jsx`**: O popup (modal) usado para criar e editar atividades.
* **`NewGroupCreator.jsx`**: O componente para criar uma nova coluna de grupo.
* **`SearchBar.jsx` / `Header.jsx`**: Componentes do cabeçalho.