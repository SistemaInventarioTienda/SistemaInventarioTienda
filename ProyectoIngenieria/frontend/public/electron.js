const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');

async function createWindow() {
  mainWindow = new BrowserWindow({
    title: 'Sistema tienda',
    width: 800, // Ajusta el ancho y alto
    height: 600,
    frame: true, // Elimina el marco por defecto
    show: false, // La ventana no se muestra inicialmente
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // Necesario para usar ipcMain si lo implementas
    },
  });

  const isDev = (await import('electron-is-dev')).default;
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show(); // Muestra la ventana después de cargar el contenido
  });

  mainWindow.setMenu(null);
  // mainWindow.setFullScreen(true);
  mainWindow.maximize();
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', () => {
  createWindow();
});

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
