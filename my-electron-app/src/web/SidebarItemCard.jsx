import React, { memo } from "react";

import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import DeleteIcon from "@mui/icons-material/Delete";

const SidebarItemCard = ({
  project,
  toggleProjectVisibility,
  deleteProject,
}) => {
  return (
    <div
      style={{
        width: "210px",
        display: "flex",
        paddingLeft: "10px",
        paddingTop: "10px",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <FrontUI
        projectId={project.taskId}
        isHidden={project.isHidden}
        toggleProjectVisibility={toggleProjectVisibility}
      />
      <div
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          flex: 1,
          opacity: project.isHidden ? 0.6 : 1,
        }}
      >
        {project.taskName}
      </div>
      <BackUI
        projectId={project.taskId}
        isHidden={project.isHidden}
        deleteProject={deleteProject}
      />
    </div>
  );
};

const FrontUI = memo(({ projectId, isHidden, toggleProjectVisibility }) => {
  return (
    <div>
      {isHidden ? (
        <IconButton
          sx={{ opacity: 0.5 }}
          size="small"
          onClick={() => toggleProjectVisibility(projectId)}
        >
          <VisibilityOffIcon fontSize="medium" />
        </IconButton>
      ) : (
        <IconButton
          sx={{ opacity: 1 }}
          size="small"
          onClick={() => toggleProjectVisibility(projectId)}
        >
          <VisibilityIcon fontSize="medium" />
        </IconButton>
      )}
    </div>
  );
});

const BackUI = memo(({ projectId, isHidden, deleteProject }) => {
  return (
    <div style={{ paddingRight: "10px" }}>
      <IconButton
        sx={{ opacity: isHidden ? 0.3 : 0.8 }}
        size="small"
        onClick={() => deleteProject(projectId)}
      >
        <DeleteIcon fontSize="medium" />
      </IconButton>
    </div>
  );
});

export default memo(SidebarItemCard);
