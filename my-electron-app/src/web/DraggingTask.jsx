import React, { memo } from "react";
import TaskCard from "./Card/TaskCard";

const DraggingTask = ({ task, isEvenOrder }) => {
  const isCenter = false;
  const isIndeterminate =
    !task.checked && task.childTasks.some((child) => child.checked);

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          paddingLeft: "35px",
          paddingBottom: "35px",
          paddingRight: "70px",
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
      {!task.isClose && task.childTasks.length !== 0 ? (
        <div style={{ marginLeft: "90px" }}>
          {task.childTasks.map((child) => (
            <DraggingTask
              key={child.taskId}
              task={child}
              isEvenOrder={isEvenOrder}
            />
          ))}
        </div>
      ) : null}
    </>
  );
};
export default memo(DraggingTask);
