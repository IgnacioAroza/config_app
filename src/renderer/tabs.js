document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('content');
    const tabButtons = document.querySelectorAll('.tab-button');    // Objetos para guardar el estado de los checkboxes de cada pestaña
    const checkboxStates = {
        articulos: null,
        clientes: null,
        general: null
    };
    let lastTab = null;

    // Cargar configuración desde el archivo XML al inicio
    async function cargarConfiguracionInicial() {
        try {
            const config = await window.electron.loadConfig();

            // Guardar las rutas principales
            if (config.erpfolder) {
                window.currentDataFolder = config.datafolder || '';
            }

            // Al iniciar, solo seteamos los valores que necesitamos de inmediato
            // El resto se cargará cuando se abra cada pestaña
            return config;
        } catch (error) {
            console.error('Error al cargar configuración inicial:', error);
            return null;
        }
    }

    function loadTabCss(tabName) {
        // Elimina el CSS anterior de pestaña si existe
        const oldLink = document.getElementById('tab-css');
        if (oldLink) oldLink.remove();

        // Crea el nuevo link para el CSS de la pestaña
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.id = 'tab-css';
        link.href = `./styles/${tabName}.css`;
        document.head.appendChild(link);
    } async function loadTab(tabName) {
        // Antes de cambiar de pestaña, guardar el estado de la pestaña actual
        if (lastTab) {
            if (lastTab === 'articulos' && typeof window.getArticulosCheckboxState === 'function') {
                checkboxStates.articulos = window.getArticulosCheckboxState();
            } else if (lastTab === 'clientes' && typeof window.getClientesCheckboxState === 'function') {
                checkboxStates.clientes = window.getClientesCheckboxState();
            } else if (lastTab === 'general' && typeof window.getGeneralConfig === 'function') {
                checkboxStates.general = window.getGeneralConfig();
            }
        }

        const response = await fetch(`./html/${tabName}.html`);
        const html = await response.text();
        content.innerHTML = html;

        if (tabName === 'articulos') {
            if (window.currentDataFolder) {
                // Esperar a que todas las funciones cargarXxx terminen antes de inicializar eventos
                await Promise.all([
                    typeof cargarDepositos === 'function' ? cargarDepositos(window.currentDataFolder) : Promise.resolve(),
                    typeof cargarLineas === 'function' ? cargarLineas(window.currentDataFolder) : Promise.resolve(),
                    typeof cargarGrupoArticulos === 'function' ? cargarGrupoArticulos(window.currentDataFolder) : Promise.resolve(),
                    typeof cargarClaseArticulos === 'function' ? cargarClaseArticulos(window.currentDataFolder) : Promise.resolve(),
                    typeof cargarMarcas === 'function' ? cargarMarcas(window.currentDataFolder) : Promise.resolve(),
                    typeof cargarTipoArticulos === 'function' ? cargarTipoArticulos(window.currentDataFolder) : Promise.resolve(),
                ]);
                if (window.initArticulosTabEvents) {
                    window.initArticulosTabEvents();
                }
                // Restaurar estado de checkboxes si existe
                if (checkboxStates.articulos && typeof window.setArticulosCheckboxState === 'function') {
                    window.setArticulosCheckboxState(checkboxStates.articulos);
                }
            } else {
                console.warn('Debes seleccionar primero la carpeta ERP para cargar los datos de artículos.');
            }
        } else if (tabName === 'clientes') {
            if (window.currentDataFolder) {

                // Esperar a que todas las funciones cargarXxx terminen antes de inicializar eventos
                await Promise.all([
                    typeof cargarZonas === 'function' ? cargarZonas(window.currentDataFolder) : Promise.resolve(),
                    typeof cargarListaPrecios === 'function' ? cargarListaPrecios(window.currentDataFolder) : Promise.resolve(),
                    typeof cargarGrupoCliente === 'function' ? cargarGrupoCliente(window.currentDataFolder) : Promise.resolve(),
                    typeof cargarTipoCliente === 'function' ? cargarTipoCliente(window.currentDataFolder) : Promise.resolve(),
                    typeof cargarClaseCliente === 'function' ? cargarClaseCliente(window.currentDataFolder) : Promise.resolve(),
                ]);
                if (window.initClientesTabEvents) {
                    window.initClientesTabEvents();
                }
                // Restaurar estado de checkboxes si existe
                if (checkboxStates.clientes && typeof window.setClientesCheckboxState === 'function') {
                    window.setClientesCheckboxState(checkboxStates.clientes);
                }
            } else {
                console.warn('Debes seleccionar primero la carpeta ERP para cargar los datos de clientes.');
            }
        } else if (tabName === 'empresas') {
            // Usar la función initEmpresasTab que ya tiene la lógica de verificación
            if (typeof window.initEmpresasTab === 'function') {
                await window.initEmpresasTab();
            } else if (typeof window.revalidarEmpresas === 'function') {
                // Si la función de inicializar no está disponible pero sí la de revalidar
                window.revalidarEmpresas();
            } else {
                // Si ninguna función está disponible, intentar cargar empresas directamente
                if (window.currentDataFolder && typeof cargarEmpresas === 'function') {
                    cargarEmpresas(window.currentDataFolder);
                } else {
                    console.warn('No se pudo inicializar la pestaña de empresas: funciones no disponibles');
                }
            }
        } else if (tabName === 'general') {
            // Restaurar configuración general si existe
            if (checkboxStates.general && typeof window.setGeneralConfig === 'function') {
                window.setGeneralConfig(checkboxStates.general);
            } else if (window.configActual) {
                // Si hay configuración global cargada desde XML, usarla
                const generalConfig = {
                    erpFolder: window.configActual.erpfolder || '',
                    dataFolder: window.configActual.datafolder || '',
                    exportFolder: window.configActual.exportfolder || '',
                    tempFolder: window.configActual.tempfolder || '',
                    idSuscriptor: window.configActual.idsuscriptor || '',
                    nombreEmpresa: window.configActual.nombreempresa || '',
                    alicuota: window.configActual.alicuotapordefecto || '',
                    remitenteCorreo: window.configActual.remitentecorreo || '',
                    destinatarioCorreo: window.configActual.destinatariocorreo || '',
                    destinatarioCc: window.configActual.destinatariocorreocopia || '',
                    destinatarioCco: window.configActual.destinatariocorreocopiaoculta || '',
                    exportFile: window.configActual.exportfile ? 'true' : 'false',
                    exportApi: window.configActual.exportapi ? 'true' : 'false',
                    test: window.configActual.test ? 'true' : 'false'
                };

                // Guardar en window.generalConfig para uso posterior
                window.generalConfig = generalConfig;

                // Si hay función para restaurar, usarla
                if (typeof window.setGeneralConfig === 'function') {
                    window.setGeneralConfig(generalConfig);
                }
            } else if (window.currentDataFolder) {
                // Si no hay estado guardado pero sí hay una carpeta ERP seleccionada,
                // asegurarse de que se carguen las alícuotas
                window.electron.invoke('get-alicuotas', window.currentDataFolder).then(alicuotas => {
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
                }).catch(err => {
                    console.error('Error al cargar alícuotas en cambio de pestaña:', err);
                });
            }
        }

        loadTabCss(tabName);
        lastTab = tabName;
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    } tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loadTab(btn.getAttribute('data-tab'));
        });
    });

    // Cargar configuración y luego cargar la pestaña inicial
    (async () => {
        const configInicial = await cargarConfiguracionInicial();
        // Si hay una configuración cargada y tiene carpeta ERP, la usamos
        if (configInicial && configInicial.erpfolder) {
            window.configActual = configInicial;
        }
        // Carga la pestaña inicial (general)
        loadTab('general');
    })();
});