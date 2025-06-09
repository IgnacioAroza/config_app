# Coliseo

Aplicación de escritorio para la configuración y gestión de parámetros de Fuerza de Venta, desarrollada con Electron.

## Estructura del proyecto

```
public/
  html/         # Archivos HTML de cada pestaña
  js/           # Scripts JS generales (por ejemplo, tabs)
  styles/       # Archivos CSS por pestaña
src/
  main/         # Lógica del proceso principal de Electron (backend)
  renderer/     # Lógica del frontend (JS de cada pestaña, preload)
package.json    # Configuración y dependencias del proyecto
```

## Instalación

1. Clona el repositorio:
   ```
   git clone <url-del-repo>
   cd Coliseo
   ```
2. Instala las dependencias:
   ```
   npm install
   ```

## Uso

Para iniciar la aplicación en modo desarrollo:
```
npm start
```

## Funcionalidades principales

- Validación de rutas y archivos requeridos.
- Carga y edición de datos desde archivos DBF.
- Configuración de parámetros generales, artículos, clientes y empresas.
- Guardado seguro de la configuración.

## Scripts útiles

- `npm start` — Inicia la app en modo desarrollo.
- `npm run build` — (Si tienes empaquetador) Genera la versión de producción.

## Contribución

1. Haz un fork del repositorio.
2. Crea una rama para tu feature o fix.
3. Haz tus cambios y abre un Pull Request.

## Licencia

[MIT](../LICENSE) (o la que corresponda)

---

> Para dudas o sugerencias, contacta a los administradores del proyecto.