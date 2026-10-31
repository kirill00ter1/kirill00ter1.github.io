/* =========================================================
   Империя Вкуса — скрипты сайта
   Чистый Vanilla JS, без библиотек.
   Содержание:
   1. Мобильное меню (бургер)
   2. Тень шапки при прокрутке
   3. Появление блоков при прокрутке
   4. Подсветка активной категории меню
   5. Подсветка текущего дня в графике
   6. Год в подвале
   ========================================================= */

(function () {
  "use strict";

  var body = document.body;
  var header = document.querySelector(".site-header");
  var burger = document.querySelector(".burger");
  var nav = document.getElementById("primary-nav");

  /* ---------- 1. Мобильное меню ---------- */

  /**
   * Открывает или закрывает мобильную навигацию.
   * @param {boolean} open — true, чтобы открыть меню.
   */
  function setMenu(open) {
    body.classList.toggle("nav-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
  }

  if (burger && nav) {
    burger.addEventListener("click", function () {
      setMenu(!body.classList.contains("nav-open"));
    });

    // Закрываем меню после клика по любой ссылке
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setMenu(false);
      });
    });

    // Закрытие по Escape
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && body.classList.contains("nav-open")) {
        setMenu(false);
        burger.focus();
      }
    });

    // Закрытие по клику вне меню
    document.addEventListener("click", function (event) {
      if (!body.classList.contains("nav-open")) return;
      if (nav.contains(event.target) || burger.contains(event.target)) return;
      setMenu(false);
    });

    // При переходе на десктоп сбрасываем состояние
    window.addEventListener("resize", function () {
      if (window.innerWidth > 960 && body.classList.contains("nav-open")) {
        setMenu(false);
      }
    });
  }

  /* ---------- 2. Шапка и мобильная панель при прокрутке ---------- */

  var mobileBar = document.querySelector(".mobile-bar");

  function updateOnScroll() {
    if (header) {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    }

    // Панель звонка появляется только после прокрутки первого экрана
    if (mobileBar) {
      mobileBar.classList.toggle("is-visible", window.scrollY > 280);
    }
  }

  updateOnScroll();
  window.addEventListener("scroll", updateOnScroll, { passive: true });

  /* ---------- 3. Появление блоков при прокрутке ---------- */

  var revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    revealItems.forEach(function (item, index) {
      // Небольшая задержка создаёт эффект «волны»
      item.style.transitionDelay = (index % 3) * 60 + "ms";
      revealObserver.observe(item);
    });
  } else {
    // Старые браузеры: показываем всё сразу
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  }

  // Страховка: контент не должен остаться скрытым
  window.setTimeout(function () {
    revealItems.forEach(function (item) {
      if (!item.classList.contains("is-visible")) {
        item.classList.add("is-visible");
      }
    });
  }, 4000);

  /* ---------- 4. Подсветка активной категории меню ---------- */

  var tabs = Array.prototype.slice.call(document.querySelectorAll(".tab"));
  var groups = Array.prototype.slice.call(document.querySelectorAll(".menu-group"));

  if (tabs.length && groups.length) {
    var setActiveTab = function (id) {
      tabs.forEach(function (tab) {
        tab.classList.toggle("is-active", tab.dataset.spy === id);
      });
    };

    var updateActiveTab = function () {
      var probe = window.scrollY + 200;
      var current = groups[0];

      groups.forEach(function (group) {
        var top = group.getBoundingClientRect().top + window.scrollY;
        if (top <= probe) current = group;
      });

      setActiveTab(current.dataset.group);
    };

    var ticking = false;
    window.addEventListener(
      "scroll",
      function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(function () {
          updateActiveTab();
          ticking = false;
        });
      },
      { passive: true }
    );

    updateActiveTab();
  }

  /* ---------- 5. Подсветка текущего дня ---------- */

  var today = new Date().getDay(); // 0 — воскресенье
  var isoDay = today === 0 ? 7 : today; // 1 — понедельник

  document.querySelectorAll(".hours__list li").forEach(function (row) {
    row.classList.toggle("is-today", row.dataset.day === String(isoDay));
  });

  /* ---------- 6. Год в подвале ---------- */

  var yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
  }
})();
