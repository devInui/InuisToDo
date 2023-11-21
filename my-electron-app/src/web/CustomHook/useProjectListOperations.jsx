import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

const useProjectListOperations = (setProjects) => {
  const projectsTemplate = useCallback((projectName) => {
    return {
      taskName: projectName,
      taskId: uuidv4(),
      isClose: false,
      isSelected: false,
      checked: false,
      childTasks: [],
      centerPinTaskId: null,
      viewLevel: 0,
    };
  }, []);

  const addProject = useCallback(
    (projectName) => {
      setProjects((previousProjects) => [
        projectsTemplate(projectName),
        ...previousProjects,
      ]);
    },
    [setProjects, projectsTemplate],
  );

  const deleteProject = useCallback(
    (projectId, shouldSkipLog = false) => {
      setProjects((previousProjects) => {
        return previousProjects.filter(
          (project) => project.taskId !== projectId,
        );
      }, shouldSkipLog);
    },
    [setProjects],
  );

  const setProject = useCallback(
    (projectId, newProject, shouldSkipLog = false) => {
      setProjects((previousProjects) => {
        return previousProjects.map((project) => {
          if (project.taskId === projectId) {
            if (typeof newProject === "function") {
              return newProject(project);
            } else {
              return newProject;
            }
          } else {
            return project;
          }
        });
      }, shouldSkipLog);
    },
    [setProjects],
  );

  const toggleProjectVisibility = useCallback(
    (projectId) => {
      setProject(projectId, (previousProject) => {
        return { ...previousProject, isHidden: !previousProject.isHidden };
      });
    },
    [setProject],
  );

  return { addProject, deleteProject, setProject, toggleProjectVisibility };
};

export default useProjectListOperations;
