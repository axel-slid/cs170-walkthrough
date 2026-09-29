const { app, BrowserWindow, ipcMain, Menu, nativeTheme } = require('electron');
const path = require('node:path');
const fs = require('node:fs/promises');

const progressFile = () => path.join(app.getPath('userData'), 'progress.json');

async function readProgress() {
  try {
    return JSON.parse(await fs.readFile(progressFile(), 'utf8'));
  } catch {
    return {};
  }
}

async function writeProgress(data) {
  await fs.writeFile(progressFile(), JSON.stringify(data, null, 2));
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1240,
    height: 880,
    minWidth: 900,
    minHeight: 560,
    titleBarStyle: 'hiddenInset',
    backgroundColor: nativeTheme.shouldUseDarkColors ? '#1e1e20' : '#ffffff',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));
  return win;
}

app.whenReady().then(() => {
  ipcMain.handle('progress:read', readProgress);
  ipcMain.handle('progress:write', (_event, data) => writeProgress(data));

  const template = [
    ...(process.platform === 'darwin' ? [{ role: 'appMenu' }] : []),
    {
      label: 'Study',
      submenu: [
        // Return is handled in the page so it can still type newlines in note boxes.
        { label: 'Show Next Step', accelerator: 'Return', registerAccelerator: false, click: send('reveal-next') },
        { label: 'Show Everything', accelerator: 'Shift+Return', registerAccelerator: false, click: send('reveal-all') },
        { type: 'separator' },
        { label: 'Show Answer', accelerator: 'CmdOrCtrl+K', click: send('toggle-key') },
        { label: 'Staff Solution', accelerator: 'CmdOrCtrl+J', click: send('solution') },
        { label: 'Start This Part Over', accelerator: 'CmdOrCtrl+Backspace', click: send('reset-part') },
        { type: 'separator' },
        { label: 'Next Part', accelerator: 'CmdOrCtrl+]', click: send('next-part') },
        { label: 'Previous Part', accelerator: 'CmdOrCtrl+[', click: send('prev-part') },
        { label: 'Cheat Sheet', accelerator: 'CmdOrCtrl+L', click: send('cheatsheet') },
        { label: 'Shop', accelerator: 'CmdOrCtrl+Shift+S', click: send('shop') },
        { label: 'Ink Palette', accelerator: 'CmdOrCtrl+Shift+I', click: send('ink') }
      ]
    },
    { role: 'editMenu' },
    { role: 'viewMenu' },
    { role: 'windowMenu' }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

function send(channel) {
  return (_item, win) => win && win.webContents.send(channel);
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
