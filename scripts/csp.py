#!/usr/bin/env python3
"""Atualiza os hashes dos scripts inline na Content-Security-Policy do .htaccess.

Cada <script> inline das páginas (GTM, gtag) precisa do seu 'sha256-...' em script-src.
Qualquer alteração no conteúdo desses scripts, até em espaços, muda o hash.

Uso:
  python3 scripts/csp.py           # recalcula e grava no .htaccess
  python3 scripts/csp.py --check   # só confere (sai com erro se estiver desatualizado)
"""
import base64, glob, hashlib, os, re, sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
HTACCESS = os.path.join(ROOT, ".htaccess")
PAGES = [os.path.join(ROOT, "index.html")] + sorted(glob.glob(os.path.join(ROOT, "*", "index.html")))

hashes = set()
for page in PAGES:
    html = open(page, encoding="utf-8").read()
    for attrs, body in re.findall(r"<script([^>]*)>(.*?)</script>", html, flags=re.S):
        if "src=" in attrs or "application/ld+json" in attrs:
            continue  # scripts externos e dados estruturados não precisam de hash
        digest = base64.b64encode(hashlib.sha256(body.encode("utf-8")).digest()).decode()
        hashes.add(f"'sha256-{digest}'")

conf = open(HTACCESS, encoding="utf-8").read()
match = re.search(r"script-src ([^;\"]*)", conf)
if not match:
    sys.exit("script-src não encontrado no .htaccess")
others = [t for t in match.group(1).split() if not t.startswith("'sha256-")]
tokens = others[:1] + sorted(hashes) + others[1:]  # mantém 'self' primeiro
updated = conf[:match.start(1)] + " ".join(tokens) + conf[match.end(1):]

if "--check" in sys.argv:
    if updated != conf:
        sys.exit("CSP desatualizada: rode python3 scripts/csp.py")
    print(f"CSP em dia ({len(hashes)} scripts inline autorizados)")
else:
    open(HTACCESS, "w", encoding="utf-8").write(updated)
    print(f"script-src atualizado com {len(hashes)} hashes")
