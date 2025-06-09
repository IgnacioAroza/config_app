const { writeFileSync, existsSync, mkdirSync } = require('fs');
const path = require('path');
const { app } = require('electron');

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
    remitentecorreo: 'fuerzadeventa.reporte@gmail.com',
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
    // Verificar que tenemos todos los campos necesarios

    const xmlContent = generateXmlContent(config);

    // Para debug - comprobar si el XML contiene la etiqueta empresas
    if (!xmlContent.includes('<empresas>') && config.empresas) {
      console.error('Advertencia: La configuración XML no contiene la etiqueta <empresas> aunque existe en el objeto config');
    }

    writeFileSync(filePath, xmlContent, 'utf8');
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
    // Comprobar si estamos en desarrollo o producción
    const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

    if (isDev) {
      // En desarrollo, usar el directorio del proyecto
      return path.join(process.cwd(), 'settings.config');
    } else {
      // En producción, usar el directorio de la aplicación
      const appDir = path.dirname(app.getPath('exe'));
      return path.join(appDir, 'settings.config');
    }
  }
};
