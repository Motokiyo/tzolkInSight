#!/bin/bash
# Hook Stop: rappel wiki + INDEX + MemPalace diary
cd "$(dirname "$0")/../.." || exit 0

python3 << 'PYEOF'
import json
msg = (
    "FIN DE SESSION — 3 obligations:\n"
    "1. INDEX.md: mettre a jour si un fichier important a change\n"
    "2. MEMPALACE: kg_add par decision + diary_write(agent, resume AAAK)\n"
    "3. Ne PAS creer de fichier date. Reporter toute analyse dans les fichiers wiki existants."
)
print(json.dumps({"systemMessage": msg}))
PYEOF
