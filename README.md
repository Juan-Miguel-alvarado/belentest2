# Gimnasio Cristiano Belén — rediseño juvenil

Sitio estático del colegio (Montería, Córdoba) construido a partir del boceto
en papel: la portada y la página «Nosotros». HTML + CSS + JS vanilla, sin build ni
dependencias: se sube tal cual a cualquier hosting.

Es una segunda propuesta visual sobre el mismo contenido de `../A12`: paleta de
cuatro colores, mucho redondeo y rotulado a mano, frente al tono institucional
en rojo y serif de aquella.

## Ver el sitio

```bash
cd /home/juan/Documents/proyects/A13
python3 -m http.server 8080
# http://localhost:8080
```

## Estructura

```
index.html    Portada completa: hero, nosotros, programas, testimonios,
              preguntas frecuentes, noticias, llamado final y pie
nosotros.html Página institucional: misión y visión, valores, himno,
              Proyecto Timoteo, cuadro de honor, cuadro de promoción y
              manual de convivencia

assets/
  css/  fonts.css    @import de Google Fonts (Onest, Gveret Levin, Inter)
        tokens.css   variables (paleta, tipografía, espacio, forma)
        base.css     reset, titulares, botones, chips, utilidades
        motion.css   revelado al scroll y prefers-reduced-motion
        layout.css   cabecera, hero, cada sección y el pie
        nosotros.css bloques propios de nosotros.html (solo la carga esa página)
  js/   motion.js    revelado al scroll
        main.js      navegación, menú móvil, acordeón, video, visor de imagen
  img/  estudiantes*.png  retratos por nivel (PNG con fondo transparente)
        foto-* / aviso-*  fotografías y piezas gráficas del colegio
        cuadro-*.png      cuadros de honor y de promoción (ver abajo)
        equipo-*.jpg      retratos del equipo directivo (ver abajo)
        portada-manual.jpg portada del manual de convivencia
  video/hero.mp4 + hero-poster.jpg
  docs/ manual-convivencia-2026.pdf
```

## Cómo editar

**Colores.** Todo sale de `assets/css/tokens.css`. Los cuatro colores de marca
están ahí en su versión pura (fondos, franjas, discos) y en una versión
oscurecida `--*-ink` para texto y enlaces: los tonos puros no alcanzan 4.5:1
sobre blanco.

**Tipografía.** Tres familias con papeles distintos: `--font-display` (Onest)
para titulares, `--font-hand` (Gveret Levin) para la palabra rotulada de cada
título, y `--font` (Inter) para el resto. En el HTML hay dos formas de usar la
letra a mano:

- `.hand` — la palabra sola, sin fondo (*Nuestros **programas***).
- `.mark` — la palabra sobre franja de color, como un resaltador
  (**ABIERTAS**, **ETERNIDAD**, **FRECUENTES**). Variantes `.mark--turquesa`,
  `.mark--mostaza`, `.mark--verde`.

**Retratos de los programas.** Los cuatro PNG de estudiantes tienen fondo
transparente y se recortan en círculo. Si reemplazas alguno, comprueba que el
sujeto quede centrado horizontalmente: el círculo recorta por los lados.

**Cuadros de honor y de promoción.** Cambian cada periodo y cada año. Para
actualizarlos basta con **sobrescribir el archivo** en `assets/img/` conservando
el nombre y ajustar el `<figcaption>` de esa tarjeta en `nosotros.html`:

| Archivo | Tarjeta |
|---|---|
| `cuadro-honor-preescolar.png` | Pre-Jardín · Jardín · Transición |
| `cuadro-honor-primaria.png` | 1° a 5° |
| `cuadro-honor-bachillerato.png` | 6° a 10° |
| `cuadro-promocion-2025-transicion.png` | Grado Transición |
| `cuadro-promocion-2025-quinto.png` | Grado Quinto |

Son las piezas que hoy publica el colegio, tal cual. Vienen en PNG y pesan entre
350 y 820 KB cada una: **conviene pasarlas a JPG antes de publicar** (bajan a
cerca del 15 %). Si se cambia la extensión hay que actualizar el `src` en el HTML.
Se ven en grande con el visor: cualquier tarjeta nueva solo necesita
`data-lightbox` y `data-lightbox-src` para heredar ese comportamiento.

**Retratos del equipo.** La tarjeta «Nuestro equipo» de `#mision-vision` usa
`equipo-rector.jpg`, `equipo-coordinadora.jpg` y `equipo-directora.jpg`, los tres
recortados del cuadro de promoción 2025 —es la única foto del personal que el
colegio tiene publicada—. Están marcados con un `TODO`: en cuanto el colegio pase
una foto de grupo del cuerpo docente, se sustituye ese bloque por la fotografía.

**Contenido institucional.** La misión, la visión, los diez valores y el himno
están en `nosotros.html` como **texto real**, no como imágenes: se pueden leer con
lector de pantalla, copiar e indexar. En el sitio actual todos ellos viven dentro
de JPG.

**Fotos.** Reemplaza los archivos de `assets/img/` conservando el nombre. Las
piezas gráficas verticales (`aviso-*`) van en tarjetas con
`.news__media--poster`, que las muestra completas en vez de recortarlas.

**Fuentes sin peticiones externas.** Hoy `fonts.css` carga Google Fonts por
`@import`. Para dejar el sitio autocontenido, descarga los woff2 y sustituye ese
`@import` por reglas `@font-face` locales.

## Pendiente de contenido oficial

Marcado en el código con comentarios `REVISAR` y `TODO`:

| Qué | Dónde |
|---|---|
| Dirección exacta de la sede | barra superior de `index.html` |
| Teléfono a publicar (ver nota abajo) | barra superior y pie |
| Videos reales de los tres testimonios | sección de testimonios |
| Nombres y grados reales de los testimonios | sección de testimonios |
| Listado oficial de documentos de admisión | `#faq`, tercera pregunta |
| URLs reales de Facebook, Instagram y YouTube | pie |
| Fecha y detalles del Family Day | tercera tarjeta de noticias |
| Texto real del Proyecto Timoteo | `#timoteo` de `nosotros.html` |
| Cuadro de promoción de 11°, si existe | `#reconocimientos` de `nosotros.html` |
| Erratas de la misión y la visión | `#mision-vision` de `nosotros.html` |
| Foto de grupo del cuerpo docente | tarjeta «Nuestro equipo» de `nosotros.html` |

**Sobre las erratas del texto oficial.** Al pasar la misión y la visión de imagen
a texto se corrigieron cuatro: «de los estudiante» → «de los estudiantes»,
«cultural y tecnológica» → «cultural y tecnológico», «cientifica» → «científica»
y «a traves» → «a través»; en el himno, «sencibles» → «sensibles». Están marcadas
con comentarios `REVISAR` en el HTML, a la espera de que el colegio confirme.

**Sobre el Proyecto Timoteo.** La página del sitio actual está vacía: no tiene
texto ni imágenes. La sección está maquetada con una descripción provisional.

**Sobre el teléfono.** El boceto indica `300 377 6700` y es el que quedó
publicado. El sitio actual y `../A12` usan `+57 321 715 6040`. Hay que confirmar
cuál es el número vigente y unificar los dos proyectos.

**Sobre las solicitudes en línea.** De los cinco trámites que publica el sitio
actual, solo el de solicitud de citas tiene URL pública; los otros apuntan a
direcciones `/edit` de Google Forms, que solo abren para el propietario de la
cuenta. Mientras el colegio no comparta las URL `/viewform`, los cinco enlaces
del pie van a WhatsApp.

## Accesibilidad y rendimiento

- Texto y enlaces usan los derivados `--*-ink`, que cumplen contraste AA.
- `prefers-reduced-motion: reduce` desactiva revelados, flotaciones y el scroll
  suave.
- Navegación completa por teclado: desplegable, menú móvil, acordeón y modal de
  video con `aria-*`, cierre con `Escape` y devolución del foco.
- Sin scroll horizontal a 390, 768, 1024 y 1440 px. **Pendiente:** por debajo de
  ~375 px la barra superior desborda (la hora y el teléfono no caben en una
  línea). Afecta por igual a las dos páginas y viene de la portada original.
- Única petición externa: las fuentes de Google. Imágenes y video son locales.
