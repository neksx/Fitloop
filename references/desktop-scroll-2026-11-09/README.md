# FITLOOP desktop scrolling-section integration

Prepared from published V61 and the retained desktop SVG CTA draft. User authorized publication on 2026-11-09, excluding mobile.

The existing scroll, split-text obstacle animation, image opening, and fitting-room handoff are retained. Only the desktop visual stages become interactive. Original section markup and existing sections.css/responsive.css are byte-identical to the baseline. New markup mounts at >=768px and is fully removed below that breakpoint. Desktop caption timing accounts for the extra 90px of image height while retaining the original clearance below the image.

Stages: 150x240 garment, 300x240 garment/model pair, 234x240 saved-look example. The model stays 156px tall, with 10px clearance below its name and 16px above its status. Both name and status use 10px native Avenir.

The garment SVG remains mounted. Measured foreground bounds pin all six pieces to the same center; native assets decode before the opacity-only replacement. Logo Bling and Monogram retain the approved 8% reduction. Native fitting-room REFRESH/REPLACE markup and styles are reused.

REPLACE always changes only the left suggestion. REFRESH applies a new top to the example model. REFRESH on a worn top shows the native-style advisory then changes the left suggestion. The 1px central divider remains above the notice. The example is isolated from working and saved fitting-room outfits.

Validation: 60 existing tests pass; JavaScript syntax and git diff checks pass. Actual desktop browser checks cover all six tops, independent REPLACE/REFRESH, model changes, worn-item notice, divider layering, naming, and forward/reverse fitting-room transitions. All centers remain fixed.

At 390x844, every recorded mobile computed style, copy string, original product count, and stage accessibility attribute matches the baseline exactly. Desktop nodes are absent on mobile, including after a desktop-to-mobile resize. Mobile screenshots are visually unchanged; their small JPEG raster differences are recorded in mobile-pixels.json.

Source baselines, computed measurements and browser screenshots are stored alongside this file.

Post-publication focus check: virtual scrolling containers now use overflow:clip on desktop. This prevents browser focus/scrollIntoView from moving the entire stage when a garment action or name input is focused. Mobile overflow rules are unchanged.
