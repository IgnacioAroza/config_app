const { writeFileSync, existsSync, mkdirSync } = require('fs');
const path = require('path');
const { app } = require('electron');
const fs = require('fs');

/**
 * Genera un documento XML a partir de un objeto de configuración
 * @param {Object} config - Objeto con la configuración a guardar
 * @returns {string} - Documento XML como string
 */
function generateXmlContent(config) {
  // Orden específico de los elementos (siguiendo el formato original)
  const orderOfElements = [
    'erpfolder',
    'datafolder',
    'exportfolder',
    'tempfolder',
    'empresas',
    'alicuotapordefecto',
    'exportfile',
    'exportapi',
    'test',
    'idsuscriptor',
    // Comentario sobre correos aquí
    'remitentecorreo',
    'destinatariocorreo',
    'destinatariocorreocopia',
    'destinatariocorreoculta',
    'nombreempresa',
    // Comentario sobre campos de filtros aquí
    'depositostock',
    'categoria',
    'grupoartic',
    'linea',
    'marca',
    'tipoartic',
    'claseartic',
    // Comentario sobre clientes aquí
    'grupocliente',
    'tipoingbrutos',
    'zonaventacliente',
    'tipocliente',
    'clasecliente',
    'listaprecioscliente'
  ];

  // Iniciar el contenido XML
  let xmlContent = '<?xml version="1.0" encoding="utf-8"?>\n<configuration>\n';

  // Función para procesar valores
  function processValue(value, key) {
    if (value === null || value === undefined) {
      return '';
    } else if (key === 'empresas' && Array.isArray(value)) {
      // Si empresas es un array, formatearlo correctamente
      return value.map(e => `${e.codigo},${e.ubicacion},${e.procesa ? 'True' : 'False'}`).join(';');
    } else if (Array.isArray(value)) {
      // Para otros arrays (checkboxes seleccionados), convertirlos a strings separados por comas
      return value.join(',');
    } else if (typeof value === 'boolean') {
      return value.toString().toLowerCase();
    } else {
      return value.toString();
    }
  }

  // Agregar elementos en el orden especificado
  for (const key of orderOfElements) {
    // Agregar comentarios en posiciones específicas
    if (key === 'remitentecorreo') {
      xmlContent += '  <!-- Datos para envío de correos: (para más de un destinatario en el mismo campo, separar direcciones con coma) -->\n';
    } else if (key === 'depositostock') {
      xmlContent += '  <!-- Campos de filtros (ingresar valores numéricos). Forma de ingreso: -->\n';
      xmlContent += '  <!-- Campo vacío: busca todos los datos -->\n';
      xmlContent += '  <!-- Campo con un solo valor: Ej: 1 -->\n';
      xmlContent += '  <!-- Campo con más de un valor, separarlos con comas. Ej: 1,2,3 -->\n';
      xmlContent += '  <!-- Artículos: -->\n';
    } else if (key === 'grupocliente') {
      xmlContent += '  <!-- Clientes: -->\n';
    }

    // Agregar el elemento si existe en la configuración
    if (key in config) {
      const value = processValue(config[key], key);
      xmlContent += `  <${key}>${value}</${key}>\n`;
    } else {
      // Si no existe, agregar elemento vacío
      xmlContent += `  <${key}></${key}>\n`;
    }
  }

  // Cerrar el elemento de configuración
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
    remitentecorreo: '',
    destinatariocorreo: '',
    destinatariocorreocopia: '',
    destinatariocorreoculta: '',
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

  try {
    writeFileSync(filePath, xmlContent, 'utf8');
    console.log('Archivo de configuración creado exitosamente en:', filePath);
  } catch (error) {
    console.error('Error al crear el archivo de configuración:', error);
    // Si falla, intentar crear en el directorio de datos de usuario
    const userDataPath = app.getPath('userData');
    const alternativePath = path.join(userDataPath, 'settings.config');
    console.log('Intentando crear en ubicación alternativa:', alternativePath);
    writeFileSync(alternativePath, xmlContent, 'utf8');
  }
}

/**
 * Guarda la configuración en un archivo XML
 * @param {string} filePath - Ruta donde guardar el archivo
 * @param {Object} config - Configuración a guardar
 * @returns {boolean} - True si se guardó correctamente
 */
function saveConfig(filePath, config) {
  try {
    // Generar el contenido XML
    const xmlContent = generateXmlContent(config);

    // Detección explícita de si estamos en desarrollo o producción
    const isDevMode = !app.isPackaged;

    // Determinar la ruta correcta donde guardar
    let configPath = filePath;

    // Si no se proporciona una ruta específica, usar la ruta predeterminada
    if (!configPath) {
      const exePath = app.getPath('exe');
      const appDir = path.dirname(exePath);

      if (isDevMode) {
        // En modo desarrollo, usar una ubicación fija conocida
        configPath = path.join(app.getPath('userData'), 'settings.config');
      } else {
        // En modo producción, usar la carpeta del ejecutable
        configPath = path.join(appDir, 'settings.config');
      }
    }

    // Asegurar que el directorio existe
    const dir = path.dirname(configPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Guardar el archivo
    fs.writeFileSync(configPath, xmlContent, 'utf8');

    return true;
  } catch (error) {
    console.error('Error al guardar la configuración:', error);

    // Intentar guardar en una ubicación alternativa
    try {
      const xmlContent = generateXmlContent(config);
      const userDataPath = app.getPath('userData');
      const alternativePath = path.join(userDataPath, 'settings.config');

      fs.writeFileSync(alternativePath, xmlContent, 'utf8');
      return true;
    } catch (fallbackError) {
      return false;
    }
  }
}

function getConfigPath() {
  let originalExePath = '';

  if (process.platform === 'win32') {
    // PORTABLE_EXECUTABLE_FILE contiene la ruta al archivo .exe original
    if (process.env.PORTABLE_EXECUTABLE_FILE) {
      originalExePath = process.env.PORTABLE_EXECUTABLE_FILE;
    } else {
      // Si la variable no está disponible, intentar con process.execPath
      originalExePath = process.execPath;
    }
  } else {
    // Para otros sistemas operativos
    originalExePath = process.execPath;
  }

  // Obtener el directorio del ejecutable original
  const originalDir = path.dirname(originalExePath);

  // Usar esta ubicación para la configuración
  const configPath = path.join(originalDir, 'settings.config');

  return configPath;
}

// Exportar funciones
module.exports = {
  saveConfig,
  createDefaultConfigFile,
  getConfigPath
};
