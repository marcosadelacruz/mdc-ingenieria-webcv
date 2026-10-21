# Auditoría QA · MDC Web CV
Fecha: 21 de octubre de 2026.

## Resultado
QA funcional favorable en el alcance comprobado. No se detectaron desbordamientos horizontales en los seis anchos ensayados. Se corrigieron dependencias innecesarias de JavaScript, peso de imágenes, contraste de numeración y navegación por teclado. No equivale a certificación WCAG ni a una prueba en todos los navegadores/dispositivos.

## Hallazgos y correcciones
| Hallazgo | Corrección | Comprobación |
|---|---|---|
| Servicios y experiencia se insertaban con JavaScript y desaparecían sin él | Generación de HTML estático desde content/profile.json | 4 servicios y 4 experiencias presentes también con scripts bloqueados |
| Imágenes PNG: 5.624.793 bytes | WebP; originales conservados en content/images | 736.782 bytes; reducción del 86,9 % |
| Numeración pequeña con contraste 3,10:1 sobre el fondo | Color oscuro de acento | Contraste calculado 5,77:1 |
| Menú móvil sin etiqueta dinámica ni retorno del foco al cerrar con Escape | Etiquetas Abrir/Cerrar, Escape y foco; cierre al cambiar a escritorio | Apertura, Tab, Escape y enlace a Trayectoria comprobados |
| Enlaces de cabecera y llamada secundaria con zonas de interacción de 14–23 px de alto | Altura mínima de 44 px | Sin objetivos visibles menores de 24 px en la revisión de escritorio |
| Lectura de párrafos muy pequeña en móvil | Ajuste a 13 px en los bloques principales | Revisión visual de móvil |
| Icono y metadatos sociales básicos ausentes | Favicon SVG, título/descripción Open Graph y preconexión de fuentes | Validación de referencias y metadatos |

## Pruebas realizadas
- Chrome remoto, vista previa interna. Marcos de contenido con anchos nominales 320, 390, 768, 1024, 1440 y 1920 px. La barra de desplazamiento de escritorio resta 15 px al área útil de cada marco; no es una emulación de hardware móvil.
- En los seis anchos: scrollWidth igual al ancho útil y ningún elemento de contenido fuera de los límites horizontales.
- 4 servicios: apertura/cierre, exclusividad de apertura nativa y activación con Enter.
- 3 preguntas frecuentes: apertura de sus respuestas.
- Menú móvil: aria-expanded, etiqueta Abrir/Cerrar, navegación con Tab, cierre con Escape y foco devuelto al botón; selección de Trayectoria cierra el menú y dirige el foco a la sección.
- Scripts bloqueados: servicios y experiencia presentes; enlaces móviles visibles y botón no operativo oculto.
- Tres imágenes con texto alternativo y dimensiones explícitas. Encuadre de la fotografía del taller revisado en móvil.
- Modelo 3D WebP: los píxeles RGB decodificados son idénticos a los del PNG de origen. Fotografías 01 y 03 usan compresión fotográfica; conservan las dimensiones y el tratamiento de color, con pérdida controlada de compresión.
- Integridad estática: 27 referencias, anclas existentes, recursos locales presentes, IDs únicos, un H1, 4 experiencias y 7 acordeones en el HTML.
- CV publicado en dist: SHA-256 idéntico al PDF fuente.
- Correo, teléfono y LinkedIn coinciden con los datos proporcionados. No se envió correo ni se inició una llamada.
- Sintaxis JavaScript comprobada con node --check.

## Límites y pendientes
- LinkedIn: la consulta externa fue rechazada por el servicio de lectura; se verificó la URL configurada, no la disponibilidad del perfil.
- CV: el archivo, la referencia y la identidad binaria están validados. La herramienta del navegador no confirmó el evento de descarga (agotó el tiempo de espera); no se declara comprobada la descarga automática en el equipo del visitante. El servidor de vista previa tampoco es accesible por 127.0.0.1 desde el entorno de ejecución; esas solicitudes rechazadas son un límite del entorno y no una respuesta 404 del sitio.
- No se probaron Safari, Firefox, un dispositivo iOS/Android real ni lector de pantalla. No se ejecutaron Lighthouse, axe ni una auditoría WCAG completa.
- No se ha medido velocidad de carga real ni Core Web Vitals; la mejora cuantificada es el peso de las imágenes.
- El sitio continúa privado. No se declara validada su indexación pública ni la previsualización en LinkedIn.
- Fechas laborales del CV y nombres/alcances/resultados de proyectos requieren confirmación de Marcos antes de ampliar el portafolio. No se inventaron casos, resultados o acreditaciones.

## Reproducibilidad
Ejecutar:
```
python3 build.py
python3 tests/qa.py
node --check dist/assets/app.js
```
El arnés de vistas de QA se retira antes de la publicación y no forma parte del sitio.


## Ampliación: cotización por WhatsApp
Se reemplazó Escribir por correo por Cotiza conmigo. Diálogo modal con proyecto, alcance, contacto y revisión. Destino: +1 (849) 652-0907, procedente del perfil. Botón final Abrir WhatsApp; el cliente debe pulsar Enviar dentro de WhatsApp. No hay envío automático ni confirmación falsa de recepción.

Comprobado en Chrome:
- Apertura desde la llamada a la acción; cierre con Escape y con el botón, retorno de foco y restauración de desplazamiento.
- Foco de teclado limitado al diálogo con Tab y Shift+Tab.
- Bloqueo por campos vacíos, ausencia de servicios, alcance menor de 20 caracteres, teléfono inválido, correo inválido y falta de aceptación.
- Avance de los cuatro pasos, selección múltiple de servicios y entregables; vuelta al paso anterior conservando los datos y regenerando el resumen tras una edición.
- Mensaje completo, acentos, saltos de línea y símbolos +, & y # conservados; enlace HTTPS al número correcto. El resumen usa texto y no interpreta marcado del visitante.
- Anchos nominales 320 y 390 px: diálogo abierto sin desbordamiento horizontal; desplazamiento vertical disponible para formularios largos.
- Pruebas unitarias de formato, destino, codificación URL, fecha, opcionales, longitud del mensaje y teléfonos.

No se abrió el enlace final durante QA ni se enviaron solicitudes ficticias. La recepción real, la existencia de la cuenta WhatsApp en ese número y el comportamiento en la aplicación del cliente requieren una prueba real del propietario. Si el navegador del visitante no ejecuta JavaScript, se ofrece un enlace directo a WhatsApp.

Comando adicional: `node tests/quote-message.test.js`.

## Efecto de proximidad del botón
Cotiza conmigo cambia a amarillo #ffdc32 con texto negro cuando el ratón entra a 64 px del borde, al pasar sobre él o al recibir foco de teclado. Comprobado con un cursor fuera del botón: is-near=true, hover=false, fondo rgb(255,220,50) y texto rgb(0,0,0). Al alejar el cursor vuelve al fondo original; al pulsarlo el diálogo continúa abriendo. Sin nuevas dependencias.
