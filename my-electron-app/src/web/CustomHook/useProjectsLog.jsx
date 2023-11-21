import React, { useState, useCallback } from "react";

const useProjectsLog = () => {
  const [projectsLog, setProjectsLog] = useState({ data: [null], index: 0 });
  const projects = projectsLog.data[projectsLog.index];

  const undoLog = useCallback(() => {
    setProjectsLog((previousLog) => {
      if (previousLog.index < previousLog.data.length - 1) {
        return {
          data: previousLog.data,
          index: previousLog.index + 1,
        };
      }
      return previousLog;
    });
  }, []);

  const redoLog = useCallback(() => {
    setProjectsLog((previousLog) => {
      if (previousLog.index > 0) {
        return {
          data: previousLog.data,
          index: previousLog.index - 1,
        };
      }
      return previousLog;
    });
  }, []);

  const setProjects = useCallback((newProjects, shouldSkipLog = false) => {
    setProjectsLog((previousLog) => {
      const updateProjects =
        typeof newProjects === "function"
          ? newProjects(previousLog.data[previousLog.index])
          : newProjects;
      const data = shouldSkipLog
        ? [
            ...previousLog.data.slice(0, previousLog.index),
            updateProjects,
            ...previousLog.data.slice(previousLog.index + 1),
          ]
        : [updateProjects, ...previousLog.data.slice(previousLog.index)];

      const index = shouldSkipLog ? previousLog.index : 0;

      return { data, index };
    });
  }, []);

  const revertLastChange = useCallback(() => {
    setProjectsLog((previousLog) => {
      return {
        data: previousLog.data.filter((_, i) => i !== previousLog.index),
        index: previousLog.index,
      };
    });
  }, []);

  const DebugWindow = () => {
    return (
      <div
        style={{
          position: "fixed",
          width: "100%",
          bottom: "0px",
          fontSize: "2vh",
          minFontSize: "100px",
          backgroundColor: "gray",
          zIndex: 100,
        }}
      >
        <h1>history debug window</h1>
        <h1>
          Step in Log: {projectsLog.index + 1}/{projectsLog.data.length}
        </h1>
      </div>
    );
  };

  return {
    projects,
    undoLog,
    redoLog,
    revertLastChange,
    setProjects,
    DebugWindow,
  };
};

export default useProjectsLog;
