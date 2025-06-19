import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const execAsync = promisify(exec);

let mainWindow: BrowserWindow | null = null;

const createWindow = (): void => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Add a more permissive CSP in development mode to allow webpack-dev-server to work
  if (!app.isPackaged) {
    mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Content-Security-Policy': [
            "default-src 'self';", 
            "script-src 'self' 'unsafe-eval' 'unsafe-inline';", 
            "style-src 'self' 'unsafe-inline';", 
            "img-src 'self' data:;",
            "connect-src 'self' ws: wss:;"
          ],
        },
      });
    });
  }

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools in development mode
  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Execute code in the specified language
ipcMain.handle('execute-code', async (_, code: string, language: string) => {
  try {
    let result;
    
    switch (language) {
      case 'php':
        // Execute PHP code
        const tempFilePath = path.join(app.getPath('temp'), 'tinkers_temp.php');
        fs.writeFileSync(tempFilePath, `<?php\n${code}\n`);
        result = await execAsync(`php "${tempFilePath}"`);
        fs.unlinkSync(tempFilePath);
        break;
      
      case 'javascript':
        // Execute JavaScript code using Node.js
        const jsFilePath = path.join(app.getPath('temp'), 'tinkers_temp.js');
        fs.writeFileSync(jsFilePath, code);
        result = await execAsync(`node "${jsFilePath}"`);
        fs.unlinkSync(jsFilePath);
        break;
      
      default:
        throw new Error(`Unsupported language: ${language}`);
    }
    
    return {
      success: true,
      stdout: result.stdout,
      stderr: result.stderr
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      stderr: error.stderr || ''
    };
  }
});
