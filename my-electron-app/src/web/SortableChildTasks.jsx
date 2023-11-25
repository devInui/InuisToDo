import React, { memo } from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
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
    <div style={{ marginLeft: "90px" }}>
      <SortableContext
        items={taskList.map((task) => task.taskId)}
        strategy={verticalListSortingStrategy}
      >
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
      </SortableContext>
    </div>
  );
}

export default memo(SortableChildTasks);
