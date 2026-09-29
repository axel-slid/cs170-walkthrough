const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('study', {
  readProgress: () => ipcRenderer.invoke('progress:read'),
  writeProgress: (data) => ipcRenderer.invoke('progress:write', data),
  onCommand: (handler) => {
    for (const channel of [
      'reveal-next',
      'reveal-all',
      'toggle-key',
      'reset-part',
      'next-part',
      'prev-part',
      'cheatsheet',
      'solution',
      'shop',
      'ink'
    ]) {
      ipcRenderer.on(channel, () => handler(channel));
    }
  }
});
