const { app, BrowserWindow } = require("electron");
const path = require("path");
const { exec } = require("child_process");

let mainWindow;
let backendProcess;

async function createWindow() {
  mainWindow = new BrowserWindow({
    title: "Sistema Tienda",
    width: 800,
    height: 600,
    frame: true,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  const isDev = (await import("electron-is-dev")).default;

  if (!isDev) {
    startBackend();
  }

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.setMenu(null);
  mainWindow.maximize();
  mainWindow.on("closed", () => {
    mainWindow = null;
    if (backendProcess) {
      backendProcess.kill();
    }
  });
}

function startBackend() {
  const backendPath = path.join(__dirname, "../backend/index.js");

  backendProcess = exec(`node ${backendPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error iniciando el backend: ${error.message}`);
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }
    console.log(`stdout: ${stdout}`);
  });

  backendProcess.stdout.on("data", (data) => {
    console.log(`Backend: ${data}`);
  });
}

app.on("ready", createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
