import React, { useState } from "react";
import { initialData } from "../data/mockData.js";
import GroupColumn from "./GroupColumn.jsx";
import ActivityModal from "./ActivityModal.jsx";

console.log(initialData); // Verifica se os dados estão sendo importados corretamente

function Board() {
  const [boardData, setBoardData] = useState(initialData);

  // Função para criar o estado do modal de atividade
  const [modalState, setModalState] = useState({
    isOpen: false,
    groupToAddTo: null,
  });

  // Função para abrir o modal de atividade
  const handleOpenModal = (groupId) => {
    setModalState({ isOpen: true, groupToAddTo: groupId });
  };

  // Função para fechar o modal de atividade
  const handleCloseModal = () => {
    setModalState({ isOpen: false, groupToAddTo: null });
  };

  // Função para adicionar uma nova atividade ao grupo
  const handleAddActivity = (activityData) => {
    const newActivityId = `activity-${Date.now()}`;
    const groupId = modalState.groupToAddTo;

    // Cria a nova atividade
    const newActivity = {
      id: newActivityId,
      description: activityData.description,
      dueDate: activityData.dueDate || null,
      isCompleted: false,
    };

    // Atualiza o estado do board com a nova atividade
    setBoardData((prevData) => {
      // Adiciona a nova atividade ao objeto de atividades
      const newActivities = {
        ...prevData.activities,
        [newActivityId]: newActivity,
      };

      // Adiciona o ID da nova atividade ao grupo correspondente
      const group = prevData.groups[groupId];
      const newActivityIds = [...group.activityIds, newActivityId];
      const newGroup = {
        ...group,
        activityIds: newActivityIds,
      };

      const newGroups = {
        ...prevData.groups,
        [groupId]: newGroup,
      };

      // Retorna o novo estado do board
      return {
        ...prevData,
        activities: newActivities,
        groups: newGroups,
      };
    });

    handleCloseModal();
  };

  return (
    <div className="board-container">
      {boardData.groupOrder.map((groupId) => {
        const group = boardData.groups[groupId];
        const activities = group.activityIds.map(
          (activityId) => boardData.activities[activityId]
        );
        return (
          <GroupColumn 
            key={group.id} 
            group={group} 
            activities={activities}
            onNewCardClick={() => handleOpenModal(group.id)}
          />
        );
      })}

      {/* Renderiza o modal de atividade se estiver aberto */}
      {modalState.isOpen && (
        <ActivityModal
          onClose={handleCloseModal}
          onSave={handleAddActivity}
        />
      )}
    </div>
  );
}

export default Board;
