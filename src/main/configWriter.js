const { writeFileSync, existsSync, mkdirSync } = require('fs');
const path = require('path');
const { app } = require('electron');

/**
 * Genera un documento XML a partir de un objeto de configuración
 * @param {Object} config - Objeto con la configuración a guardar
 * @returns {string} - Documento XML como string
 */
function generateXmlContent(config) {
  let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n<configuration>\n';

  // Función recursiva para manejar valores anidados
  function processValue(value) {
    if (Array.isArray(value)) {
      // Si es un array, lo unimos con comas
      return value.join(',');
    } else if (typeof value === 'object' && value !== null) {
      // Si es un objeto anidado, lo manejamos de forma especial
      if (value.empresas) {
        return processEmpresasData(value.empresas);
      }
      return JSON.stringify(value);
    } else if (typeof value === 'boolean') {
      // Convertir booleanos a "true" o "false" en string
      return value.toString();
    } else {
      // Cualquier otro valor lo convertimos a string
      return value !== undefined && value !== null ? String(value) : '';
    }
  }

  // Procesamiento especial para el formato de empresas
  function processEmpresasData(empresas) {
    if (!Array.isArray(empresas)) return '';

    return empresas.map(empresa => {
      return `${empresa.codigo}|${empresa.ubicacion || ''}|${empresa.procesa ? '1' : '0'}`;
    }).join(';');
  }

  // Agregar cada elemento de configuración como un nodo XML
  for (const [key, value] of Object.entries(config)) {
    const processedValue = processValue(value);
    xmlContent += `  <${key}>${processedValue}</${key}>\n`;
  }

  xmlContent += '</configuration>';
  return xmlContent;
}

/**
 * Crea un archivo XML de configuración por defecto si no existe
 * @param {string} filePath - Ruta donde crear el archivo
 */
function createDefaultConfigFile(filePath) {
  const defaultConfig = {
    erpfolder: '',
    datafolder: '',
    exportfolder: '',
    tempfolder: '',
    empresas: '',
    alicuotapordefecto: '',
    exportfile: 'false',
    exportapi: 'false',
    test: 'true',
    idsuscriptor: '',
    remitentecorreo: 'fuerzadeventa.reporte@gmail.com',
    destinatariocorreo: '',
    destinatariocorreocopia: '',
    destinatariocorreocopiaoculta: '',
    nombreempresa: '',
    // Artículos
    depositostock: '',
    categoria: '',
    grupoartic: '',
    linea: '',
    marca: '',
    tipoartic: '',
    claseartic: '',
    // Clientes
    grupocliente: '',
    tipoingbrutos: '',
    zonaventacliente: '',
    tipocliente: '',
    clasecliente: '',
    listaprecioscliente: ''
  };

  const xmlContent = generateXmlContent(defaultConfig);

  // Asegurarse de que el directorio existe
  const dir = path.dirname(filePath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  writeFileSync(filePath, xmlContent, 'utf8');
}

/**
 * Guarda la configuración en un archivo XML
 * @param {string} filePath - Ruta donde guardar el archivo
 * @param {Object} config - Configuración a guardar
 * @returns {boolean} - True si se guardó correctamente
 */
function saveConfig(filePath, config) {
  try {
    const xmlContent = generateXmlContent(config);

    // Asegurarse de que el directorio existe
    const dir = path.dirname(filePath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    writeFileSync(filePath, xmlContent, 'utf8');
    console.log(`Configuracion guardada exitosamente en: ${filePath}`);
    return true;
  } catch (error) {
    console.error('Error al guardar la configuracion:', error);
    return false;
  }
}

// Exportar funciones
module.exports = {
  saveConfig,
  createDefaultConfigFile,
  // Devuelve la ruta al archivo settings.config
  getConfigPath: () => {
    // Usar directorio de la aplicación en lugar de userData
    const appDir = path.dirname(app.getPath('exe'));
    return path.join(appDir, 'settings.config');
  }
};
