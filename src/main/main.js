const { app, BrowserWindow } = require('electron');
const { ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

// Importar funciones necesarias
const { getConfigPath, saveConfig } = require('./configWriter');

// Importar los handlers
require('./ipcHandlers');

let mainWindow;

// Crear la ventana principal
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 750,
    webPreferences: {
      preload: path.join(__dirname, '../renderer/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, '../public/index.html'));

  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }
}
// Inicialización principal
app.whenReady().then(() => {
  try {
    // Intentar crear y guardar la configuración
    const configPath = getConfigPath();
    if (!fs.existsSync(configPath)) {
      const defaultConfig = {
        erpfolder: '',
        datafolder: '',
        exportfolder: '',
        tempfolder: '',
        empresas: '',
        alicuotapordefecto: '',
        exportfile: false,
        exportapi: false,
        test: true
      };
      saveConfig(configPath, defaultConfig);
    }
  } catch (err) {
    console.error('Error al crear configuración:', err);
  }

  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Manejador para cerrar la aplicación
ipcMain.handle('close-app', () => {
  app.quit();
});