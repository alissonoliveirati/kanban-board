import React, { useEffect, useState } from "react";

// Receber as props onClose e onSave
// Adicionar initialData para editar atividades
function ActivityModal({ onClose, onSave, initialData = null }) {
    // Estado local para o campo de descrição
    const [description, setDescription] = useState("");
    // Adicionar data de entrega
    const [dueDate, setDueDate] = useState("");

    const [isCompleted, setIsCompleted] = useState(false);

    const isEditing = initialData !== null;

    useEffect(() => {
        if (isEditing) {
            setDescription(initialData.description);
            setDueDate(initialData.dueDate ? initialData.dueDate.split("T")[0] : "");
            setIsCompleted(initialData.isCompleted);
        }
    }, [initialData, isEditing]);

    const handleSaveClick = () => {
        if (!description) {
            alert("Insira uma descrição.");
            return;
        }
        
        const activityDataToSave = {
            description,
            dueDate: dueDate || null,
            isCompleted,
            id: isEditing ? initialData.id : undefined,
        };

        onSave(activityDataToSave);
    }
    return (
        // O fundo escuro (overlay) que fecha o modal ao clicar
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>{isEditing ? "Editar Atividade" : "Adicionar Nova Atividade"}</h2>
                <label htmlFor="description">Descrição:</label>
                <textarea 
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Digite a descrição da atividade..."
                />
                <label htmlFor="dueDate">Data de Entrega:</label>
                <input 
                    id="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                />

                <div className="modal-completion-checkbox">
                    <input 
                        id="isCompleted"
                        type="checkbox"
                        checked={isCompleted}
                        onChange={(e) => setIsCompleted(e.target.checked)}
                    />
                    <label htmlFor="isCompleted">Concluído</label>
                </div>
                
                <div className="modal-actions">
                    <button onClick={onClose} className="btn-cancel">Cancelar</button>
                    <button onClick={handleSaveClick} className="btn-save">Salvar</button>
                </div>
            </div>
        </div>
    );
}

export default ActivityModal;