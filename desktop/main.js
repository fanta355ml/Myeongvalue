const path = require('node:path');
const fs = require('node:fs');
const { app, BrowserWindow } = require('electron');

let mainWindow;

const appRoot = path.join(__dirname, 'app');
const configPath = path.join(appRoot, 'desktop-config.json');
const desktopConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));

app.setAppUserModelId(desktopConfig.appId);

function createWindow() {
  const startPage = path.join(appRoot, 'valuation', 'index.html');

  mainWindow = new BrowserWindow({
    width: 1500,
    height: 980,
    minWidth: 1100,
    minHeight: 720,
    show: false,
    title: desktopConfig.windowTitle,
    autoHideMenuBar: true,
    backgroundColor: '#f3f6fb',
    icon: path.join(appRoot, 'assets', desktopConfig.icon),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true
    }
  });

  mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (url !== mainWindow.webContents.getURL()) {
      event.preventDefault();
    }
  });
  mainWindow.once('ready-to-show', () => mainWindow.show());
  mainWindow.on('closed', () => {
    mainWindow = undefined;
  });

  mainWindow.loadFile(startPage);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
