# Mundial Refrigeração — Página de escolha + LPs (protótipo)

- `/` — página de escolha (Câmara fria + Peças de apoio · Linha branca)
- `/camaras-frias/` — LP câmara fria e refrigeração comercial (âncora `#pecas-de-apoio`)
- `/linha-branca/` — LP peças de linha branca

Domínio: `https://produto.mundialrefrigeracaogo.com.br/` (canonical, `og:url` e dados estruturados usam este endereço).

## Tracking

- **GTM** `GTM-T6JJ5MPM` e **GA4** `G-YPNLP0WT4K` (gtag.js direto) no topo do `<head>` das três páginas; `noscript` do GTM logo após `<body>`.
- **Microsoft Clarity** `yqihasm6oq` no `<head>` das três páginas (origens `*.clarity.ms` e `c.bing.com` liberadas na CSP).
- Os scripts inline do GTM e do gtag são autorizados na CSP **por hash**. Se alterar qualquer caractere deles, rode `python3 scripts/csp.py` (confira com `--check`).
- A CSP libera GTM, modo Preview do GTM e GA4 com recursos de publicidade ([guia oficial](https://developers.google.com/tag-platform/security/guides/csp)). Qualquer outra origem é bloqueada: tags de **HTML personalizado** e **variáveis JavaScript personalizadas** do GTM não funcionam; prefira Modelos da galeria e libere no `.htaccess` apenas origens confirmadas do cliente.
- ⚠️ A versão 4 do container `GTM-T6JJ5MPM` contém tags de outro cliente (GA4 `G-ZC0L9ZZM0F` via `stape.marmorariastudio.com.br`), além de Google Ads `AW-18474397484`, Meta Pixel `3507445589526089`, Clarity `yq1li5jqbf` e `spar-hazel.vercel.app/spar-track.js`. Todas estão bloqueadas pela CSP até que a propriedade de cada uma seja confirmada.
- Se o GA4 `G-YPNLP0WT4K` também for configurado dentro do GTM, remova o gtag direto para não contar visitas em dobro.

WhatsApps são **placeholders**: altere em `assets/js/mundial.js` (`CONFIG.whatsapp`).
Eventos enviados ao `dataLayer`: `selecao_categoria`, `clique_whatsapp` (frente, intenção, posição), `atalho_pecas_apoio`.
Parâmetros de aquisição (utm_*, gclid, fbclid…) são preservados entre a página de escolha e as LPs.

Identidade: logo oficial, azul #0064FF / marinho #000F6B (logo #001382) e Poppins, extraídos de produtos.mundialrefrigeracaogo.com.br.
Fotos de produtos (`assets/img/produtos/`) e ambiente de câmara fria vêm do mesmo site, recortadas e convertidas em WebP.

## Estrutura técnica

- **CSS mobile first**: a base atende o celular e `min-width` amplia (`lp.css`: 481 · 641 · 768 · 901 · 1101; `escolha.css`: 768 · 1025). Não use `max-width` em media queries.
- **Fonte**: Poppins hospedada em `assets/fonts/` (subset latino, licença em `assets/fonts/OFL.txt`); nenhuma requisição ao Google Fonts.
- **Animação de entrada** (`Mundial.reveal` em `assets/js/mundial.js`): só esconde o que está abaixo da dobra no carregamento e revela uma vez ao rolar. Hero nunca fica oculto; sem JS ou com redução de movimento, tudo aparece.
- **FAQ**: `<details name="faq">` — abrir uma resposta fecha a anterior (nativo, com fallback em `lp.js`). Os dados estruturados `FAQPage` repetem exatamente perguntas e respostas visíveis: ao editar uma, edite a outra.
- **Botão WhatsApp**: verde `#15803D` (contraste 5:1 com texto branco, WCAG AA).

## Publicação (cPanel · Git Version Control)

- Clone URL: `https://github.com/atende3ads-ux/lp-mundial.git`
- `.cpanel.yml` copia o repositório para `/home2/hg3ads37/produto.mundialrefrigeracaogo.com.br` com `rsync --delete`, excluindo `.git`, `README.md`, `scripts/`, `.nojekyll` e preservando `.well-known`, `cgi-bin` e `error_log` do servidor.
- Depois da cópia, o deploy aplica **755 nas pastas e 644 nos arquivos** (fora `cgi-bin`). Sem isso, o `rsync -a` herdava a permissão 700 da pasta do repositório criada pelo cPanel e o site respondia 403.
- No cPanel: **Update from Remote** → **Deploy HEAD Commit**.

### `.htaccess` (fonte única de cabeçalhos)

- HTTPS forçado apenas no domínio de produção.
- CSP estrita: próprio domínio + origens do GTM/GA4 (ver Tracking), sem `unsafe-inline`; scripts inline só por hash. **Ao adicionar Google Ads, pixel ou outro recurso externo, inclua as origens exatas na CSP antes de publicar** — senão o navegador bloqueia.
- Cache: HTML revalidado sempre; CSS/JS por 1 ano (versionados por `?v=`); imagens 30 dias; fontes 1 ano. Compressão gzip.
- Arquivos internos (`.git`, `.cpanel.yml`, `README.md`, `scripts/`) respondem 404 mesmo que o clone fique na raiz do site.

### Ao alterar CSS ou JS

Rode `sh scripts/versionar.sh` antes do commit para renovar o `?v=` em todas as páginas. Ao mexer em scripts inline, rode também `python3 scripts/csp.py`.

## Pendências antes de indexar e divulgar

- [ ] Números reais de WhatsApp em `CONFIG.whatsapp` (hoje fictícios — os CTAs não funcionam).
- [ ] CNPJ no rodapé e URL da política de privacidade (link hoje desativado).
- [ ] Confirmar mix de marcas e produtos exibidos (ver comentários no HTML).
- [ ] Trocar `noindex, nofollow` por `index, follow` nas três páginas e criar `sitemap.xml` + `robots.txt` apontando para ele.
- [ ] Limpar o container `GTM-T6JJ5MPM` (remover tags da Marmoraria Studio) e confirmar Ads, Meta, Clarity e spar-track antes de liberá-los na CSP.
