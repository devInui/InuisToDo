import React, { memo } from "react";
import IconButton from "@mui/material/IconButton";
import GolfCourseIcon from "@mui/icons-material/GolfCourse";

const CardUIFront = ({ isCenter, handleFlag }) => {
  return (
    <IconButton
      sx={{
        color: isCenter ? "emphasis" : "primary.light",
        opacity: isCenter ? 1 : 0.1,
      }}
      size="small"
      onClick={handleFlag}
    >
      <GolfCourseIcon fontSize="medium" />
    </IconButton>
  );
};

export default memo(CardUIFront);
