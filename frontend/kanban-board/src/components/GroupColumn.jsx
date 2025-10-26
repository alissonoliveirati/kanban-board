import React from "react";
import ActivityCard from "./ActivityCard";

function GroupColumn({ group, activities, onNewCardClick, onEditActivity }) {
  return (
    <div className="group-column">
      <h2 className="group-title">{group.title}</h2>
      <div className="activity-list">
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