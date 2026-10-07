# Mundial Refrigeração — Página de escolha + LPs

- `/` — página de escolha (Câmara fria + Peças de apoio · Linha branca)
- `/camaras-frias/` — LP câmara fria e refrigeração comercial (âncora `#pecas-de-apoio`)
- `/linha-branca/` — LP peças de linha branca
- `/politica-de-privacidade/` e `/termos-de-uso/` — páginas legais (ver "Privacidade e consentimento")

Domínio: `https://produto.mundialrefrigeracaogo.com.br/` (canonical, `og:url` e dados estruturados usam este endereço).
**As LPs devem permanecer exatamente nas URLs `/camaras-frias/` e `/linha-branca/`** (decisão do cliente): não renomeie as pastas nem os canonicals.

## Privacidade e consentimento

Consent Mode v2 em **modo básico** (`assets/js/consent.js` + `assets/css/consent.css`): nenhuma tag opcional é carregada antes da escolha.

- Cada página tem, no topo do `<head>`, um script inline que define `analytics_storage`, `ad_storage`, `ad_user_data` e `ad_personalization` como `denied` e, se já houver escolha salva, aplica `update` antes de qualquer tag. Esse é o único script inline (hash na CSP via `scripts/csp.py`).
- Escolha guardada em `localStorage` (`mundial_consent`: categorias, data, versão e modo). Para pedir nova escolha a todos, suba `VERSION` em `consent.js` **e** o `c.v === 1` do script inline das 5 páginas.
- Banner: **Aceitar todos** e **Rejeitar opcionais** com o mesmo estilo, tamanho e contraste; **Personalizar** abre o painel (Necessários sempre ativos; Analytics e Marketing começam desativados, com "Ver detalhes" de cada tecnologia). Sem botão "X" no banner. O rodapé tem "Configurações de privacidade" para revogar.
- Carregamento por categoria:
  - **Analytics** → gtag.js `G-YPNLP0WT4K` (cookies `lp_ga*`, só deste host, 13 meses) e Microsoft Clarity `yqihasm6oq` (`clarity('consentv2')`);
  - **Analytics ou Marketing** → contêiner GTM `GTM-T6JJ5MPM` (sem `<noscript>`: sem JavaScript não há como consentir);
  - **Marketing** → `spar-track.js` (Spar), que guarda `spar_attribution` e anexa gclid/fbclid/UTMs ao link do WhatsApp. Sem Marketing o botão abre o link `/l/…` do Spar sem parâmetros.
- Ao revogar uma categoria já ativa: `consent update` para `denied`, apagam-se os cookies próprios (`_ga*`, `lp_ga*`, `_clck`, `_clsk`, `_gcl_*`, `_fbp`, `_fbc`) e `spar_attribution`, e a página recarrega. Cookies que Google/Microsoft gravam em domínios próprios só o navegador remove.
- Eventos de `dataLayer` (`selecao_categoria`, `clique_whatsapp` com frente/intenção/posição, `atalho_pecas_apoio`) só são enviados depois de Analytics ou Marketing; nunca contêm PII. Não há formulário nas páginas.
- `mundial.js` repassa utm_*/gclid/fbclid entre a página de escolha e as LPs apenas na URL do link (sem armazenar nem enviar a terceiros).

### Páginas legais

`/politica-de-privacidade/` e `/termos-de-uso/` usam somente fatos confirmados: razão social, CNPJ e endereço do Comprovante de Inscrição (CNPJ 97.538.497/0002-19, **filial**), contatos informados (`mundialvendas22@gmail.com`, WhatsApp (62) 99284-7772), retenção de leads de 12 meses e o inventário técnico de cookies. **Não há texto jurídico aprovado**: bases legais, direitos do titular, transferência internacional, segurança e limitações de responsabilidade foram deliberadamente omitidos. As duas páginas estão `noindex, follow` e fora do sitemap até a aprovação do conteúdo.

## Tracking

- **GTM** `GTM-T6JJ5MPM` e **GA4** `G-YPNLP0WT4K` (gtag.js direto) e **Microsoft Clarity** `yqihasm6oq`: carregados por `consent.js` (ver acima), não mais por scripts inline.
- **Spar** (pedido do cliente): todos os botões de WhatsApp das duas LPs e o botão flutuante (`.wa-float`) são **links** (navegação em nova aba, não `fetch`) para o link rastreável da própria LP — câmara fria: `https://spar-hazel.vercel.app/l/comercial-camara-fria-kl56` · linha branca: `https://spar-hazel.vercel.app/l/linha-branca-w3sz`. O destino e a mensagem do WhatsApp são definidos no Spar. Botões com link `/l/` não levam `data-spar-whatsapp` nem `data-phone`.
- A CSP libera GTM, modo Preview do GTM, GA4 com recursos de publicidade ([guia oficial](https://developers.google.com/tag-platform/security/guides/csp)) e Clarity ([guia](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-csp)). Qualquer outra origem é bloqueada: tags de **HTML personalizado** e **variáveis JavaScript personalizadas** do GTM não funcionam; prefira Modelos da galeria e libere no `.htaccess` apenas origens confirmadas do cliente.
- ⚠️ O container publicado `GTM-T6JJ5MPM` contém tags de **outro cliente** (GA4 `G-ZC0L9ZZM0F` via `stape.marmorariastudio.com.br`, Google Ads `AW-18474397484`, Meta Pixel `3507445589526089`, Clarity `yq1li5jqbf`, seletores de formulário e leitura de cookies de e-mail/telefone/nome, `spar-track.js`). A CSP as bloqueia, mas **o container precisa ser limpo antes de divulgar**. Nenhuma dessas IDs foi instalada no HTML. Meta Pixel e Google Ads não estão confirmados para a Mundial; ao configurá-los no GTM, use consentimento adicional (Meta e Clarity só com `marketing`/`analytics`) e libere as origens na CSP.
- O GA4 `G-YPNLP0WT4K` não está no GTM (não há contagem em dobro). Se for movido para o GTM, remova `loadGa` de `consent.js`.

WhatsApp: o número e a mensagem vêm do link rastreável do Spar; para trocar o destino, altere o link em todos os botões das LPs ou a configuração do link no Spar. Números informados pelo cliente: câmara fria +55 62 9415-9089 · linha branca +55 62 99284-7772 (a ficha de 07/10/2026 traz o 9º dígito; o README anterior citava 9284-7772 — confirme no Spar).

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
- CSP estrita (fonte única, sem `<meta>`), sem `unsafe-inline`/`unsafe-eval`; o único script inline é autorizado por hash. Por diretiva:
  - `script-src`: `'self'`, hash do consentimento, `googletagmanager.com`, `tagmanager.google.com` (Preview), `*.clarity.ms`, `spar-hazel.vercel.app`;
  - `connect-src`/`img-src`: GA4 com publicidade (`*.google-analytics.com`, `*.google.com`, `*.google.com.br`, `*.g.doubleclick.net`, `pagead2.googlesyndication.com`) e Clarity (`*.clarity.ms`, `c.bing.com`);
  - `style-src`/`font-src`: origens do Google usadas só pelo Preview do GTM; `frame-src`: `googletagmanager.com`;
  - `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'self'`.
  O Spar é **link**, não entra em `connect-src`/`form-action`. **Ao adicionar Google Ads, pixel ou outro recurso externo, inclua as origens exatas antes de publicar.**
- Outros cabeçalhos: `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options` e HSTS (`max-age=31536000`, só em HTTPS, sem `includeSubDomains`/`preload`).
- Cache: HTML revalidado sempre; CSS/JS por 1 ano (versionados por `?v=`); imagens 30 dias; fontes 1 ano. Compressão gzip.
- Arquivos internos (`.git`, `.cpanel.yml`, `README.md`, `scripts/`) respondem 404 mesmo que o clone fique na raiz do site. `robots.txt` e `sitemap.xml` são servidos com cache de 1 hora.

### Ao alterar CSS ou JS

Rode `sh scripts/versionar.sh` antes do commit para renovar o `?v=` em todas as páginas. Ao mexer em scripts inline, rode também `python3 scripts/csp.py`.

## Indexação

As três páginas públicas estão `index, follow` (decisão de 07/10/2026) com `robots.txt` e `sitemap.xml` listando `/`, `/camaras-frias/` e `/linha-branca/`. As páginas legais ficam `noindex, follow` e fora do sitemap. Depois do deploy, envie o sitemap no Search Console e meça as URLs públicas no PageSpeed Insights.

## Pendências

- [ ] Aprovação jurídica da Política de Privacidade e dos Termos de Uso (e depois decidir se saem do `noindex`).
- [ ] Limpar o container `GTM-T6JJ5MPM` (tags da Marmoraria Studio) e confirmar Ads, Meta e a propriedade do Clarity; configurar consentimento adicional nas tags de terceiros.
- [ ] Confirmar no Spar o número de WhatsApp de cada link (linha branca: ficha informa +55 62 99284-7772).
- [ ] Confirmar que a filial (CNPJ …/0002-19) é a entidade responsável pelas páginas e o endereço a exibir.
- [ ] Confirmar mix de marcas e produtos exibidos (ver comentários no HTML).
- [ ] Validar Consent Mode no Tag Assistant e a CSP no servidor real após o deploy.
