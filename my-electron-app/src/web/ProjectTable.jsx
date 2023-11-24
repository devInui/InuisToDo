import React, { memo, useState } from "react";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import useProjectListOperations from "./CustomHook/useProjectListOperations";

import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
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

  function handleDragStart(event) {
    setActiveId(event.active.id);
  }

  const handleDragEnd = (event) => {
    const { active, over } = event;

    setActiveId(null);

    if (over && active.id !== over.id) {
      // use setProjects
    }
  };

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

  return (
    <>
      <div style={{ position: "fixed", top: "10px", right: "10px" }}>
        <AddProjectButton onClick={addProject} />
      </div>
      <div style={{ backgroundColor: "#60584e" }}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
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
              <DraggingTask
                task={draggingTask}
                isEvenOrder={
                  (visibleProjects.length - draggingProjectIndex) % 2 === 0
                }
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
      <div style={{ height: "30vh" }}></div>
    </>
  );
};

export default ProjectTable;
