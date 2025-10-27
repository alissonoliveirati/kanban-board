import React, { useState, useEffect } from "react";
import { initialData } from "../data/mockData.js";
import GroupColumn from "./GroupColumn.jsx";
import ActivityModal from "./ActivityModal.jsx";
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  KeyboardSensor,
} from "@dnd-kit/core";
import NewGroupCreator from "./NewGroupCreator.jsx";
import SearchBar from "./SearchBar.jsx";

console.log(initialData); // Verifica se os dados estão sendo importados corretamente

function Board({ searchTerm = "", onUpdateOverdueCount }) {
  const [boardData, setBoardData] = useState(initialData);

  // Função para criar o estado do modal de atividade
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: "create",
    activityData: null,
    groupToAddTo: null,
  });

  // Função para atualizar o título do grupo
  const handleUpdateGroupTitle = (groupId, newTitle) => {
    if (!newTitle) return;

    setBoardData((prevData) => {
      const group = prevData.groups[groupId];
      const updatedGroup = {
        ...group,
        title: newTitle,
      };

      return {
        ...prevData,
        groups: {
          ...prevData.groups,
          [groupId]: updatedGroup,
        },
      };
    });
  };

  // Função para configurar o sensor de arrastar e soltar
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 100,
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  // Função adicionar novo grupo
  const handleAddNewGroup = (groupTitle) => {
    const newGroupId = `group-${Date.now()}`;

    setBoardData((prevData) => {
      const newGroup = {
        id: newGroupId,
        title: groupTitle,
        activityIds: [],
      };

      const newGroups = {
        ...prevData.groups,
        [newGroupId]: newGroup,
      };

      const newGroupOrder = [...prevData.groupOrder, newGroupId];

      return {
        ...prevData,
        groups: newGroups,
        groupOrder: newGroupOrder,
      };
    });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
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
      groupToAddTo: groupId,
    });
  };

  // Função para editar uma atividade existente
  const handleOpenEditModal = (activity) => {
    setModalState({
      isOpen: true,
      mode: "edit",
      activityData: activity,
      groupToAddTo: null,
    });
  };

  // Função para fechar o modal de atividade
  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      mode: "create",
      activityData: null,
      groupToAddTo: null,
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
      setBoardData((prevData) => {
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

  // Atualiza a contagem de atividades atrasadas sempre que os dados do board mudam
  useEffect(() => {
    // Conta as atividades atrasadas
    const allActivities = Object.values(boardData.activities);

    //Calcula contagem de atividades atrasadas
    let count = 0;
    allActivities.forEach((activity) => {
      if (activity && !activity.isCompleted && activity.dueDate) {
        if (new Date(activity.dueDate) < new Date()) {
          count++;
        }
      }
    });

    // Chama a função de callback para atualizar a contagem no componente pai
    onUpdateOverdueCount(count);
  }, [boardData, onUpdateOverdueCount]);

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}
    >
      <div className="board-container">
        {boardData.groupOrder.map((groupId) => {
          const group = boardData.groups[groupId];
          const allGroupActivities = group.activityIds.map(
            (activityId) => boardData.activities[activityId]
          );
          // Filtra as atividades com base no termo de busca
          const filteredActivities = allGroupActivities.filter((activity) =>
            activity &&
            activity.description.toLowerCase().includes(searchTerm.toLowerCase())
          );

          return (
            <GroupColumn
              key={group.id}
              group={group}
              activities={filteredActivities}
              onEditActivity={handleOpenEditModal}
              onNewCardClick={() => handleOpenCreateModal(group.id)}
              onUpdateGroupTitle={handleUpdateGroupTitle}
            />
          );
        })}

        <NewGroupCreator onSave={handleAddNewGroup} />
        
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
