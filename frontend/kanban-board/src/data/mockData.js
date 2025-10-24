export const initialData = {
  groups: {
    "group-1": {
      id: "group-1",
      title: "A Fazer",
      activityIds: ["activity-1", "activity-2"],
    },
    "group-2": {
      id: "group-2",
      title: "Em Andamento",
      activityIds: ["activity-3"],
    },
    "group-3": {
      id: "group-3",
      title: "Concluído",
      activityIds: [],
    },
  },
  activities: {
    "activity-1": {
      id: "activity-1",
      description: "Implementar a renderização inicial do board",
      dueDate: "2025-10-24T10:00:00Z",
      isCompleted: false,
    },
    "activity-2": {
      id: "activity-2",
      description: "Criar o componente ActivityCard com estilos básicos.",
      dueDate: "2025-10-22T10:00:00Z", // Data passada, deve ficar vermelho
      isCompleted: false,
    },
    "activity-3": {
      id: "activity-3",
      description: "Configurar o CSS global no App.css e testar.",
      dueDate: null,
      isCompleted: true, // Deve ficar verde
    },
  },
  // Esta linha é a que estava faltando!
  groupOrder: ["group-1", "group-2", "group-3"],
};
