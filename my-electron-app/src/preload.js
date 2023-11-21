import { contextBridge, ipcRenderer } from "electron";

// use Electron Store
contextBridge.exposeInMainWorld("electron", {
  store: {
    getProjects() {
      return ipcRenderer.invoke("electron-store-get-projects");
    },
    setProjects(data) {
      return ipcRenderer.invoke("electron-store-set-projects", data);
    },
  },
  testAPI: {
    access: () => "Access Electron API",
  },
  ipcRenderer: {
    listen: (channel, listener) => {
      ipcRenderer.on(channel, listener);
      return () => ipcRenderer.removeListener(channel, listener);
    },
  },
});
