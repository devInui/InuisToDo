import React, { memo, useCallback } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TaskCard from "./Card/TaskCard";
import CardUIFront from "./Card/CardUIFront";
import CardUIBack from "./Card/CardUIBack";
import CardUIBottom from "./Card/CardUIBottom";
import SortableChildTasks from "./SortableChildTasks";
const Task = memo(
  ({
    task,
    parentId,
    centerPinTaskId,
    addChildTaskFront,
    addChildTaskEnd,
    insertBrotherTask,
    deleteTask,
    pinFlag,
    toggleChecked,
    updateTaskName,
    toggleClose,
    switchSelect,
    moveTaskInList,
    revertLastChange,
    isEvenOrder,
    // not task property list
    //parentId, centerPinTaskId, isEvenOrder
  }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: task.taskId });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };
    /*-----------Helper Function--------------*/
    const foundPinFlag = (task) => {
      if (task.taskId === centerPinTaskId) {
        return true;
      } else if (task.childTasks) {
        return task.childTasks.some(foundPinFlag);
      }
      return false;
    };
    // The dependency array should be updated before defining the useCallback,
    // because the dependencies are evaluated at the time of defining the useCallback.
    const isCenter = foundPinFlag(task);
    const isIndeterminate =
      !task.checked && task.childTasks.some((child) => child.checked);
    /*-------------------------*/
    // Task Handlers are defined within RenderTask.
    // Differences are referred to in the comments within RenderTask.
    /*---------Task Handler----------------*/
    const handleDelete = useCallback(
      (shouldSkipLog = false) => {
        deleteTask(task.taskId, isCenter, parentId, shouldSkipLog);
      },
      [Boolean(isCenter), parentId],
    );

    const handleInsertBrotherTask = useCallback(() => {
      insertBrotherTask(parentId, task.taskId, "");
    }, [parentId]);

    const handleAddChildFront = useCallback(() => {
      addChildTaskFront(task.taskId, "");
    }, []);

    const handleAddChildEnd = useCallback(() => {
      addChildTaskEnd(task.taskId, "");
    }, []);

    const handleTaskNameChange = useCallback((event, shouldSkipLog) => {
      updateTaskName(task.taskId, event.target.value, shouldSkipLog);
    }, []);

    const handleToggle = useCallback(() => {
      toggleChecked(task.taskId, !task.checked && isCenter, parentId);
    }, [Boolean(isCenter), task.checked, parentId]);

    const handleToggleList = useCallback(() => {
      toggleClose(task.taskId);
    }, []);

    const handleSelect = useCallback(() => {
      switchSelect(task.taskId);
    }, []);

    const handleFlag = useCallback(() => {
      const newPinnedId = isCenter ? parentId : task.taskId;
      pinFlag(newPinnedId);
    }, [Boolean(isCenter), parentId]);
    /*-------------------------*/
    // The dependency array should be updated before defining the useCallback,
    // because the dependencies are evaluated at the time of defining the useCallback.
    /*---------Custom Handler----------------*/
    const handleKeyDown = useCallback(
      (event) => {
        if (event.key === "Tab") {
          event.preventDefault();
          if (task.taskName) {
            handleAddChildFront();
          }
        } else if (event.key === "Enter") {
          event.preventDefault();
          if (task.taskName) {
            handleInsertBrotherTask();
          }
        } else if (event.key === "Delete") {
          if (!task.taskName && task.childTasks.length === 0) {
            event.preventDefault();
            handleDelete(true);
          }
        }
      },
      [
        task.taskName,
        task.childTasks.length,
        handleAddChildFront,
        handleInsertBrotherTask,
        handleDelete,
      ],
    );

    const handleBlur = useCallback(
      (isEmpty) => {
        if (!task.taskName && task.childTasks.length === 0) {
          handleDelete(true);
          if (isEmpty) revertLastChange();
        }
      },
      [task.taskName, task.childTasks.length, handleDelete],
    );
    /*-------------------------*/

    return (
      <div
        ref={setNodeRef}
        style={{
          ...style,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <CardUIFront isCenter={Boolean(isCenter)} handleFlag={handleFlag} />
          <TaskCard
            attributes={attributes}
            listeners={listeners}
            taskName={task.taskName}
            taskChecked={Boolean(task.checked)}
            isIndeterminate={Boolean(isIndeterminate)}
            childTasksLength={task.childTasks.length}
            isSelected={task.isSelected}
            isEvenOrder={isEvenOrder}
            handleToggle={handleToggle}
            handleSelect={handleSelect}
            handleBlur={handleBlur}
            handleKeyDown={handleKeyDown}
            handleTaskNameChange={handleTaskNameChange}
            revertLastChange={revertLastChange}
          />
          <CardUIBack
            handleAddChildFront={handleAddChildFront}
            handleDelete={handleDelete}
          />
        </div>
        <CardUIBottom
          haveChild={task.childTasks.length !== 0}
          isClose={task.isClose}
          handleToggleList={handleToggleList}
          handleAdd={handleInsertBrotherTask}
        />
        {!task.isClose && (
          <SortableChildTasks
            taskList={task.childTasks}
            parentId={task.taskId}
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
        )}
      </div>
    );
  },
);

export default memo(Task);
