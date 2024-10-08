const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');

let mainWindow;
async function createWindow() {

  const screenSize = getScreenSize();
  console.log(`Tamaño total de la pantalla: ${screenSize.width}x${screenSize.height}`);
  mainWindow = new BrowserWindow({
    width: screenSize.width,
    height: screenSize.height,
    fullscreen: false,
    icon: path.join(__dirname, './test.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  const isDev = (await import('electron-is-dev')).default;
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.setResizable(true);
  mainWindow.on('closed', () => mainWindow = null);

  //No queremos ver el menu que trae por defecto
  const Menu = electron.Menu;
  Menu.setApplicationMenu(null);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

function getScreenSize() {
  const screen = electron.screen;
  var { width, height } = screen.getPrimaryDisplay().workAreaSize;
  width = width + 350;
  height = height + 264;
  return { width, height };
}