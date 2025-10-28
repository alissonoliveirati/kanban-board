import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

function ActivityCard({ activity, onClick }) {

    const { 
        attributes, 
        listeners, 
        setNodeRef, 
        transform, 
        isDragging 
    } = useDraggable({
        id: activity.activityId,
        data: { type: "activity" },
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
        cursor: "grab",
    };

    const isCompleted = activity.isCompleted;
    const isOverdue = new Date(activity.dueDate) < new Date() && !isCompleted;

    let cardClass = "activity-card";
    if (isCompleted) {
        cardClass += " card--completed";
    } else if (isOverdue) {
        cardClass += " card--overdue";
    }
    

    return (
        <div 
            ref={setNodeRef} 
            style={style} 
            {...listeners} 
            {...attributes}
            className={cardClass} 
            onClick={onClick}
        >
            <p>{activity.description}</p>
            {activity.dueDate && (
                <div className="activity-date">
                    <span>{new Date(activity.dueDate).toLocaleDateString()}</span>
                </div>
            )}
        </div>
    );
}

export default ActivityCard;    