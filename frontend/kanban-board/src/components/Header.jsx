import React from "react";
import SearchBar from "./SearchBar.jsx";


function Header({ onSearchChange }) {
  return (
    <header className="Header">
      <h1>Kanban Board</h1>
      <SearchBar onSearchChange={onSearchChange} />
    </header>
  );
}

export default Header;
