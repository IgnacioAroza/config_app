async function cargarDepositos(dataFolder) {
    if (!dataFolder) {
        console.error('[depositos] No se recibió dataFolder');
        return;
    }
    const depositos = await window.electron.getDepositos(dataFolder);
    const container = document.getElementById('depositos-list');
    if (!container) {
        console.error('[depositos] No se encontró el contenedor depositos-list');
        return;
    }
    // Agrega primero la opción 0. vacío
    let html = `<label><input type="checkbox" checked> 0. vacío</label>`;
    html += (depositos || []).map(depo =>
        `<label>
            <input type="checkbox" checked>
            ${depo.codigo}.${depo.nombre}
        </label>`
    ).join('');
    container.innerHTML = html;
    await new Promise(r => setTimeout(r, 0)); // Forzar delay para que el DOM procese el innerHTML
    validarChecksArticulos();
}

async function cargarGrupoArticulos(dataFolder) {
    if (!dataFolder) {
        console.error('[grupoArticulos] No se recibió dataFolder');
        return;
    }
    const grupos = await window.electron.getGrupoArtic(dataFolder);
    const container = document.getElementById('grupoartic-list');
    if (!container) {
        console.error('[grupoArticulos] No se encontró el contenedor grupoartic-list');
        return;
    }
    // Agrega primero la opción 0. vacío
    let html = `<label><input type="checkbox" checked> 0. vacío</label>`;
    html += (grupos || []).map(grup =>
        `<label>
            <input type="checkbox" checked>
            ${grup.codigo}.${grup.nombre}
        </label>`
    ).join('');
    container.innerHTML = html;
    await new Promise(r => setTimeout(r, 0)); // Forzar delay para que el DOM procese el innerHTML
    validarChecksArticulos();
}

async function cargarClaseArticulos(dataFolder) {
    if (!dataFolder) {
        console.error('[claseartic] No se recibió dataFolder');
        return;
    }
    const clases = await window.electron.getClaseArtic(dataFolder);
    const container = document.getElementById('claseartic-list');
    if (!container) {
        console.error('[claseartic] No se encontró el contenedor claseartic-list');
        return;
    }
    // Agrega primero la opción 0. vacío
    let html = `<label><input type="checkbox" checked> 0. vacío</label>`;
    html += (clases || []).map(clas =>
        `<label>
            <input type="checkbox" checked>
            ${clas.codigo}.${clas.nombre}
        </label>`
    ).join('');
    container.innerHTML = html;
    await new Promise(r => setTimeout(r, 0)); // Forzar delay para que el DOM procese el innerHTML
    validarChecksArticulos();
}

async function cargarLineas(dataFolder) {
    if (!dataFolder) {
        console.error('[cargarLineas] No se recibió dataFolder');
        return;
    }
    const lineas = await window.electron.getLineas(dataFolder);
    const container = document.getElementById('lineas-list');
    if (!container) {
        console.error('[tipoclient] No se encontró el contenedor tipoclient-list');
        return;
    }
    // Agrega primero la opción 0. vacío
    let html = `<label><input type="checkbox" checked> 0. vacío</label>`;
    html += (lineas || []).map(linea =>
        `<label>
            <input type="checkbox" checked>
            ${linea.codigo}.${linea.nombre}
        </label>`
    ).join('');
    container.innerHTML = html;
    await new Promise(r => setTimeout(r, 0)); // Forzar delay para que el DOM procese el innerHTML
    validarChecksArticulos();
}

async function cargarMarcas(dataFolder) {
    if (!dataFolder) {
        console.error('[cargarMarcas] No se recibió dataFolder');
        return;
    }
    const marcas = await window.electron.getMarcas(dataFolder);
    const container = document.getElementById('marcas-list');
    if (!container) {
        console.error('[marcas] No se encontró el contenedor marcas-list');
        return;
    }
    // Agrega primero la opción 0. vacío
    let html = `<label><input type="checkbox" checked> 0. vacío</label>`;
    html += (marcas || []).map(marca =>
        `<label>
            <input type="checkbox" checked>
            ${marca.codigo}.${marca.nombre}
        </label>`
    ).join('');
    container.innerHTML = html;
    await new Promise(r => setTimeout(r, 0)); // Forzar delay para que el DOM procese el innerHTML
    validarChecksArticulos();
}

async function cargarTipoArticulos(dataFolder) {
    if (!dataFolder) {
        console.error('[cargarTipoArticulos] No se recibió dataFolder');
        return;
    }
    const tipoartic = await window.electron.getTiposArtic(dataFolder);
    const container = document.getElementById('tipoartic-list');
    if (!container) {
        console.error('[tipoartic] No se encontró el contenedor tipoartic-list');
        return;
    }
    // Agrega primero la opción 0. vacío
    let html = `<label><input type="checkbox" checked> 0. vacío</label>`;
    html += (tipoartic || []).map(tipo =>
        `<label>
            <input type="checkbox" checked>
            ${tipo.codigo}.${tipo.nombre}
        </label>`
    ).join('');
    container.innerHTML = html;
    await new Promise(r => setTimeout(r, 0)); // Forzar delay para que el DOM procese el innerHTML
    validarChecksArticulos();
}

function validarChecksArticulos() {
    // IDs de las columnas a validar en artículos
    const columnas = [
        'categoria-list',
        'depositos-list',
        'grupoartic-list',
        'claseartic-list',
        'lineas-list',
        'marcas-list',
        'tipoartic-list',
    ];
    columnas.forEach(id => {
        const cont = document.getElementById(id);
        if (!cont) return;
        const checks = cont.querySelectorAll('input[type="checkbox"]:checked');
        const total = cont.querySelectorAll('input[type="checkbox"]');
        const cabeceraCheck = cont.parentElement.querySelector('.articulos-title input[type="checkbox"]');
        const hijosChecks = Array.from(total).filter(chk => chk !== cabeceraCheck);
        const hijosMarcados = Array.from(checks).filter(chk => chk !== cabeceraCheck).length;
        const hijosTotales = hijosChecks.length;
        const colDiv = cont.closest('.articulos-col');
        // Igual que en clientes: si no hay hijos o no hay ninguno marcado, agrega la clase de error
        if (hijosTotales === 0 || hijosMarcados === 0) {
            if (colDiv) {
                colDiv.classList.add('articulos-error');
            }
        } else {
            if (colDiv) {
                colDiv.classList.remove('articulos-error');
            }
        }
    });
}

// Listener delegado para toda la lógica de checks en el tab de artículos
function agregarListenerChangeArticulos() {
    const tab = document.getElementById('articulos-tab');
    if (tab && !tab._articulosListenerAgregado) {
        tab.addEventListener('change', (e) => {
            if (e.target && e.target.type === 'checkbox') {
                // Encuentra el contenedor de columna
                const colDiv = e.target.closest('.articulos-col');
                if (!colDiv) return;
                const cabeceraCheck = colDiv.querySelector('.articulos-title input[type="checkbox"]');
                const hijosChecks = colDiv.querySelectorAll('.articulos-list input[type="checkbox"]');
                // Si el cambio fue en la cabecera
                if (cabeceraCheck && e.target === cabeceraCheck) {
                    hijosChecks.forEach(chk => {
                        chk.checked = cabeceraCheck.checked;
                    });
                } else {
                    // Si el cambio fue en un hijo, actualiza la cabecera
                    const todosMarcados = Array.from(hijosChecks).every(c => c.checked);
                    if (cabeceraCheck) {
                        cabeceraCheck.checked = todosMarcados;
                    }
                }
                // Llamar directamente a la validación
                validarChecksArticulos();
            }
        });
        tab._articulosListenerAgregado = true;
    }
}

// Llama a esta función para agregar el listener de submit solo si el botón existe
function agregarListenerSubmitArticulos() {
    const btn = document.querySelector('.button-center button[type="submit"]');
    if (btn) {
        btn.addEventListener('click', e => {
            validarChecksArticulos();
            if (document.querySelector('.articulos-error')) {
                e.preventDefault();
                alert('Debes seleccionar al menos una opción en cada tabla.');
            }
        });
    }
}

function inicializarEstadoArticulos() {
    try {
        const savedState = localStorage.getItem('articulosCheckboxState');
        if (savedState) {
            window.setArticulosCheckboxState(JSON.parse(savedState));
        }
    } catch (e) {
        console.warn('Error al restaurar estado de artículos:', e);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    agregarListenerSubmitArticulos();
    agregarListenerChangeArticulos();
});

window.initArticulosTabEvents = function () {
    agregarListenerChangeArticulos();
    agregarListenerSubmitArticulos();
    inicializarEstadoArticulos();
}


// --- Persistencia de estado de checkboxes para tabs.js ---
// Devuelve un objeto con el estado de todos los checkboxes de cada columna
window.getArticulosCheckboxState = function (useCache = false) {
    // Si useCache es true y ya tenemos el estado guardado, devolverlo directamente
    if (useCache && window.articulosCheckboxState && window.articulosCodigosMap) {
        return {
            state: window.articulosCheckboxState,
            codigosMap: window.articulosCodigosMap
        };
    }
    const columnas = [
        'categoria-list',
        'depositos-list',
        'grupoartic-list',
        'claseartic-list',
        'lineas-list',
        'marcas-list',
        'tipoartic-list',
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
    window.articulosCheckboxState = state;
    window.articulosCodigosMap = codigosMap;

    // Persistir en localStorage
    try {
        localStorage.setItem('articulosCheckboxState', JSON.stringify(state));
        localStorage.setItem('articulosCodigosMap', JSON.stringify(codigosMap));
    } catch (e) {
        console.warn('Error al guardar estado de artículos en localStorage:', e);
    }

    // IMPORTANTE: Return FUERA del forEach
    return { state, codigosMap };
};

// Restaura el estado de los checkboxes a partir de un objeto de estado
window.setArticulosCheckboxState = function (state) {
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
        const colDiv = cont.closest('.articulos-col');
        if (colDiv) {
            const cabeceraCheck = colDiv.querySelector('.articulos-title input[type="checkbox"]');
            const hijosChecks = cont.querySelectorAll('input[type="checkbox"]');
            if (cabeceraCheck) {
                const todosMarcados = Array.from(hijosChecks).every(c => c.checked);
                cabeceraCheck.checked = todosMarcados;
            }
        }
    });
    // Actualiza validación visual
    if (typeof validarChecksArticulos === 'function') {
        validarChecksArticulos();
    }
};

window.getArticulosSeleccionados = function () {
    const result = window.getArticulosCheckboxState(true);

    // Validar que result tenga la estructura esperada
    if (!result || !result.state || !result.codigosMap) {
        console.error('Error: getArticulosCheckboxState devolvió un valor incorrecto', result);
        return {}; // Devolver objeto vacío para evitar errores
    }

    const { state, codigosMap } = result;
    const seleccionados = {};

    Object.keys(state).forEach(id => {
        const listName = id.replace('-list', ''); // Convertir 'depositos-list' a 'depositos'

        // Verificar si todos los elementos están seleccionados (excepto el primero que es el 0)
        const totalItems = state[id].length;
        if (totalItems <= 1) {
            seleccionados[listName] = '';
            return; // Continuar con la siguiente lista
        }

        // Los elementos reales comienzan en el índice 1 (saltando el 0.vacío)
        const itemsReales = state[id].slice(1);

        // Verificar si todos están seleccionados
        const todosSeleccionados = itemsReales.every(checked => checked === true);

        if (todosSeleccionados) {
            // Si todos están seleccionados, simplemente no incluimos este campo en seleccionados
            // Esto hará que se genere un tag XML vacío como <marca></marca>
            seleccionados[listName] = '';
        } else {
            // Si no todos están seleccionados, guardar solo los índices seleccionados
            const indicesSeleccionados = [];

            // Comenzamos desde el índice 1 para ignorar el "0.vacío"
            for (let i = 1; i < state[id].length; i++) {
                if (state[id][i]) {
                    // Obtener el código correspondiente (número antes del punto)
                    const codigo = codigosMap[id][i].split('.')[0];
                    if (codigo) {
                        indicesSeleccionados.push(codigo);
                    }
                }
            }

            // Unir con comas y guardar
            seleccionados[listName] = indicesSeleccionados.join(',');
        }
    });

    return seleccionados;
};