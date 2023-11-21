import React, { useEffect } from "react";
import useProjectsLog from "./CustomHook/useProjectsLog";

import ProjectTable from "./ProjectTable";
import ProjectListSidebar from "./ProjectListSidebar";

const App = () => {
  // Using the useProjectsLog hook to manage project history state and related actions
  const {
    projects,
    undoLog,
    redoLog,
    revertLastChange,
    setProjects,
    DebugWindow,
  } = useProjectsLog();

  // Load projects from Electron Store when the application mounts
  useEffect(() => {
    window.electron.store
      .getProjects()
      .then((loadProjects) => setProjects(loadProjects, true));
  }, []);

  // Save projects to Electron Store whenever they change
  useEffect(() => {
    if (projects !== null) {
      window.electron.store.setProjects(projects);
    }
  }, [projects]);

  // Registering shortcut listeners for undo and redo functionality
  useEffect(() => {
    const shortCutListeners = [
      {
        channel: "renderShortCut-undo",
        listener: undoLog,
      },
      {
        channel: "renderShortCut-redo",
        listener: redoLog,
      },
    ];
    const removeListeners = shortCutListeners.map(({ channel, listener }) =>
      window.electron.ipcRenderer.listen(channel, listener),
    );

    // Cleanup function to remove the event listeners when the component unmounts
    return () => {
      removeListeners.forEach((removeListener) => {
        removeListener();
      });
    };
  }, []);

  // If projects is still null, show a loading message
  if (projects === null) {
    return <div>Loading...</div>;
  }
  return (
    <>
      {/* <DebugWindow /> */}
      <div style={{ paddingLeft: "200px" }}>
        <ProjectListSidebar projects={projects} setProjects={setProjects} />
        <ProjectTable
          projects={projects}
          setProjects={setProjects}
          revertLastChange={revertLastChange}
        />
      </div>
    </>
  );
};

export default App;
