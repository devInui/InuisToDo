import React, { memo } from "react";
import TaskCard from "./Card/TaskCard";

const DraggingTask = ({ task, isEvenOrder }) => {
  const isCenter = false;
  const isIndeterminate =
    !task.checked && task.childTasks.some((child) => child.checked);

  return (
    <div
      style={{
        marginLeft: "90px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          paddingLeft: "35px",
        }}
      >
        <TaskCard
          taskName={task.taskName}
          taskChecked={Boolean(task.checked)}
          isIndeterminate={Boolean(isIndeterminate)}
          childTasksLength={task.childTasks.length}
          isSelected={task.isSelected}
          isEvenOrder={isEvenOrder}
        />
      </div>
    </div>
  );
};
export default memo(DraggingTask);
