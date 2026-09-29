const { app, BrowserWindow, ipcMain, Menu, nativeTheme, dialog, shell } = require('electron');
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

// Renders a finished test (HTML built by the page) to a PDF and asks where to save it.
async function exportPDF(event, html, name) {
  const tmp = path.join(app.getPath('temp'), `cs170-test-${Date.now()}.html`);
  await fs.writeFile(tmp, html);
  const win = new BrowserWindow({ show: false, width: 900, height: 1200, webPreferences: { contextIsolation: true } });
  try {
    await win.loadFile(tmp);
    await new Promise((r) => setTimeout(r, 400)); // let images and fonts settle
    const pdf = await win.webContents.printToPDF({
      pageSize: 'Letter',
      printBackground: true,
      margins: { top: 0.55, bottom: 0.55, left: 0.6, right: 0.6 }
    });
    const parent = BrowserWindow.fromWebContents(event.sender);
    const { canceled, filePath } = await dialog.showSaveDialog(parent, {
      defaultPath: path.join(app.getPath('downloads'), name),
      filters: [{ name: 'PDF', extensions: ['pdf'] }]
    });
    if (canceled || !filePath) return { ok: false };
    await fs.writeFile(filePath, pdf);
    shell.showItemInFolder(filePath);
    return { ok: true, path: filePath };
  } finally {
    win.destroy();
    fs.unlink(tmp).catch(() => {});
  }
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
  ipcMain.handle('pdf:export', (event, html, name) => exportPDF(event, html, name));
  ipcMain.handle('theme:set', (_event, theme) => {
    nativeTheme.themeSource = ['light', 'dark'].includes(theme) ? theme : 'system';
  });

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
        { label: 'Shop', accelerator: 'CmdOrCtrl+Shift+S', click: send('shop') },
        { label: 'Ink Palette', accelerator: 'CmdOrCtrl+Shift+I', click: send('ink') },
        { label: 'No-Hints Mode', accelerator: 'CmdOrCtrl+Shift+H', click: send('hints') },
        { label: 'Toggle Sidebar', accelerator: 'CmdOrCtrl+\\', click: send('sidebar') },
        { label: 'Test Mode', accelerator: 'CmdOrCtrl+Shift+T', click: send('test') },
        { type: 'separator' },
        { label: 'Settings…', accelerator: 'CmdOrCtrl+,', click: send('settings') }
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
