import React, { memo } from "react";
import Task from "./Task";

function SortableChildTasks({
  taskList,
  parentId,
  centerPinTaskId,
  addChildTaskFront,
  addChildTaskEnd,
  insertBrotherTask,
  deleteTask,
  pinFlag,
  toggleChecked,
  toggleClose,
  switchSelect,
  updateTaskName,
  revertLastChange,
  isEvenOrder,
}) {
  return (
    <>
      {taskList.map((task) => (
        <Task
          key={task.taskId}
          task={task}
          parentId={parentId}
          centerPinTaskId={centerPinTaskId}
          addChildTaskFront={addChildTaskFront}
          addChildTaskEnd={addChildTaskEnd}
          insertBrotherTask={insertBrotherTask}
          deleteTask={deleteTask}
          pinFlag={pinFlag}
          toggleChecked={toggleChecked}
          toggleClose={toggleClose}
          switchSelect={switchSelect}
          updateTaskName={updateTaskName}
          revertLastChange={revertLastChange}
          isEvenOrder={isEvenOrder}
        />
      ))}
    </>
  );
}

export default memo(SortableChildTasks);
