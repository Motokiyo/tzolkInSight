#!/bin/bash
# Hook SessionStart: injecte INDEX.md (leger) au lieu du contexte complet
# L'agent lit ensuite les fichiers wiki pertinents a sa tache
cd "$(dirname "$0")/../.." || exit 0

INDEX=""
[ -f INDEX.md ] && INDEX=$(cat INDEX.md)

python3 << PYEOF
import json, sys
idx = """$INDEX"""
print(json.dumps({"systemMessage": idx}))
PYEOF
