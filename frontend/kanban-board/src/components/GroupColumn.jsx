import React, { useState } from "react";
import ActivityCard from "./ActivityCard.jsx";
import { useDroppable } from "@dnd-kit/core";

function GroupColumn({ group, activities, onNewCardClick, onEditActivity, onUpdateGroupTitle }) {
  // State para edição do título do grupo
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(group.title);
    
  const { isOver, setNodeRef } = useDroppable({
    id: group.id,
  });

  const style = {
    backgroundColor: isOver ? "#cceeff" : "transparent",
    transition: "background-color 0.2s ease",
  };
  
  // Função para salvar o novo título do grupo
  const handleTitleSave = () => {
    setIsEditingTitle(false);
    if (currentTitle.trim() && currentTitle !== group.title) {
      onUpdateGroupTitle(group.id, currentTitle.trim());
    } else {
      setCurrentTitle(group.title); // Reverte para o título original se vazio
    }
  }

  // Função para lidar com a tecla Enter ao editar o título
  const handleTitleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleTitleSave();
    } else if (e.key === "Escape") {
      setIsEditingTitle(false);
      setCurrentTitle(group.title); // Reverte para o título original
    }
  };

  return (
    <div className="group-column">
      {isEditingTitle ? (
        <input 
          type="text"
          className="group-title-input"
          value={currentTitle}
          onChange={(e) => setCurrentTitle(e.target.value)}
          onBlur={handleTitleSave}
          onKeyDown={handleTitleKeyDown}
          autoFocus
        />
      ) : (
        <h2 
          className="group-title"
          onClick={() => setIsEditingTitle(true)}
        >
          {group.title}
        </h2>
      )}

      <div 
        ref={setNodeRef}
        style={style}
        className="activity-list"
      >
        {activities.map((activity) => (
          <ActivityCard 
            key={activity.id} 
            activity={activity}
            onClick={() => onEditActivity(activity)}
          />
        ))}
      </div>
      
      <button 
        className="new-card-button"
        onClick={onNewCardClick}
      >
        + Novo Card
      </button>
    </div>
  );
}

export default GroupColumn;