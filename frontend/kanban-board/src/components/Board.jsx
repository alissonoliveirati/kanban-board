import React, { useState } from "react";
import { initialData } from "../data/mockData.js";
import GroupColumn from "./GroupColumn";

console.log(initialData); // Verifica se os dados estão sendo importados corretamente

function Board() {
  const [boardData, setBoardData] = useState(initialData);

  return (
    <div className="board-container">
      {boardData.groupOrder.map((groupId) => {
        const group = boardData.groups[groupId];
        const activities = group.activityIds.map(
          (activityId) => boardData.activities[activityId]
        );
        return (
          <GroupColumn key={groupId} group={group} activities={activities} />
        );
      })}
    </div>
  );
}

export default Board;
