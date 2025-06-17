async function cargarZonas(dataFolder) {
    if (!dataFolder) {
        console.error('[zonas] No se recibió dataFolder');
        return;
    }
    const zonas = await window.electron.getZonas(dataFolder);
    const container = document.getElementById('zonas-list');
    if (!container) {
        console.error('[zonas] No se encontró el contenedor lineas-list');
        return;
    }
    // Agrega primero la opción 0. vacío
    let html = `<label><input type="checkbox" checked> 0. vacío</label>`;
    html += (zonas || []).map(zon =>
        `<label>
            <input type="checkbox" checked>
            ${zon.codigo}.${zon.nombre}
        </label>`
    ).join('');
    container.innerHTML = html;
    // agregarListenersCabeceraChecks(); // <-- Agrega listeners después de renderizar
    validarChecksClientes();
}

async function cargarListaPrecios(dataFolder) {
    if (!dataFolder) {
        console.error('[listaPrecios] No se recibió dataFolder');
        return;
    }
    const listas = await window.electron.getListaPrecios(dataFolder);
    const container = document.getElementById('listaprecios-list');
    if (!container) {
        console.error('[listaPrecios] No se encontró el contenedor listaprecios-list');
        return;
    }
    // Agrega primero la opción 0. vacío
    let html = `<label><input type="checkbox" checked> 0. vacío</label>`;
    html += (listas || []).map(lis =>
        `<label>
            <input type="checkbox" checked>
            ${lis.codigo}.${lis.nombre}
        </label>`
    ).join('');
    container.innerHTML = html;
    agregarListenersCabeceraChecks(); // <-- Agrega listeners después de renderizar
    validarChecksClientes();
}

async function cargarGrupoCliente(dataFolder) {
    if (!dataFolder) {
        console.error('[grupclient] No se recibió dataFolder');
        return;
    }
    const grupclient = await window.electron.getGrupoCliente(dataFolder);
    const container = document.getElementById('grupclient-list');
    if (!container) {
        console.error('[grupclient] No se encontró el contenedor grupclient-list');
        return;
    }
    // Agrega primero la opción 0. vacío
    let html = `<label><input type="checkbox" checked> 0. vacío</label>`;
    html += (grupclient || []).map(grup =>
        `<label>
            <input type="checkbox" checked>
            ${grup.codigo}.${grup.nombre}
        </label>`
    ).join('');
    container.innerHTML = html;
    agregarListenersCabeceraChecks(); // <-- Agrega listeners después de renderizar
    validarChecksClientes();
}

async function cargarTipoCliente(dataFolder) {
    if (!dataFolder) {
        console.error('[cargarTipoCliente] No se recibió dataFolder');
        return;
    }
    const tipos = await window.electron.getTipoCliente(dataFolder);
    const container = document.getElementById('tipoclient-list');
    if (!container) {
        console.error('[tipoclient] No se encontró el contenedor tipoclient-list');
        return;
    }
    // Agrega primero la opción 0. vacío
    let html = `<label><input type="checkbox" checked> 0. vacío</label>`;
    html += (tipos || []).map(tipo =>
        `<label>
            <input type="checkbox" checked>
            ${tipo.codigo}.${tipo.nombre}
        </label>`
    ).join('');
    container.innerHTML = html;
    agregarListenersCabeceraChecks(); // <-- Agrega listeners después de renderizar
    validarChecksClientes();
}

async function cargarClaseCliente(dataFolder) {
    if (!dataFolder) {
        console.error('[cargarClaseCliente] No se recibió dataFolder');
        return;
    }
    const claseclient = await window.electron.getClaseCliente(dataFolder);
    const container = document.getElementById('claseclient-list');
    if (!container) {
        console.error('[claseclient] No se encontró el contenedor claseclient-list');
        return;
    }
    // Agrega primero la opción 0. vacío
    let html = `<label><input type="checkbox" checked> 0. vacío</label>`;
    html += (claseclient || []).map(clas =>
        `<label>
            <input type="checkbox" checked>
            ${clas.codigo}.${clas.nombre}
        </label>`
    ).join('');
    container.innerHTML = html;
    agregarListenersCabeceraChecks(); // <-- Agrega listeners después de renderizar
    validarChecksClientes();
}

function validarChecksClientes() {
    // IDs de las columnas a validar en clientes
    const columnas = [
        'tipingresos-list',
        'zonas-list',
        'listaprecios-list',
        'grupclient-list',
        'tipoclient-list',
        'claseclient-list'
    ];
    columnas.forEach(id => {
        const cont = document.getElementById(id);
        if (!cont) return;
        const checks = cont.querySelectorAll('input[type="checkbox"]:checked');
        const total = cont.querySelectorAll('input[type="checkbox"]');
        const cabeceraCheck = cont.parentElement.querySelector('.clientes-title input[type="checkbox"]');
        const hijosChecks = Array.from(total).filter(chk => chk !== cabeceraCheck);
        const hijosMarcados = Array.from(checks).filter(chk => chk !== cabeceraCheck).length;
        const hijosTotales = hijosChecks.length;
        const colDiv = cont.closest('.clientes-col');
        if (hijosTotales === 0 || hijosMarcados === 0) {
            if (colDiv) {
                colDiv.classList.add('clientes-error');
            }
        } else {
            if (colDiv) {
                colDiv.classList.remove('clientes-error');
            }
        }
    });
}

// Lógica para desmarcar todos los checkboxes de una columna si se desmarca el checkbox de la cabecera
function agregarListenersCabeceraChecks() {
    const columnas = [
        // Clientes
        'tipingresos-list',
        'zonas-list',
        'listaprecios-list',
        'grupclient-list',
        'tipoclient-list',
        'claseclient-list'
    ];
    columnas.forEach(id => {
        const col = document.getElementById(id);
        if (!col) return;
        // Checkbox de cabecera (fuera de la lista)
        const cabeceraCheck = col.parentElement.querySelector('.clientes-title input[type="checkbox"]');
        // Delegación de eventos: un solo listener para los hijos
        col.addEventListener('change', function (e) {
            if (e.target.type === 'checkbox') {
                // Si el cambio fue en un hijo
                const hijosChecks = col.querySelectorAll('input[type="checkbox"]');
                const todosMarcados = Array.from(hijosChecks).every(c => c.checked);
                if (cabeceraCheck) {
                    cabeceraCheck.checked = todosMarcados;
                }
            }
        });
        // Listener para la cabecera
        if (cabeceraCheck) {
            cabeceraCheck.addEventListener('change', function () {
                const hijosChecks = col.querySelectorAll('input[type="checkbox"]');
                hijosChecks.forEach(chk => {
                    chk.checked = this.checked;
                });
            });
        }
    });
}

// Llama a esta función para agregar el listener de submit solo si el botón existe
function agregarListenerSubmitClientes() {
    const btn = document.querySelector('.button-center button[type="submit"]');
    if (btn) {
        btn.addEventListener('click', e => {
            validarChecksClientes();
            // Si alguna columna está en error, puedes prevenir el submit:
            if (document.querySelector('.clientes-error')) {
                e.preventDefault();
                alert('Debes seleccionar al menos una opción en cada tabla.');
            }
        });
    }
}

function agregarListenerChangeClientes() {
    const tab = document.getElementById('clientes-tab');
    if (tab) {
        tab.addEventListener('change', (e) => {
            if (e.target && e.target.type === 'checkbox') {
                validarChecksClientes();
            }
        });
    }
}

function inicializarEstadoClientes() {
    try {
        const savedState = localStorage.getItem('clientesCheckboxState');
        if (savedState) {
            window.setClientesCheckboxState(JSON.parse(savedState));
        }
    } catch (e) {
        console.warn('Error al restaurar estado de clientes:', e);
    }
}


// Llama a esta función después de renderizar las columnas/artículos
window.addEventListener('DOMContentLoaded', () => {
    agregarListenersCabeceraChecks();
    agregarListenerSubmitClientes();
    agregarListenerChangeClientes();
});

window.initClientesTabEvents = function () {
    agregarListenersCabeceraChecks();
    agregarListenerChangeClientes();
    agregarListenerSubmitClientes();
    inicializarEstadoClientes();
}


// --- Persistencia de estado de checkboxes para tabs.js ---
// Devuelve un objeto con el estado de todos los checkboxes de cada columna
window.getClientesCheckboxState = function (useCache = false) {
    // Si useCache es true y ya tenemos el estado guardado, devolverlo directamente
    if (useCache && window.clientesCheckboxState && window.clientesCodigosMap) {
        return {
            state: window.clientesCheckboxState,
            codigosMap: window.clientesCodigosMap
        };
    }

    const columnas = [
        'tipingresos-list',
        'zonas-list',
        'listaprecios-list',
        'grupclient-list',
        'tipoclient-list',
        'claseclient-list'
    ];

    const state = {};
    const codigosMap = {};

    columnas.forEach(id => {
        const cont = document.getElementById(id);
        if (!cont) {
            console.warn(`Contenedor #${id} no encontrado`);
            return; // Continuar con la siguiente iteración
        }
        const checks = cont.querySelectorAll('input[type="checkbox"]');
        state[id] = Array.from(checks).map(chk => chk.checked);
        // Extraer códigos de las etiquetas
        codigosMap[id] = Array.from(checks).map(chk => {
            const labelText = chk.parentElement.textContent.trim();
            // Extraer código de textos como "1.Nombre" -> "1"
            const match = labelText.match(/^(\d+)\./);
            return match ? match[1] : null;
        });

    });
    // Guardar también en window para acceso global
    window.clientesCheckboxState = state;
    window.clientesCodigosMap = codigosMap;

    // Persistir en localStorage
    try {
        localStorage.setItem('clientesCheckboxState', JSON.stringify(state));
        localStorage.setItem('clientesCodigosMap', JSON.stringify(codigosMap));
    } catch (e) {
        console.warn('Error al guardar estado de clientes en localStorage:', e);
    }
    return { state, codigosMap };
};

// Restaura el estado de los checkboxes a partir de un objeto de estado
window.setClientesCheckboxState = function (state) {
    if (!state) return;

    Object.keys(state).forEach(id => {
        const cont = document.getElementById(id);
        if (!cont) return;
        const checks = cont.querySelectorAll('input[type="checkbox"]');
        const arr = state[id] || [];

        checks.forEach((chk, i) => {
            if (typeof arr[i] === 'boolean') chk.checked = arr[i];
        });

        // Actualizar cabecera según hijos
        const colDiv = cont.closest('.clientes-col');
        if (colDiv) {
            const cabeceraCheck = colDiv.querySelector('.clientes-title input[type="checkbox"]');
            const hijosChecks = cont.querySelectorAll('input[type="checkbox"]');
            if (cabeceraCheck) {
                const todosMarcados = Array.from(hijosChecks).every(c => c.checked);
                cabeceraCheck.checked = todosMarcados;
            }
        }
    });

    // Actualiza validación visual
    if (typeof validarChecksClientes === 'function') {
        validarChecksClientes();
    }
};

// En clientes.js
window.getClientesSeleccionados = function () {
    // Usar caché para evitar errores si estamos en otra pestaña
    const result = window.getClientesCheckboxState(true);

    // Validar que result tenga la estructura esperada
    if (!result || !result.state || !result.codigosMap) {
        console.error('Error: getClientesCheckboxState devolvió un valor incorrecto', result);
        return {}; // Devolver objeto vacío para evitar errores
    }

    const { state, codigosMap } = result;
    const seleccionados = {};

    Object.keys(state).forEach(id => {
        const fieldName = id.replace('-list', ''); // Convertir 'zonas-list' a 'zonas'

        // Verificar si todos los elementos están seleccionados (excepto el primero que es el 0)
        const totalItems = state[id].length;
        if (totalItems <= 1) {
            seleccionados[fieldName] = '';
            return; // Continuar con la siguiente lista
        }

        // Los elementos reales comienzan en el índice 1 (saltando el 0.vacío)
        const itemsReales = state[id].slice(1);

        // Verificar si todos están seleccionados
        const todosSeleccionados = itemsReales.every(checked => checked === true);

        if (todosSeleccionados) {
            // Si todos están seleccionados, asignar cadena vacía para que
            // se genere un tag XML vacío como <tipingresos></tipingresos>
            seleccionados[fieldName] = '';
        } else {
            // Si no todos están seleccionados, guardar solo los índices seleccionados
            const indicesSeleccionados = [];

            // Comenzamos desde el índice 1 para ignorar el "0.vacío"
            for (let i = 1; i < state[id].length; i++) {
                if (state[id][i]) {
                    // Obtener el código correspondiente (número antes del punto)
                    const codigo = codigosMap[id][i];
                    if (codigo) {
                        // Extraer solo el número del código (por si acaso viene con formato)
                        const codigoNumerico = codigo.split('.')[0];
                        indicesSeleccionados.push(codigoNumerico);
                    }
                }
            }

            // Unir con comas y guardar
            seleccionados[fieldName] = indicesSeleccionados.join(',');
        }
    });

    return seleccionados;
};