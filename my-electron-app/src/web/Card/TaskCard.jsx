import React, { memo } from "react";
import Checkbox from "@mui/material/Checkbox";
import AutoResizingInput from "./AutoResizingInput";

const TaskCard = ({
  attributes,
  listeners,
  taskName,
  taskChecked,
  isIndeterminate,
  childTasksLength,
  isSelected,
  isEvenOrder,
  handleToggle,
  handleSelect,
  handleBlur,
  handleKeyDown,
  handleTaskNameChange,
  revertLastChange,
}) => {
  return (
    <div
      {...attributes}
      {...listeners}
      style={{
        margin: "5px",
        padding: "4px",
        backgroundColor: isEvenOrder ? "#e3efda" : "#f1e7db",
        borderRadius: "3px",
        display: "flex",
        alignItems: "center",
        boxShadow: "0px 1px 3px 0px",
        // outline: isSelected
        //   ? "solid 3px #4484eb"
        //   : childTasksLength === 0
        //   ? "solid 3px #ebab44"
        //   : undefined,
      }}
      // onClick={handleSelect}
    >
      <Checkbox
        sx={{
          opacity: 1,
          width: 24,
          height: 24,
          color: "secondary.main",
          "& .MuiSvgIcon-root": {
            color: "secondary.main",
          },
        }}
        onChange={handleToggle}
        indeterminate={isIndeterminate}
        checked={taskChecked}
      />
      <AutoResizingInput
        type="text"
        placeholder="Edit taskName"
        value={taskName}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onChange={handleTaskNameChange}
        revertLastChange={revertLastChange}
      />
    </div>
  );
};

export default memo(TaskCard);
