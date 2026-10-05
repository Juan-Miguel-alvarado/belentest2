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
      if (window.innerWidth > 1280) setOpen(false);
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
      // El institucional lleva narración: el clic es gesto del usuario, así
      // que el navegador ya permite reproducirlo con sonido.
      video.muted = false;
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

  /* La sección «Razones por las cuales nos escogen» sustituyó al
     acordeón de las cuatro dimensiones: son tarjetas sin interacción,
     así que no hay nada que inicializar aquí. */

  /* El collage de «Vida belenista» ya no tiene código propio: sus piezas
     son disparadores del visor compartido (initLightbox). */

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

  /* Visor compartido: abre en un modal la lámina de un uniforme, la
     lista escolar de un grado o una lámina del calendario. Siempre es
     una imagen, con su botón de descarga y el de cerrar.

     Antes las listas vivían además como documento HTML dentro de la
     página y el visor las movía adentro para generar un PDF. Se quitó:
     la lista es una sola lámina y lo que las familias hacen con ella es
     bajarla y llevarla a la papelería. */
  function initViewer() {
    const viewer = $("[data-viewer]");
    if (!viewer) return;

    const body = $("[data-viewer-body]", viewer);
    const title = $("[data-viewer-title]", viewer) || $("#viewer-title", viewer);
    const download = $("[data-viewer-download]", viewer);
    const downloadLabel = $("[data-viewer-download-label]", viewer);

    let lastFocus = null;

    const close = () => {
      body.textContent = "";
      viewer.hidden = true;
      document.body.classList.remove("is-locked");
      if (lastFocus) lastFocus.focus();
    };

    const open = (btn) => {
      const imagen = btn.dataset.verImagen;
      if (!imagen) return;

      lastFocus = btn;
      body.textContent = "";

      const img = document.createElement("img");
      img.src = imagen;
      img.alt = btn.dataset.verTitulo || "";
      body.appendChild(img);

      title.textContent = btn.dataset.verTitulo || "";
      if (downloadLabel) downloadLabel.textContent = "Descargar imagen";

      download.href = imagen;
      download.setAttribute("download", btn.dataset.verArchivo || "");

      viewer.hidden = false;
      document.body.classList.add("is-locked");
      /* El primer [data-viewer-close] es el fondo, un div que no toma foco:
         hay que buscar el botón de cerrar de la barra. */
      const cerrar = $("button[data-viewer-close]", viewer);
      if (cerrar) cerrar.focus();
    };

    $$("[data-ver-imagen]").forEach((btn) => {
      btn.addEventListener("click", () => open(btn));
    });

    $$("[data-viewer-close]", viewer).forEach((btn) => {
      btn.addEventListener("click", close);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !viewer.hidden) close();
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

    /* El pie solo existe donde hay algo que contar: en la portada, las
       piezas del collage traen etiqueta y descripción; los cuadros de
       honor no, y entonces el visor va sin pie. */
    const pie = $("[data-lightbox-pie]", box);
    const pieTag = $("[data-lightbox-tag]", box);
    const pieTexto = $("[data-lightbox-texto]", box);

    const pintarPie = (btn) => {
      if (!pie) return;
      const tag = $(".collage__tag", btn);
      const texto = $(".collage__text", btn);
      pie.hidden = !tag && !texto;
      if (pie.hidden) return;
      if (pieTag) {
        // Copiar la clase entera trae también el color de la etiqueta
        // (collage__tag--rojo, --turquesa…), sin repetir la paleta aquí.
        pieTag.className = tag ? tag.className : "";
        pieTag.textContent = tag ? tag.textContent.trim() : "";
        pieTag.hidden = !tag;
      }
      if (pieTexto) pieTexto.textContent = texto ? texto.textContent.trim() : "";
    };

    triggers.forEach((btn) => {
      btn.addEventListener("click", () => {
        const src = btn.getAttribute("data-lightbox-src");
        if (!src) return;
        opener = btn;
        img.src = src;
        img.alt = $("img", btn) ? $("img", btn).alt : "";
        pintarPie(btn);
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

  /* --- 15. Copiar un dato al portapapeles -------------------- */
  function initCopiar() {
    const botones = $$("[data-copiar]");
    if (!botones.length) return;

    // navigator.clipboard solo existe con HTTPS; abierta la página desde
    // un archivo o por http sigue haciendo falta el textarea de siempre.
    const alPortapapeles = (texto) => {
      if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(texto);
      }
      return new Promise((bien, mal) => {
        const caja = document.createElement("textarea");
        caja.value = texto;
        caja.setAttribute("readonly", "");
        caja.style.position = "fixed";
        caja.style.top = "0";
        caja.style.opacity = "0";
        document.body.appendChild(caja);
        caja.select();
        let hecho = false;
        try {
          hecho = document.execCommand("copy");
        } catch (e) {
          hecho = false;
        }
        document.body.removeChild(caja);
        hecho ? bien() : mal();
      });
    };

    botones.forEach((btn) => {
      const etiqueta = $(".copiar__texto", btn);
      const original = etiqueta ? etiqueta.textContent : "";
      let reloj = null;

      // El botón vuelve a su estado normal a los dos segundos.
      const avisar = (mensaje, ok) => {
        if (etiqueta) etiqueta.textContent = mensaje;
        btn.classList.toggle("is-hecho", ok);
        clearTimeout(reloj);
        reloj = setTimeout(() => {
          if (etiqueta) etiqueta.textContent = original;
          btn.classList.remove("is-hecho");
        }, 2000);
      };

      btn.addEventListener("click", () => {
        const dato = btn.getAttribute("data-copiar");
        if (!dato) return;
        alPortapapeles(dato).then(
          () => avisar("¡Copiado!", true),
          () => avisar("Cópialo a mano", false)
        );
      });
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
    initFab();
    initScrollSpy();
    initLightbox();
    initListas();
    initPeriodos();
    initViewer();
    initMisc();
    initCopiar();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
