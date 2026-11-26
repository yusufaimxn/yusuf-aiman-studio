---
name: brand-guard
description: Check that Yusuf Aiman videos, scenes and assets follow the brand system and the locked character specs. Use before rendering and whenever characters, colours, fonts or styles are touched.
---

# Brand guard

Sources: `CLAUDE.md` (defaults), `brand/` (tokens and standards), `characters/*/spec.md` (locked).

Check and report (file + line + fix):
- Colours come from brand tokens: #0066DE, #0B1E3F, #00C2FF, #FF8A00, #F5F7FA, #1F2937 (or tints defined in `brand/`).
- Fonts are Sora / Inter / Plus Jakarta Sans via local `@font-face`.
- Character usage matches the spec: Yusuf has goatee + watch; Aiman has glasses + headphones (default outfit); outfits and expressions come from the approved lists.
- No character asset is altered (recoloured, redrawn, restyled) without an approval note in `documentation/approvals.md`.
- Placeholders are listed in the breakdown with `status: placeholder`.

Never fix a character issue by editing the character; stop and ask the owner.
