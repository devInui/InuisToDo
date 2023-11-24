import React, { memo } from "react";
import CardUIFront from "./Card/CardUIFront";
import TaskCard from "./Card/TaskCard";
import CardUIBack from "./Card/CardUIBack";
import CardUIBottom from "./Card/CardUIBottom";

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
        }}
      >
        <CardUIFront isCenter={Boolean(isCenter)} />
        <TaskCard
          taskName={task.taskName}
          taskChecked={Boolean(task.checked)}
          isIndeterminate={Boolean(isIndeterminate)}
          childTasksLength={task.childTasks.length}
          isSelected={task.isSelected}
          isEvenOrder={isEvenOrder}
        />
        <CardUIBack />
      </div>
      <CardUIBottom
        haveChild={task.childTasks.length !== 0}
        isClose={task.isClose}
      />
      {!task.isClose &&
        task.childTasks.map((task) => (
          <DraggingTask
            key={task.taskId}
            task={task}
            isEvenOrder={isEvenOrder}
          />
        ))}
    </div>
  );
};
export default memo(DraggingTask);
