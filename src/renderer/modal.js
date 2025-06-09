// Este archivo maneja la carga y funcionalidad del modal reutilizable

// Cargar el HTML del modal si aún no está cargado
async function cargarModalHTML() {
    // Verificar si el modal ya está en el DOM
    if (document.getElementById('error-modal')) {
        return;
    }

    try {
        // Cargar el HTML del modal desde el archivo
        const response = await fetch('./html/modal.html');
        const html = await response.text();

        // Crear un contenedor para el modal
        const modalContainer = document.createElement('div');
        modalContainer.id = 'modal-container';
        modalContainer.innerHTML = html;

        // Agregar el modal al final del body
        document.body.appendChild(modalContainer);

        // Agregar event listeners para cerrar el modal
        const closeButtons = document.querySelectorAll('.close-modal, #cerrar-modal-btn');
        closeButtons.forEach(button => {
            button.addEventListener('click', cerrarModal);
        });

        // Cerrar modal al hacer clic fuera del contenido
        const modal = document.getElementById('error-modal');
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                cerrarModal();
            }
        });

        // Cerrar modal con tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                cerrarModal();
            }
        });

        console.log('Modal cargado correctamente');
        return true;
    } catch (error) {
        console.error('Error al cargar el modal:', error);
        return false;
    }
}

// Mostrar el modal con mensajes de error
async function mostrarModalError(mensajes, callback) {
    // Asegurarse de que el HTML del modal esté cargado
    await cargarModalHTML();

    // Obtener el modal y la lista de errores
    const modal = document.getElementById('error-modal');
    const errorList = document.getElementById('error-list');
    const modalHeader = modal.querySelector('.modal-header');
    const modalTitle = modalHeader.querySelector('h3');

    // Configurar como modal de error
    modalHeader.style.backgroundColor = '#ffebee';
    modalHeader.style.color = '#d32f2f';
    modalTitle.textContent = 'Por favor, corrija los siguientes errores:';

    // Limpiar lista de errores anterior
    errorList.innerHTML = '';

    // Agregar los mensajes de error a la lista
    mensajes.forEach(mensaje => {
        const item = document.createElement('li');
        item.textContent = mensaje;
        errorList.appendChild(item);
    });

    // Mostrar el modal
    modal.style.display = 'block';

    // Guardar el callback para ejecutarlo al cerrar
    modal._closeCallback = callback || null;
}

// Mostrar el modal con mensajes de éxito
async function mostrarModalExito(mensajes, callback) {
    // Asegurarse de que el HTML del modal esté cargado
    await cargarModalHTML();

    // Obtener el modal y la lista de mensajes
    const modal = document.getElementById('error-modal');
    const errorList = document.getElementById('error-list');
    const modalHeader = modal.querySelector('.modal-header');
    const modalTitle = modalHeader.querySelector('h3');

    // Configurar como modal de éxito
    modalHeader.style.backgroundColor = '#e8f5e9';
    modalHeader.style.color = '#2e7d32';
    modalTitle.textContent = '¡Operación completada con éxito!';

    // Limpiar lista de mensajes anterior
    errorList.innerHTML = '';

    // Agregar los mensajes de éxito a la lista
    mensajes.forEach(mensaje => {
        const item = document.createElement('li');
        item.textContent = mensaje;
        item.style.color = '#2e7d32';
        errorList.appendChild(item);
    });

    // Mostrar el modal
    modal.style.display = 'block';

    // Guardar el callback para ejecutarlo al cerrar
    modal._closeCallback = callback || null;
}

// Cerrar el modal
function cerrarModal() {
    const modal = document.getElementById('error-modal');
    if (modal) {
        modal.style.display = 'none';

        // Ejecutar callback si existe
        if (typeof modal._closeCallback === 'function') {
            modal._closeCallback();
            modal._closeCallback = null;
        }
    }
}

// Exponer las funciones globalmente
window.modalUtils = {
    mostrarModalError,
    mostrarModalExito,
    cerrarModal,
    cargarModalHTML
};
