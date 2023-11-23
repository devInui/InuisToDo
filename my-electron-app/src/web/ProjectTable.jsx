import React, { memo } from "react";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import useProjectListOperations from "./CustomHook/useProjectListOperations";

import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { arrayMove } from "@dnd-kit/sortable";

import Project from "./Project";

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
        distance: 3,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
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
        </DndContext>
      </div>
      <div style={{ height: "30vh" }}></div>
    </>
  );
};

export default ProjectTable;
