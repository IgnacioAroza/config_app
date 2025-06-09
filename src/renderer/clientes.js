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

// Llama a esta función después de renderizar las columnas/artículos
window.addEventListener('DOMContentLoaded', () => {
    agregarListenersCabeceraChecks();
    agregarListenerSubmitClientes();
    agregarListenerChangeClientes();
});

window.initClientesTabEvents = function () {
    agregarListenersCabeceraChecks();
    agregarListenerChangeClientes();
    agregarListenerSubmitClientes(); // Si quieres la validación de submit igual que en artículos
}


// --- Persistencia de estado de checkboxes para tabs.js ---
// Devuelve un objeto con el estado de todos los checkboxes de cada columna
window.getClientesCheckboxState = function () {
    const columnas = [
        'tipingresos-list',
        'zonas-list',
        'listaprecios-list',
        'grupclient-list',
        'tipoclient-list',
        'claseclient-list'
    ];
    const state = {};
    columnas.forEach(id => {
        const cont = document.getElementById(id);
        if (!cont) return;
        const checks = cont.querySelectorAll('input[type="checkbox"]');
        state[id] = Array.from(checks).map(chk => chk.checked);
    });
    return state;
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
        // Actualizar cabecera según hijos (igual que en Artículos)
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