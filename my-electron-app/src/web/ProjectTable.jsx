import React, { useState, memo } from "react";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import useProjectListOperations from "./CustomHook/useProjectListOperations";

import Project from "./Project";

const ProjectTable = ({ projects, setProjects, revertLastChange }) => {
  // Using the useProjectOperations hook to manage operations like adding, deleting, and updating projects
  const { addProject, deleteProject, setProject } =
    useProjectListOperations(setProjects);

  const AddProjectButton = memo(({ onClick: handleAddProject }) => {
    return (
      <Button
        size="small"
        variant="contained"
        sx={{ color: "primary.light", opacity: 1 }}
        onClick={() => handleAddProject("")}
      >
        <AddIcon fontSize="large" />
      </Button>
    );
  });

  const visibleProjects = projects.filter((project) => !project.isHidden);

  // for debug DnD
  const [debugOverInfo, setDebugOverInfo] = useState(null);
  const [debugMoveInfo, setDebugMoveInfo] = useState(null);
    const findTask = (taskList, projectId = null) => {
      return taskList.reduce((acc, task) => {
        const currentProjectId = projectId || task.taskId;
        const result =
          task.taskId === activeId
            ? { task, currentProjectId }
            : task.childTasks.length !== 0
            ? findTask(task.childTasks, currentProjectId)
            : false;
        return acc !== false ? acc : result;
      }, false);
    };
    return findTask(projects);
  };
  return (
    <>
      <div style={{ position: "fixed", top: "10px", right: "10px" }}>
        <AddProjectButton onClick={addProject} />
      </div>
      <div style={{ backgroundColor: "#60584e" }}>
        {visibleProjects.map((project, index) => (
          <Project
            isEvenOrder={(visibleProjects.length - index) % 2 === 0}
            key={project.taskId}
            project={project}
            revertLastChange={revertLastChange}
            setProject={setProject}
            deleteProject={deleteProject}
            setDebugOverInfo={setDebugOverInfo}
            setDebugMoveInfo={setDebugMoveInfo}
          />
        ))}
        <div
          style={{
            position: "fixed",
            marginLeft: "10px",
            width: "100%",
            bottom: "0px",
            fontSize: "2vh",
            minFontSize: "100px",
            backgroundColor: "gray",
            borderRadius: "3px",
            zIndex: 100,
          }}
        >
          <h1>Debug Window for DnD over event</h1>
          <p>
            ActiveTask:{" "}
            {debugOverInfo?.active &&
              detectDragTask(debugOverInfo.active.id).task.taskName}
          </p>
          <p>
            OverTask:{" "}
            {debugOverInfo?.over &&
              detectDragTask(debugOverInfo.over.id).task.taskName}
          </p>
          <p>MoveX: {debugMoveInfo && debugMoveInfo.delta.x}</p>
          <p>MoveY: {debugMoveInfo && debugMoveInfo.delta.y}</p>
        </div>
      </div>
      <div style={{ height: "30vh" }}></div>
    </>
  );
};

export default memo(ProjectTable);
