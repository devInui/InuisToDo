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
      <div>
        {project.isHidden ? (
          <IconButton
            sx={{ opacity: 0.5 }}
            size="small"
            onClick={() => toggleProjectVisibility(project.taskId)}
          >
            <VisibilityOffIcon fontSize="medium" />
          </IconButton>
        ) : (
          <IconButton
            sx={{ opacity: 1 }}
            size="small"
            onClick={() => toggleProjectVisibility(project.taskId)}
          >
            <VisibilityIcon fontSize="medium" />
          </IconButton>
        )}
      </div>
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
      <div style={{ paddingRight: "10px" }}>
        <IconButton
          sx={{ opacity: project.isHidden ? 0.3 : 0.8 }}
          size="small"
          onClick={() => deleteProject(project.taskId)}
        >
          <DeleteIcon fontSize="medium" />
        </IconButton>
      </div>
    </div>
  );
};

export default memo(SidebarItemCard);
