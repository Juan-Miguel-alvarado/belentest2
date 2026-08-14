/* ============================================================
   main.js — comportamiento del sitio
   Navegación · menú móvil · acordeón · video · modal · utilidades
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

  /* --- 6. Modal de video (testimonios) ----------------------- */
  function initModal() {
    const modal = $("[data-modal]");
    if (!modal) return;

    const player = $("[data-modal-player]", modal);
    const triggers = $$("[data-modal-video]");
    if (!player || !triggers.length) return;

    let lastFocus = null;

    const close = () => {
      modal.classList.remove("is-open");
      document.body.classList.remove("is-locked");
      player.pause();
      player.removeAttribute("src");
      player.load();
      if (lastFocus) lastFocus.focus();
    };

    triggers.forEach((btn) => {
      btn.addEventListener("click", () => {
        lastFocus = btn;
        player.src = btn.dataset.modalVideo;
        modal.classList.add("is-open");
        document.body.classList.add("is-locked");
        $("[data-modal-close]", modal).focus();
        const attempt = player.play();
        if (attempt && typeof attempt.catch === "function") attempt.catch(() => {});
      });
    });

    $("[data-modal-close]", modal).addEventListener("click", close);

    // Clic en el fondo, fuera de la caja del video.
    modal.addEventListener("click", (e) => {
      if (!e.target.closest(".modal__box")) close();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("is-open")) close();
    });
  }

  /* --- 7. Botón flotante de WhatsApp ------------------------- */
  function initFab() {
    const fab = $(".wa-fab");
    if (!fab) return;
    const onScroll = () => fab.classList.toggle("is-in", window.scrollY > 480);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* --- 8. Sección activa en el menú -------------------------- */
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

  /* --- 9. Detalles de utilidad ------------------------------- */
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
    initModal();
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
