import React, { useState } from "react";

function Notification({ count = 0}) {
    const [isHovering, setIsHovering] = useState(false);
    const message = `Existem ${count} tarefas atrasadas!`;
    
    return (
        <div 
            className="notification-bell"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <span className="bell-icon">🔔</span>
            {count > 0 && (
                <div className="notification-badge">
                    {count}
                </div>
            )}
            {isHovering && count > 0 && (
                <div className="notification-tooltip">
                    {message}
                </div>
            )}
        </div>
    );
}

export default Notification;