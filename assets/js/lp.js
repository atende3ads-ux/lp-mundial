/* Landing pages: WhatsApp, parâmetros de origem e animação de entrada */
(function () {
  Mundial.keepParams();
  Mundial.wireWhatsApp();

  document.querySelectorAll("a[data-track]").forEach(function (a) {
    a.addEventListener("click", function () { Mundial.track(a.dataset.track, { destino: a.getAttribute("href") }); });
  });

  var fx = document.querySelectorAll(".fx");
  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    fx.forEach(function (el) { el.classList.add("is-in"); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  fx.forEach(function (el) { io.observe(el); });
})();
