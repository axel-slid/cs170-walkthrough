const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('study', {
  readProgress: () => ipcRenderer.invoke('progress:read'),
  writeProgress: (data) => ipcRenderer.invoke('progress:write', data),
  exportPDF: (html, name) => ipcRenderer.invoke('pdf:export', html, name),
  setTheme: (theme) => ipcRenderer.invoke('theme:set', theme),
  onCommand: (handler) => {
    for (const channel of [
      'reveal-next',
      'reveal-all',
      'toggle-key',
      'reset-part',
      'next-part',
      'prev-part',
      'solution',
      'shop',
      'ink',
      'hints',
      'sidebar',
      'test',
      'settings'
    ]) {
      ipcRenderer.on(channel, () => handler(channel));
    }
  }
});
