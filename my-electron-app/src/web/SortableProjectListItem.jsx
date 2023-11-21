import React, { memo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import SidebarItemCard from "./SidebarItemCard";

const SortableProjectListItem = ({
  project,
  toggleProjectVisibility,
  deleteProject,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: project.taskId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      style={{
        ...style,
        backgroundColor: "#edeed9",
      }}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      <SidebarItemCard
        project={project}
        toggleProjectVisibility={toggleProjectVisibility}
        deleteProject={deleteProject}
      />
    </div>
  );
};

export default memo(SortableProjectListItem);
