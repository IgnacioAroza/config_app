const path = require('path');
const { contextBridge, ipcRenderer } = require('electron');
const { get } = require('http');

contextBridge.exposeInMainWorld('electron', {
  send: (channel, data) => ipcRenderer.send(channel, data),
  receive: (channel, callback) => ipcRenderer.on(channel, (_, data) => callback(data)),
  invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
  joinPath: (...args) => path.join(...args), // Exponer path.join
  // Articulos
  getDepositos: (dataFolder) => ipcRenderer.invoke('get-depositos', dataFolder),
  getGrupoArtic: (dataFolder) => ipcRenderer.invoke('get-grupoartic', dataFolder),
  getClaseArtic: (dataFolder) => ipcRenderer.invoke('get-claseartic', dataFolder),
  getLineas: (dataFolder) => ipcRenderer.invoke('get-lineas', dataFolder),
  getMarcas: (dataFolder) => ipcRenderer.invoke('get-marcas', dataFolder),
  getTiposArtic: (dataFolder) => ipcRenderer.invoke('get-tipoartic', dataFolder),
  // Clientes
  getZonas: (dataFolder) => ipcRenderer.invoke('get-zonas', dataFolder),
  getListaPrecios: (dataFolder) => ipcRenderer.invoke('get-listaprecios', dataFolder),
  getGrupoCliente: (dataFolder) => ipcRenderer.invoke('get-grupclientes', dataFolder),
  getTipoCliente: (dataFolder) => ipcRenderer.invoke('get-tipoclientes', dataFolder),
  getClaseCliente: (dataFolder) => ipcRenderer.invoke('get-claseclientes', dataFolder),
  // Empresas
  getEmpresas: (dataFolder) => ipcRenderer.invoke('get-empresas', dataFolder),
  // Configuración XML
  loadConfig: () => ipcRenderer.invoke('load-config'),
  saveConfig: (config) => {
    return ipcRenderer.invoke('save-config', config);
  },
  getAppPath: () => app.getPath('exe'),
  closeApp: () => ipcRenderer.invoke('close-app'),
});