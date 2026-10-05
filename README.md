# Gimnasio Cristiano Belén — rediseño juvenil

Sitio estático del colegio (Montería, Córdoba) construido a partir del boceto
en papel: la portada, «Nosotros», «Solicitudes en línea» y «Donaciones». HTML + CSS + JS vanilla, sin build ni
dependencias: se sube tal cual a cualquier hosting.

Es una segunda propuesta visual sobre el mismo contenido de `../A12`: paleta de
cinco colores, mucho redondeo y rotulado a mano, frente al tono institucional
en rojo y serif de aquella.

## Ver el sitio

```bash
cd /home/juan/Documents/proyects/A13
python3 -m http.server 8080
# http://localhost:8080
```

## Estructura

```
index.html    Portada completa: hero, nosotros, programas, razones, testimonios,
              preguntas frecuentes, vida belenista, coberturas y convenios,
              llamado final y pie
nosotros.html    Página institucional: misión y visión, valores, himno,
                 Proyecto Timoteo, cuadro de honor, cuadro de promoción y
                 manual de convivencia
admisiones.html  Solo la pregunta: ¿estudiante nuevo o antiguo?
admisiones-nuevos.html    Los siete pasos del proceso, documentos de
                          matrícula, fechas y canales de atención
admisiones-antiguos.html  Los cinco pasos de la preinscripción, con el plazo
                          y los canales de atención
solicitudes.html Los cinco trámites en línea, cómo funcionan y los canales
                 de atención
donaciones.html  La campaña de apadrinamiento: cifras, carta, formas de
                 ayudar y contacto

assets/
  css/  fonts.css    @import de Google Fonts (Onest, Gveret Levin, Inter)
        tokens.css   variables (paleta, tipografía, espacio, forma)
        base.css     reset, titulares, botones, chips, pistas, visor, utilidades
        motion.css   revelado al scroll y prefers-reduced-motion
        layout.css   cabecera, hero, cada sección y el pie
        paginas.css  bloques de las páginas interiores (no la carga la portada)
  js/   motion.js    revelado al scroll
        main.js      navegación, menú móvil, acordeón, video, visor de imagen
  img/  estudiantes*.png  retratos por nivel (PNG con fondo transparente)
        foto-* / aviso-*  fotografías y piezas gráficas del colegio
        cuadro-*.png      cuadros de honor y de promoción (ver abajo)
        equipo-imagen.jpeg foto de grupo del cuerpo docente (ver abajo)
        equipo-*.jpg      retratos sueltos, ya sin uso (ver abajo)
        portada-manual.jpg portada del manual de convivencia
  video/hero.mp4 + hero-poster.jpg
  docs/ manual-convivencia-2026.pdf
```

## Cómo editar

**Colores.** Todo sale de `assets/css/tokens.css`. Los cinco colores de marca
están ahí en su versión pura (fondos, franjas, discos) y en una versión
oscurecida `--*-ink` para texto y enlaces: los tonos puros no alcanzan 4.5:1
sobre blanco. Los neutros son grises azulados, no beige: el sitio lo usan
familias que lo leen en el móvil y a plena luz, y el color plano orienta mejor
que un fondo apagado. Hay además un morado (`--morado`, con su `-ink` y su
tinte) que entró para una sola tarjeta —«Permisos e inasistencias» en
`solicitudes.html`—; si se usa en más sitios, la familia ya está definida.

Cada sección larga toma su propio tinte con `.section--turquesa`,
`.section--amarillo`, `.section--azul`, `.section--verde`, `.section--mostaza` o
`.section--rojo`. Si una onda `.wave` cae sobre una de ellas, lleva el modificador
del mismo color (`.wave--turquesa`, etc.) para que la curva no cambie de tono a
mitad de camino.

**Tipografía.** Tres familias con papeles distintos: `--font-display` (Onest)
para titulares, `--font-hand` (Gveret Levin) para la palabra rotulada de cada
título, y `--font` (Inter) para el resto. En el HTML hay dos formas de usar la
letra a mano:

- `.hand` — la palabra sola, sin fondo (*Nuestros **programas***).
- `.mark` — la palabra sobre franja de color, como un resaltador
  (**ABIERTAS**, **ETERNIDAD**, **FRECUENTES**). Variantes `.mark--turquesa`,
  `.mark--mostaza`, `.mark--verde`, `.mark--azul`.

**Textos de los botones.** Buena parte de quienes usan el sitio no distingue un
enlace de un texto cualquiera, así que los botones dicen qué hay que hacer y no
solo a dónde llevan: «Toca aquí para llenar el formulario», no «Formulario».
Si añades un botón, escribe la acción completa y en segunda persona.

**Los niveles de botón.** El principal es una píldora de color con relieve
(`.btn`, con `.btn--turquesa`, `.btn--ink`, `.btn--wa`…). El secundario no es una
caja: es la acción subrayada con su flecha, y da igual escribirlo como
`.btn.btn--outline` o como `.link` — se ven iguales a propósito.

Hay un tercer aspecto, `.btn--claro`: píldora blanca con filete y texto oscuro,
sin relieve. **No es para destacar una acción**, es justo lo contrario: es para
grupos de acciones equivalentes, donde varios botones macizos competirían entre
sí y ninguno ganaría. Lo usan la barra del visor (descargar PDF, descargar
imagen) y los tres canales de `#atencion` en `solicitudes.html` (WhatsApp,
teléfono, correo). Si lo que hace falta es que algo destaque, se sube a botón
principal; no se mezclan los tres niveles en el mismo grupo.

**Pistas de uso (`.pista`).** Frase corta con emoji que explica cómo funciona
un bloque, colocada justo encima —o debajo— de lo que hay que tocar:

```html
<p class="pista pista--abajo">Toca una pregunta y la respuesta aparece debajo.</p>
```

Lo único que cambia entre unas y otras es el emoji, que lo pone el CSS:
`.pista--dedo` (👆), `.pista--mano` (👉), `.pista--abajo` (👇), `.pista--ojo`
(👀), `.pista--nota` (📝). El aspecto es siempre el mismo —gris, con borde
discontinuo— y no debe llevar color: es una acotación al margen y compite con el
botón que está señalando. El gris además funciona sobre cualquier
`.section--*`, que cambian de color de una página a otra.

Una regla más: cada instrucción se dice **una sola vez**, en la pista o en el
`lede`, nunca en los dos.

**Tamaño de lo que se toca.** Botones, pestañas, cabeceras de acordeón y fichas
de grado llevan `min-height: var(--tap)` (56px). Si creas un control nuevo,
ponle ese mínimo: por debajo, el dedo falla y la gente cree que la página no
sirve.

**«Razones por las cuales nos escogen».** Seis tarjetas apaisadas, sin
interacción: disco de foto que sobresale por el borde izquierdo, título y una
descripción corta. La rejilla usa `auto-fit` con `minmax(min(100%, 30rem), 1fr)`,
que da dos columnas en pantalla ancha y una en el móvil sin puntos de ruptura —
el `min(100%, …)` es lo que evita que la tarjeta fuerce scroll horizontal en
pantallas estrechas. El hueco entre columnas tiene que seguir siendo mayor que lo
que sobresale el disco; si se toca uno hay que revisar el otro. Sustituyó al
acordeón de «Cuatro dimensiones», cuyo CSS y JavaScript se borraron.

**Dos cosas de esta sección están sin terminar.** Las seis ilustraciones de
`assets/img/razones/` son SVG planos —un color y un pictograma— que hay que
reemplazar por fotos del colegio: basta dejar el archivo definitivo en esa
carpeta y ajustar el `src`, porque el recorte circular lo hace `.razon__img` con
`aspect-ratio` y `object-fit: cover` y la foto no hay que reencuadrarla. Y las
descripciones son un borrador redactado a partir de lo que ya decía el sitio;
conviene que el colegio las confirme antes de publicar.

**«Vida belenista» (el collage de la portada).** Las seis piezas son botones con
`data-lightbox`: abren la foto centrada en el visor, y se cierra pulsando fuera,
en «Cerrar la imagen» o con Escape. Antes crecían en el sitio, dentro de la
propia retícula, con un juego de clases (`is-open` / `has-open`) y una escala por
`transform`. Se cambió a propósito: además de ser lo que se pidió, el visor es
comportamiento de galería normal y corriente, así que al pasar el sitio a
WordPress esta sección se puede rehacer con el bloque de galería del núcleo
—que trae «Ampliar al hacer clic» de serie— sin arrastrar JavaScript propio. Lo
único que habría que rehacer a mano son las etiquetas de color sobre cada foto
(`.collage__tag`) y la inclinación de las piezas, que son CSS del tema.

El visor arrastra la etiqueta y la descripción de la pieza y las dibuja **dentro
de la foto**, abajo a la izquierda y sobre un velo degradado: el mismo rótulo que
aparece en el collage al pasar el cursor, pero fijo. `pintarPie()` copia la clase
entera de `.collage__tag`, y con ella el color, en vez de repetir aquí la paleta.
Donde el disparador no trae ninguna de las dos —los cuadros de honor de
`nosotros.html`— el pie se oculta solo. El alto de la imagen se topa con
`calc(100vh - 7rem)`, el margen del visor; un `max-height: 100%` no serviría,
porque la figura tiene alto automático y un porcentaje contra alto automático no
limita nada.

**«Coberturas y convenios».** Once piezas —un marco con el logo y el nombre
debajo— entre «Vida belenista» y el llamado final. **No hay tarjeta alrededor**:
la única caja es el marco del logo, y el nombre va suelto sobre el fondo de la
sección. No son enlaces y por eso no llevan hover: nada debe insinuar que se
pueden tocar. La lista es `flex` con `justify-content: center`, no una rejilla:
son once, así que la última línea siempre queda incompleta y con `auto-fit` se
pegaría a la izquierda dejando un hueco; en flex lo que sobra se centra. Reparte
de seis a tres columnas según el ancho, y por debajo de 620px pasa a dos columnas
fijas (`flex-basis: calc(50% - gap)`). El `align-items: flex-start` es lo que
mantiene todos los marcos a la misma altura cuando un nombre ocupa dos líneas y
el de al lado una.

**El marco del logo**, que ahora es el único recuadro de la sección. Los once
logos llegaron con proporciones muy distintas (escudos cuadrados, marcas
apaisadas de casi 5:1) y en formatos mezclados: JPG con su propio fondo blanco,
PNG y WebP con transparencia. `.convenio__marco` los iguala —caja de alto fijo,
logo centrado con `object-fit: contain`— y va en blanco, no tintado, porque sobre
un fondo de color los JPG se verían como recortes pegados; sobre el azul pálido
de la sección el blanco ya destaca solo. Dos detalles que hay que respetar si se
toca: el marco es `flex` y no `grid` (contra una fila de rejilla de alto
automático el `max-height: 100%` del logo no resuelve y los escudos cuadrados se
salen), y su alto es fijo y no `aspect-ratio`, por lo mismo. Para cambiar un logo basta
sobrescribir el archivo conservando el nombre; cuanto más recortado al borde de
la marca venga, más grande se ve, porque el margen blanco del propio archivo
cuenta como parte de la imagen.

El nombre va debajo, a 1rem y sin negrilla: es la única excepción al piso de
17px del sitio, porque no dice nada que el logo no diga ya y a tamaño de cuerpo
competía con él.

La onda que cierra la sección lleva además `wave--desde-tint`. Las ondas son un
`div` transparente con una curva de color: la de entrada se ve porque la curva
lleva el color de la sección que empieza, pero una curva blanca sobre el fondo
blanco de la página no se vería, así que ese modificador le pinta al `div` el
color de la sección que termina para que la curva la recorte. Va sin
`wave--flip`, así que la curva sube; es el espejo de la onda de entrada.

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
`data-lightbox` y `data-lightbox-src` para heredar ese comportamiento. El visor
(`.lightbox`) vive en `base.css` y no en `paginas.css`, porque la portada
también lo usa y no carga `paginas.css`.

**Las páginas interiores.** Las tres comparten cabecera, pie y `paginas.css`, y
se montan igual: `.pagehead` con foto y degradado, secciones alternas
`.section` / `.section--tint` separadas por `.wave`, y `.cta` al cierre. Las dos
de admisiones son la excepción: cierran en la sección de dudas, sin llamado
final, porque quien llega ahí ya está dentro del proceso y el botón no lo
llevaría a ninguna parte nueva. El enlace
del menú que corresponde a la página lleva `aria-current="page"` a mano:
`initScrollSpy()` solo observa enlaces que empiezan por `#`, así que no lo pisa.

**Solicitudes en línea.** Los cinco trámites son formularios de Google y los
cinco tienen ya su enlace: el de **solicitud de retiro** entró con el enlace
corto `https://forms.gle/cX8URRgXAzareJEa6`.

De los cinco, solo el de **solicitud de citas** abre en público. Comprobado sin
sesión iniciada: los otros cuatro devuelven **401**, por dos motivos distintos.
Inasistencias, certificados y PQRS son URL del lado del editor,
`/forms/d/<id>/viewform`, mientras que la de citas es la publicada,
`/forms/d/e/<id>/viewform`; ahí basta con que el colegio saque el enlace del
botón **Enviar**. El de retiro ya es la publicada —el enlace corto redirige a
`/forms/d/e/…/viewform`— y aun así pide sesión: ese formulario está restringido
a cuentas del colegio y hay que abrir la respuesta a «cualquier persona con el
enlace». Está anotado con un `REVISAR` en la propia sección.

**Donaciones.** Todo el texto —las cifras, la carta y el certificado de la DIAN—
sale literal de `/donaciones/` del sitio actual. El colegio **no publica cuenta
bancaria ni pasarela de pago**: la donación se coordina por teléfono, WhatsApp o
correo, que es lo que ofrece la sección de contacto. Si más adelante habilitan
una cuenta, va en `#contacto`.

**Los valores.** La sección `#valores` es una rejilla bento: diez tarjetas de
color y dos piezas fotográficas —una alta y una ancha— que rompen el ritmo. La
colocación es automática: basta el orden del HTML, y los dos `span` de las fotos
dejan los huecos que rellenan las tarjetas. El colegio solo publica los *nombres*
de los valores; la frase de una línea de cada uno es redacción nuestra y está
marcada con un `REVISAR`.

**La foto del equipo.** La tarjeta «Nuestro equipo» de `#mision-vision` lleva
**una sola foto de grupo en cuadrado** (`.team__foto`) y debajo los nombres de
Eder García y Jeinny Esquivel. Antes eran tres retratos redondos superpuestos,
recortados del cuadro de promoción 2025; esos archivos (`equipo-rector.jpg`,
`equipo-coordinadora.jpg`, `equipo-directora.jpg`) siguen en `assets/img/` pero
ya no los usa ninguna página, así que se pueden borrar.

Las dos tarjetas de misión y visión se estiran hasta igualar esa columna
(`.purpose__cards` sin `align-content: start`) y llevan el texto centrado en
vertical: la tarjeta del equipo es más alta por la foto, y antes quedaba un hueco
vacío debajo de «Visión».

La foto es `equipo-imagen.jpeg` (1600×1200). El recorte cuadrado lo hace
`object-fit: cover`, así que para cambiarla basta sobrescribir el archivo, sin
reencuadrar nada. Eso sí: **el cuadrado recorta por los lados**, un cuarto del
ancho en una foto 4:3, así que quien quede pegado a un borde se pierde —en esta
se va casi entero el de la derecha—. Si en algún momento se prefiere que salgan
todos, es cambiar el `aspect-ratio` de `.team__foto` a `4 / 3`.

**«Lista y uniforme».** El nivel elegido (`.listas__tab.is-active`) va en el
azul oscuro del pie. El rótulo de cada grado —«Toca para ver la lista»— es el
botón secundario del sitio, subrayado y flecha sin fondo: con catorce tarjetas
juntas, catorce pastillas rojas saturaban la sección. No se parte nunca en dos
líneas, y eso amarra dos valores: `.grado__cta` lleva `white-space: nowrap` y el
mínimo de `.listas__grid` (16.5rem) está calculado para que quepa entero con el
relleno de la tarjeta. Si se cambia el texto del botón, hay que revisar el mínimo
de la rejilla.

En el visor, los dos botones de descarga —el PDF y el archivo original— comparten
estilo: son la misma acción sobre el mismo documento, y destacar uno hacía pensar
que el otro daba algo distinto. Ya no existe el modificador `--main`. El de
cerrar sí se distingue, con el azul del pie: es el único que no descarga nada.
Vale también para el visor de `calendario-academico.html`, que es el mismo.

La sección `#horarios` transcribe la lámina oficial del colegio —cuatro filas,
nivel y franja horaria— en vez de publicarla como imagen, para que se pueda leer
con lector de pantalla, copiar y buscar. Cada nivel lleva un color (`.horario--*`)
en el mismo orden que las tarjetas de grado de más abajo, y el rótulo de la hora
usa la variante `-ink` de ese color: sobre el tono puro, el texto blanco no
llegaría al contraste mínimo —el mostaza sobre todo—.

**Ojo con una contradicción heredada:** la lámina dice que las clases van de
6:20 a.m. a 1:45 p.m. según el nivel (6:50 a 11:50 en preescolar), pero la barra
superior de todas las páginas y la pregunta «¿Cuál es el horario escolar?» del
inicio siguen diciendo «8:00 a.m. – 3:00 p.m.». Uno de los dos datos está mal, o
el segundo se refiere a la atención administrativa y no a la jornada; hay que
confirmarlo con el colegio y corregir el que sobre.

**Trámites de `solicitudes.html`.** Los enlaces a los formularios son botones
secundarios (subrayado y flecha), no pastillas rojas: cinco tarjetas seguidas con
un botón macizo cada una saturaban la sección. Los rótulos van en la forma corta
(«Toca para llenar el formulario»), porque con «Toca aquí para…» el texto no
cabía en una línea dentro de la tarjeta. En anchos intermedios —a partir de tres
columnas apretadas— alguno todavía se parte en dos líneas; para eso `.btn--outline`
lleva `align-items: flex-end`, que deja la flecha a la altura de la última línea
en vez de flotando a media altura.

**«Admisiones» son tres páginas, no una.** `admisiones.html` no tiene más
contenido que la pregunta —¿estudiante nuevo o antiguo?— y cada botón lleva a su
propia página. Los dos procesos no se parecen en nada (siete pasos con pagos y
formularios frente a cinco de preinscripción), y en una sola página el papá tenía
que ir saltándose la mitad de lo que leía.

Las fechas **solo viven en la página de estudiantes nuevos**, y la de costos
—matrícula y pensión— salió del sitio a pedido del colegio: las tarifas del año
se entregan por otro canal. La página de antiguos se quedó con los cinco pasos y
nada más; quien ya tiene a su hijo estudiando no necesita el calendario de
admisión, sino saber qué hacer y hasta cuándo. El plazo va en un aviso
(`.plazo`) encima de la lista, que es lo primero que se lee.

El CSS de los costos (`.tabla`, `.notas`, `.dato--fila`) sigue en
`paginas.css`: si el colegio decide volver a publicar las tarifas, la sección se
rehace sin tocar los estilos.

Los pasos (`.ruta`) van en vertical y no en fila como los de `solicitudes.html`:
cada uno lleva su botón o sus datos bancarios, y en cuatro columnas no cabrían. Dentro de cada tarjeta, el número va a la izquierda del
texto hasta los 560 px y encima de él por debajo: en el móvil, reservarle una
columna deja el renglón corriendo por bastante menos del ancho de la tarjeta, y
con siete pasos eso es mucho alto desaprovechado.
Los datos que la gente copia a mano —cuenta, NIT, dirección— van en su propia
caja (`.dato`) para que no se pierdan dentro del párrafo. El número de cuenta y
el NIT llevan además su botón de copiar (`.copiar`, módulo 15 de `main.js`),
uno por dato y en las dos páginas: en la app del banco se pega primero la cuenta
y después el NIT, así que copiarlos juntos no sirve de nada. Sin HTTPS
`navigator.clipboard` no existe, y ahí entra el textarea oculto de siempre.

Las tablas (`.tabla`) se deslizan dentro de su caja (`.tabla-scroll`): una tabla
no se puede encoger más allá de su contenido, y sin ese envoltorio serían ellas
las que empujarían la página entera a lo ancho. Es lo que sostiene el calendario
de `#fechas` entre 560 px y el escritorio.

Por debajo de 560 px **la tabla deja de ser tabla**: el `<thead>` se esconde y
cada fila se vuelve una tarjeta, con la primera celda de título y las demás
debajo de su etiqueta. Deslizar una tabla de lado con el dedo se siente como si
se moviera la página entera, y con fechas de «Del 21 de octubre al 1 de
noviembre de 2025» no hay ancho de teléfono que alcance. La etiqueta viaja en el
atributo `data-col` de cada celda, que el CSS pinta con `::before`: si se
agrega una fila nueva hay que ponerle su `data-col`, o en el móvil el dato sale
sin nombre.

**Tres cosas de estas páginas hay que confirmarlas con el colegio**, y están
marcadas con `REVISAR` en el HTML:

1. El enlace del formulario de interés llegó terminado en `/edit`, que es la
   vista de edición: cualquiera que entrara podría modificar el formulario. Se
   publica la misma dirección terminada en `/viewform`, y falta comprobar que
   abre sin sesión iniciada.
2. **El calendario de `#fechas` son las fechas de la circular de 2026 corridas
   un año**, no las que publicó el colegio para 2027, y hay que confirmarlas una
   por una: cuatro caen en fin de semana (cierre del proceso, fin de entrevistas,
   fin de la matrícula extraordinaria y reunión de padres). Los días de la semana
   se quitaron de la tabla, porque el corrimiento los dejó todos mal. El plazo de
   estudiantes antiguos —«del 13 al 05 de octubre de 2026»— sigue con el día
   final antes del inicial; lo más probable es del 13 de septiembre al 5 de
   octubre.
3. El horario presencial de admisiones (7:00 a.m.–12:00 m. y 2:30–4:30 p.m.) no
   coincide con el que publica el resto del sitio (8:00 a.m.–3:00 p.m.).

Y una advertencia de fondo: **el sitio quedó a medio camino entre dos años**.
Están en 2027 los botones de «Pedir cupo», el calendario de `#fechas`, la
portada entera (titular y descripciones), su pregunta frecuente de matrículas y
`admisiones.html` (título, descripciones y titular). Las dos subpáginas de
pasos **no llevan año** ni en la pestaña ni al compartirse: lo suyo es el
procedimiento, que no cambia de un año a otro, y el año vive en la página madre
y en el calendario. El único 2026 que queda es el plazo de preinscripción de los
antiguos, que está pendiente de confirmar con el colegio.

Las catorce listas escolares se salieron de la cuenta: **ya no llevan año**, ni
en el título de la lámina, ni en la descripción de la página, ni en el nombre
con que se descargan la imagen y el PDF (`initViewer` en `main.js`). Las
láminas cambian de un año a otro, pero lo hacen todas a la vez y el año no
distinguía nada; quitarlo evita que la página quede desfasada sola.

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
| Circular de admisión del año siguiente | `#fechas` de `admisiones-nuevos.html` |
| Las fechas reales del plazo de preinscripción | `.plazo` de `admisiones-antiguos.html` |
| Enlace directo del consentimiento y del formato del colegio anterior | paso 3 de `#nuevos` |
| Que el formulario de interés abra sin sesión | paso 1 de `#nuevos` |
| Teléfono a publicar (ver nota abajo) | barra superior y pie |
| Videos reales de los tres testimonios | sección de testimonios |
| Nombres y grados reales de los testimonios | sección de testimonios |
| Listado oficial de documentos de admisión | `#faq`, tercera pregunta |
| URLs reales de Facebook, Instagram y YouTube | pie |
| Fecha y detalles del Family Day | tercera tarjeta de noticias |
| Texto real del Proyecto Timoteo | `#timoteo` de `nosotros.html` |
| Cuadro de promoción de 11°, si existe | `#reconocimientos` de `nosotros.html` |
| Erratas de la misión y la visión | `#mision-vision` de `nosotros.html` |
| Confirmar el «8:00 a.m. – 3:00 p.m.» (choca con la lámina de horarios) | barra superior y `#faq` de `index.html` |
| Frases de una línea de los diez valores | `#valores` de `nosotros.html` |
| URL públicas de 4 formularios (dan 401) | `#tramites` de `solicitudes.html` |
| Datos que exige cada trámite | `#como` de `solicitudes.html` |
| Cuenta bancaria para donar, si la habilitan | `#contacto` de `donaciones.html` |

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
- Sin scroll horizontal a 320, 360, 390, 768, 1024 y 1440 px, en las diez
  páginas. Lo que desbordaba por debajo de ~375 px era la barra superior: el
  horario y el teléfono van con `white-space: nowrap` y no caben en un renglón.
  Por debajo de 430 px se cae el rango de días (`.topbar__dias`) y queda solo
  la hora, que es el dato que se consulta.
- Única petición externa: las fuentes de Google. Imágenes y video son locales.
