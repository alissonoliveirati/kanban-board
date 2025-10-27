import React, { useState } from "react";

function NewGroupCreator({ onSave }) {
    const [isEditing, setIsEditing] = useState(false);
    const [groupTitle, setGroupTitle] = useState("");

    const handleSaveClick = () => {
        if (groupTitle.trim()) {
            onSave(groupTitle.trim());
        }
        setGroupTitle("");
        setIsEditing(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSaveClick();
        } else if (e.key === "Escape") {
            setIsEditing(false);
            setGroupTitle("");
        }
    };

    if (isEditing) {
        return (
            <div className="group group-column new-group-creator">
                <input
                    type="text"
                    className="group-title-input"
                    placeholder="Digite o nome do grupo..."
                    value={groupTitle}
                    onChange={(e) => setGroupTitle(e.target.value)}
                    onBlur={handleSaveClick}
                    onKeyDown={handleKeyDown}
                    autoFocus
                />
            </div>
        );
    }

    return (
        <div 
            className="group-column new-grouop-button"
            onClick={() => setIsEditing(true)}
        >
            <span>+ Adicionar novo grupo</span>
        </div>
    );
}

export default NewGroupCreator;
