// --- MODELO EN MEMORIA ---
let empresasModel = [];

// Valida si existe la carpeta y el archivo .DBC para una empresa
async function validarUbicacionEmpresa(ubicacion, codigo) {
    // Verificar si la ubicación está vacía
    if (!ubicacion) return { valido: false, error: 'La ubicación está vacía' };

    // Verificar si el código es numérico
    if (!/^\d+$/.test(codigo)) {
        return { valido: false, error: `El código de empresa '${codigo}' no es válido. Debe ser un valor numérico.` };
    }

    // Verificar si la carpeta existe
    const existeCarpeta = await window.electron.invoke('check-folder-exists', ubicacion);
    if (!existeCarpeta) {
        return { valido: false, error: `La carpeta '${ubicacion}' no existe` };
    }

    // Verifica que exista el archivo .DBC correspondiente
    const existeDBC = await window.electron.invoke('check-file-exists', `${ubicacion}\\${codigo}.DBC`);
    if (!existeDBC) {
        return { valido: false, error: `No se encontró el archivo ${codigo}.DBC en la carpeta` };
    }

    // Verificar permisos de escritura en la carpeta (necesario para generación de archivos)
    try {
        const tienePermisos = await window.electron.invoke('check-folder-permissions', ubicacion);
        if (!tienePermisos) {
            return { valido: false, error: `No tiene permisos de escritura en la carpeta '${ubicacion}'` };
        }
    } catch (error) {
        console.error('Error al verificar permisos:', error);
        return { valido: false, error: `Error al verificar permisos en la carpeta '${ubicacion}'` };
    }

    return { valido: true, error: null };
}

// Renderiza la tabla de empresas según el modelo en memoria
function renderEmpresasTable() {
    const tbody = document.querySelector('.empresas-table tbody');
    if (!tbody) return; // Evita error si la tabla aún no está en el DOM

    tbody.innerHTML = '';

    // Ordenamos solo por código para mantener el orden consistente
    const empresasOrdenadas = [...empresasModel].sort((a, b) => {
        return String(a.codigo).localeCompare(String(b.codigo));
    });

    empresasOrdenadas.forEach((empresa, idx) => {
        const tr = document.createElement('tr');
        const errorClass = !empresa.ubicacionValida.valido ? ' error' : '';
        const errorTitle = !empresa.ubicacionValida.valido ? `Error: ${empresa.ubicacionValida.error}` : '';
        // Ya no deshabilitamos el checkbox aunque la ubicación sea inválida

        tr.innerHTML = `
            <td>${empresa.codigo}</td>
            <td>${empresa.nombre}</td>
            <td class="td-ubicacion${errorClass}" title="${errorTitle}">${empresa.ubicacion || ''}</td>
            <td><button class="btn-ubicacion">...</button></td>
            <td><input type="checkbox" class="chk-procesa" ${empresa.procesa ? 'checked' : ''}></td>
        `;

        // Añadir clase si la empresa no es válida
        if (!empresa.ubicacionValida.valido) {
            tr.classList.add('empresa-error');
        }

        tbody.appendChild(tr);
    });

    // Actualizar contador de empresas a procesar
    const empresasProcesadas = empresasModel.filter(e => e.procesa).length;
    const totalEmpresas = empresasModel.length;

    // Actualizar el contador en la sección de estadísticas
    const contadorElement = document.getElementById('empresas-contador');
    if (contadorElement) {
        contadorElement.textContent = `${empresasProcesadas} de ${totalEmpresas} empresas serán procesadas`;
        // Destacar visualmente si no hay ninguna empresa seleccionada
        if (empresasProcesadas === 0 && totalEmpresas > 0) {
            contadorElement.classList.add('error');
        } else {
            contadorElement.classList.remove('error');
        }
    }

    // Listeners para botones de ubicación
    tbody.querySelectorAll('.btn-ubicacion').forEach((btn, idx) => {
        btn.addEventListener('click', async () => {
            const empresaIdx = Array.from(tbody.querySelectorAll('.btn-ubicacion')).indexOf(btn);
            const nuevaUbicacion = await window.electron.invoke('select-folder');
            if (nuevaUbicacion) {
                empresasModel[empresaIdx].ubicacion = nuevaUbicacion;
                empresasModel[empresaIdx].ubicacionValida = await validarUbicacionEmpresa(nuevaUbicacion, empresasModel[empresaIdx].codigo);
                renderEmpresasTable();
            }
        });
    });
    // Listeners para checkboxes de procesa
    tbody.querySelectorAll('.chk-procesa').forEach((chk, idx) => {
        chk.addEventListener('change', () => {
            const empresaIdx = Array.from(tbody.querySelectorAll('.chk-procesa')).indexOf(chk);
            empresasModel[empresaIdx].procesa = chk.checked;
            renderEmpresasTable();
        });
    });
}

// Carga empresas y su configuración guardada
async function cargarEmpresas() {
    try {
        // 1. Obtener empresas base
        const empresas = await window.electron.invoke('get-empresas', window.currentDataFolder);
        // 2. Obtener configuración guardada (ubicación y procesa)
        const configEmpresas = await window.electron.invoke('get-empresas-config'); // Debe devolver un array [{codigo, ubicacion, procesa}]

        // Verificar duplicados en códigos de empresa
        const codigosUnicos = new Set();
        const codigosDuplicados = [];

        empresas.forEach(empresa => {
            const codigo = empresa.codigo || empresa.CODIGO || empresa.Cod || '';
            if (codigosUnicos.has(codigo)) {
                codigosDuplicados.push(codigo);
            } else {
                codigosUnicos.add(codigo);
            }
        });

        if (codigosDuplicados.length > 0) {
            mostrarErrorModal([`Se encontraron códigos de empresa duplicados: ${codigosDuplicados.join(', ')}`]);
        }

        // Verificar que las rutas sean únicas para empresas distintas
        const rutasEmpresa = new Map();
        let rutasDuplicadas = false;

        configEmpresas?.forEach(config => {
            if (config.ubicacion && rutasEmpresa.has(config.ubicacion)) {
                rutasDuplicadas = true;
                const empresaExistente = rutasEmpresa.get(config.ubicacion);
                mostrarErrorModal([`La ruta "${config.ubicacion}" está duplicada para las empresas "${config.codigo}" y "${empresaExistente}"`]);
            } else if (config.ubicacion) {
                rutasEmpresa.set(config.ubicacion, config.codigo);
            }
        });

        // Verificar si hay configuración previa cargada
        const codigosAnteriores = new Set(empresasModel.map(e => e.codigo));
        const codigosNuevos = new Set(empresas.map(e => e.codigo || e.CODIGO || e.Cod || ''));

        // Detectar códigos que ya no existen
        const codigosEliminados = [...codigosAnteriores].filter(c => !codigosNuevos.has(c));
        if (codigosEliminados.length > 0 && empresasModel.length > 0) {
            mostrarErrorModal([`Atención: Se han eliminado las siguientes empresas: ${codigosEliminados.join(', ')}`]);
        }

        // Detectar códigos nuevos
        const codigosAgregados = [...codigosNuevos].filter(c => !codigosAnteriores.has(c));
        if (codigosAgregados.length > 0 && empresasModel.length > 0) {
            window.modalUtils.mostrarModalExito([`Se han encontrado nuevas empresas: ${codigosAgregados.join(', ')}`]);
        }

        empresasModel = await Promise.all(empresas.map(async (empresa) => {
            const codigo = empresa.codigo || empresa.CODIGO || empresa.Cod || '';
            const nombre = empresa.nombre || empresa.NOMBRE || empresa.Nom || '';

            // Buscar config guardada
            const config = (configEmpresas || []).find(e => e.codigo == codigo) || {};
            const ubicacion = config.ubicacion || (window.currentDataFolder + '\\' + codigo);
            const procesa = typeof config.procesa === 'boolean' ? config.procesa : true;
            const ubicacionValida = await validarUbicacionEmpresa(ubicacion, codigo);

            return { codigo, nombre, ubicacion, procesa, ubicacionValida };
        }));

        renderEmpresasTable();
    } catch (error) {
        console.error('Error al cargar empresas:', error);
        mostrarErrorModal([`Error al cargar empresas: ${error.message}`]);
    }
}

// Valida todas las empresas antes de guardar
function validarEmpresasAntesDeGuardar() {
    let valido = true;
    const errores = [];

    // Verificar que las rutas sean únicas para empresas distintas
    const rutasEmpresa = new Map();
    const empresasProcesadas = empresasModel.filter(emp => emp.procesa);

    // Verificar si hay al menos una empresa a procesar
    if (empresasProcesadas.length === 0) {
        valido = false;
        errores.push('Debe seleccionar al menos una empresa para procesar.');
    }

    empresasModel.forEach(emp => {
        // Verificar si la empresa debe ser procesada
        if (emp.procesa) {
            // Verificar si la ubicación es válida
            if (!emp.ubicacionValida.valido) {
                valido = false;
                errores.push(`Empresa ${emp.codigo} (${emp.nombre}): ${emp.ubicacionValida.error}`);
            }

            // Verificar si la ruta está duplicada
            if (emp.ubicacion && rutasEmpresa.has(emp.ubicacion)) {
                valido = false;
                const empresaExistente = rutasEmpresa.get(emp.ubicacion);
                errores.push(`La ruta "${emp.ubicacion}" está duplicada para las empresas "${emp.codigo}" y "${empresaExistente}"`);
            } else if (emp.ubicacion) {
                rutasEmpresa.set(emp.ubicacion, emp.codigo);
            }

            // Verificar si el código de empresa es numérico
            if (!/^\d+$/.test(emp.codigo)) {
                valido = false;
                errores.push(`El código de empresa '${emp.codigo}' no es válido. Debe ser un valor numérico.`);
            }

            // Verificar la longitud máxima de la ruta (para evitar problemas con rutas muy largas)
            if (emp.ubicacion && emp.ubicacion.length > 250) {
                valido = false;
                errores.push(`La ruta de la empresa ${emp.codigo} es demasiado larga (${emp.ubicacion.length} caracteres). La longitud máxima recomendada es de 250 caracteres.`);
            }            // Verificar que la ruta no contenga caracteres especiales que puedan causar problemas
            // No validamos los caracteres : y \ porque son necesarios en las rutas de Windows
            if (emp.ubicacion && /[<>"|?*]/.test(emp.ubicacion)) {
                valido = false;
                errores.push(`La ruta de la empresa ${emp.codigo} contiene caracteres no permitidos. No se permiten: < > " | ? *`);
            }
        }
    });

    renderEmpresasTable();

    // Si hay errores, mostrarlos
    if (!valido && errores.length > 0) {
        mostrarErrorModal(errores);
    }

    return valido;
}

// Guarda la configuración de empresas
async function guardarEmpresasConfig() {
    try {
        // Verificar que tenemos empresas para guardar
        if (!empresasModel || empresasModel.length === 0) {
            console.warn('No hay empresas para guardar');
            return true; // No es un error, simplemente no hay empresas
        }

        // Formatear empresas como cadena
        const empresasString = empresasModel
            .map(e => `${e.codigo},${e.ubicacion},${e.procesa ? 'True' : 'False'}`)
            .join(';');

        // Guardar en la ventana para acceso global
        window.empresasConfigString = empresasString;

        // IMPORTANTE: Guardar también en localStorage para persistencia entre pestañas
        try {
            localStorage.setItem('empresasConfigString', empresasString);

            // También guarda una versión simplificada del modelo
            const modelSimplificado = empresasModel.map(e => ({
                codigo: e.codigo,
                nombre: e.nombre || '',
                ubicacion: e.ubicacion,
                procesa: e.procesa
            }));
            localStorage.setItem('empresasModel', JSON.stringify(modelSimplificado));
        } catch (storageError) {
            console.warn('No se pudo guardar en localStorage:', storageError);
        }

        // También exponer el modelo completo
        window.empresasModel = empresasModel;

        // Enviar modelo al backend para guardar
        const resultado = await window.electron.invoke('save-empresas-config', empresasString);

        if (!resultado) {
            throw new Error('Error al guardar la configuración de empresas');
        }

        return true;
    } catch (error) {
        console.error('Error al guardar empresas:', error);
        mostrarErrorModal([`Error al guardar la configuración de empresas: ${error.message}`]);
        return false;
    }
}

// Función para mostrar errores en el modal
function mostrarErrorModal(mensajes) {
    // Utilizar el modal que ya creamos en modal.js
    if (window.modalUtils && typeof window.modalUtils.mostrarModalError === 'function') {
        window.modalUtils.mostrarModalError(mensajes);
    } else {
        // Fallback a alert si el modal no está disponible
        alert('Errores de validación:\n\n' + mensajes.join('\n'));
    }
}

// Exponer funciones para tabs.js o para el botón de guardar global
window.validarEmpresasAntesDeGuardar = validarEmpresasAntesDeGuardar;
window.guardarEmpresasConfig = guardarEmpresasConfig;
window.revalidarEmpresas = async function () {
    // Revalidar las ubicaciones de todas las empresas
    for (let i = 0; i < empresasModel.length; i++) {
        const empresa = empresasModel[i];
        empresasModel[i].ubicacionValida = await validarUbicacionEmpresa(empresa.ubicacion, empresa.codigo);
    }
    // Actualizar la visualización
    renderEmpresasTable();
    return true;
};

function updateEmpresasProcesa(index, procesa) {
    empresasModel[index].procesa = procesa;

    // Actualizar la cadena formateada y guardarla globalmente
    const empresasString = empresasModel
        .map(e => `${e.codigo},${e.ubicacion},${e.procesa ? 'True' : 'False'}`)
        .join(';');

    window.empresasConfigString = empresasString;
    localStorage.setItem('empresasConfigString', empresasString);

    // Actualizar la UI
    renderEmpresasTable();
}

// Inicializar la carga de empresas cuando se carga el documento
window.onload = async function () {
    await cargarEmpresas();

    // Agregar el listener para el botón de verificación
    const verificarBtn = document.getElementById('verificar-empresas-btn');
    if (verificarBtn) {
        verificarBtn.addEventListener('click', async () => {
            verificarBtn.disabled = true;
            verificarBtn.textContent = 'Verificando...';

            try {
                // Revalidar todas las empresas
                await window.revalidarEmpresas();
                // Ejecutar validación completa para mostrar cualquier error
                const esValido = validarEmpresasAntesDeGuardar();

                if (esValido) {
                    window.modalUtils.mostrarModalExito(['Todas las empresas han sido verificadas correctamente.']);
                }
            } catch (error) {
                console.error('Error al verificar empresas:', error);
                mostrarErrorModal([`Error al verificar empresas: ${error.message}`]);
            } finally {
                verificarBtn.disabled = false;
                verificarBtn.textContent = 'Verificar todas las empresas';
            }
        });
    }

    // Agregar el listener para el botón de guardar
    const guardarBtn = document.getElementById('btn-guardar');
    if (guardarBtn) {
        guardarBtn.addEventListener('click', async () => {
            // Validar antes de guardar
            if (validarEmpresasAntesDeGuardar()) {
                try {
                    guardarBtn.disabled = true;
                    guardarBtn.textContent = 'Guardando...';

                    // Guardar configuración
                    await guardarEmpresasConfig();

                    // Mostrar mensaje de éxito
                    window.modalUtils.mostrarModalExito(['Configuración de empresas guardada correctamente.']);
                } catch (error) {
                    console.error('Error al guardar:', error);
                    mostrarErrorModal([`Error al guardar: ${error.message}`]);
                } finally {
                    guardarBtn.disabled = false;
                    guardarBtn.textContent = 'Guardar';
                }
            }
        });
    }
};