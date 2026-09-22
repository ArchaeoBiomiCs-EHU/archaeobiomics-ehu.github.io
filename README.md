# ArchaeoBiomiCs · primera versión

Web estática con ocho páginas, preparada para GitHub Pages. Esta versión contiene ejemplos claramente indicados y aún no se ha publicado.

## Ver la web

Abre `index.html` en un navegador. También puede servirse esta carpeta con cualquier servidor estático. No requiere instalación ni compilación.

## Cambiar contenidos

- `index.html`: portada y publicaciones seleccionadas.
- `research.html`: las dos líneas de investigación.
- `team.html`: siete miembros del grupo con sus fotografías y cargos.
- `publications.html`: referencias de ejemplo; incluye búsqueda y filtro.
- `projects.html`: proyectos de ejemplo.
- `news.html`: noticias de ejemplo.
- `contact.html`: dirección de Lascaray y correo inigo.olalde@ehu.eus.
- `teaching.html`: docencia en el Master of Forensic Analysis, con enlace oficial.
- `assets/style.css`: colores, tipografías y distribución.
- `assets/main.js`: menú móvil y filtros de publicaciones.

Cada página contiene su propia cabecera y pie para funcionar incluso sin JavaScript. Si cambias los enlaces del menú, hazlo en todas las páginas, incluida `404.html`. Las publicaciones de portada se editan también en `index.html`.

Las tipografías se solicitan a Google Fonts; si no están disponibles, se usan fuentes locales. No hay analítica ni formulario de recogida de datos. La ilustración SVG es un diseño abstracto original, no una fotografía del laboratorio. El logo se ha extraído como vector de la primera página en color del PDF aportado por el usuario. El original se mantiene intacto. La cabecera usa el símbolo junto al nombre y el pie incluye el logo completo.

## Antes de publicar la versión definitiva

1. Sustituir los ejemplos de publicaciones, proyectos y noticias.
2. Revisar la dirección y correo ya incorporados, y completar los detalles de docencia.
3. Incorporar el logo institucional y fotografías aprobadas. El logo del grupo ya está integrado.
4. Retirar los avisos de ejemplo, la etiqueta `noindex,nofollow` de cada HTML y el bloqueo de `robots.txt` cuando esté lista para indexación.
5. Revisar la portada y las páginas internas.

## Publicación en GitHub Pages

La configuración descrita en el chat publica desde `main`, carpeta raíz. Los archivos contenidos en esta carpeta deben colocarse en la raíz del repositorio que sirve `https://archaeobiomics-ehu.github.io/`, no dentro de una subcarpeta `website`. Mantener `.nojekyll` y `assets/` junto a `index.html`. No se ha cambiado el repositorio remoto ni la web pública.

## Decisiones recuperadas del chat «web ArchaeoBiomiCs»

- GitHub Pages como alojamiento; dominio propio más adelante.
- HTML y CSS sencillos para facilitar futuras actualizaciones.
- Home, Research, Team, Publications, Projects, News y Contact.
- Inglés inicial; otros idiomas en una fase posterior.
- Dos líneas con igual protagonismo: Archaeogenetics y Forensic genetics & historical memory.
- Estructura institucional inspirada en EvoAdapta, con diseño propio.
- Presentación respetuosa de la identificación de víctimas de la Guerra Civil española.
- Contenido genérico autorizado durante esta tarea para revisar primero el diseño.

## Actualización de identidad, contacto y Teaching

Paleta aplicada: azul marino `#0D294D`, azul `#1F5FAE` y oliva `#6B7F3A` extraídos de los valores RGB de los trazados originales; fondo marfil `#F8F7F2`, con fondos oliva y azul muy claros.

La portada utiliza «Tracing human lives through DNA. Restoring identities.» y el subtítulo neutro solicitado. Se conserva la referencia a la Guerra Civil en las líneas de investigación.

Teaching incorpora una introducción y datos generales verificados en https://www.ehu.eus/es/web/master/master-analisis-forense el 18 de septiembre de 2026. Asignaturas concretas impartidas por el grupo, profesorado y temas de TFM quedan pendientes.

## Editor visual local

La vista previa incluye un botón «Editar página» para editar textos y ocultar apartados. Consulta `EDITING.md`. El guardado es local al navegador; los archivos de este proyecto no se modifican automáticamente. El editor permite guardar/recuperar una copia JSON y exportar una web completa en ZIP sin controles de edición.
