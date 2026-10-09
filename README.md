# RentBuild — DataFlux

Landing page del proyecto académico RentBuild, desarrollado por DataFlux para Aplicaciones Web. Presenta la propuesta de gestión y control de alquileres de maquinaria en el sector construcción.

## Sobre el producto

RentBuild centraliza en un solo dashboard todo lo que hoy se gestiona de forma dispersa con chats, correos y hojas de cálculo. Está diseñada para gerentes de proyectos, equipos de logística e ingenieros residentes que buscan optimizar la disponibilidad, reserva y operación de maquinaria en obra.

La plataforma permite:

- Control digital de pedidos y disponibilidad de equipos.
- Trazabilidad completa de órdenes, cotizaciones y facturas por proyecto.
- Seguimiento del gasto real vs. proyectado para proteger el margen del proyecto.
- Gestión del ciclo completo de alquiler: reservación, entrega, devolución y mantenimiento.

## Sobre este repositorio

Este repositorio contiene el código fuente de la landing page pública del producto. La web está construida con Vue 3 + Vite, es liviana, responsive y soporta dos idiomas (inglés y español) mediante `vue-i18n`.

La propuesta visual se basa en un sistema de diseño modular con CSS Vanilla, usando variables, componentes reutilizables y una estructura clara orientada a la presentación del valor del producto.

## Stack

| Herramienta | Versión |
| --- | --- |
| Vue | 3.5.33 |
| Vite | 5.4.21 |
| @vitejs/plugin-vue | 5.2.4 |
| vue-i18n | 9.14.5 |

El proyecto usa JavaScript con ES Modules, Composition API en `<script setup>`, y estilos en CSS puro con variables, layout y componentes modulares.

## Estructura del proyecto

```text
public/
  assets/
    images/
    videos/
    references/
src/
  App.vue
  main.js
  i18n.js
  locales/
    en.json
    es.json
  assets/styles/
    reset.css
    variables.css
    layout.css
    main.css
    responsive.css
    components/
  shared/presentation/components/
    AccessDialog.vue
    BrandLogo.vue
    ReferenceArtwork.vue
    SiteFooter.vue
    TheHeader.vue
    UserDashboard.vue
    VideoPlaceholder.vue
  value-proposition/presentation/components/
    AboutRentBuild.vue
    AppFeatures.vue
    ContactUs.vue
    OperationOverview.vue
    OurTeam.vue
    PricingCard.vue
    PricingPlans.vue
    ProductShowcase.vue
    RentalBenefits.vue
    TheHero.vue
```

## Ejecutar localmente

Requisitos: Node.js 20.19+ o 22 LTS y npm.

```bash
npm ci
npm run dev
```

Abre la dirección que muestra Vite, normalmente `http://localhost:5173`.

Para compilar la versión de producción:

```bash
npm run build
npm run preview
```

El resultado se genera en `dist/`.

## Funcionalidades principales

- Navegación responsive con menú móvil y cierre con Escape.
- Selector EN/ES con idiomas canónicos `en-US`/`es-419`, aliases anteriores y persistencia local cuando el navegador lo permite. Sin preferencia guardada ni parámetro `lang` válido, el idioma inicial es inglés.
- Secciones con anclas reales para cada bloque de contenido.
- Acordeones accesibles y bloques de información reutilizables.
- Catálogo de planes de referencia TB1: Essential/Professional/Growth, PEN 79/149/249 por mes de demo, alineados con Subscriptions. Las características se identifican como alcance propuesto; las tarjetas abren el acceso y no suscriben, cobran ni habilitan límites comerciales.
- Diálogo de acceso con bloqueo de scroll y restauración del foco.
- Newsletter con validación de email, manejo de errores y tiempo de espera configurable.
- Sección "Contáctanos" con formulario (nombre, correo y mensaje), correo directo y enlaces a redes sociales.
- CTA para los dos segmentos: empresa constructora y empresa de alquiler. Con una URL configurada, abren el registro de la aplicación separada con el parámetro `role` correspondiente.
- Acceso a la aplicación separada mediante su ruta de login; sin URL configurada se muestra un aviso, sin pedir contraseñas ni crear una sesión ficticia en la landing.
- Términos y aviso de privacidad de la demo académica, en inglés y español, con enlaces locales compartibles y navegación por teclado.
- Soporte para movimiento reducido y navegación por teclado.

## Configurar la aplicación TB1 y servicios opcionales

El proyecto está preparado para conectar endpoints reales usando variables de entorno con prefijo `VITE_`.

Ejemplo:

```dotenv
VITE_FRONTEND_URL=
VITE_BASE_PATH=/
VITE_CONTACT_EMAIL=contacto@tu-dominio.example
VITE_NEWSLETTER_ENDPOINT=https://tu-api.example/newsletter
VITE_CONTACT_FORM_ENDPOINT=https://tu-api.example/contacto
VITE_SOCIAL_GITHUB=https://github.com/tu-organizacion
VITE_SOCIAL_X=https://x.com/tu-cuenta
VITE_SOCIAL_DISCORD=https://discord.gg/tu-servidor
VITE_SOCIAL_BLUESKY=https://bsky.app/profile/tu-cuenta
```

Estas URLs son ejemplos y no apuntan a servicios reales de RentBuild. Las variables `VITE_` son públicas en el navegador, así que no se deben incluir claves privadas o tokens sensibles.

Configura `VITE_FRONTEND_URL` con la URL base **real y comprobada** del frontend, conservando su subdirectorio si existe. Debe ser una dirección absoluta HTTP/HTTPS; no debe ser una URL de login/registro ni contener credenciales. Los enlaces eliminan query parameters y fragments anteriores. No hay un destino público predeterminado. Una URL ausente o inválida muestra su propio aviso y no se imprime el valor de configuración.

Los CTA construyen `/iam/sign-up?role=construction_company` para empresas constructoras y `/iam/sign-up?role=rental_company` para empresas de alquiler. "Ingresar" abre `/iam/sign-in`. El botón genérico de registro y las tarjetas de plan permiten elegir segmento. La selección de un plan en la landing es ilustrativa y no crea una suscripción o pago, ni preselecciona un plan en la aplicación.

`src/value-proposition/reference-plans.js` es el catálogo local de referencia, tomado de `server/db.json` del contexto Subscriptions TB1. Conserva sus tres IDs, nombres, importes PEN y ciclo `MONTHLY`; nombres, descripciones y características EN/ES proceden de `subscriptions.plans` del frontend. Al cambiar ese catálogo, actualizar ambos repositorios y comprobar el contrato. No se ofrece un ciclo anual, reportes/PDF ficticios ni acceso comercial activo en estas tarjetas.

Esos roles y la ruta de registro coinciden con el contrato del frontend. Antes de publicar la integración, comprobar que su formulario interpreta `query.role` y preselecciona el segmento sin tratarlo como autorización. Mientras falte la URL o sea inválida, la landing informa que la aplicación no está enlazada; no afirma que un usuario inició sesión.

Los componentes anteriores `AccessDialog.vue` y `UserDashboard.vue` se conservan en el repositorio, pero ya no forman parte del flujo público de acceso. Las variables anteriores de login/registro y documentos legales no controlan ese flujo. Contacto y newsletter mantienen sus endpoints opcionales.

Los documentos locales se abren con `?document=terms&lang=en-US`, `?document=privacy&lang=en-US` y sus versiones `lang=es-419`, bajo la misma base de despliegue. `lang` y la preferencia guardada aceptan también `en`, `es`, `en_US` y `es_419`; el parámetro válido tiene prioridad. Los enlaces de documentos y regreso conservan el idioma canónico. Describen la demo y el comportamiento de esta versión; no son un contrato comercial ni una promesa de backend real.

## Despliegue reproducible

1. Copiar `.env.example` a `.env.local` y completar la URL comprobada del frontend, si ya existe. Las variables Vite se incorporan al compilar; cambiar la URL requiere un nuevo build.
2. Ejecutar `npm ci` y `npm run build`; publicar **el contenido de `dist/`**, no el código fuente ni el servidor de desarrollo. Conservar el SHA/rama y la URL asignada por el proveedor como evidencia.
3. Para Vercel o un Static Site de Render en la raíz del dominio, usar `VITE_BASE_PATH=/`, comando de build `npm run build` y directorio de salida `dist`.
4. El repositorio se renombró a `dataflux-website`. Para su subdirectorio de GitHub Pages, compilar con `VITE_BASE_PATH=/dataflux-website/` o ejecutar `npm run build -- --base=/dataflux-website/`; para un dominio propio en raíz usar `/`. La base debe coincidir con la ruta pública asignada. Publicar `dist` con el flujo Pages autorizado. Esta landing usa anclas y query parameters; sus documentos no requieren una ruta SPA adicional.
5. Comprobar CSS/JS/imágenes, cambio EN/ES, ambos documentos en ambos idiomas y los dos CTA desde la URL real. No afirmar un despliegue exitoso solo porque el proveedor devuelve `success`.

La configuración del hosting, su cuenta y la publicación corresponden al compañero que realiza el despliegue. La URL pública del frontend continúa pendiente de entrega y comprobación; mientras tanto `VITE_FRONTEND_URL` queda vacío. GitHub Pages no ejecuta la fake API del frontend: ese mock requiere un servicio separado o una modalidad local explícita. Este ajuste permite comprobar de forma reproducible la base del build y los assets bajo el subdirectorio.

## Estado actual

La landing mantiene su diseño, textos y secciones. El acceso corresponde a la aplicación separada y depende de su URL configurada; sin ella no se simula una autenticación. El frontend TB1 utiliza una fake API para demostración académica. Newsletter y contacto muestran mensajes informativos cuando no existe un endpoint. No se declara una API propia de producción, un alquiler real o un pago realizado.

## Diseño y contenido

El sitio está orientado a presentar RentBuild como una solución de control operativo para maquinaria y alquileres. Se usaron referencias visuales para construir la composición general, manteniendo los textos y módulos HTML reales en vez de depender de imágenes con texto embebido.

Los colores principales, la tipografía y la arquitectura de secciones están pensados para transmitir confianza, claridad y sentido de operación profesional.

## Verificación

Las pruebas de comportamiento usan `node:test`, sin nuevas dependencias. Cubren los dos roles y rutas de acceso, subdirectorios, limpieza de query/fragment, rechazo de URL/credenciales/modos inválidos, idioma inicial, aliases, preferencias, links bilingües y almacenamiento no disponible:

```bash
node --test src/shared/frontend-links.test.js src/shared/language.test.js src/value-proposition/reference-plans.test.js
npm run build
npm run build -- --base=/dataflux-website/
```

Antes de publicar, comprobar con teclado el selector, los avisos y documentos, Escape y retorno de foco al cerrar el diálogo, y el botón del menú móvil. La revisión local comprobó los dos CTA contra el registro de la webapp y su selección del segmento, términos/privacidad EN/ES, Escape/retorno de foco y menú móvil. A 375 × 812 px la landing y el diálogo no desbordaron horizontalmente. Se utilizó una URL local solo en el proceso de prueba, sin publicarla como destino. El coordinador debe repetir los recorridos con la URL pública; una prueba de helper o un build no confirma un despliegue ni la interpretación de `query.role` en la aplicación separada.

## Repositorio

```text
https://github.com/upc-pre-202620-1asi0730-8093-dataflux/dataflux-website
```

Este proyecto está pensado para evolucionar con imágenes reales, videos productivos y servicios de backend en etapas posteriores.
