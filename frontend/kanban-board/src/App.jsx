import "./App.css";
import React, { useState} from "react";
import Board from "./components/Board.jsx";
import Header from "./components/Header.jsx";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [overdueCount, setOverdueCount] = useState(0);

  return (
    <div className="App">
      <Header 
        onSearchChange={setSearchTerm}
        overdueCount={overdueCount}
      />
      
      <main>
        <Board 
          searchTerm={searchTerm} 
          onUpdateOverdueCount={setOverdueCount}
        />
      </main>
    </div>
  );
}

export default App;
