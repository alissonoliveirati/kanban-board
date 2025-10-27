import "./App.css";
import React, { useState} from "react";
import Board from "./components/Board.jsx";
import Header from "./components/Header.jsx";

function App() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="App">
      <Header onSearchChange={setSearchTerm} />
      
      <main>
        <h1>Kanban Board</h1>
        <Board searchTerm={searchTerm} />
      </main>
    </div>
  );
}

export default App;
