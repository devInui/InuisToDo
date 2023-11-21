import React, { memo } from "react";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const CardUIEnd = ({
  haveChild,
  isClose,
  handleToggleList,
  handleAdd: handleAdd,
}) => {
  return (
    <div style={{ display: "flex", alignItems: "left" }}>
      <IconButton
        sx={{ color: "primary.light", opacity: 0 }}
        size="small"
        onClick={handleAdd}
      >
        <AddIcon fontSize="medium" />
      </IconButton>
      {haveChild &&
        (isClose ? (
          <IconButton
            size="small"
            sx={{
              color: "primary.light",
            }}
            onClick={handleToggleList}
          >
            <ExpandLessIcon fontSize="medium" />
          </IconButton>
        ) : (
          <div>
            <IconButton
              size="small"
              sx={{
                color: "primary.light",
              }}
              onClick={handleToggleList}
            >
              <ExpandMoreIcon fontSize="medium" />
            </IconButton>
          </div>
        ))}
    </div>
  );
};

export default memo(CardUIEnd);
