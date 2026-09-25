# Mundial Refrigeração — Página de escolha + LPs (protótipo)

- `/` — página de escolha (Câmara fria + Peças de apoio · Linha branca)
- `/camaras-frias/` — LP câmara fria e refrigeração comercial (âncora `#pecas-de-apoio`)
- `/linha-branca/` — LP peças de linha branca

WhatsApps são **placeholders**: altere em `assets/js/mundial.js` (`CONFIG.whatsapp`).
Eventos enviados ao `dataLayer`: `selecao_categoria`, `clique_whatsapp` (frente, intenção, posição), `atalho_pecas_apoio`.
Parâmetros de aquisição (utm_*, gclid, fbclid…) são preservados entre a página de escolha e as LPs.
