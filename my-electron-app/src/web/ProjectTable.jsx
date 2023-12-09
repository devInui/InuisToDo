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
  const [debugInfo, setDebugInfo] = useState(null);
  const detectDragTask = (activeId) => {
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
            setDebugInfo={setDebugInfo}
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
            {debugInfo?.active &&
              detectDragTask(debugInfo.active.id).task.taskName}
          </p>
          <p>
            OverTask:{" "}
            {debugInfo?.over && detectDragTask(debugInfo.over.id).task.taskName}
          </p>
        </div>
      </div>
      <div style={{ height: "30vh" }}></div>
    </>
  );
};

export default memo(ProjectTable);
