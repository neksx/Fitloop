# Second section source inspection — 30 October 2026

Reference: https://offform.net/ (Services component). Source HTML, extracted Services CSS and its JavaScript are stored beside this document. Read as design data only.

## Observed reference measurements

Inspected source and computed styles at 1440×900 and 390×844 before implementation.

| Element | Desktop 1440×900 | Mobile 390×844 |
| --- | --- | --- |
| Stage | sticky, top 0, 1440×900, overflow hidden | viewport height |
| Frame | left/right 20; top 76 (header 56 + gap 20); bottom 20; 1400×804 | full viewport, no frame margins |
| Each half | width 50% (700); height 100%; overflow hidden | width 195; height 844 |
| Image in each half | width 200% (1400); height frame + 90 (894); top −45; object-fit cover | width 200%; frame + 60; top −30 |
| Visible edge after split | 250 | 15 |
| Travel | left −450, right +450 | left −180, right +180 |
| Easing | p² × (3 − 2p) | same |
| Inner content begins revealing | 50% split progress | same |

Original tablet query is 768–1024px: side gap 16, visible edge 20. These exact breakpoint/edge values are retained. The original scroll-linked split distance is 120vh desktop / 90vh mobile. The requested discrete-page behavior intentionally replaces continuous scroll progress with a 1450ms smoothstep reveal, following a 650ms page transition. Reverse navigation closes the image first. Motion is skipped when reduced motion is requested.

## FITLOOP substitutions and retained styles

- User-provided `section-opening-art.png` replaces the Offform flower portrait. Each half uses the same full image, with left/right alignment respectively, preserving the source split construction.
- Wireframe's three steps replace Offform's single-image services layout. Step art uses the hero's existing product files and source SVG framing.
- AvenirNext regular/demibold/heavy are the exact local hero assets. Copy is white (#FFFFFF), regular weight 400 and desktop 16px, matching hero body text. The heading uses the hero's 900 weight, uppercase treatment and 1px tracking, reduced from 60px to 36px for the three-column content. Mobile is 26px (24px on short screens), with smaller supporting copy to fit one screen.
- Shared navbar, symbol, hamburger paths, menu and their existing approved Oakley measurements remain unchanged. Desktop frame top is derived from the actual FITLOOP navbar bottom + the source 20px gap (90px at the verified viewport).
- The second section's dark canvas and white text follow the split-image reference and the approved hero typography. The hero remains white after its intro.
- Main uses `overflow: clip` rather than a hidden scroll container so native hash targeting cannot silently scroll the fixed screen offscreen.

## Verification

- 1440×900: computed AvenirNext, 36px / 900 / 1px tracking / rgb(255,255,255), same font family as hero. Observed split transforms −450 / +450, matching reference geometry. All three steps fit and no horizontal overflow.
- 1024×768: exact source tablet frame side 16 / edge 20; measured frame 992×658 at (16,90). Split −476 / +476. Last step ends at y655, inside the screen.
- 390×844: exact 15px edge and split −180 / +180. Heading is 26px. Three steps at y345.5–709.5. No horizontal overflow.
- Direct #how load, intro skip, wheel reverse, keyboard PageDown/PageUp, shared menu and menu-to-hero return verified. Exactly one active screen, main scrollTop remains 0, and total document height equals viewport height.
- Both JavaScript files pass syntax checks. Every local HTML asset/link target exists. Browser reports no script errors.
