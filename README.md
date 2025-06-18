# Instrucciones para descargar y ejecutar el proyecto Coliseo

## Opción 1: Descargar usando Git

1. **Descargar el proyecto**
   - Abre el programa "Símbolo del sistema" o "Terminal" en tu computadora
   - Copia y pega este comando:
   ```
   git clone https://github.com/tuusuario/Coliseo.git
   ```
   - Luego escribe:
   ```
   cd Coliseo
   ```

2. **Instalar lo necesario para que funcione**
   - En la misma ventana, escribe:
   ```
   npm install
   ```
   - Espera a que termine (puede tardar unos minutos)

3. **Iniciar el programa**
   - Finalmente, escribe:
   ```
   npm start
   ```
   - El programa debería abrirse automáticamente

## Opción 2: Descargar como archivo ZIP

1. **Descargar el programa**
   - Usa el archivo ZIP que recibiste por correo electrónico
   - O descárgalo desde el enlace que te proporcionaron

2. **Preparar el programa**
   - Busca el archivo ZIP descargado en tu computadora
   - Haz clic derecho sobre él y selecciona "Extraer todo..." o "Descomprimir aquí"
   - Se creará una carpeta con todos los archivos del programa

3. **Instalar lo necesario**
   - Abre la carpeta que acabas de crear
   - Mantén presionada la tecla Shift y haz clic derecho en un espacio vacío dentro de la carpeta
   - Selecciona "Abrir ventana de PowerShell aquí" o "Abrir ventana de comandos aquí"
   - En la ventana que aparece, escribe:
   ```
   npm install
   ```
   - Espera a que termine (puede tardar unos minutos)

4. **Iniciar el programa en modo desarrollo**
   - En la misma ventana, escribe:
   ```
   npm run start
   ```
   - El programa debería abrirse automáticamente

5. **Compilar programa**
   - En la misma ventana, escribe:
   ```
   npm run build
   ```
   - Esperar a que genere los archivos
   - El comando generara una carpeta llamada 'dist'
   - Abrir la carpeta 'dist' dentro va a estar el archivo ejecutable

## Estructura del proyecto
   El proyecto es una aplicación Electron que configura parámetros para Fuerza de Venta:

   - Carpeta main: Contiene los archivos del proceso principal de Electron
   - Carpeta renderer: Contiene la lógica del frontend
   - Carpeta public: Contiene los archivos HTML y CSS de la interfaz

## Lo que necesitas tener instalado antes de empezar

- **Node.js**: Si no lo tienes, descárgalo e instálalo desde [nodejs.org](https://nodejs.org)
  - Durante la instalación, simplemente haz clic en "Siguiente" en todas las opciones

## ¿Problemas?

Si el programa no se inicia correctamente:
- Asegúrate de haber seguido todos los pasos en orden
- Verifica que hayas instalado Node.js correctamente
- Intenta reiniciar tu computadora y volver a intentarlo

Para cualquier consulta adicional, por favor contáctanos por correo electrónico.