import React, { memo } from "react";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const CardUIBack = ({ handleAddChildFront, handleDelete }) => {
  return (
    <>
      <IconButton
        sx={{ color: "primary.light" }}
        size="small"
        onClick={handleAddChildFront}
      >
        <AddIcon fontSize="medium" />
      </IconButton>
      <IconButton
        sx={{ color: "primary.light" }}
        size="small"
        onClick={() => handleDelete()}
      >
        <DeleteIcon fontSize="medium" />
      </IconButton>
    </>
  );
};

export default memo(CardUIBack);
