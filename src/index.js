import { app, BrowserWindow, ipcMain, dialog } from "electron";
import isInstall from "electron-squirrel-startup";
import fs from "fs/promises";
import path from "node:path";
import isDev from "electron-is-dev";
import LiteLogger from "@kingdanx/litelogger";

process.on("uncaughtException", (error) => {
  console.error("Unhandled Exception:", error);
  dialog.showErrorBox(
    "Unhandled Exception",
    `An error occurred: ${error.message}`
  );
});

const logger = new LiteLogger(getResourcePath(), "log", "logs", 14);

let window;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (isInstall) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: isDev,
    webPreferences: {
      contextIsolation: true,
      webSecurity: !isDev,
      preload: path.join(import.meta.dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  mainWindow.removeMenu();
  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    mainWindow.loadFile("src/frontend/dist/index.html");
  }

  // Open the DevTools.
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  window = mainWindow;
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
  initListeners();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

function getResourcePath(resourceRelativePath = null) {
  if (isDev) {
    if (resourceRelativePath) {
      return path.join(import.meta.dirname, resourceRelativePath);
    } else {
      return import.meta.dirname;
    }
  }
  if (resourceRelativePath) {
    return path.join(process.resourcesPath, resourceRelativePath);
  } else {
    return process.resourcesPath;
  }
}

async function purgeTemp() {
  try {
    const files = await fs.readdir(TEMP_PATH);

    for (const file of files) {
      const filePath = path.join(TEMP_PATH, file);
      await fs.unlink(filePath);
    }
  } catch (e) {
    logger.error(`Purge temp error: ${e.toString()}`);
  }
}

function count(event, { number }) {
  console.log("index.js count: ", number);
  window.webContents.send("count", {
    success: true,
    data: { number },
  });
}

function initListeners() {
  ipcMain.on("count", count);

  ipcMain.on("minimize-window", () => window.minimize());
  ipcMain.on("maximize-window", () => {
    if (window.isMaximized()) {
      window.unmaximize();
    } else {
      window.maximize();
    }
  });
  ipcMain.on("close-window", () => window.close());
}
