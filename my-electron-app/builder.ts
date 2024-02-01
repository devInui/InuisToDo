import { build } from "electron-builder";

build({
  config: {
    appId: "com.Electron.ElectronApp",
    productName: "InuisToDo",
    artifactName: "${productName}-${version}-${platform}-${arch}.${ext}",
    files: ["dist/**/*"],
    directories: {
      output: "release",
    },
  },
});
