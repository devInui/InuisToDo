import React, { memo, useCallback } from "react";
import TaskCard from "./Card/TaskCard";
import CardUIFront from "./Card/CardUIFront";
import CardUIBack from "./Card/CardUIBack";
import CardUIBottom from "./Card/CardUIBottom";
const TaskUnwrap = ({
  task,
  toggleChecked,
  toggleClose,
  switchSelect,
  addChildTaskFront,
  addChildTaskEnd,
  insertBrotherTask,
  deleteTask,
  updateTaskName,
  pinFlag,
  parentId,
  centerPinTaskId,
  revertLastChange,
  isEvenOrder,
  // not task property list
  //parentId, centerPinTaskId, isEvenOrder
}) => {
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
        <CardUIFront isCenter={Boolean(isCenter)} handleFlag={handleFlag} />
        <TaskCard
          taskName={task.taskName}
          taskChecked={Boolean(task.checked)}
          isIndeterminate={Boolean(isIndeterminate)}
          childTasksLength={task.childTasks.length}
          isSelected={task.isSelected}
          isFocus={task.isFocus}
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
      {!task.isClose &&
        task.childTasks.map((child) => (
          <Task
            key={child.taskId}
            task={child}
            parentId={task.taskId}
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
    </div>
  );
};

const Task = memo(TaskUnwrap);
export default Task;