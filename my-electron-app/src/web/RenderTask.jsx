import React, { memo, useCallback } from "react";
import TaskCard from "./Card/TaskCard";
import CardUIFront from "./Card/CardUIFront";
import CardUIBack from "./Card/CardUIBack";
import CardUIBottom from "./Card/CardUIBottom";
import SortableChildTasks from "./SortableChildTasks";

const RenderTask = ({
  task: topTask,
  parentId,
  centerPinTaskId,
  addChildTaskFront,
  addChildTaskEnd,
  insertBrotherTask,
  deleteProject,
  deleteTask,
  pinFlag,
  toggleChecked,
  updateTaskName,
  toggleClose,
  switchSelect,
  moveTaskInList,
  revertLastChange,
  isEvenOrder,
  setDebugOverInfo,
  setDebugMoveInfo,
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
  //  because the dependencies are evaluated at the time of defining the useCallback.
  const isCenter = foundPinFlag(topTask);
  const isIndeterminate =
    !topTask.checked && topTask.childTasks.some((child) => child.checked);
  /*-------------------------*/

  // Functions, is deferent from Task, are
  // handleDeleteTask and handleKeyDown.
  // No exiting function is handleInsertBrotherTask
  /*----------RenderTask Handler---------------*/
  const handleDeleteTask = useCallback(
    (shouldSkipLog = false) => {
      if (parentId) {
        deleteTask(topTask.taskId, isCenter, parentId, shouldSkipLog);
      } else {
        deleteProject(topTask.taskId, shouldSkipLog);
      }
    },
    [topTask.taskId, Boolean(isCenter), parentId],
  );

  const handleAddTaskFront = useCallback(() => {
    addChildTaskFront(topTask.taskId, "");
  }, [topTask.taskId]);

  const handleAddTaskEnd = useCallback(() => {
    addChildTaskEnd(topTask.taskId, "");
  }, [topTask.taskId]);

  const handleProjectNameChange = useCallback(
    (event, shouldSkipLog) => {
      updateTaskName(topTask.taskId, event.target.value, shouldSkipLog);
    },
    [topTask.taskId],
  );

  const handleToggle = useCallback(() => {
    toggleChecked(topTask.taskId, !topTask.checked && isCenter, parentId);
  }, [Boolean(isCenter), topTask.checked, parentId]);

  const handleToggleList = useCallback(() => {
    toggleClose(topTask.taskId);
  }, [topTask.taskId]);

  const handleSelect = useCallback(() => {
    switchSelect(topTask.taskId);
  }, [topTask.taskId]);

  const handleFlag = useCallback(() => {
    const newPinnedId = isCenter ? parentId : topTask.taskId;
    pinFlag(newPinnedId);
  }, [topTask.taskId, Boolean(isCenter), parentId]);
  /*-------------------------*/
  // The dependency array should be updated before defining the useCallback,
  //  because the dependencies are evaluated at the time of defining the useCallback.
  /*---------Custom Handler----------------*/
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Tab" || event.key === "Enter") {
        event.preventDefault();
        if (topTask.taskName) {
          addChildTaskFront(topTask.taskId, "");
        }
      }
      if (event.key === "Delete") {
        if (!topTask.taskName && topTask.childTasks.length === 0) {
          event.preventDefault();
          handleDeleteTask(true);
        }
      }
    },
    [
      topTask.taskId,
      topTask.taskName,
      topTask.childTasks.length,
      handleAddTaskFront,
      handleDeleteTask,
    ],
  );

  const handleBlur = useCallback(
    (isEmpty) => {
      if (!topTask.taskName && topTask.childTasks.length === 0) {
        handleDeleteTask(true);
        if (isEmpty) revertLastChange();
      }
    },
    [topTask.taskName, topTask.childTasks.length, handleDeleteTask],
  );
  /*-------------------------*/

  return (
    <div style={{ margin: "20px" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <CardUIFront isCenter={Boolean(isCenter)} handleFlag={handleFlag} />
          <TaskCard
            taskName={topTask.taskName}
            taskChecked={topTask.checked}
            isIndeterminate={Boolean(isIndeterminate)}
            childTasksLength={topTask.childTasks.length}
            isSelected={topTask.isSelected}
            isEvenOrder={isEvenOrder}
            handleToggle={handleToggle}
            handleSelect={handleSelect}
            handleBlur={handleBlur}
            handleKeyDown={handleKeyDown}
            handleTaskNameChange={handleProjectNameChange}
            revertLastChange={revertLastChange}
          />
          <CardUIBack
            handleAddChildFront={handleAddTaskFront}
            handleDelete={handleDeleteTask}
          />
        </div>
      </div>
      {topTask.childTasks.length !== 0 && (
        <CardUIBottom
          haveChild={topTask.childTasks.length !== 0}
          isClose={topTask.isClose}
          handleToggleList={handleToggleList}
          handleAdd={handleAddTaskEnd}
        />
      )}

      {!topTask.isClose && (
        <SortableChildTasks
          taskList={topTask.childTasks}
          parentId={topTask.taskId}
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
          setDebugOverInfo={setDebugOverInfo}
          setDebugMoveInfo={setDebugMoveInfo}
        />
      )}
    </div>
  );
};

export default memo(RenderTask);
