import React from "react";

function ActivityCard({ activity }) {
    const isCompleted = activity.isCompleted;
    const isOverdue = new Date(activity.dueDate) < new Date() && !isCompleted;

    let cardClass = "activity-card ";
    if (isCompleted) {
        cardClass += "completed-card";
    } else if (isOverdue) {
        cardClass += "overdue-card";
    }

    return (
        <div className={cardClass}>
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