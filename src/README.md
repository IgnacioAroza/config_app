# Coliseo - Configurador de Fuerza de Venta

Aplicación de escritorio para la configuración y gestión de parámetros de Fuerza de Venta, desarrollada con Electron y JavaScript.

<p align="center">
  <img src="assets/logo.png" alt="Logo de Coliseo" width="200">
</p>

## Descripción

Coliseo es una herramienta que permite configurar todos los parámetros necesarios para el sistema Fuerza de Venta, incluyendo:

- Rutas de archivos y carpetas del sistema
- Configuración de empresas
- Filtrado y selección de artículos para exportación
- Filtrado y selección de clientes para exportación
- Parámetros generales del sistema

## Requisitos previos

- Windows 10 o superior
- Acceso a las carpetas del sistema ERP
- Permisos de administrador para instalar la aplicación

## Instalación

### Opción 1: Instalador

1. Ejecuta `Coliseo-1.0.0 Setup.exe`
2. Sigue las instrucciones del instalador
3. La aplicación se instalará y creará accesos directos

### Opción 2: Versión portable

1. Descomprime el archivo ZIP en la ubicación deseada
2. Ejecuta `Coliseo.exe` para iniciar la aplicación


## Uso

1. **Pestaña General**: Configura las rutas de las carpetas del sistema
   - ERP Folder: Carpeta raíz del ERP
   - Data Folder: Carpeta de datos
   - Export Folder: Carpeta donde se guardarán los archivos exportados
   - Temp Folder: Carpeta temporal para procesos intermedios

2. **Pestaña Empresas**: Selecciona las empresas disponibles para exportación
   - Activar/desactivar empresas
   - Establecer rutas específicas para cada empresa

3. **Pestaña Artículos**: Configura los filtros para la exportación de artículos
   - Selección por depósito, categoría, línea, etc.
   - Activar/desactivar exportación para cada artículo

4. **Pestaña Clientes**: Configura los filtros para la exportación de clientes
   - Selección por zona, grupo, tipo, etc.
   - Activar/desactivar exportación para cada cliente

5. **Guardar Configuración**: Presiona el botón "Guardar" para almacenar todos los cambios

## Formato del archivo de configuración

El archivo `settings.config` utiliza formato XML para almacenar la configuración:

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <erpfolder>C:\Coliseo\ERP</erpfolder>
  <datafolder>C:\Coliseo\ERP\Data</datafolder>
  <exportfolder>C:\Coliseo\Fuerzadeventa\Exportacion</exportfolder>
  <tempfolder>C:\Coliseo\Fuerzadeventa\Temp</tempfolder>
  <!-- Continúa con el resto de configuraciones -->
</configuration>