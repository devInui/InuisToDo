import { Menu } from "electron";

function setMenu(mainWindow) {
  // メニューのテンプレート配列を作成
  const template = [
    { role: "fileMenu" },
    {
      role: "editMenu",
      submenu: [
        {
          label: "Undo",
          accelerator: "CmdOrCtrl+Z",
          click: () => {
            mainWindow.webContents.send("renderShortCut-undo");
          },
        },
        {
          label: "Redo",
          accelerator: "CmdOrCtrl+Shift+Z",
          click: () => {
            mainWindow.webContents.send("renderShortCut-redo");
          },
        },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "pasteandmatchstyle" },
        { role: "delete" },
        { role: "selectall" },
      ],
    },
    { role: "viewMenu" },
    { role: "windowMenu" },
    { role: "help" },
  ];

  // macOS では "アプリメニュー" が必要
  if (process.platform === "darwin") template.unshift({ role: "appMenu" });

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

export default setMenu;
