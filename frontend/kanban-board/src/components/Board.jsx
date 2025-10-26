import React, { useState } from "react";
import { initialData } from "../data/mockData.js";
import GroupColumn from "./GroupColumn.jsx";
import ActivityModal from "./ActivityModal.jsx";
import {closestCenter, DndContext, PointerSensor, useSensor, useSensors} from "@dnd-kit/core";

console.log(initialData); // Verifica se os dados estão sendo importados corretamente

function Board() {
  const [boardData, setBoardData] = useState(initialData);

  // Função para criar o estado do modal de atividade
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: "create",
    activityData: null,
    groupToAddTo: null,
  });

  // Função para configurar o sensor de arrastar e soltar
  const sensors = useSensors(
    useSensor(PointerSensor)
  );

  const handleDragEnd = (event) => {
    const {active, over} = event;
    if (!over) {
      return;
    }

  const activityId = active.id;
  const targetGroupId = over.id;

  // Encontra o grupo atual da atividade
  let sourceGroupId = null;

  Object.values(boardData.groups).forEach((group) => {
    if (group.activityIds.includes(activityId)) {
      sourceGroupId = group.id;
    }
  });

  if (sourceGroupId === targetGroupId) {
    return; // Não faz nada se a atividade for solta no mesmo grupo
  }

  // Atualiza o estado do board para mover a atividade entre grupos
  setBoardData((prevData) => {
    // Remove a atividade do grupo de origem
    const sourceGroup = prevData.groups[sourceGroupId];
    const newSourceActivityIds = sourceGroup.activityIds.filter(
      (id) => id !== activityId
    );
    const updatedSourceGroup = {
      ...sourceGroup,
      activityIds: newSourceActivityIds,
    };

    // Adiciona a atividade ao grupo de destino
    const targetGroup = prevData.groups[targetGroupId];
    const newTargetActivityIds = [...targetGroup.activityIds, activityId];
    const updatedTargetGroup = {
      ...targetGroup,
      activityIds: newTargetActivityIds,
    };

    // Retorna o novo estado do board com os grupos atualizados
    return {
      ...prevData,
      groups: {
        ...prevData.groups,
        [sourceGroupId]: updatedSourceGroup,
        [targetGroupId]: updatedTargetGroup,
      },
    };
  });
};

  // Função para abrir o modal de atividade
  const handleOpenCreateModal = (groupId) => {
    setModalState({ 
      isOpen: true,
      mode: "create",
      activityData: null,
      groupToAddTo: groupId 
    });
  };

  // Função para editar uma atividade existente
  const handleOpenEditModal = (activity) => {
    setModalState({ 
      isOpen: true,
      mode: "edit",
      activityData: activity,
      groupToAddTo: null
    });
  };

  // Função para fechar o modal de atividade
  const handleCloseModal = () => {
    setModalState({ 
      isOpen: false, 
      mode: "create", 
      activityData: null,
      groupToAddTo: null 
    });
  };

  // Função para adicionar uma nova atividade ao grupo
  const handleSaveOrUpdateActivity = (activityData) => {
    
    if (modalState.mode === "create") {
      const newActivityId = `activity-${Date.now()}`;
      const groupId = modalState.groupToAddTo;

      // Cria a nova atividade
      const newActivity = {
        ...activityData,
        id: newActivityId,
        isCompleted: activityData.isCompleted || false,
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
    } else if (modalState.mode === "edit") {
      setBoardData(prevData => {
        const activityId = activityData.id;
        const newActivities = {
          ...prevData.activities,
          [activityId]: activityData,
        };
        return {
          ...prevData,
          activities: newActivities,
        };
      });
    }
    handleCloseModal();
  };

  return (
    <DndContext 
      sensors={sensors}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}
    >
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
              onEditActivity={handleOpenEditModal}
              onNewCardClick={() => handleOpenCreateModal(group.id)}
            />
          );
        })}
      </div>

        {/* Renderiza o modal de atividade se estiver aberto */}
        {modalState.isOpen && (
          <ActivityModal
            onClose={handleCloseModal}
            onSave={handleSaveOrUpdateActivity}
            initialData={modalState.activityData}
          />
        )}
      </DndContext>
      
  );
}

export default Board;
