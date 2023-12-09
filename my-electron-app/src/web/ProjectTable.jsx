import React, { useState, memo } from "react";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import useProjectListOperations from "./CustomHook/useProjectListOperations";

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

import Project from "./Project";
import DraggingTask from "./DraggingTask";

const ProjectTable = ({ projects, setProjects, revertLastChange }) => {
  // Using the useProjectOperations hook to manage operations like adding, deleting, and updating projects
  const { addProject, deleteProject, setProject } =
    useProjectListOperations(setProjects);

  const AddProjectButton = memo(({ onClick: handleAddProject }) => {
    return (
      <Button
        size="small"
        variant="contained"
        sx={{ color: "primary.light", opacity: 1 }}
        onClick={() => handleAddProject("")}
      >
        <AddIcon fontSize="large" />
      </Button>
    );
  });

  const visibleProjects = projects.filter((project) => !project.isHidden);

  // ---
  const [activeId, setActiveId] = useState(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 0,
      },
    }),
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    setDebugInfo(null); // for debug code

    if (over && active.id !== over.id) {
      // helper function
      const processor = (taskList) => {
        const exitActiveTask = taskList.some(
          (task) => task.taskId === active.id,
        );
        if (exitActiveTask) {
          const oldIndex = taskList.findIndex(
            (task) => task.taskId === active.id,
          );
          const newIndex = taskList.findIndex(
            (task) => task.taskId === over.id,
          );
          return arrayMove(taskList, oldIndex, newIndex);
        } else {
          const newTaskList = taskList.map((task) => {
            const newChildTasks = processor(task.childTasks);
            if (newChildTasks) {
              return { ...task, childTasks: newChildTasks };
            } else {
              return false;
            }
          });
          return processedTaskList(taskList, newTaskList);
        }
      };
      const processedTaskList = (oldTaskList, newTaskList) => {
        if (newTaskList.some((task) => task)) {
          return newTaskList.map((task, index) => task || oldTaskList[index]);
        } else {
          return false;
        }
      };
      // use setProjects
      setProjects(
        (previousProjects) => processor(previousProjects) || previousProjects,
      );
    }
  };
  // ---
  // helper function for DragOverlay
  const detectDragTask = (activeId) => {
    const findTask = (taskList, projectId = null) => {
      return taskList.reduce((acc, task) => {
        const currentProjectId = projectId || task.taskId;
        const result =
          task.taskId === activeId
            ? { task, currentProjectId }
            : task.childTasks.length !== 0
            ? findTask(task.childTasks, currentProjectId)
            : false;
        return acc !== false ? acc : result;
      }, false);
    };
    return findTask(projects);
  };
  const { task: draggingTask, currentProjectId: draggingProjectId } =
    detectDragTask(activeId);
  const draggingProjectIndex = visibleProjects.findIndex(
    (project) => project.taskId === draggingProjectId,
  );
  // ---
  // for debug
  const [debugInfo, setDebugInfo] = useState(null);
  const handleDragOver = (event) => {
    setDebugInfo(event);
  };
  return (
    <>
      <div style={{ position: "fixed", top: "10px", right: "10px" }}>
        <AddProjectButton onClick={addProject} />
      </div>
      <div style={{ backgroundColor: "#60584e" }}>
        <DndContext
          modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          {visibleProjects.map((project, index) => (
            <Project
              isEvenOrder={(visibleProjects.length - index) % 2 === 0}
              key={project.taskId}
              project={project}
              revertLastChange={revertLastChange}
              setProject={setProject}
              deleteProject={deleteProject}
            />
          ))}
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
                    <DraggingTask
                      task={draggingTask}
                      isEvenOrder={
                        (visibleProjects.length - draggingProjectIndex) % 2 ===
                        0
                      }
                    />
                  </div>
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
        <div
          style={{
            position: "fixed",
            marginLeft: "10px",
            width: "100%",
            bottom: "0px",
            fontSize: "2vh",
            minFontSize: "100px",
            backgroundColor: "gray",
            borderRadius: "3px",
            zIndex: 100,
          }}
        >
          <h1>Debug Window for DnD over event</h1>
          <p>
            ActiveTask:{" "}
            {debugInfo?.active &&
              detectDragTask(debugInfo.active.id).task.taskName}
          </p>
          <p>
            OverTask:{" "}
            {debugInfo?.over && detectDragTask(debugInfo.over.id).task.taskName}
          </p>
        </div>
      </div>
      <div style={{ height: "30vh" }}></div>
    </>
  );
};

export default memo(ProjectTable);
