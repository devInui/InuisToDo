import React, { useState, memo } from "react";
import { v4 as uuidv4 } from "uuid";

const AutoResizingInput = ({
  value: inputValue,
  onBlur: handleBlurOutside,
  onKeyDown: handleKeyDown,
  onChange: handleInputChange,
  revertLastChange,
}) => {
  const [key, setKey] = useState(uuidv4());
  const [previousValue, setPreviousValue] = useState(inputValue);

  const [isEditing, setIsEditing] = useState(false);

  const handleBlur = () => {
    handleBlurOutside(previousValue === "");

    setIsEditing(false);
    setPreviousValue(inputValue);
    setKey(uuidv4());
  };

  const handleChange = (e) => {
    if (previousValue === "") {
      handleInputChange(e, true);
    } else {
      handleInputChange(e, isEditing);
      if (!isEditing) {
        setIsEditing(true);
      } else if (e.target.value === previousValue) {
        setIsEditing(false);
        revertLastChange();
      }
    }
  };
  return (
    <>
      <div
        style={{
          position: "relative",
          width: "min-content",
          height: "min-content",
          display: "inline-block",
          padding: 0,
          margin: "0px",
        }}
      >
        <span
          style={{
            padding: "0 9px",
            whiteSpace: "pre",
            visibility: "hidden",
            fontSize: "20px",
          }}
          aria-hidden="true"
        >
          {inputValue}
        </span>
        <input
          key={key}
          autoFocus={inputValue === ""}
          className="input"
          type="text"
          style={{
            left: 0,
            padding: "0 8px",
            position: "absolute",
            width: "100%",
            font: "inherit",
            fontSize: "20px",
            boxSizing: "border-box",
            borderWidth: 0,
            outline: "none",
            backgroundColor: "transparent",
          }}
          value={inputValue}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onChange={handleChange}
        />
      </div>
    </>
  );
};

export default memo(AutoResizingInput);
