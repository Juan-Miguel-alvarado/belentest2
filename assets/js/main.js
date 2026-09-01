/* ============================================================
   main.js — comportamiento del sitio
   Navegación · menú móvil · acordeón · video · utilidades
   ============================================================ */

(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* --- 1. Sombra de la cabecera al hacer scroll -------------- */
  function initStickyHeader() {
    const head = $(".masthead");
    if (!head) return;
    const onScroll = () => head.classList.toggle("is-stuck", window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* --- 2. Desplegables del menú (ratón + teclado) ------------ */
  function initDropdowns() {
    const items = $$(".menu__item--has-menu");
    if (!items.length) return;

    const closeAll = (except) => {
      items.forEach((item) => {
        if (item === except) return;
        item.classList.remove("is-open");
        const btn = $(".menu__link", item);
        if (btn) btn.setAttribute("aria-expanded", "false");
      });
    };

    items.forEach((item) => {
      const btn = $(".menu__link", item);
      if (!btn) return;

      const open = (state) => {
        item.classList.toggle("is-open", state);
        btn.setAttribute("aria-expanded", String(state));
      };

      btn.addEventListener("click", () => {
        const next = !item.classList.contains("is-open");
        closeAll(item);
        open(next);
      });

      item.addEventListener("mouseenter", () => {
        closeAll(item);
        open(true);
      });
      item.addEventListener("mouseleave", () => open(false));

      item.addEventListener("focusout", (e) => {
        if (!item.contains(e.relatedTarget)) open(false);
      });

      // Al elegir un destino del desplegable, ciérralo.
      item.addEventListener("click", (e) => {
        if (e.target.closest(".dropdown a")) open(false);
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeAll(null);
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest(".menu__item--has-menu")) closeAll(null);
    });
  }

  /* --- 3. Menú móvil ---------------------------------------- */
  function initMobileMenu() {
    const burger = $(".burger");
    const panel = $(".mobile-menu");
    if (!burger || !panel) return;

    const setOpen = (state) => {
      burger.setAttribute("aria-expanded", String(state));
      burger.setAttribute("aria-label", state ? "Cerrar el menú" : "Abrir el menú");
      panel.classList.toggle("is-open", state);
      document.body.classList.toggle("is-locked", state);
    };

    burger.addEventListener("click", () =>
      setOpen(burger.getAttribute("aria-expanded") !== "true")
    );

    panel.addEventListener("click", (e) => {
      if (e.target.closest("a")) setOpen(false);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setOpen(false);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 1080) setOpen(false);
    });
  }

  /* --- 4. Acordeón de preguntas frecuentes ------------------- */
  function initFaq() {
    $$(".faq__q").forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = btn.closest(".faq__item");
        const open = item.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", String(open));
      });
    });
  }

  /* --- 5. Carrusel del hero ---------------------------------- */
  /* Desplaza un carril horizontal. Sin librerías ni medidas en JS: la
     posición es un porcentaje, así que sobrevive a cualquier cambio de
     altura o de ancho sin recalcular nada. */
  function initHero() {
    const track = $("[data-hero-track]");
    if (!track) return;

    const slides = $$(".hero__slide", track);
    const dots = $$("[data-hero-go]");
    if (slides.length < 2) return;

    const hero = track.closest(".hero");
    let index = 0;
    let timer = null;

    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");

    const show = (next) => {
      index = (next + slides.length) % slides.length;
      track.style.transform = "translateX(-" + index * 100 + "%)";

      slides.forEach((slide, i) => {
        const active = i === index;
        /* inert saca del tabulador los enlaces de la diapositiva oculta. */
        slide.inert = !active;
        slide.setAttribute("aria-hidden", String(!active));

        /* El video de fondo solo corre en su diapositiva: fuera de ella
           no gasta datos ni batería. Con preload="none" ni siquiera se
           descarga hasta la primera vez que se muestra. */
        const film = $(".hero__film", slide);
        if (film) {
          if (active) {
            const attempt = film.play();
            if (attempt && typeof attempt.catch === "function") attempt.catch(() => {});
          } else {
            film.pause();
          }
        }
      });

      dots.forEach((dot, i) => {
        dot.setAttribute("aria-current", String(i === index));
      });
    };

    const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
    const start = () => {
      stop();
      if (calm.matches) return;
      timer = setInterval(() => show(index + 1), 7000);
    };

    const goTo = (next) => { show(next); start(); };

    $("[data-hero-next]").addEventListener("click", () => goTo(index + 1));
    $("[data-hero-prev]").addEventListener("click", () => goTo(index - 1));
    dots.forEach((dot, i) => dot.addEventListener("click", () => goTo(i)));

    /* El giro automático se detiene mientras el visitante está encima o
       navegando con el teclado dentro del hero. */
    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    hero.addEventListener("focusin", stop);
    hero.addEventListener("focusout", start);

    show(0);
    start();
  }

  /* --- 6. Video de la sección «Nosotros» --------------------- */
  /* Arranca pausado con el póster: el visitante decide verlo. */
  function initPlayer() {
    const wrap = $("[data-player]");
    if (!wrap) return;

    const video = $("[data-player-video]", wrap);
    const btn = $("[data-player-toggle]", wrap);
    if (!video || !btn) return;

    btn.addEventListener("click", () => {
      video.controls = true;
      wrap.classList.add("is-playing");
      // Safari/iOS puede rechazar la promesa; el póster queda de respaldo.
      const attempt = video.play();
      if (attempt && typeof attempt.catch === "function") attempt.catch(() => {});
    });

    video.addEventListener("pause", () => wrap.classList.remove("is-playing"));
    video.addEventListener("play", () => wrap.classList.add("is-playing"));
  }

  /* --- 7. Video del testimonio, dentro de la propia tarjeta -- */
  function initInlineVideo() {
    const triggers = $$("[data-inline-video]");
    if (!triggers.length) return;

    triggers.forEach((btn) => {
      btn.addEventListener("click", () => {
        const media = btn.closest(".testimonial__media");
        if (!media || media.querySelector("video")) return;

        const video = document.createElement("video");
        video.className = "testimonial__video";
        video.src = btn.dataset.inlineVideo;
        video.controls = true;
        video.playsInline = true;
        media.appendChild(video);
        media.classList.add("is-playing");

        const attempt = video.play();
        if (attempt && typeof attempt.catch === "function") attempt.catch(() => {});
      });
    });
  }


  /* --- 8. Dimensiones de la formación integral --------------- */
  /* Acordeón de una sola abierta: al desplegar una se cierran las demás,
     a diferencia del de preguntas frecuentes, que admite varias. */
  function initDims() {
    const items = $$(".dim");
    if (!items.length) return;

    items.forEach((item) => {
      const head = $(".dim__head", item);
      if (!head) return;

      head.addEventListener("click", () => {
        const open = !item.classList.contains("is-open");

        items.forEach((other) => {
          other.classList.remove("is-open");
          const btn = $(".dim__head", other);
          if (btn) btn.setAttribute("aria-expanded", "false");
        });

        if (open) {
          item.classList.add("is-open");
          head.setAttribute("aria-expanded", "true");
        }
      });
    });
  }
  /* --- 9. Collage de vida belenista -------------------------- */
  /* Al pulsar una pieza crece dentro del propio collage; no se abre
     ninguna ventana encima. Solo puede haber una abierta a la vez. */
  function initCollage() {
    const collage = $(".collage");
    if (!collage) return;

    const items = $$(".collage__item", collage);
    if (!items.length) return;

    const setOpen = (target) => {
      items.forEach((item) => {
        const open = item === target;
        item.classList.toggle("is-open", open);
        item.setAttribute("aria-expanded", String(open));
      });
      collage.classList.toggle("has-open", Boolean(target));
    };

    items.forEach((item) => {
      item.addEventListener("click", () => {
        setOpen(item.classList.contains("is-open") ? null : item);
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && collage.classList.contains("has-open")) setOpen(null);
    });
  }

  /* --- 10. Botón flotante de WhatsApp ------------------------- */
  function initFab() {
    const fab = $(".wa-fab");
    if (!fab) return;
    const onScroll = () => fab.classList.toggle("is-in", window.scrollY > 480);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* --- 11. Páginas interiores -------------------------------- */
  /* Pestañas de nivel en las listas escolares. Los paneles usan el
     atributo hidden, que es lo que ya entienden los lectores de
     pantalla, en vez de una clase propia. */
  function initListas() {
    const tabs = $$(".listas__tab");
    if (!tabs.length) return;

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const nivel = tab.dataset.nivel;

        tabs.forEach((other) => {
          const on = other === tab;
          other.classList.toggle("is-active", on);
          other.setAttribute("aria-selected", String(on));
        });

        $$("[data-nivel-panel]").forEach((panel) => {
          panel.hidden = panel.dataset.nivelPanel !== nivel;
        });
      });
    });
  }

  /* Acordeón de períodos del calendario: uno abierto a la vez. */
  function initPeriodos() {
    const items = $$(".periodo");
    if (!items.length) return;

    items.forEach((item) => {
      const head = $(".periodo__head", item);
      if (!head) return;

      head.addEventListener("click", () => {
        const open = !item.classList.contains("is-open");

        items.forEach((other) => {
          other.classList.remove("is-open");
          const btn = $(".periodo__head", other);
          if (btn) btn.setAttribute("aria-expanded", "false");
        });

        if (open) {
          item.classList.add("is-open");
          head.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  /* Envoltorio de html2pdf, compartido por el visor de listas y por las
     láminas del calendario. Lleva las dos precauciones que costaron
     encontrar:

     1. La página se lleva arriba del todo antes de generar. html2pdf monta
        su propio contenedor con position:fixed, pero html2canvas mide en
        coordenadas del documento: con la página desplazada captura la franja
        equivocada y el PDF sale en blanco.
     2. El salto se hace dentro del ciclo de pintado y asignando scrollTop.
        Quitar la clase que bloquea el scroll no surte efecto hasta el
        siguiente reflujo, y como la hoja pone scroll-behavior: smooth,
        window.scrollTo se anima y html2canvas mide a mitad del recorrido.

     Devuelve una promesa que se cumple cuando el archivo ya se descargó, con
     la página y el bloqueo de scroll tal como estaban. */
  function generarPdf(elemento, ajustes) {
    const raiz = document.scrollingElement || document.documentElement;
    const scrollPrev = raiz.scrollTop;
    const estabaBloqueado = document.body.classList.contains("is-locked");
    const behaviorPrev = document.documentElement.style.scrollBehavior;

    document.documentElement.style.scrollBehavior = "auto";
    document.body.classList.remove("is-locked");

    return new Promise((listo) => {
      requestAnimationFrame(() => {
        raiz.scrollTop = 0;
        requestAnimationFrame(() => {
          window.html2pdf().set(ajustes).from(elemento).save().then(listo, listo);
        });
      });
    }).then(() => {
      raiz.scrollTop = scrollPrev;
      document.documentElement.style.scrollBehavior = behaviorPrev;
      if (estabaBloqueado) document.body.classList.add("is-locked");
    });
  }

  /* Visor compartido: abre en un modal la lámina de un uniforme o la
     lista digital de un grado, con sus botones de descarga.

     Los documentos de lista viven en la página (ocultos) y el visor los
     mueve dentro; al cerrar vuelven a su sitio. Se mueven en vez de
     clonarse para que las casillas que el visitante haya marcado no se
     pierdan y para no duplicar ids en el documento. */
  function initViewer() {
    const viewer = $("[data-viewer]");
    if (!viewer) return;

    const body = $("[data-viewer-body]", viewer);
    const title = $("[data-viewer-title]", viewer) || $("#viewer-title", viewer);
    const pdfBtn = $("[data-viewer-pdf]", viewer);
    const pdfLabel = $("[data-viewer-pdf-label]", viewer);
    const download = $("[data-viewer-download]", viewer);
    const downloadLabel = $("[data-viewer-download-label]", viewer);

    let lastFocus = null;
    let borrowed = null;   // documento prestado de la página
    let home = null;       // dónde estaba, para devolverlo
    let pdfName = "";      // nombre del archivo PDF que se genera

    /* «Pre-Jardín» → «pre-jardin». Se descomponen las tildes con NFD y se
       descartan las marcas diacríticas por código, que evita meter
       escapes unicode en la expresión regular. */
    const slug = (s) => s
      .normalize("NFD")
      .split("")
      .filter((c) => c.charCodeAt(0) < 768 || c.charCodeAt(0) > 879)
      .join("")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const close = () => {
      if (borrowed && home) {
        borrowed.hidden = true;
        home.appendChild(borrowed);
      }
      borrowed = null;
      home = null;

      body.textContent = "";
      viewer.hidden = true;
      document.body.classList.remove("is-locked");
      if (lastFocus) lastFocus.focus();
    };

    const open = (btn) => {
      lastFocus = btn;
      body.textContent = "";

      const docId = btn.dataset.verDoc;
      const imagen = btn.dataset.verImagen;
      const archivo = btn.dataset.verArchivo || "";

      if (docId) {
        /* Lista digital: se presta el documento de la tarjeta. */
        const doc = document.getElementById(docId);
        if (!doc) return;

        home = doc.parentNode;
        borrowed = doc;
        doc.hidden = false;
        body.appendChild(doc);

        const name = $(".doc__grade", doc);
        const grado = name ? name.textContent : "";
        title.textContent = grado ? "Lista de " + grado : "Lista escolar";
        pdfBtn.hidden = false;
        downloadLabel.textContent = "Descargar imagen";

        /* Nombre del PDF, sin tildes ni espacios: viaja mejor por correo
           y por WhatsApp, que es como lo van a compartir. */
        pdfName = "lista-utiles-2026-" + slug(grado) + ".pdf";
      } else {
        /* Lámina de uniforme: solo la imagen. */
        const img = document.createElement("img");
        img.src = imagen;
        img.alt = btn.dataset.verTitulo || "";
        body.appendChild(img);

        title.textContent = btn.dataset.verTitulo || "";
        pdfBtn.hidden = true;
        downloadLabel.textContent = "Descargar imagen";
        pdfName = "";
      }

      download.href = imagen;
      download.setAttribute("download", archivo);

      viewer.hidden = false;
      document.body.classList.add("is-locked");
      /* El primer [data-viewer-close] es el fondo, un div que no toma foco:
         hay que buscar el botón de cerrar de la barra. */
      const cerrar = $("button[data-viewer-close]", viewer);
      if (cerrar) cerrar.focus();
    };

    $$("[data-ver-doc], [data-ver-imagen]").forEach((btn) => {
      btn.addEventListener("click", () => open(btn));
    });

    $$("[data-viewer-close]", viewer).forEach((btn) => {
      btn.addEventListener("click", close);
    });

    /* Genera el PDF con html2pdf y lo baja de un clic. Si la librería no
       llegó a cargar, se cae al diálogo de impresión del sistema, que con
       la hoja @media print produce el mismo documento.

       Hay dos cosas aquí que parecen rodeos y no lo son:

       1. La página se lleva arriba del todo antes de generar. html2pdf
          monta su propio contenedor con position:fixed, pero html2canvas
          mide en coordenadas del documento: con la página desplazada
          captura la franja equivocada y el PDF sale en blanco. Es el
          motivo real de las hojas vacías, no la posición del clon.
       2. El documento se clona a un lienzo de ancho fijo en vez de usar el
          que está en el visor, cuyo ancho depende del tamaño de la ventana
          y cuyo contenedor tiene scroll propio. */
    if (pdfBtn) {
      pdfBtn.addEventListener("click", () => {
        const paper = $(".doc__paper", body);
        if (!paper) return;

        if (!window.html2pdf) {
          window.print();
          return;
        }

        pdfBtn.disabled = true;
        pdfLabel.textContent = "Generando…";

        /* El documento se clona a un lienzo de ancho fijo en vez de usar el
           que está en el visor, cuyo ancho depende del tamaño de la ventana
           y cuyo contenedor tiene scroll propio. */
        const stage = document.createElement("div");
        stage.className = "pdf-stage";
        const clone = paper.cloneNode(true);
        stage.appendChild(clone);
        document.body.appendChild(stage);

        /* La página del PDF se hace del tamaño exacto del documento, así
           que la lista entra completa en una sola hoja y no se parte.
           Margen blanco alrededor: sin él el marco rojo llega al borde de
           la hoja y en el visor no se lee como una página. */
        const margen = 26;
        const w = clone.offsetWidth;
        /* Dos píxeles de holgura: si el alto de la página coincidiera al
           milímetro con el del contenido, un redondeo podía sacar una
           segunda hoja casi vacía. */
        const h = clone.offsetHeight + 2;

        generarPdf(clone, {
          margin: margen,
          filename: pdfName || "lista-escolar.pdf",
          image: { type: "jpeg", quality: 0.98 },
          /* scale 2 para que el texto no salga pixelado. */
          html2canvas: { scale: 2, backgroundColor: "#ffffff", useCORS: true },
          jsPDF: {
            unit: "px",
            format: [w + margen * 2, h + margen * 2],
            orientation: h >= w ? "portrait" : "landscape",
            /* px_scaling hace que un píxel del documento sea un píxel del
               PDF; sin él jsPDF reescala y el encuadre no cuadra. */
            hotfixes: ["px_scaling"]
          }
        }).then(() => {
          stage.remove();
          pdfBtn.disabled = false;
          pdfLabel.textContent = "Descargar PDF";
        });
      });
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !viewer.hidden) close();
    });
  }

  /* Junta las láminas del calendario en un único PDF, una por hoja.

     El lienzo se arma con cajas del alto exacto de la página en vez de con
     saltos de página: html2pdf corta el lienzo por altura de hoja, así que
     con cajas iguales cada lámina cae encuadrada en la suya. Los saltos
     declarados fallan cuando el contenido son imágenes. */
  function initLaminasPdf() {
    const btn = $("[data-laminas-pdf]");
    if (!btn) return;

    const laminas = $$(".laminas img");
    if (!laminas.length) return;

    const label = $("[data-laminas-pdf-label]", btn) || btn;
    const textoPrev = label.textContent;

    btn.addEventListener("click", () => {
      if (!window.html2pdf) return;

      btn.disabled = true;
      label.textContent = "Generando…";

      /* Las hojas van en un bloque normal dentro del lienzo, no colgando de
         él: el lienzo está en position:fixed y html2canvas mide cero de alto
         cuando se le entrega un elemento fijo. */
      const stage = document.createElement("div");
      stage.className = "pdf-stage";
      const hojas = document.createElement("div");
      stage.appendChild(hojas);

      const copias = laminas.map((img) => {
        const hoja = document.createElement("div");
        hoja.className = "pdf-hoja";
        const copia = new Image();
        copia.src = img.currentSrc || img.src;
        hoja.appendChild(copia);
        hojas.appendChild(hoja);
        return copia;
      });

      document.body.appendChild(stage);

      const fin = () => {
        stage.remove();
        btn.disabled = false;
        label.textContent = textoPrev;
      };

      /* Sin esperar a que las copias carguen, html2canvas dibujaría hojas
         vacías. */
      const cargadas = copias.map(
        (img) =>
          new Promise((listo) => {
            if (img.complete) return listo();
            img.addEventListener("load", listo, { once: true });
            img.addEventListener("error", listo, { once: true });
          })
      );

      Promise.all(cargadas)
        .then(() => {
          /* Las medidas salen de las copias ya cargadas: las del documento
             llevan loading="lazy" y, mientras no se han visto, su tamaño
             natural es cero.

             La hoja se hace del tamaño de la lámina mayor para que ninguna
             quede recortada; las más pequeñas se centran con el sobrante. */
          const w = Math.max(...copias.map((img) => img.naturalWidth));
          const h = Math.max(...copias.map((img) => img.naturalHeight));
          if (!w || !h) return;

          stage.style.width = w + "px";
          copias.forEach((img) => {
            img.parentNode.style.height = h + "px";
          });

          return generarPdf(hojas, {
            margin: 0,
            filename: btn.dataset.laminasPdf || "calendario.pdf",
            image: { type: "jpeg", quality: 0.95 },
            html2canvas: { scale: 2, backgroundColor: "#ffffff", useCORS: true },
            jsPDF: {
              unit: "px",
              format: [w, h],
              orientation: h >= w ? "portrait" : "landscape",
              hotfixes: ["px_scaling"]
            }
          });
        })
        .then(fin, fin);
    });
  }

  /* --- 12. Sección activa en el menú -------------------------- */
  /* Resalta el enlace del menú según la sección que se está viendo. */
  function initScrollSpy() {
    const links = $$('.menu__link[href^="#"]');
    if (!links.length || !("IntersectionObserver" in window)) return;

    const map = new Map();
    links.forEach((link) => {
      const section = document.getElementById(link.getAttribute("href").slice(1));
      if (section) map.set(section, link);
    });
    if (!map.size) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const link = map.get(entry.target);
          if (!link) return;
          if (entry.isIntersecting) {
            links.forEach((l) => l.removeAttribute("aria-current"));
            link.setAttribute("aria-current", "page");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    map.forEach((_, section) => io.observe(section));
  }

  /* --- 13. Visor de imagen (cuadros de honor y de promoción) --- */
  /* Las piezas son anchas y con los nombres en letra pequeña: en el
     móvil no hay forma de leerlas sin ampliarlas. */
  function initLightbox() {
    const box = $(".lightbox");
    const img = $("[data-lightbox-img]");
    const triggers = $$("[data-lightbox]");
    if (!box || !img || !triggers.length) return;

    let opener = null;

    const close = () => {
      if (!box.classList.contains("is-open")) return;
      box.classList.remove("is-open");
      document.body.classList.remove("is-locked");
      // El src se limpia al terminar la transición, no antes: si no,
      // la imagen desaparece de golpe mientras el fondo se desvanece.
      window.setTimeout(() => {
        if (!box.classList.contains("is-open")) img.removeAttribute("src");
      }, 300);
      if (opener) opener.focus();
      opener = null;
    };

    triggers.forEach((btn) => {
      btn.addEventListener("click", () => {
        const src = btn.getAttribute("data-lightbox-src");
        if (!src) return;
        opener = btn;
        img.src = src;
        img.alt = $("img", btn) ? $("img", btn).alt : "";
        box.classList.add("is-open");
        document.body.classList.add("is-locked");
        const closeBtn = $("[data-lightbox-close]", box);
        if (closeBtn) closeBtn.focus();
      });
    });

    // Clic fuera de la imagen o en el botón de cerrar.
    box.addEventListener("click", (e) => {
      if (e.target === box || e.target.closest("[data-lightbox-close]")) close();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }

  /* --- 14. Detalles de utilidad ------------------------------- */
  function initMisc() {
    $$("[data-year]").forEach((el) => {
      el.textContent = String(new Date().getFullYear());
    });
  }

  const boot = () => {
    initStickyHeader();
    initDropdowns();
    initMobileMenu();
    initFaq();
    initHero();
    initPlayer();
    initInlineVideo();
    initDims();
    initCollage();
    initFab();
    initScrollSpy();
    initLightbox();
    initListas();
    initPeriodos();
    initViewer();
    initLaminasPdf();
    initMisc();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
