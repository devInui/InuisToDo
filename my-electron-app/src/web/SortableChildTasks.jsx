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
  rectangleIntersection,
  verticalSortableListCollisionDetection,
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
  moveTaskInToChild,
  moveTaskToParent,
  revertLastChange,
  isEvenOrder,
  setDebugOverInfo,
  setDebugMoveInfo,
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
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    setDebugOverInfo(null); // for debug code
    setDebugMoveInfo(null); // for debug code
    if (event.delta.x > 90) {
      moveTaskInToChild(active.id, over.id);
    } else if (event.delta.x < -90) {
      moveTaskToParent(active.id, parentId);
    } else if (over && active.id !== over.id) {
      moveTaskInList(active.id, over.id);
    }
  };
  const detectDragTask = (activeId) => {
    return taskList.find((task) => task.taskId === activeId);
  };
  const draggingTask = detectDragTask(activeId);

  // for debug
  const handleDragOver = (event) => {
    setDebugOverInfo(event);
  };
  const handleDragMove = (event) => {
    setDebugMoveInfo(event);
    // if (event.delta.x < -100) console.log("fire MoveToParentEvent");
    // if (event.delta.x > 100)
    //   console.log("fire MoveToChildEvent", event.active.id, event.over.id);
  };
  return (
    <div style={{ marginLeft: "90px" }}>
      <DndContext
        // modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        // modifiers={[restrictToVerticalAxis]}
        sensors={sensors}
        // collisionDetection={closestCenter}
        // collisionDetection={rectangleIntersection}
        // collisionDetection={closestCorners}
        collisionDetection={verticalSortableListCollisionDetection}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
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
              moveTaskInToChild={moveTaskInToChild}
              moveTaskToParent={moveTaskToParent}
              revertLastChange={revertLastChange}
              isEvenOrder={isEvenOrder}
              setDebugOverInfo={setDebugOverInfo}
              setDebugMoveInfo={setDebugMoveInfo}
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
