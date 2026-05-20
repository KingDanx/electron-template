import { app, BrowserWindow, ipcMain, dialog } from "electron";
import isInstall from "electron-squirrel-startup";
import fs from "fs/promises";
import path from "node:path";
import isDev from "electron-is-dev";
import LiteLogger from "@kingdanx/litelogger";

import type { IpcMainInvokeEvent } from "electron";

process.on("uncaughtException", (error) => {
  console.error("Unhandled Exception:", error);
  dialog.showErrorBox(
    "Unhandled Exception",
    `An error occurred: ${error.message}`,
  );
});

const logger = new LiteLogger(getResourcePath(), "log", "logs", 14);

let window: BrowserWindow | undefined;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (isInstall) {
  app.quit();
}

console.log(path.join(import.meta.dirname, "preload.ts"));

function createWindow(): BrowserWindow {
  const preload = isDev ? "preload.js" : "preload.bundle.js";
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: isDev,
    webPreferences: {
      contextIsolation: true,
      webSecurity: !isDev,
      preload: path.join(import.meta.dirname, preload),
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

  return mainWindow;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  window = createWindow();
  purgeTemp();
  initListeners();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      window = createWindow();
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

function getResourcePath(resourceRelativePath?: string | undefined) {
  if (isDev) {
    if (resourceRelativePath) {
      return path.join(import.meta.dirname, resourceRelativePath);
    }
    return import.meta.dirname;
  }
  if (resourceRelativePath) {
    return path.join(process.resourcesPath, resourceRelativePath);
  }
  return process.resourcesPath;
}

async function purgeTemp() {
  try {
    const TEMP_PATH = getResourcePath(path.join("temp"));
    const files = await fs.readdir(TEMP_PATH);

    for (const file of files) {
      const filePath = path.join(TEMP_PATH, file);
      await fs.unlink(filePath);
    }
  } catch (e: any) {
    logger.error(`Purge temp error: ${e.toString()}`);
  }
}

function count(_: IpcMainInvokeEvent, number: number): number {
  return number++;
}

function initListeners() {
  ipcMain.handle("count", count);

  ipcMain.on("minimize-window", () => window && window.minimize());
  ipcMain.on("maximize-window", () => {
    if (window && window.isMaximized()) {
      window.unmaximize();
    } else if (window) {
      window.maximize();
    }
  });
  ipcMain.on("close-window", () => window && window.close());
}
