# Gimnasio Cristiano Belén — portada (rediseño juvenil)

Portada estática del colegio (Montería, Córdoba) construida a partir del boceto
en papel. HTML + CSS + JS vanilla, sin build ni dependencias: se sube tal cual a
cualquier hosting.

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
index.html   Portada completa: hero, nosotros, programas, testimonios,
             preguntas frecuentes, noticias, llamado final y pie

assets/
  css/  fonts.css   @import de Google Fonts (Onest, Gveret Levin, Inter)
        tokens.css  variables (paleta, tipografía, espacio, forma)
        base.css    reset, titulares, botones, chips, utilidades
        motion.css  revelado al scroll y prefers-reduced-motion
        layout.css  cabecera, hero, cada sección y el pie
  js/   motion.js   revelado al scroll
        main.js     navegación, menú móvil, acordeón, video, modal
  img/  estudiantes*.png  retratos por nivel (PNG con fondo transparente)
        foto-* / aviso-*  fotografías y piezas gráficas del colegio
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
- Sin scroll horizontal a 360, 390, 768, 1024 y 1440 px.
- Única petición externa: las fuentes de Google. Imágenes y video son locales.
