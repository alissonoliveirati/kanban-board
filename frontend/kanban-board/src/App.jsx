import "./App.css";
import React from "react";
import Board from "./components/Board";

function App() {
  return (
    <div className="App">
      <main>
        <h1>Kanban Board</h1>
        <Board />
      </main>
    </div>
  );
}

export default App;
