import React, { useState, memo } from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Task from "./Task";

import {
  DndContext,
  DragOverlay,
  closestCenter,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";
import { arrayMove } from "@dnd-kit/sortable";
import DraggingTask from "./DraggingTask";

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
  moveTaskInList,
  revertLastChange,
  isEvenOrder,
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 0,
      },
    }),
  );
  const [activeId, setActiveId] = useState(null);
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };
  // const handleDragEnd = (event) => {
  //   const { active, over } = event;
  //   setActiveId(null);
  //   setDebugInfo(null); // for debug code

  //   if (over && active.id !== over.id) {
  //     // helper function
  //     const processor = (taskList) => {
  //       const exitActiveTask = taskList.some(
  //         (task) => task.taskId === active.id,
  //       );
  //       if (exitActiveTask) {
  //         const oldIndex = taskList.findIndex(
  //           (task) => task.taskId === active.id,
  //         );
  //         const newIndex = taskList.findIndex(
  //           (task) => task.taskId === over.id,
  //         );
  //         return arrayMove(taskList, oldIndex, newIndex);
  //       } else {
  //         const newTaskList = taskList.map((task) => {
  //           const newChildTasks = processor(task.childTasks);
  //           if (newChildTasks) {
  //             return { ...task, childTasks: newChildTasks };
  //           } else {
  //             return false;
  //           }
  //         });
  //         return processedTaskList(taskList, newTaskList);
  //       }
  //     };
  //     const processedTaskList = (oldTaskList, newTaskList) => {
  //       if (newTaskList.some((task) => task)) {
  //         return newTaskList.map((task, index) => task || oldTaskList[index]);
  //       } else {
  //         return false;
  //       }
  //     };
  //     // use setProjects
  //     setProjects(
  //       (previousProjects) => processor(previousProjects) || previousProjects,
  //     );
  //   }
  // };
  const detectDragTask = (activeId) => {
    return taskList.find((task) => task.taskId === activeId);
  };
  const draggingTask = detectDragTask(activeId);

  return (
    <div style={{ marginLeft: "90px" }}>
      <DndContext
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
      >
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
              updateTaskName={updateTaskName}
              toggleClose={toggleClose}
              switchSelect={switchSelect}
              moveTaskInList={moveTaskInList}
              revertLastChange={revertLastChange}
              isEvenOrder={isEvenOrder}
            />
          ))}
        </SortableContext>
        <DragOverlay>
          {activeId ? (
            <div style={{ width: "100%" }}>
              <div
                style={{
                  width: "min-content",
                  height: "min-content",
                  backgroundColor: "rgba(256, 256, 256, 0.1)",
                  outline: "solid 3px #4484eb",
                  borderRadius: "3px",
                }}
              >
                <div style={{ opacity: 0.8 }}>
                  <DraggingTask task={draggingTask} isEvenOrder={isEvenOrder} />
                </div>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

export default memo(SortableChildTasks);
