# RentBuild — DataFlux

Sitio público de RentBuild construido con HTML, CSS y JavaScript estándar. Conserva el diseño, las imágenes, los textos EN/ES y los flujos del sitio original. No utiliza componentes ni dependencias de Vue.

## Ejecutar

Requisitos: Node.js 22.12 o superior (se verificó con Node.js 24) y npm.

```bash
npm ci
npm run dev
```

Para generar y revisar la versión publicable:

```bash
npm run build
npm run preview
```

Publicar el contenido de `dist/` en un alojamiento estático. En Vercel o Render Static Site usar `npm ci && npm run build` y `dist` como directorio de salida. La base relativa permite alojar el resultado en una subcarpeta. Vite es únicamente la herramienta de desarrollo y compilación; el navegador recibe HTML, CSS y JavaScript.

## Estructura

- `index.html`: documento de entrada, metadatos y carga de JavaScript.
- `src/templates/en.html` y `es.html`: estructura HTML de la página en ambos idiomas, sin directivas ni componentes de framework.
- `src/landing.js`: menú, idioma, acordeones, planes, diálogos y formularios.
- `src/dashboard/`: panel de demostración, datos de ejemplo e iconos.
- `src/i18n.js` y `src/locales/`: traducciones de controles dinámicos mediante JavaScript.
- `src/shared/dom.js`: diálogos accesibles, escape de texto y peticiones HTTP.
- `src/assets/styles/`: CSS modular original y estilos de los bloques de video.
- `public/`: logotipos, ilustraciones, fotos e iconos originales.
- `tests/`: pruebas de navegador con Playwright.

Al modificar los textos o la estructura de una sección, actualizar ambas plantillas HTML. Los textos de los formularios dinámicos y del panel se editan en los JSON de traducción. Los archivos HTML son código fuente editable: no requieren regeneración ni el framework anterior.

## Funciones conservadas

- Selector EN/ES con persistencia, navegación por secciones y menú móvil con cierre mediante Escape.
- Acordeones, selección de facturación mensual/anual y selección de plan.
- Diálogos con bloqueo de desplazamiento y restauración del foco.
- Enlaces de ingreso y registro a `https://dataflux-webapp.vercel.app/iam/sign-in` y `/iam/sign-up`, como en el repositorio original.
- Registro e ingreso de demostración desde el diálogo de planes, con sesión durante la pestaña activa y cierre de sesión.
- Panel con perfil, inventario, registro de maquinaria, solicitudes, alquileres activos, mantenimiento, incidentes, historial filtrado y catálogo con filtros.
- Detalle de maquinaria accesible por ratón y teclado. Registrar mantenimiento actualiza el estado, la fecha y el historial de la maquinaria.
- Contacto y newsletter con validación, control de envíos repetidos, espera máxima de 10 segundos y mensajes de éxito/error.

El panel sigue siendo una demostración: contiene registros de ejemplo, los cambios de inventario/mantenimiento viven en memoria y se reinician al recargar. Los alquileres activos se calculan a partir de la fecha real; las solicitudes de ejemplo vencidas no aparecen como activas. La sesión guarda únicamente datos de presentación, nunca contraseñas. No sustituye la autenticación ni la autorización de la aplicación de producto.

## Configurar servicios

Copiar `.env.example` a `.env.local`, completar las variables necesarias y volver a compilar. Todas las variables `VITE_` son públicas; no colocar secretos.

- `VITE_LOGIN_URL` / `VITE_SIGNUP_URL`: destinos externos de ingreso/registro; también se respetan desde el diálogo de planes.
- `VITE_LOGIN_ENDPOINT` / `VITE_SIGNUP_ENDPOINT`: POST JSON de los formularios locales. El registro incluye `name`, `email`, `company`, `phone`, `password`, `plan` y `period`. El ingreso envía `email` y `password`.
- `VITE_CONTACT_FORM_ENDPOINT`: POST JSON con `name`, `email` y `message`.
- `VITE_NEWSLETTER_ENDPOINT`: POST JSON con `email`.
- `VITE_CONTACT_EMAIL`: correo de contacto visible.
- `VITE_TERMS_URL` / `VITE_PRIVACY_URL`: documentos legales externos.
- `VITE_SOCIAL_GITHUB`, `VITE_SOCIAL_X`, `VITE_SOCIAL_DISCORD`, `VITE_SOCIAL_BLUESKY`: redes visibles cuando están configuradas.

Los endpoints deben aceptar JSON y permitir el origen de la página mediante CORS cuando corresponda. Un HTTP no exitoso muestra un error; no se presenta como envío correcto. Sin endpoints de contacto/newsletter, se informa que los datos no se enviaron. Sin endpoints de ingreso/registro, los formularios locales conservan el modo demo original. Incluso con un POST de autenticación aceptado, este sitio muestra el panel demo; la sesión real del producto se gestiona en la aplicación enlazada.

Los videos no estaban incluidos en el repositorio. Se mantienen los avisos de disponibilidad pendiente. Se pueden incorporar `public/assets/videos/product-demo.mp4` y `about-rentbuild.mp4` y recompilar. Los enlaces legales sin URL configurada muestran el aviso informativo original; no son documentos legales completos.

## Verificación

```bash
npm run build
npx playwright install chromium
npm test
```

En equipos con Microsoft Edge instalado se puede evitar la descarga de Chromium. En PowerShell:

```powershell
$env:PLAYWRIGHT_CHANNEL = 'msedge'
npm test
```

Las pruebas verifican la versión de producción y otra instancia con endpoints HTTP interceptados para comprobar cargas JSON, respuestas correctas y errores sin enviar mensajes reales. Los puertos de prueba son 4180 y 4182.
