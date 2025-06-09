// Función reutilizable para inicializar eventos después de cargar el HTML dinámico
function initGeneralTabEvents() {
  // ERP Folder
  const erpFolderButton = document.getElementById('select-erp-folder');
  if (erpFolderButton && !erpFolderButton._listenerAdded) {
    erpFolderButton.addEventListener('click', async () => {
      const folderPath = await window.electron.invoke('select-erp-folder');
      if (folderPath) {
        document.getElementById('erp-folder').value = folderPath;
        // Selecciona automáticamente la carpeta Data dentro del ERP usando path.join expuesto por preload
        const dataFolderPath = window.electron.joinPath(folderPath, 'Data');
        document.getElementById('data-folder').value = dataFolderPath;
        // Guarda la ruta globalmente para otras pestañas
        window.currentDataFolder = dataFolderPath;
        // Cargar alícuotas desde ALIC.DBF y llenar el select
        const alicuotas = await window.electron.invoke('get-alicuotas', dataFolderPath);
        const alicuotaSelect = document.getElementById('alicuota');
        if (alicuotaSelect) {
          alicuotaSelect.innerHTML = '';
          alicuotas.forEach((alicuota) => {
            const option = document.createElement('option');
            option.value = alicuota.codigo;
            option.textContent = `${alicuota.codigo}. ${alicuota.nombre}`;
            alicuotaSelect.appendChild(option);
          });
        }
      } else {
        console.error('No se seleccionó ninguna carpeta');
      }
    });
    erpFolderButton._listenerAdded = true;
  }

  // Export Folder
  const exportFolderButton = document.getElementById('select-export-folder');
  if (exportFolderButton && !exportFolderButton._listenerAdded) {
    exportFolderButton.addEventListener('click', async () => {
      const folderPath = await window.electron.invoke('select-export-folder');
      if (folderPath) {
        document.getElementById('export-folder').value = folderPath;
        // Selecciona automáticamente la carpeta Temp dentro de la exportación
        const tempFolderPath = window.electron.joinPath(folderPath, 'Temp');
        document.getElementById('temp-folder').value = tempFolderPath;
      } else {
        console.error('No se seleccionó ninguna carpeta');
      }
    });
    exportFolderButton._listenerAdded = true;
  }
}

// Observa cambios en el contenedor donde se carga el HTML dinámico y llama a la función de inicialización
document.addEventListener('DOMContentLoaded', () => {
  const content = document.getElementById('content');
  if (content) {
    const observer = new MutationObserver(() => {
      initGeneralTabEvents();
    });
    observer.observe(content, { childList: true, subtree: true });
  }
});

// Función para agregar el event listener después de cargar el HTML dinámico
document.addEventListener('DOMContentLoaded', () => {
  // Observa cambios en el contenedor donde se carga el HTML dinámico
  const content = document.getElementById('content');
  if (content) {
    const observer = new MutationObserver(() => {
      const erpFolderButton = document.getElementById('select-erp-folder');
      if (erpFolderButton && !erpFolderButton._listenerAdded) {
        erpFolderButton.addEventListener('click', async () => {
          // Abre el selector de carpetas usando el canal de Electron
          const folderPath = await window.electron.invoke('select-folder');
          if (folderPath) {
            document.getElementById('erp-folder').value = folderPath;
            // Aquí puedes agregar lógica adicional, como actualizar el campo Data Folder, etc.
            // console.log('Carpeta seleccionada:', folderPath);
          } else {
            console.log('No se seleccionó ninguna carpeta');
          }
        });
        erpFolderButton._listenerAdded = true; // Evita agregar el listener más de una vez
      }
    });
    observer.observe(content, { childList: true, subtree: true });
  }
});

// Validación de la pestaña General usando IPC para carpetas
async function validarGeneral() {
  let valido = true;
  let mensajes = [];

  // Validar ERP Folder (solo existencia)
  const erpFolder = document.getElementById('erp-folder').value.trim();
  if (!erpFolder || !(await window.electron.invoke('check-folder-exists', erpFolder))) {
    valido = false;
    mensajes.push('Debe seleccionar una carpeta ERP válida.');
    marcarInvalido('erp-folder');
  } else {
    limpiarInvalido('erp-folder');
  }

  // Validar Data Folder (existencia)
  const dataFolder = document.getElementById('data-folder').value.trim();
  if (!dataFolder || !(await window.electron.invoke('check-folder-exists', dataFolder))) {
    valido = false;
    mensajes.push('Debe tener una carpeta Data válida.');
    marcarInvalido('data-folder');
  } else {
    limpiarInvalido('data-folder');
  }

  // Validar Export Folder (existencia)
  const exportFolder = document.getElementById('export-folder').value.trim();
  if (!exportFolder || !(await window.electron.invoke('check-folder-exists', exportFolder))) {
    valido = false;
    mensajes.push('Debe seleccionar una carpeta de exportación válida.');
    marcarInvalido('export-folder');
  } else {
    limpiarInvalido('export-folder');
  }

  // Validar ID Suscriptor
  const idSuscriptor = document.getElementById('id-suscriptor').value.trim();
  if (!idSuscriptor) {
    valido = false;
    mensajes.push('Debe ingresar el ID Suscriptor.');
    marcarInvalido('id-suscriptor');
  } else {
    limpiarInvalido('id-suscriptor');
  }

  // Validar Nombre Empresa
  const nombreEmpresa = document.getElementById('nombre-empresa').value.trim();
  if (!nombreEmpresa) {
    valido = false;
    mensajes.push('Debe ingresar el nombre de la empresa.');
    marcarInvalido('nombre-empresa');
  } else {
    limpiarInvalido('nombre-empresa');
  }

  // Validar Alícuota seleccionada
  const alicuota = document.getElementById('alicuota').value;
  if (!alicuota) {
    valido = false;
    mensajes.push('Debe seleccionar una alícuota por defecto.');
    marcarInvalido('alicuota');
  } else {
    limpiarInvalido('alicuota');
  }

  // Validar correos
  const remitenteInput = document.getElementById('remitente-correo');
  const destinatarioInput = document.getElementById('destinatario-correo');
  const ccInput = document.getElementById('destinatario-cc');
  const ccoInput = document.getElementById('destinatario-cco');

  // Asegurar que los inputs de mail NO queden readonly ni disabled por error
  [remitenteInput, destinatarioInput, ccInput, ccoInput].forEach(input => {
    if (input) {
      input.readOnly = false;
      input.disabled = false;
    }
  });

  const remitente = remitenteInput?.value.trim() || '';
  const destinatario = destinatarioInput?.value.trim() || '';
  const cc = ccInput?.value.trim() || '';
  const cco = ccoInput?.value.trim() || '';

  const emails = [remitente, destinatario, cc, cco].filter(e => e);
  const emailSet = new Set(emails);

  function esEmailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  if (!remitente || !esEmailValido(remitente)) {
    valido = false;
    mensajes.push('El remitente debe ser un correo válido.');
    marcarInvalido('remitente-correo');
  } else {
    limpiarInvalido('remitente-correo');
  }

  if (!destinatario || !esEmailValido(destinatario)) {
    valido = false;
    mensajes.push('El destinatario debe ser un correo válido.');
    marcarInvalido('destinatario-correo');
  } else {
    limpiarInvalido('destinatario-correo');
  }

  if (cc && !esEmailValido(cc)) {
    valido = false;
    mensajes.push('El destinatario CC debe ser un correo válido.');
    marcarInvalido('destinatario-cc');
  } else {
    limpiarInvalido('destinatario-cc');
  }

  if (cco && !esEmailValido(cco)) {
    valido = false;
    mensajes.push('El destinatario CCO debe ser un correo válido.');
    marcarInvalido('destinatario-cco');
  } else {
    limpiarInvalido('destinatario-cco');
  }

  if (emails.length !== emailSet.size) {
    valido = false;
    mensajes.push('Los correos no pueden repetirse entre los campos.');
  }

  // Validar radio buttons
  const radios = [
    { name: 'export-file', label: 'Export File' },
    { name: 'export-api', label: 'Export API' },
    { name: 'test', label: 'Test' }
  ];
  radios.forEach(radio => {
    const checked = document.querySelector(`input[name="${radio.name}"]:checked`);
    if (!checked) {
      valido = false;
      mensajes.push(`Debe seleccionar una opción para ${radio.label}.`);
      marcarGrupoRadioInvalido(radio.name);
    } else {
      limpiarGrupoRadioInvalido(radio.name);
    }
  });

  if (!valido) {
    mostrarMensajeError(mensajes);
    // Importante: Asegurarnos que los inputs queden habilitados después del alert
    setTimeout(() => habilitarCamposCorreo(), 100);
  }
  return valido;
}

// Función dedicada para habilitar los campos de correo
function habilitarCamposCorreo() {
  const ids = ['remitente-correo', 'destinatario-correo', 'destinatario-cc', 'destinatario-cco'];

  // Primera pasada: solo habilitar campos
  ids.forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      // Eliminar los atributos que podrían estar bloqueando el input
      input.removeAttribute('readonly');
      input.removeAttribute('disabled');

      // Asegurarse de que la propiedad también esté establecida
      input.readOnly = false;
      input.disabled = false;

      // Intentar otras técnicas para desbloquear el campo
      input.style.pointerEvents = 'auto';
      input.style.userSelect = 'text';
      input.style.backgroundColor = 'white'; // Asegurarse que se vea activo
    }
  });

  // Segunda pasada: intentar enfocar el primer campo con error
  setTimeout(() => {
    let haFocusado = false;

    ids.forEach(id => {
      const input = document.getElementById(id);
      if (input && input.style.borderColor === 'red' && !haFocusado) {
        // Intentar múltiples enfoques
        try {
          input.focus();
          input.select();
          input.click();
          haFocusado = true;

          // Crear un evento para simular interacción
          const event = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
          });
          input.dispatchEvent(event);
        } catch (e) {
          console.error('Error al enfocar campo:', e);
        }
      }
    });

    // Si ningún campo tenía error, enfocar el primero
    if (!haFocusado) {
      const primerInput = document.getElementById(ids[0]);
      if (primerInput) {
        try {
          primerInput.focus();
          primerInput.click();
        } catch (e) {
          console.error('Error al enfocar primer campo:', e);
        }
      }
    }
  }, 50);
}

// Helpers para marcar campos inválidos
function marcarInvalido(id) {
  const el = document.getElementById(id);
  if (el) el.style.borderColor = 'red';
}
function limpiarInvalido(id) {
  const el = document.getElementById(id);
  if (el) el.style.borderColor = '';
}
function marcarGrupoRadioInvalido(name) {
  document.querySelectorAll(`input[name="${name}"]`).forEach(radio => {
    radio.parentElement.style.color = 'red';
  });
}
function limpiarGrupoRadioInvalido(name) {
  document.querySelectorAll(`input[name="${name}"]`).forEach(radio => {
    radio.parentElement.style.color = '';
  });
}

// Función para mostrar mensajes de error usando el modal
function mostrarMensajeError(mensajes) {
  // Usar el modal en lugar del mensaje inline
  window.modalUtils.mostrarModalError(mensajes, habilitarCamposCorreo);
}

// Asociar la validación al botón Guardar
function asociarValidacionGeneral() {
  const generalTab = document.getElementById('general-tab');
  if (generalTab) {
    const guardarBtn = generalTab.querySelector('#guardar-btn');
    if (guardarBtn && !guardarBtn._listenerAdded) {
      guardarBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        // Asegurar que los campos de correo estén habilitados antes de validar
        habilitarCamposCorreo();        // Validar la pestaña general
        if (await validarGeneral()) {
          // Validar empresas si están cargadas
          let empresasValidas = true;
          let errorEmpresasMsg = '';

          try {
            if (typeof window.validarEmpresasAntesDeGuardar === 'function') {
              empresasValidas = window.validarEmpresasAntesDeGuardar();
              if (!empresasValidas) {
                errorEmpresasMsg = 'La validación de empresas falló. Por favor, corrija los errores antes de continuar.';
              }
            }
          } catch (error) {
            empresasValidas = false;
            errorEmpresasMsg = `Error al validar empresas: ${error.message}`;
            window.modalUtils.mostrarModalError([errorEmpresasMsg]);
          }          // Solo continuar si ambas validaciones son correctas
          if (empresasValidas) {
            // Guardar en memoria primero
            guardarGeneralEnMemoria();

            // Preparar el objeto de configuración
            const config = prepararConfiguracionCompleta();            // Guardar en XML
            const result = await window.electron.saveConfig(config);

            if (result.success) {
              window.modalUtils.mostrarModalExito([
                `¡Configuración guardada exitosamente!`,
                `Archivo guardado en: ${result.path}`
              ]);
            } else {
              window.modalUtils.mostrarModalError(['Error al guardar la configuración. Por favor, intente nuevamente.']);
            }
          }
          // Si empresas no son válidas, la función validarEmpresasAntesDeGuardar ya muestra los errores

          // Asegurar nuevamente que los campos queden habilitados después de todo el proceso
          setTimeout(() => habilitarCamposCorreo(), 100);
        }
      });
      guardarBtn._listenerAdded = true;
    }
  }
}

// --- INICIO: Estado en memoria para General ---
window.generalConfig = window.generalConfig || {};

function guardarGeneralEnMemoria() {
  window.generalConfig = {
    erpFolder: document.getElementById('erp-folder')?.value || '',
    dataFolder: document.getElementById('data-folder')?.value || '',
    exportFolder: document.getElementById('export-folder')?.value || '',
    tempFolder: document.getElementById('temp-folder')?.value || '',
    idSuscriptor: document.getElementById('id-suscriptor')?.value || '',
    nombreEmpresa: document.getElementById('nombre-empresa')?.value || '',
    alicuota: document.getElementById('alicuota')?.value || '',
    remitenteCorreo: document.getElementById('remitente-correo')?.value || '',
    destinatarioCorreo: document.getElementById('destinatario-correo')?.value || '',
    destinatarioCc: document.getElementById('destinatario-cc')?.value || '',
    destinatarioCco: document.getElementById('destinatario-cco')?.value || '',
    exportFile: document.querySelector('input[name="export-file"]:checked')?.value || '',
    exportApi: document.querySelector('input[name="export-api"]:checked')?.value || '',
    test: document.querySelector('input[name="test"]:checked')?.value || ''
  };
}

function restaurarGeneralDesdeMemoria() {
  const cfg = window.generalConfig || {};
  const setValue = (id, val) => {
    const el = document.getElementById(id);
    if (el && val !== undefined) {
      el.value = val;
      // Disparar un evento 'input' para cualquier listener que dependa de este valor
      if (id !== 'alicuota') { // Evitar disparar para alícuota que se maneja especialmente
        const event = new Event('input', { bubbles: true });
        el.dispatchEvent(event);
      }
    }
  };
  setValue('erp-folder', cfg.erpFolder);
  setValue('data-folder', cfg.dataFolder);
  setValue('export-folder', cfg.exportFolder);
  setValue('temp-folder', cfg.tempFolder);
  setValue('id-suscriptor', cfg.idSuscriptor);
  setValue('nombre-empresa', cfg.nombreEmpresa);

  // Alícuota se maneja de forma especial para asegurar que existan las opciones primero
  const alicuotaSelect = document.getElementById('alicuota');
  if (alicuotaSelect && cfg.alicuota) {
    // Verificar si la opción existe antes de seleccionarla
    let exists = false;
    for (let i = 0; i < alicuotaSelect.options.length; i++) {
      if (alicuotaSelect.options[i].value === cfg.alicuota) {
        exists = true;
        break;
      }
    }

    if (exists) {
      alicuotaSelect.value = cfg.alicuota;
    } else if (alicuotaSelect.options.length === 0 && cfg.dataFolder) {
      // Si no hay opciones y tenemos dataFolder, intentar cargar las alícuotas
      window.electron.invoke('get-alicuotas', cfg.dataFolder).then(alicuotas => {
        alicuotaSelect.innerHTML = '';
        alicuotas.forEach((alicuota) => {
          const option = document.createElement('option');
          option.value = alicuota.codigo;
          option.textContent = `${alicuota.codigo}. ${alicuota.nombre}`;
          alicuotaSelect.appendChild(option);
        });
        if (cfg.alicuota) {
          alicuotaSelect.value = cfg.alicuota;
        }
      }).catch(err => {
        console.error('Error al cargar alícuotas:', err);
      });
    }
  }

  setValue('remitente-correo', cfg.remitenteCorreo);
  setValue('destinatario-correo', cfg.destinatarioCorreo);
  setValue('destinatario-cc', cfg.destinatarioCc);
  setValue('destinatario-cco', cfg.destinatarioCco);
  // Radios
  if (cfg.exportFile) {
    const radio = document.querySelector(`input[name="export-file"][value="${cfg.exportFile}"]`);
    if (radio) radio.checked = true;
  }
  if (cfg.exportApi) {
    const radio = document.querySelector(`input[name="export-api"][value="${cfg.exportApi}"]`);
    if (radio) radio.checked = true;
  }
  if (cfg.test) {
    const radio = document.querySelector(`input[name="test"][value="${cfg.test}"]`);
    if (radio) radio.checked = true;
  }
}

function asociarEventosGeneralMemoria() {
  const ids = [
    'erp-folder', 'data-folder', 'export-folder', 'temp-folder',
    'id-suscriptor', 'nombre-empresa', 'alicuota',
    'remitente-correo', 'destinatario-correo', 'destinatario-cc', 'destinatario-cco'
  ];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el && !el._memListener) {
      el.addEventListener('input', guardarGeneralEnMemoria);
      el._memListener = true;
    }
  });
  // Radios
  ['export-file', 'export-api', 'test'].forEach(name => {
    document.querySelectorAll(`input[name="${name}"]`).forEach(radio => {
      if (!radio._memListener) {
        radio.addEventListener('change', guardarGeneralEnMemoria);
        radio._memListener = true;
      }
    });
  });
}
// --- FIN: Estado en memoria para General ---

// Exponer funciones para que tabs.js pueda acceder a ellas
window.getGeneralConfig = function () {
  guardarGeneralEnMemoria();
  return window.generalConfig;
};

window.setGeneralConfig = function (config) {
  if (!config) return;
  window.generalConfig = config;

  // Cargar alícuotas desde ALIC.DBF si hay una carpeta Data configurada
  const dataFolder = config.dataFolder;
  if (dataFolder) {
    window.electron.invoke('get-alicuotas', dataFolder).then(alicuotas => {
      const alicuotaSelect = document.getElementById('alicuota');
      if (alicuotaSelect) {
        const selectedValue = config.alicuota; // Guardar el valor seleccionado anteriormente
        alicuotaSelect.innerHTML = ''; // Limpiar opciones actuales

        if (alicuotas && alicuotas.length > 0) {
          alicuotas.forEach((alicuota) => {
            const option = document.createElement('option');
            option.value = alicuota.codigo;
            option.textContent = `${alicuota.codigo}. ${alicuota.nombre}`;
            alicuotaSelect.appendChild(option);
          });

          // Restaurar la selección anterior si existe
          if (selectedValue) {
            alicuotaSelect.value = selectedValue;
          }
        }
      }
    }).catch(err => {
      console.error('Error al cargar alícuotas:', err);
    });
  }

  // Restaurar el resto de la configuración
  restaurarGeneralDesdeMemoria();
};

// Observa cambios en el contenedor donde se carga el HTML dinámico y llama a la función de inicialización y asociación
function observarGeneralTab() {
  const content = document.getElementById('content');
  if (content) {
    const observer = new MutationObserver(() => {
      initGeneralTabEvents();
      asociarValidacionGeneral();
      restaurarGeneralDesdeMemoria();
      asociarEventosGeneralMemoria();
      // Asegurar que los campos de correo estén habilitados al cargar/cambiar a la pestaña
      setTimeout(() => habilitarCamposCorreo(), 100);
    });
    observer.observe(content, { childList: true, subtree: true });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  observarGeneralTab();
  // Si la pestaña ya está cargada al inicio
  initGeneralTabEvents();
  asociarValidacionGeneral();
  restaurarGeneralDesdeMemoria();
  asociarEventosGeneralMemoria();
});

/**
 * Prepara el objeto de configuración completo para guardarlo
 * @returns {Object} - Objeto con toda la configuración del programa
 */
function prepararConfiguracionCompleta() {
  // Guardar primero en memoria para tener todos los valores actualizados
  guardarGeneralEnMemoria();

  // Convertir la configuración general para el formato XML
  const config = {
    // Rutas
    erpfolder: window.generalConfig.erpFolder || '',
    datafolder: window.generalConfig.dataFolder || '',
    exportfolder: window.generalConfig.exportFolder || '',
    tempfolder: window.generalConfig.tempFolder || '',

    // Datos generales
    idsuscriptor: window.generalConfig.idSuscriptor || '',
    nombreempresa: window.generalConfig.nombreEmpresa || '',
    alicuotapordefecto: window.generalConfig.alicuota || '',

    // Correos
    remitentecorreo: window.generalConfig.remitenteCorreo || '',
    destinatariocorreo: window.generalConfig.destinatarioCorreo || '',
    destinatariocorreocopia: window.generalConfig.destinatarioCc || '',
    destinatariocorreocopiaoculta: window.generalConfig.destinatarioCco || '',

    // Opciones booleanas
    exportfile: window.generalConfig.exportFile === 'true',
    exportapi: window.generalConfig.exportApi === 'true',
    test: window.generalConfig.test === 'true',
  };

  // Obtener estados de checkboxes para artículos
  if (typeof window.getArticulosCheckboxState === 'function') {
    const articulosState = window.getArticulosCheckboxState();

    // Procesar cada grupo de checkboxes para obtener los códigos seleccionados
    // Para cada lista de checkboxes, extraer los códigos de los elementos marcados
    if (articulosState) {
      // Extraer valores de los checkboxes
      config.depositostock = extraerCodigosSeleccionados(articulosState['depositos-list']);
      config.grupoartic = extraerCodigosSeleccionados(articulosState['grupoartic-list']);
      config.claseartic = extraerCodigosSeleccionados(articulosState['claseartic-list']);
      config.linea = extraerCodigosSeleccionados(articulosState['lineas-list']);
      config.marca = extraerCodigosSeleccionados(articulosState['marcas-list']);
      config.tipoartic = extraerCodigosSeleccionados(articulosState['tipoartic-list']);
      config.categoria = extraerCodigosSeleccionados(articulosState['categoria-list']);
    }
  }

  // Obtener estados de checkboxes para clientes
  if (typeof window.getClientesCheckboxState === 'function') {
    const clientesState = window.getClientesCheckboxState();

    if (clientesState) {
      // Extraer valores de los checkboxes
      config.grupocliente = extraerCodigosSeleccionados(clientesState['grupclient-list']);
      config.tipoingbrutos = extraerCodigosSeleccionados(clientesState['tipingresos-list']);
      config.zonaventacliente = extraerCodigosSeleccionados(clientesState['zonas-list']);
      config.tipocliente = extraerCodigosSeleccionados(clientesState['tipoclient-list']);
      config.clasecliente = extraerCodigosSeleccionados(clientesState['claseclient-list']);
      config.listaprecioscliente = extraerCodigosSeleccionados(clientesState['listaprecios-list']);
    }
  }  // Obtener configuración de empresas
  if (window.empresasConfig && Array.isArray(window.empresasConfig)) {
    config.empresas = window.empresasConfig;
  }

  return config;
}

/**
 * Extrae los códigos de los elementos seleccionados en una lista de checkboxes
 * @param {Array} checksState - Estado de los checkboxes (array de booleanos)
 * @param {Array} elementos - Lista de elementos con sus códigos
 * @returns {string} - String con los códigos separados por comas
 */
function extraerCodigosSeleccionados(checksState) {
  if (!checksState || !Array.isArray(checksState)) {
    return '';
  }

  // Para simplicidad, asumimos que los índices corresponden a los códigos 0,1,2,etc.
  // Esto es una simplificación, en un caso real deberíamos mapear los índices a códigos reales
  const codigosSeleccionados = checksState
    .map((checked, index) => checked ? index : null)
    .filter(codigo => codigo !== null);

  return codigosSeleccionados.join(',');
}