#!/bin/sh
# Renova o ?v= de CSS/JS em todas as páginas. O .htaccess guarda CSS/JS em cache por 1 ano,
# então rode este script sempre que alterar arquivos em assets/css ou assets/js.
# Uso: sh scripts/versionar.sh
set -e
cd "$(dirname "$0")/.."
V=$(date +%Y%m%d%H%M)
for f in index.html */index.html; do
  sed -i.bak -E "s/\?v=[0-9]+/?v=$V/g" "$f" && rm "$f.bak"
done
echo "CSS/JS versionados com v=$V"
