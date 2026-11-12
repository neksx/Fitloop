# FITLOOP V62 — inline SVG button chrome

Prepared against published V61 commit3a48bd11f006fc8022e347bc634d3d8a38dc5988. The user authorized publication of the combined desktop SVG and scrolling-section update on 2026-11-09; deployment receipts are stored separately.

Desktop only: the hero Try Fitloop, section-two Try an Example and both menu CTA buttons now contain inline SVG surfaces and four SVG corner paths. Below768px the additional SVGs are hidden and all original V61 button rules remain active, as explicitly requested by the user. The decorative SVG uses no external image, SVG URL or downloaded asset. A radial SVG gradient is centered at50%/50%; the button and glow centers coincide exactly. The prior section-two white inset shadows and .34-opacity border are replaced by one1px SVG frame at.12 opacity.

Corners use1px non-scaling strokes in both resting and expanded states, with the existing12px leg and5px opening displacement. Existing button geometry and typography are preserved. The fitting-room factory removes the new renderer class from its cloned hero button before applying its separately approved Add-model treatment.

before.json and after.json contain computed desktop source metrics. Width, height, Avenir font family, size, weight, line height, letter spacing and padding match exactly for all four controls. Hero is242×50/16px600; Example242×44/14px400; menu buttons139.5703×38 and129.5×38/14px600. Hover/focus checks show1px strokes and±5px transforms; obsolete CSS pseudo-corners are disabled. Below768px, computed legacy corner strokes remain2px, inline SVG decorations are hidden, and the original V61 fonts, borders and section-two inset shadows remain active; see mobile-preserved.json.

Both entry pages contain20 valid inline SVG roots for these four components and four unique gradient IDs, with no image nodes. All60 existing behavior tests pass; git diff --check passes. Browser screenshots record hero closed/open, Example closed/open and the desktop menu. Mobile appearance is preserved.
