# Editar visualmente la web

1. Abre la vista previa local (http://127.0.0.1:8765/).
2. Pulsa **Editar página**, abajo a la derecha.
3. Pulsa un texto con borde y escribe. Usa **Minimizar** si el panel tapa el texto; **Panel** vuelve a abrirlo.
4. En **Mostrar u ocultar apartados**, oculta secciones o fichas individuales. Puedes volver a mostrarlas desde la misma lista.
5. Usa **Deshacer / Rehacer** durante la sesión. **Restaurar página** recupera la versión que está en los archivos del proyecto; también se puede deshacer durante la sesión.
6. Pulsa **Terminar edición** para ver y navegar por el resultado sin bordes.

Los cambios se guardan automáticamente en el almacenamiento de este navegador y esta dirección local. Se conservan al recargar y al cambiar de página. No cambian los archivos originales ni se publican en GitHub. No aparecen automáticamente en otro navegador, otro puerto o dispositivo. Evita editar la misma página simultáneamente en varias pestañas.

## Conservar tus pruebas

En **Guardar y exportar**:

- **Guardar copia** descarga un JSON con las pruebas de todas las páginas. Guárdalo antes de borrar datos del navegador o cambiar de equipo.
- **Abrir copia** recupera un JSON guardado. Pide confirmación porque sustituye los borradores de todas las páginas.
- **Exportar toda la web (.zip)** descarga todas las páginas, imágenes y estilos, aplicando los textos y apartados visibles de tus borradores. El ZIP no incluye el editor. Puedes abrirlo localmente o usar sus archivos para publicar la versión elegida más adelante.

Los apartados ocultos desaparecen de la web exportada; se mantienen recuperables en el borrador. Los textos se editan en el lugar donde aparecen: por ejemplo, una publicación de portada y su entrada en Publications son independientes.

## Alcance

El editor modifica textos del contenido principal y permite ocultar apartados o tarjetas. No cambia imágenes, colores, enlaces de destino, estructura del menú ni crea nuevas páginas. Un texto de enlace editado conserva su dirección original; por ejemplo, cambiar lo que se lee en un correo no modifica su dirección de envío.

El editor solo se activa en localhost / 127.0.0.1. La web exportada funciona sin él. Para futuras actualizaciones del diseño, conserva la copia JSON: es el formato que permite recuperar o incorporar tus cambios.
