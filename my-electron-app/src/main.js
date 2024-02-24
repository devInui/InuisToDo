import path from "path";
import { BrowserWindow, app, ipcMain } from "electron";
import Store from "electron-store";
import setMenu from "./menu";
import handleZoomChange from "./zoomHandler";
import initProjects from "./initProject";

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    // frame: false,
    titleBarStyle: "customButtonsOnHover",
    autoHideMenuBar: true,
    webPreferences: {
      spellcheck: false,
      preload: path.resolve(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile("dist/index.html");
  // mainWindow.webContents.openDevTools({ mode: "detach" });

  setMenu(mainWindow);

  mainWindow.webContents.on("zoom-changed", (_event, zoomDirection) => {
    handleZoomChange(_event, zoomDirection, mainWindow.webContents);
  });
};

app.whenReady().then(() => {
  createWindow();
});

app.once("window-all-closed", () => app.quit());

//electron API

//electron-store
const store = new Store({
  /**
   * 設定を保存するファイルのパーミッションを
   * -rw-r--r-- に設定する
   */
  configFileMode: 0o644,
});

ipcMain.handle("electron-store-get-projects", async () => {
  return store.get("projects", initProjects);
});

ipcMain.handle("electron-store-set-projects", async (_event, data) => {
  store.set("projects", data);
  return { status: "success" };
});
