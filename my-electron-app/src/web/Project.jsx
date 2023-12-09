import React, { memo } from "react";
import useProjectOperations from "./CustomHook/useProjectOperations";
import RenderTask from "./RenderTask";

const Project = ({
  project,
  deleteProject,
  setProject,
  revertLastChange,
  isEvenOrder,
  setDebugInfo,
}) => {
  const {
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
  } = useProjectOperations(project.taskId, setProject);

  /*----------TaskViewTest---------------*/
  const getTaskInfo = (
    targetId,
    // property for recursive call
    depth = 0,
    parentId = null,
    task = project,
  ) => {
    if (task.taskId === targetId) {
      return {
        task,
        depth,
        parentId,
      };
    }

    for (const childTask of task.childTasks || []) {
      const result = getTaskInfo(targetId, depth + 1, task.taskId, childTask);
      if (result) return result;
    }

    return null;
  };

  // const findAncestorTask = (targetId, levelsToGoUp) => {
  //   const taskInfo = getTaskInfo(targetId);

  //   if (taskInfo && taskInfo.parentId && taskInfo.depth > levelsToGoUp) {
  //     return findAncestorTask(taskInfo.parentId, levelsToGoUp - 1);
  //   }

  //   return taskInfo ? taskInfo.task : null;
  // };

  // const renderTask = findAncestorTask(
  //   project.centerPinTaskId,
  //   project.viewLevel,
  // );

  const taskInfo = getTaskInfo(project.centerPinTaskId);

  return (
    <div
      style={{
        padding: "10px",
        backgroundColor: isEvenOrder ? "#56604e" : "#60584e",
      }}
    >
      {taskInfo ? (
        <RenderTask
          task={taskInfo.task}
          parentId={taskInfo.parentId}
          centerPinTaskId={project.centerPinTaskId}
          addChildTaskFront={addChildTaskFront}
          addChildTaskEnd={addChildTaskEnd}
          insertBrotherTask={insertBrotherTask}
          deleteProject={deleteProject}
          deleteTask={deleteTask}
          pinFlag={pinFlag}
          toggleChecked={toggleChecked}
          updateTaskName={updateTaskName}
          toggleClose={toggleClose}
          switchSelect={switchSelect}
          moveTaskInList={moveTaskInList}
          revertLastChange={revertLastChange}
          isEvenOrder={isEvenOrder}
          setDebugInfo={setDebugInfo}
        />
      ) : (
        <RenderTask
          task={project}
          parentId={null}
          centerPinTaskId={project.centerPinTaskId}
          addChildTaskFront={addChildTaskFront}
          addChildTaskEnd={addChildTaskEnd}
          insertBrotherTask={insertBrotherTask}
          deleteProject={deleteProject}
          deleteTask={deleteTask}
          pinFlag={pinFlag}
          toggleChecked={toggleChecked}
          updateTaskName={updateTaskName}
          toggleClose={toggleClose}
          switchSelect={switchSelect}
          moveTaskInList={moveTaskInList}
          revertLastChange={revertLastChange}
          isEvenOrder={isEvenOrder}
          setDebugInfo={setDebugInfo}
        />
      )}
    </div>
  );
};

export default memo(Project);
