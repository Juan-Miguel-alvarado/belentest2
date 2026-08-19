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

  /* --- 5. Video de la sección «Nosotros» --------------------- */
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

  /* --- 6. Video del testimonio, dentro de la propia tarjeta -- */
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


  /* --- 7. Dimensiones de la formación integral --------------- */
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
  /* --- 8. Collage de vida belenista -------------------------- */
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

  /* --- 9. Botón flotante de WhatsApp ------------------------- */
  function initFab() {
    const fab = $(".wa-fab");
    if (!fab) return;
    const onScroll = () => fab.classList.toggle("is-in", window.scrollY > 480);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* --- 10. Sección activa en el menú -------------------------- */
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

  /* --- 11. Detalles de utilidad ------------------------------- */
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
    initPlayer();
    initInlineVideo();
    initDims();
    initCollage();
    initFab();
    initScrollSpy();
    initMisc();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
