const { ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const {
  // Alicuotas
  getAlicuotasFromDBF,
  // Articulos
  getDepositosFromDBF,
  getGrupArticFromDBF,
  getClaseArticFromDBF,
  getLineasFromDBF,
  getMarcasFromDBF,
  getTiposArticFromDBF,
  // Clientes
  getGrupClienteFromDBF,
  getTipoClienteFromDBF,
  getClaseClienteFromDBF,
  getZonasFromDBF,
  getListaPreciosFromDBF,
  // Empresas
  getEmpresas
} = require('./db');

ipcMain.handle('select-erp-folder', async () => {
  const result = await dialog.showOpenDialog({ properties: ['openDirectory'] });
  return result.filePaths[0]; // Devuelve la carpeta seleccionada
});

ipcMain.handle('select-export-folder', async () => {
  const result = await dialog.showOpenDialog({ properties: ['openDirectory'] });
  return result.filePaths[0]; // Devuelve la carpeta seleccionada
});

ipcMain.handle('get-data-folder', (event, erpFolder) => {
  return path.join(erpFolder, 'Data'); // Devuelve la ruta de la carpeta Data
});

ipcMain.handle('get-alicuotas', async (event, dataFolder) => {
  const dbfPath = path.join(dataFolder, 'ALIC.DBF');
  try {
    const alicuotas = await getAlicuotasFromDBF(dbfPath);
    return alicuotas;
  } catch (error) {
    console.error('Error al leer ALIC.DBF:', error);
    return [];
  }
});

// ARTICULOS
ipcMain.handle('get-depositos', async (event, dataFolder) => {
  const dbfPath = path.join(dataFolder, 'DEPOSITO.DBF');
  try {
    const depositos = await getDepositosFromDBF(dbfPath);
    return depositos;
  } catch (error) {
    console.error('[get-depositos] Error:', error);
    return [];
  }
});

ipcMain.handle('get-grupoartic', async (event, dataFolder) => {
  const dbfPath = path.join(dataFolder, 'GARTIC.DBF');
  try {
    const grupos = await getGrupArticFromDBF(dbfPath);
    return grupos;
  } catch (error) {
    console.error('[get-grupoartic] Error:', error);
    return [];
  }
});

ipcMain.handle('get-claseartic', async (event, dataFolder) => {
  const dbfPath = path.join(dataFolder, 'CLASEART.DBF');
  try {
    const clase = await getClaseArticFromDBF(dbfPath);
    return clase;
  } catch (error) {
    console.error('[get-claseartic] Error:', error);
    return [];
  }
});

ipcMain.handle('get-lineas', async (event, dataFolder) => {
  const dbfPath = path.join(dataFolder, 'LINEAS.DBF');
  try {
    const lineas = await getLineasFromDBF(dbfPath);
    return lineas;
  } catch (error) {
    console.error('[get-lineas] Error:', error);
    return [];
  }
});

ipcMain.handle('get-marcas', async (event, dataFolder) => {
  const dbfPath = path.join(dataFolder, 'MARCAS.DBF');
  try {
    const marcas = await getMarcasFromDBF(dbfPath);
    return marcas;
  } catch (error) {
    console.error('[get-marcas] Error:', error);
    return [];
  }
});

ipcMain.handle('get-tipoartic', async (event, dataFolder) => {
  const dbfPath = path.join(dataFolder, 'TARTIC.DBF');
  try {
    const depositos = await getDepositosFromDBF(dbfPath);
    return depositos;
  } catch (error) {
    console.error('[get-depositos] Error:', error);
    return [];
  }
});

// CLIENTES
ipcMain.handle('get-grupclientes', async (event, dataFolder) => {
  const dbfPath = path.join(dataFolder, 'GCLIENT.DBF');
  try {
    const grupoClient = await getGrupClienteFromDBF(dbfPath);
    return grupoClient;
  } catch (error) {
    console.error('[get-grupclientes] Error:', error);
    return [];
  }
});

ipcMain.handle('get-tipoclientes', async (event, dataFolder) => {
  const dbfPath = path.join(dataFolder, 'GCLIENT.DBF');
  try {
    const tipoCliente = await getTipoClienteFromDBF(dbfPath);
    return tipoCliente;
  } catch (error) {
    console.error('[get-tipoclientes] Error:', error);
    return [];
  }
});

ipcMain.handle('get-claseclientes', async (event, dataFolder) => {
  const dbfPath = path.join(dataFolder, 'CCLIENT.DBF');
  try {
    const claseCliente = await getClaseClienteFromDBF(dbfPath);
    return claseCliente;
  } catch (error) {
    console.error('[get-claseclientes] Error:', error);
    return [];
  }
});

ipcMain.handle('get-zonas', async (event, dataFolder) => {
  const dbfPath = path.join(dataFolder, 'ZONAS.DBF');
  try {
    const zonas = await getZonasFromDBF(dbfPath);
    return zonas;
  } catch (error) {
    console.error('[get-zonas] Error:', error);
    return [];
  }
});

ipcMain.handle('get-listaprecios', async (event, dataFolder) => {
  const dbfPath = path.join(dataFolder, 'LISTAS.DBF');
  try {
    const listaprecios = await getListaPreciosFromDBF(dbfPath);
    return listaprecios;
  } catch (error) {
    console.error('[get-listaprecios] Error:', error);
    return [];
  }
});

// EMPRESAS
ipcMain.handle('get-empresas', async (event, dataFolder) => {
  if (!dataFolder) {
    console.error('[get-empresas] No data folder provided');
    return [];
  }
  const dbfPath = path.join(dataFolder, 'EMPRESAS.DBF');
  try {
    const empresas = await getEmpresas(dbfPath);
    return empresas;
  } catch (error) {
    console.error('[get-empresas] Error:', error);
    return [];
  }
});

// Check if a folder exists
ipcMain.handle('check-folder-exists', async (event, folderPath) => {
  try {
    return fs.existsSync(folderPath);
  } catch (error) {
    console.error('[check-folder-exists] Error:', error);
    return false;
  }
});

// Check if a file exists (para validar .DBC)
ipcMain.handle('check-file-exists', async (event, filePath) => {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    console.error('[check-file-exists] Error:', error);
    return false;
  }
});

// Verificar permisos de escritura en una carpeta
ipcMain.handle('check-folder-permissions', async (event, folderPath) => {
  try {
    // Crear un archivo temporal para verificar permisos
    const testFilePath = path.join(folderPath, `.test_permissions_${Date.now()}.tmp`);

    // Intentar escribir en el archivo
    fs.writeFileSync(testFilePath, 'test');

    // Si llegamos aquí, la escritura fue exitosa, ahora eliminar el archivo
    fs.unlinkSync(testFilePath);

    return true;
  } catch (error) {
    console.error('[check-folder-permissions] Error:', error);
    return false;
  }
});

// Configuración de empresas: persistencia en JSON simple en la carpeta de usuario
const empresasConfigPath = path.join(process.env.APPDATA || process.env.HOME || __dirname, 'empresas-config.json');

ipcMain.handle('get-empresas-config', async () => {
  try {
    if (fs.existsSync(empresasConfigPath)) {
      const data = fs.readFileSync(empresasConfigPath, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('[get-empresas-config] Error:', error);
    return [];
  }
});

ipcMain.handle('save-empresas-config', async (event, empresasConfig) => {
  try {
    fs.writeFileSync(empresasConfigPath, JSON.stringify(empresasConfig, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('[save-empresas-config] Error:', error);
    return false;
  }
});

ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog({ properties: ['openDirectory'] });
  return result.filePaths[0] || null;
});

// Módulos para manejar el archivo de configuración XML
const { saveConfig, getConfigPath } = require('./configWriter');
const { readConfig } = require('./configReader');

// Cargar configuración desde XML
ipcMain.handle('load-config', async () => {
  try {
    const configPath = getConfigPath();
    const config = readConfig(configPath);
    return config;
  } catch (error) {
    console.error('[load-config] Error:', error);
    return {};
  }
});

// Guardar configuración en XML
ipcMain.handle('save-config', async (event, config) => {
  try {
    const configPath = getConfigPath();
    const success = saveConfig(configPath, config);
    return { success, path: configPath };
  } catch (error) {
    console.error('[save-config] Error:', error);
    return { success: false, error: error.message };
  }
});