import React from "react";
import SearchBar from "./SearchBar.jsx";
import Notification from "./Notification.jsx";


function Header({ onSearchChange, overdueCount }) {
  return (
    <header className="header-container">
        <div className="header-left">
            <h1 className="header-title">Kanban Board</h1>   
            <SearchBar onSearchChange={onSearchChange} />
        </div>

        <div className="header-right">
            <Notification count={overdueCount} />
        </div>
    </header>
  );
}

export default Header;
