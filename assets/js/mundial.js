/* Mundial Refrigeração — configuração e utilitários compartilhados */
(function () {
  // Parâmetros de aquisição preservados entre a página de escolha e as LPs
  var KEEP = /^(utm_|gclid$|gbraid$|wbraid$|fbclid$|msclkid$|ttclid$)/;

  function acquisitionParams() {
    var out = new URLSearchParams();
    new URLSearchParams(window.location.search).forEach(function (v, k) {
      if (KEEP.test(k)) out.set(k, v);
    });
    return out;
  }

  function keepParams(root) {
    var params = acquisitionParams();
    if (![...params.keys()].length) return;
    (root || document).querySelectorAll("a[data-keep-params]").forEach(function (a) {
      var url = new URL(a.getAttribute("href"), window.location.href);
      params.forEach(function (v, k) { if (!url.searchParams.has(k)) url.searchParams.set(k, v); });
      a.setAttribute("href", url.pathname + url.search + url.hash);
    });
  }

  function track(event, data) {
    window.dataLayer = window.dataLayer || [];
    var payload = { event: event };
    for (var k in data) payload[k] = data[k];
    window.dataLayer.push(payload);
  }

  // Links de WhatsApp no formato do Spar: data-spar-whatsapp data-phone="55DDDNUMERO" data-text="mensagem".
  // O número fica só no HTML de cada botão; data-wa="camara|linha" e data-intent/data-pos alimentam o dataLayer.
  function wireWhatsApp(root) {
    (root || document).querySelectorAll("a[data-wa]").forEach(function (a) {
      var number = a.dataset.phone;
      var msg = a.dataset.text || "";
      a.href = "https://wa.me/" + number + (msg ? "?text=" + encodeURIComponent(msg) : "");
      a.target = "_blank";
      a.rel = "noopener";
      a.addEventListener("click", function () {
        track("clique_whatsapp", {
          frente: a.dataset.wa,
          intencao: a.dataset.intent || "geral",
          posicao: a.dataset.pos || ""
        });
      });
    });
  }

  // Revelação única ao rolar. Só esconde (.fx-wait) o que está abaixo da dobra no carregamento:
  // hero e conteúdo já visível nunca somem; sem JS, sem IntersectionObserver ou com redução de movimento, nada é escondido.
  function reveal(selector, options) {
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var vh = window.innerHeight;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        io.unobserve(el);
        el.classList.add("fx-in");
        el.classList.remove("fx-wait");
        el.addEventListener("transitionend", function done(ev) {
          if (ev.target !== el) return;
          el.classList.remove("fx-in"); // devolve ao elemento as próprias transições (ex.: hover dos cards)
          el.removeEventListener("transitionend", done);
        });
      });
    }, options);
    document.querySelectorAll(selector).forEach(function (el) {
      if (el.getBoundingClientRect().top <= vh) return;
      el.classList.add("fx-wait");
      io.observe(el);
    });
  }

  window.Mundial = { keepParams: keepParams, track: track, wireWhatsApp: wireWhatsApp, reveal: reveal };
})();
