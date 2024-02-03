import React, { useState, memo, useMemo, useCallback } from "react";
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
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { arrayMove } from "@dnd-kit/sortable";

import SortableProjectListItem from "./SortableProjectListItem";
import useProjectListOperations from "./CustomHook/useProjectListOperations";
import SidebarItemCard from "./SidebarItemCard";

const ProjectListSidebar = ({ projects, setProjects }) => {
  const projectsHash = projects
    .map(
      ({ taskId, taskName, isHidden }) => `${taskId}-${taskName}-${isHidden}`,
    )
    .join("|");
  const projectTitleList = useMemo(
    () =>
      projects.map((project) => ({
        taskId: project.taskId,
        taskName: project.taskName,
        isHidden: project.isHidden,
      })),
    [projectsHash],
  );
  return (
    <>
      <InnerItemList
        projectTitleList={projectTitleList}
        setProjects={setProjects}
      />
    </>
  );
};

const InnerItemList = memo(({ projectTitleList, setProjects }) => {
  const [activeId, setActiveId] = useState(null);

  const sensors = useCallback(
    useSensors(
      useSensor(PointerSensor, {
        activationConstraint: {
          distance: 3,
        },
      }),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      }),
    ),
    [],
  );

  const { toggleProjectVisibility, deleteProject } =
    useProjectListOperations(setProjects);

  const handleDragStart = useCallback((event) => {
    setActiveId(event.active.id);
  }, []);

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;

    setActiveId(null);

    if (over && active.id !== over.id) {
      setProjects((projects) => {
        const oldIndex = projects.findIndex(
          (project) => project.taskId === active.id,
        );
        const newIndex = projects.findIndex(
          (project) => project.taskId === over.id,
        );

        return arrayMove(projects, oldIndex, newIndex);
      });
    }
  }, []);

  return (
    <DndContext
      modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={projectTitleList.map(({ taskId }) => taskId)}
        strategy={verticalListSortingStrategy}
      >
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",
            backgroundColor: "#edeed9",
            overflowY: "auto",
            zIndex: 10,
          }}
        >
          {projectTitleList.map((item) => (
            <SortableProjectListItem
              key={item.taskId}
              project={item}
              toggleProjectVisibility={toggleProjectVisibility}
              deleteProject={deleteProject}
            />
          ))}
        </div>
      </SortableContext>
      <DragOverlay>
        {activeId ? (
          <div
            style={{
              backgroundColor: "#edeed9",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              borderRadius: "10px",
              filter: "brightness(110%)",
            }}
          >
            <SidebarItemCard
              project={projectTitleList.find(
                (project) => project.taskId === activeId,
              )}
              toggleProjectVisibility={toggleProjectVisibility}
              deleteProject={deleteProject}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
});

export default memo(ProjectListSidebar);
