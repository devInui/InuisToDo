import React from "react";
import Button from "@mui/material/Button";

const TaskDeckSidebar = () => {
  const [taskDeckIdList, setTaskDeckIdList] = useState([]);
  /*-----------control sidebar--------------*/
  const addTaskToDeck = () => {
    const selectedList = (taskList) => {
      return taskList.reduce((accumulator, task) => {
        const selectedIds = task.isSelected ? [task.taskId] : [];
        const childSelectedIds = task.childTasks
          ? selectedList(task.childTasks)
          : [];
        return [...accumulator, ...selectedIds, ...childSelectedIds];
      }, []);
    };
    setTaskDeckIdList((previousDeck) => [
      ...previousDeck,
      ...selectedList(projects),
    ]);
  };
  /*-------------------------*/
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1>I'm sure that I am SIDEBAR...</h1>
      <div>{taskDeckIdList}</div>
      <Button onClick={addTaskDeckId} sx={{ color: "emphasis", opacity: 1 }}>
        Add task card
      </Button>
    </div>
  );
};

export default TaskDeckSidebar;
