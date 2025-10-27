import React from "react";

function SearchBar({ onSearchChange }) {
  const handleInputChange = (event) => {
    onSearchChange(event.target.value);
  };

  return (
    <div className="SearchBar">
      <input
        type="text"
        placeholder="Localiza atividade..."
        onChange={handleInputChange}
      />
    </div>
  );
}

export default SearchBar;
