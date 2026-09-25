/* Mundial Refrigeração — configuração e utilitários compartilhados */
(function () {
  // PROTÓTIPO: números fictícios. Trocar pelos WhatsApps confirmados pela Mundial.
  var CONFIG = {
    whatsapp: {
      camara: "5562900000000", // câmara fria + linha comercial
      linha: "5562900000001"   // peças / linha branca
    }
  };

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

  // Links de WhatsApp: data-wa="camara|linha", data-wa-msg="texto", data-intent="projeto|pecas|..."
  function wireWhatsApp(root) {
    (root || document).querySelectorAll("a[data-wa]").forEach(function (a) {
      var number = CONFIG.whatsapp[a.dataset.wa];
      var msg = a.dataset.waMsg || "";
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

  window.Mundial = { CONFIG: CONFIG, keepParams: keepParams, track: track, wireWhatsApp: wireWhatsApp };
})();
