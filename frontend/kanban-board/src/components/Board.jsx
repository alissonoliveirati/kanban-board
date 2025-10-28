import React, { useState, useEffect } from "react";
// import { initialData } from "../data/mockData.js";
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

// console.log(initialData); // Verifica se os dados estão sendo importados corretamente
const API_URL = "https://rmglcg24e6.execute-api.us-east-1.amazonaws.com/Prod/";

function Board({ searchTerm = "", onUpdateOverdueCount }) {
  const [boardData, setBoardData] = useState(null);

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

  // Busca os dados iniciais do board da API ao montar o componente
  useEffect(() => {
    const fetchBoardData = () => {
      console.log("Buscando dados da API...");
      fetch(`${API_URL}/board`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Erro ao buscar dados do board");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Dados do board recebidos:", data);
          setBoardData(data);
        })
        .catch((error) => {
          console.error("Erro ao buscar dados do board:", error);
        });
    };

    fetchBoardData();
  }, []);

  // Função adicionar novo grupo
  const handleAddNewGroup = (groupTitle) => {
    const newGroupData = {
      title: groupTitle,
    };

    fetch(`${API_URL}groups`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newGroupData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao adicionar novo grupo");
        }
        return response.json();
      })
      .then((savedGroup) => {
        console.log("Novo grupo adicionado:", savedGroup);
        setBoardData((prevData) => {
          const newGroups = {
            ...prevData.groups,
            [savedGroup.groupId]: { ...savedGroup, activityIds: [] },
          };

          const newGroupOrder = [...prevData.groupOrder, savedGroup.groupId];

          return {
            ...prevData,
            groups: newGroups,
            groupOrder: newGroupOrder,
          };
        });
      })
      .catch((error) => {
        console.error("Erro ao adicionar novo grupo:", error);
      });
  };

  // Função para lidar com o fim do arrastar e soltar

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
    if (!boardData) {
      onUpdateOverdueCount(0);
      return;
    }
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

  if (!boardData) {
    return (
      <div className="loading-container" style={{ padding: "2rem" }}>
        <h1>Carregando seu quadro...</h1>
        <p>
          Se demorar muito, verifique o console do navegador e o terminal do SAM
        </p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}
    >
      <div className="board-container">
        {boardData.groupOrder.map((groupId) => {
          const group = boardData.groups[groupId];

          if (!group) {
            console.error(`ERRO: Grupo inválido para o ID: ${groupId}`);
            return null;
          }

          const allGroupActivities = group.activityIds.map(
            (activityId) => boardData.activities[activityId]
          ).filter(Boolean); 
          
          // Filtra as atividades com base no termo de busca
          const filteredActivities = allGroupActivities.filter(
            (activity) =>
              activity &&
              activity.description
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
          );

          return (
            <GroupColumn
              key={groupId}
              group={group}
              activities={filteredActivities}
              onEditActivity={handleOpenEditModal}
              onNewCardClick={() => handleOpenCreateModal(groupId)}
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
