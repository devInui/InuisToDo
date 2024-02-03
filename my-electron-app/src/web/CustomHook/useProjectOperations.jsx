import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { arrayMove } from "@dnd-kit/sortable";

// This custom hook provides operations for managing tasks within a project.
// It optimizes task object updates to minimize unnecessary re-renders
const useProjectOperations = (projectId, setProject) => {
  // Updates project state for the specified projectId.
  const setEditedProject = (...args) => setProject(projectId, ...args);

  /*-----------Control Add and Delete Task --------------*/
  // Creates a new task template with default properties.
  const taskTemplate = (taskName) => ({
    // task property
    taskName: taskName,
    taskId: uuidv4(),
    isClose: false,
    isSelected: false,
    isFocus: true,
    checked: false,
    childTasks: [],
  });

  // Adds a child task at the start of a parent's list.
  const addChildTaskFront = useCallback((parentId, childName) => {
    setEditedProject((previousProject) => {
      const updateParent = (task) => {
        if (parentId === null || task.taskId === parentId) {
          const newChildren = [taskTemplate(childName), ...task.childTasks];
          //Update task
          if (task.isClose) {
            return syncParentChildCheckStatus(
              { ...task, isClose: false },
              newChildren,
            );
          } else {
            return syncParentChildCheckStatus(task, newChildren);
          }
        } else if (task.childTasks) {
          //Update childTasks
          const updatedChildTasks = task.childTasks.map(updateParent);
          // Evaluating to avoid unnecessary reference changes
          if (updatedChildTasks.some(Boolean)) {
            return updateTaskCheckStatus(task, updatedChildTasks);
          } else {
            return false;
          }
        } else {
          //Not found task
          return false;
        }
      };
      return updateParent(previousProject) || previousProject;
    });
  }, []);

  // Adds a child task at the end of a parent's list.
  const addChildTaskEnd = useCallback((parentId, childName) => {
    setEditedProject((previousProject) => {
      const updateParent = (task) => {
        if (parentId === null || task.taskId === parentId) {
          //Update task
          const newChildren = [...task.childTasks, taskTemplate(childName)];
          return syncParentChildCheckStatus(task, newChildren);
        } else if (task.childTasks) {
          //Update childTasks
          const updatedChildTasks = task.childTasks.map(updateParent);
          // Evaluating to avoid unnecessary reference changes
          if (updatedChildTasks.some(Boolean)) {
            return updateTaskCheckStatus(task, updatedChildTasks);
          } else {
            return false;
          }
        } else {
          //Not found task
          return false;
        }
      };
      return updateParent(previousProject) || previousProject;
    });
  }, []);

  // Inserts a sibling task at the same level.
  const insertBrotherTask = useCallback((parentId, taskId, brotherName) => {
    setEditedProject((previousProject) => {
      const updateParent = (task) => {
        if (parentId === null || task.taskId === parentId) {
          //Update task
          //Find index of taskId
          const index = task.childTasks.findIndex(
            (task) => task.taskId === taskId,
          );
          const newChildren = [
            ...task.childTasks.slice(0, index + 1),
            taskTemplate(brotherName),
            ...task.childTasks.slice(index + 1),
          ];
          return syncParentChildCheckStatus(task, newChildren);
        } else if (task.childTasks) {
          //Update childTasks
          const updatedChildTasks = task.childTasks.map(updateParent);
          // Evaluating to avoid unnecessary reference changes
          if (updatedChildTasks.some(Boolean)) {
            return updateTaskCheckStatus(task, updatedChildTasks);
          } else {
            return false;
          }
        } else {
          //Not found task
          return false;
        }
      };
      return updateParent(previousProject) || previousProject;
    });
  }, []);

  // Removes a specified task from the project.
  const deleteTask = useCallback(
    (taskId, needNewPin = false, parentId = null, shouldSkipLog = false) => {
      setEditedProject((previousProject) => {
        const updateParent = (task) => {
          if (task.childTasks.some((child) => child.taskId === taskId)) {
            const newChildren = task.childTasks.filter(
              (task) => task.taskId !== taskId,
            );
            //Update task
            return syncParentChildCheckStatus(task, newChildren);
          } else if (task.childTasks) {
            //Update childTasks
            const updatedChildTasks = task.childTasks.map(updateParent);
            // Evaluating to avoid unnecessary reference changes
            if (updatedChildTasks.some(Boolean)) {
              return updateTaskCheckStatus(task, updatedChildTasks);
            } else {
              return false;
            }
          } else {
            //Not found task
            return false;
          }
        };
        return (
          pinCheckedProject(
            updateParent(previousProject),
            needNewPin,
            parentId,
          ) || previousProject
        );
      }, shouldSkipLog);
    },
    [],
  );
  /*-------------------------*/
  /*----------- handleDragEvents for DndContext in SortableChildTasks --------------*/
  const moveTaskInList = useCallback((activeId, overId) => {
    setEditedProject((previousProject) => {
      const updateParent = (task) => {
        if (task.childTasks.some((child) => child.taskId === activeId)) {
          const oldIndex = task.childTasks.findIndex(
            (task) => task.taskId === activeId,
          );
          const newIndex = task.childTasks.findIndex(
            (task) => task.taskId === overId,
          );
          const newChildren = arrayMove(task.childTasks, oldIndex, newIndex);
          //Update task
          return { ...task, childTasks: newChildren };
        } else if (task.childTasks) {
          //Update childTasks
          const updatedChildTasks = task.childTasks.map(updateParent);
          // Evaluating to avoid unnecessary reference changes
          if (updatedChildTasks.some(Boolean)) {
            return {
              ...task,
              childTasks: task.childTasks.map((child, index) => {
                if (updatedChildTasks[index]) {
                  return updatedChildTasks[index];
                } else {
                  return child;
                }
              }),
            };
          } else {
            return false;
          }
        } else {
          //Not found task
          return false;
        }
      };
      return updateParent(previousProject) || previousProject;
    });
  }, []);

  const moveTaskInToChild = useCallback((activeId, overId) => {
    const findNewParentId = (activeId, overId, sourceTask) => {
      if (sourceTask.childTasks.some((child) => child.taskId === activeId)) {
        if (!overId) return false;
        const activeIndex = sourceTask.childTasks.findIndex(
          (task) => task.taskId === activeId,
        );
        const overIndex = sourceTask.childTasks.findIndex(
          (task) => task.taskId === overId,
        );
        const parentIndex = overIndex < activeIndex ? overIndex : overIndex - 1;
        if (parentIndex < 0) return false;
        const parentId =
          parentIndex >= 0 ? sourceTask.childTasks[parentIndex].taskId : false;
        return parentId;
      } else if (sourceTask.childTasks) {
        let parentId = false;
        for (const child of sourceTask.childTasks) {
          const newParentId = findNewParentId(activeId, overId, child);
          if (newParentId !== false) {
            parentId = newParentId;
            break;
          }
        }
        return parentId;
      } else {
        return false;
      }
    };

    const appendSubTask = (parentId, targetTask, sourceTask) => {
      if (sourceTask.taskId === parentId) {
        const newChildTasks = [...sourceTask.childTasks, targetTask];
        return syncParentChildCheckStatus(
          { ...sourceTask, isClose: false },
          newChildTasks,
        );
      } else if (sourceTask.childTasks) {
        //Update childTasks
        const updatedChildTasks = sourceTask.childTasks.map((child) =>
          appendSubTask(parentId, targetTask, child),
        );
        // Evaluating to avoid unnecessary reference changes
        if (updatedChildTasks.some(Boolean)) {
          return updateTaskCheckStatus(sourceTask, updatedChildTasks);
        } else {
          return false;
        }
      } else {
        return false;
      }
    };
    setEditedProject((previousProject) => {
      const newParentId = findNewParentId(activeId, overId, previousProject);
      if (!newParentId) {
        return previousProject;
      }
      const detachResult = extractSubTask(activeId, previousProject);
      if (!detachResult) {
        return previousProject;
      }
      const activeTask = detachResult.subTask;
      const restProject = detachResult.restSourceTask;
      return (
        appendSubTask(newParentId, activeTask, restProject) || previousProject
      );
    });
  }, []);

  const moveTaskToParent = useCallback((activeId, parentId) => {
    const findGranParentId = (parentId, sourceTask) => {
      if (sourceTask.childTasks.some((child) => child.taskId === parentId)) {
        const granParentId = sourceTask.taskId;
        return granParentId;
      } else if (sourceTask.childTasks) {
        let granParentId = false;
        for (const child of sourceTask.childTasks) {
          const findId = findGranParentId(parentId, child);
          if (findId !== false) {
            granParentId = findId;
            break;
          }
        }
        return granParentId;
      } else {
        return false;
      }
    };

    const appendSubTaskNext = (
      granParentId,
      parentId,
      targetTask,
      sourceTask,
    ) => {
      if (sourceTask.taskId === granParentId) {
        const parentIndex = sourceTask.childTasks.findIndex(
          (child) => child.taskId === parentId,
        );
        const newChildTasks = [
          ...sourceTask.childTasks.slice(0, parentIndex + 1),
          targetTask,
          ...sourceTask.childTasks.slice(parentIndex + 1),
        ];
        return syncParentChildCheckStatus(sourceTask, newChildTasks);
      } else if (sourceTask.childTasks) {
        //Update childTasks
        const updatedChildTasks = sourceTask.childTasks.map((child) =>
          appendSubTaskNext(granParentId, parentId, targetTask, child),
        );
        // Evaluating to avoid unnecessary reference changes
        if (updatedChildTasks.some(Boolean)) {
          return updateTaskCheckStatus(sourceTask, updatedChildTasks);
        } else {
          return false;
        }
      } else {
        return false;
      }
    };
    setEditedProject((previousProject) => {
      const granParentId = findGranParentId(parentId, previousProject);
      if (!granParentId) {
        return previousProject;
      }
      const detachResult = extractSubTask(activeId, previousProject);
      if (!detachResult) {
        return previousProject;
      }
      const activeTask = detachResult.subTask;
      const restProject = detachResult.restSourceTask;
      return (
        appendSubTaskNext(granParentId, parentId, activeTask, restProject) ||
        previousProject
      );
    });
  }, []);

  /*-------------------------*/
  /*-----------helper function for Drag and Drop--------------*/
  const extractSubTask = (targetId, sourceTask) => {
    if (sourceTask.childTasks.some((child) => child.taskId === targetId)) {
      const targetTask = sourceTask.childTasks.find(
        (task) => task.taskId === targetId,
      );
      const newChildTasks = sourceTask.childTasks.filter(
        (child) => child.taskId !== targetId,
      );
      return {
        subTask: targetTask,
        restSourceTask: syncParentChildCheckStatus(sourceTask, newChildTasks),
      };
    } else if (sourceTask.childTasks) {
      //Update childTasks
      const results = sourceTask.childTasks.map((child) =>
        extractSubTask(targetId, child),
      );
      if (results.some(Boolean)) {
        const targetTask = results.find(Boolean).subTask;
        const updatedChildTasks = results.map(
          (child) => child && child.restSourceTask,
        );
        return {
          subTask: targetTask,
          restSourceTask: updateTaskCheckStatus(sourceTask, updatedChildTasks),
        };
      } else {
        return false;
      }
    } else {
      return false;
    }
  };
  /*-------------------------*/
  /*-----------Control Task Property--------------*/

  // Toggles a task's pin status.
  const pinFlag = useCallback((taskId) => {
    setEditedProject((previousProject) => ({
      ...previousProject,
      centerPinTaskId: taskId,
    }));
  }, []);

  // Toggles a task's completion status.
  const toggleChecked = useCallback(
    (taskId, needNewPin = false, parentId = null) => {
      setEditedProject((previousProject) => {
        const updateToggle = (task) => {
          if (task.taskId === taskId) {
            //Update task
            return { ...task, checked: !task.checked };
          } else if (task.childTasks) {
            //Update childTasks
            const updatedChildTasks = task.childTasks.map(updateToggle);
            // Evaluating to avoid unnecessary reference changes
            if (updatedChildTasks.some(Boolean)) {
              return updateTaskCheckStatus(task, updatedChildTasks);
            } else {
              return false;
            }
          } else {
            //Not found task
            return false;
          }
        };
        return (
          pinCheckedProject(
            updateToggle(previousProject),
            needNewPin,
            taskId,
          ) || previousProject
        );
      });
    },
    [],
  );

  // Changes a task's name.
  const updateTaskName = useCallback((taskId, newTaskName, shouldSkipLog) => {
    setEditedProject((previousProject) => {
      const updateName = (task) => {
        if (task.taskId === taskId) {
          //Update task
          return { ...task, taskName: newTaskName };
        } else if (task.childTasks) {
          //Update childTasks
          const updatedChildTasks = task.childTasks.map(updateName);
          // Evaluating to avoid unnecessary reference changes
          if (updatedChildTasks.some(Boolean)) {
            return {
              ...task,
              childTasks: task.childTasks.map((child, index) => {
                if (updatedChildTasks[index]) {
                  return updatedChildTasks[index];
                } else {
                  return child;
                }
              }),
            };
          } else {
            return false;
          }
        } else {
          //Not found task
          return false;
        }
      };
      return updateName(previousProject) || previousProject;
    }, shouldSkipLog);
  }, []);

  // Switches a task's 'close' state.
  const toggleClose = useCallback((taskId) => {
    setEditedProject(
      (previousProject) => {
        const updateToggle = (task) => {
          if (task.taskId === taskId) {
            //Update task
            return { ...task, isClose: !task.isClose };
          } else if (task.childTasks) {
            //Update childTasks
            const updatedChildTasks = task.childTasks.map(updateToggle);
            // Evaluating to avoid unnecessary reference changes
            if (updatedChildTasks.some(Boolean)) {
              return {
                ...task,
                childTasks: task.childTasks.map((child, index) => {
                  if (updatedChildTasks[index]) {
                    return updatedChildTasks[index];
                  } else {
                    return child;
                  }
                }),
              };
            } else {
              return false;
            }
          } else {
            //Not found task
            return false;
          }
        };
        return updateToggle(previousProject) || previousProject;
      },
      // shouldSkipLog = true
      true,
    );
  }, []);

  // Toggles a task's selection state.
  const switchSelect = useCallback((taskId) => {
    setEditedProject((previousProject) => {
      const updateTask = (task) => {
        if (task.taskId === taskId) {
          //Update task
          return { ...task, isSelected: !task.isSelected };
        } else if (task.childTasks) {
          //Update childTasks
          const updatedChildTasks = task.childTasks.map(updateTask);
          // Evaluating to avoid unnecessary reference changes
          if (updatedChildTasks.some(Boolean)) {
            return {
              ...task,
              childTasks: task.childTasks.map((child, index) => {
                if (updatedChildTasks[index]) {
                  return updatedChildTasks[index];
                } else {
                  return child;
                }
              }),
            };
          } else {
            return false;
          }
        } else {
          //Not found task
          return false;
        }
      };
      return updateTask(previousProject) || previousProject;
    });
  }, []);

  // ---------- helper function ----------
  // for update checked state
  const updateTaskCheckStatus = (task, updatedChildTasks) => {
    const newChildren = task.childTasks.map((child, index) => {
      if (updatedChildTasks[index]) {
        return updatedChildTasks[index];
      } else {
        return child;
      }
    });
    return syncParentChildCheckStatus(task, newChildren);
  };

  // sync checked state between parent and child task
  const syncParentChildCheckStatus = (task, newChildren) => {
    const isConsistent =
      task.checked === task.childTasks.every((child) => Boolean(child.checked));
    const isComplete = newChildren.every((child) => Boolean(child.checked));
    if (isConsistent && !isComplete === task.checked && newChildren.length) {
      return {
        ...task,
        checked: isComplete,
        childTasks: newChildren,
      };
    } else {
      return {
        ...task,
        childTasks: newChildren,
      };
    }
  };

  const pinCheckedProject = (newProject, needNewPin, tempPinId) => {
    if (!newProject) return false;

    const newCenterPin = updatedCenterPin(
      newProject,
      needNewPin ? tempPinId : newProject.centerPinTaskId,
    );
    if (newCenterPin === null || newCenterPin) {
      return { ...newProject, centerPinTaskId: newCenterPin };
    } else {
      return newProject;
    }
  };

  const updatedCenterPin = (newProject, tempPinId) => {
    const previousPinId = tempPinId;
    if (previousPinId === null) return false;

    const detectNewCenterPin = (task, previousPinId, newCenterPinId) => {
      if (task.taskId === previousPinId) {
        // Update task
        return task.checked ? newCenterPinId : task.taskId;
      } else if (task.childTasks) {
        // Reduce childTasks array to find the new center pin
        return task.childTasks.reduce((acc, child) => {
          const result = detectNewCenterPin(
            child,
            previousPinId,
            task.checked ? newCenterPinId : task.taskId,
          );
          return acc !== false ? acc : result;
        }, false);
      } else {
        // Not found task
        return false;
      }
    };
    return detectNewCenterPin(newProject, previousPinId, null);
  };

  /*-------------------------*/
  return {
    addChildTaskFront,
    addChildTaskEnd,
    insertBrotherTask,
    deleteTask,
    pinFlag,
    toggleChecked,
    updateTaskName,
    toggleClose,
    switchSelect,
    moveTaskInList,
    moveTaskInToChild,
    moveTaskToParent,
  };
};

export default useProjectOperations;
