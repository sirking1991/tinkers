import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('api', {
  executeCode: (code: string, language: string) => {
    return ipcRenderer.invoke('execute-code', code, language);
  }
});
