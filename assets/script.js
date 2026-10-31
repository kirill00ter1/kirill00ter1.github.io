(function () {
  "use strict";

  /* Current year in footer */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* Reveal on scroll */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = (i % 3) * 60 + "ms";
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* Failsafe: never leave content hidden if the observer misfires */
  window.setTimeout(function () {
    revealEls.forEach(function (el) {
      if (!el.classList.contains("is-visible")) el.classList.add("is-visible");
    });
  }, 4000);

  /* Menu category scroll-spy */
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".tab"));
  var groups = Array.prototype.slice.call(document.querySelectorAll(".menu-group"));

  if (tabs.length && groups.length) {
    var setActive = function (id) {
      tabs.forEach(function (tab) {
        tab.classList.toggle("is-active", tab.dataset.spy === id);
      });
    };

    var updateSpy = function () {
      var probe = window.scrollY + 200;
      var current = groups[0];

      groups.forEach(function (group) {
        var top = group.getBoundingClientRect().top + window.scrollY;
        if (top <= probe) current = group;
      });

      setActive(current.dataset.group);
    };

    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        updateSpy();
        ticking = false;
      });
    }, { passive: true });

    updateSpy();
  }
})();
