import React from "react";
import ActivityCard from "./ActivityCard.jsx";
import { useDroppable } from "@dnd-kit/core";

function GroupColumn({ group, activities, onNewCardClick, onEditActivity }) {
  const { isOver, setNodeRef } = useDroppable({
    id: group.id,
  });

  const style = {
    backgroundColor: isOver ? "#cceeff" : "transparent",
    transition: "background-color 0.2s ease",
  };
  
  return (
    <div className="group-column">
      <h2 className="group-title">{group.title}</h2>
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