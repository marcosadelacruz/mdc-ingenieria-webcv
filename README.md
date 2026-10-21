# MDC · Ingeniería de detalle y gestión de ingeniería

Web CV de Marcos Alejandro De La Cruz. Servicios de ingeniería mecánica, ingeniería de detalle, gestión de ingeniería y planificación de proyectos.

## Sitio
La web pública se sirve desde `docs/`. El contenido usa HTML y CSS; JavaScript controla el menú, el formulario de cotización y el efecto amarillo por proximidad del cursor.

El formulario prepara una solicitud dirigida a **+1 (849) 652-0907**. Al final el visitante abre WhatsApp con el mensaje completo y pulsa **Enviar** para entregarlo. No hay backend de envío automático, almacenamiento de solicitudes ni cálculo automático de precios.

## GitHub Pages
En el repositorio: **Settings → Pages → Deploy from a branch → main → /docs → Save**. GitHub Pages publicará `docs/index.html` y los recursos de `docs/assets/`.

## Editar y verificar
- `docs/index.html`: estructura, formulario y texto editorial.
- `docs/assets/style.css`: diseño y adaptación a móvil.
- `docs/assets/app.js`: interacciones y validación.
- `docs/assets/quote-message.js`: mensaje y enlace de WhatsApp.
- `content/profile.json`: servicios, experiencia y teléfono de destino.
- `content/cv.pdf`: CV descargable.
- `docs/assets/*.webp`: fotografías optimizadas de la web.

Después de cambiar el perfil o el CV:
```bash
python3 build.py
python3 tests/qa.py
node tests/quote-message.test.js
node --check docs/assets/app.js
```
Después, subir los archivos modificados, incluidos los cambios generados en `docs/`. La publicación utiliza archivos estáticos; no requiere instalar paquetes ni ejecutar Python en el servidor.

## Revisión antes de compartir
- Comprobar el sitio desde un teléfono real.
- Enviar una solicitud real propia desde el formulario y confirmar su recepción en WhatsApp.
- Confirmar fechas del CV y mantener actualizados los datos de contacto.

Ver `QA_REPORT.md` para el alcance y los límites de las pruebas realizadas. Ninguna prueba automática ha enviado mensajes reales.

## Derechos
No se concede una licencia abierta de reutilización. Las marcas de terceros conservan sus derechos respectivos.
