const { readFileSync, existsSync } = require('fs');
const { DOMParser } = require('xmldom');
const path = require('path');
const { createDefaultConfigFile, getConfigPath } = require('./configWriter');

/**
 * Convierte un valor string de XML a su tipo correspondiente
 * @param {string} value - Valor como string
 * @param {string} key - Nombre de la propiedad
 * @returns {any} - Valor convertido al tipo adecuado
 */
function parseValue(value, key) {
    // Para las propiedades booleanas
    if (['exportfile', 'exportapi', 'test'].includes(key)) {
        return value === 'true';
    }

    // Si es una lista separada por comas (excepto empresas que tiene formato especial)
    if (value && value.includes(',') && key !== 'empresas') {
        return value.split(',').filter(Boolean);
    }    // Caso especial para empresas (formato: codigo,ubicacion,procesa;codigo2,ubicacion2,procesa2)
    if (key === 'empresas' && value) {
        try {
            return value.split(';').filter(Boolean).map(empresaStr => {
                const [codigo, ubicacion, procesa] = empresaStr.split(',');
                return {
                    codigo,
                    ubicacion,
                    procesa: procesa === 'True' || procesa === 'true'
                };
            });
        } catch (error) {
            console.error('Error al parsear empresas:', error);
            return [];
        }
    }

    return value;
}

/**
 * Lee y parsea el archivo XML de configuración
 * @param {string} filePath - Ruta al archivo de configuración
 * @returns {Object} - Objeto con la configuración
 */
function readConfig(filePath = getConfigPath()) {
    try {
        // Si el archivo no existe, crear uno con valores por defecto
        if (!existsSync(filePath)) {
            console.log(`El archivo de configuración no existe. Creando uno por defecto en: ${filePath}`);
            createDefaultConfigFile(filePath);
        }

        const xmlContent = readFileSync(filePath, 'utf8');
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');

        // Obtener todos los nodos de configuración y convertirlos a un objeto
        const config = {};
        const configNodes = xmlDoc.getElementsByTagName('configuration')[0].childNodes;

        for (let i = 0; i < configNodes.length; i++) {
            const node = configNodes[i];
            // Ignorar nodos de texto y comentarios
            if (node.nodeType === 1) { // ELEMENT_NODE
                const key = node.nodeName;
                const value = node.textContent;
                config[key] = parseValue(value, key);
            }
        }

        return config;

    } catch (error) {
        console.error('Error al leer la configuración:', error);
        return {};
    }
}

module.exports = { readConfig };
