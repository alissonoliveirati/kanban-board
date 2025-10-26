import React, { useState } from "react";

// Receber as props onClose e onSave
function ActivityModal({ onClose, onSave }) {
    // Estado local para o campo de descrição
    const [description, setDescription] = useState("");
    // Adicionar data de entrega
    const [dueDate, setDueDate] = useState("");

    const handleSaveClick = () => {
        if (!description) {
            alert("Insira uma descrição.");
            return;
        }
        
        onSave({ description, dueDate });
    }
    return (
        // O fundo escuro (overlay) que fecha o modal ao clicar
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Adicionar Nova Atividade</h2>
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
                <div className="modal-actions">
                    <button onClick={onClose} className="btn-cancel">Cancelar</button>
                    <button onClick={handleSaveClick} className="btn-save">Salvar</button>
                </div>
            </div>
        </div>
    );
}

export default ActivityModal;