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

        return true;
    } catch (error) {
        console.error('Error al cargar el modal:', error);
        return false;
    }
}

// Mostrar el modal con mensajes de error
async function mostrarModalError(mensajes, callback) {
    // Marca que se ha mostrado un modal de error
    window.modalUtils.lastModalWasShown = true;

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

// Función para mostrar mensaje de éxito con opción de salir
async function mostrarModalExito(mensajes, callback) {
    await cargarModalHTML();

    const modal = document.getElementById('error-modal');
    if (!modal) return;

    // Cambiar título y estilo para modal de éxito
    const modalContent = modal.querySelector('.modal-content');
    if (!modalContent) return;

    // Crear o actualizar el encabezado
    let modalHeader = modal.querySelector('.modal-header');
    if (!modalHeader) {
        modalHeader = document.createElement('div');
        modalHeader.className = 'modal-header';
        modalContent.appendChild(modalHeader);
    }
    modalHeader.innerHTML = '<h3>Confirmación</h3>';

    // Crear o actualizar el cuerpo del modal
    let modalBody = modal.querySelector('.modal-body');
    if (!modalBody) {
        modalBody = document.createElement('div');
        modalBody.className = 'modal-body';
        modalContent.appendChild(modalBody);
    }

    // Contenido del mensaje con estilo similar a la imagen
    modalBody.innerHTML = `
        <div style="display: flex; align-items: center; margin-bottom: 20px;">
            <div>
                <p>Configuración guardada exitosamente. ¿Desea salir del programa?</p>
            </div>
        </div>
    `;

    // Crear o actualizar el footer con botones
    let modalFooter = modal.querySelector('.modal-footer');
    if (!modalFooter) {
        modalFooter = document.createElement('div');
        modalFooter.className = 'modal-footer';
        modalContent.appendChild(modalFooter);
    }

    // Botones en español, como en la imagen
    modalFooter.innerHTML = `
        <button id="modal-yes-btn" class="btn btn-primary">Sí</button>
        <button id="modal-no-btn" class="btn">No</button>
    `;

    // Mostrar el modal
    modal.style.display = 'block';

    // Configurar eventos de botones
    const yesBtn = document.getElementById('modal-yes-btn');
    const noBtn = document.getElementById('modal-no-btn');

    yesBtn.onclick = function () {
        cerrarModal();
        if (typeof callback === 'function') {
            callback(true); // true indica "Sí"
        }
    };

    noBtn.onclick = function () {
        cerrarModal();
        if (typeof callback === 'function') {
            callback(false); // false indica "No"
        }
    };
}

// Cerrar el modal
function cerrarModal() {
    const modal = document.getElementById('error-modal');
    if (modal) {
        modal.style.display = 'none';

        // Resetear la bandera cuando se cierra el modal
        window.modalUtils.lastModalWasShown = false;

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
    cargarModalHTML,
    lastModalWasShown: false
};
