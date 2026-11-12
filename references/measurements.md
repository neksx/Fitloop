# Source-to-extraction verification — 2026-10-30

Source: http://127.0.0.1:4173/#how, local code `../fitloop/dist`.
Extracted: http://127.0.0.1:4174/.

Computed styles were inspected in the browser BEFORE extraction at 1440×900 and 390×844, then compared against the extracted page at the SAME viewport sizes. All sampled computed values matched; only subpixel garment bounding-box rounding differed (less than 0.00005px). Asset URL origins were normalized for this comparison, and full document height was excluded because the lower sections/header/footer were deliberately removed.

| Element / value | Desktop 1440×900 | Mobile 390×844 |
|---|---|---|
| Hero dimensions | 1440×828px | 390×810px |
| Title font | AvenirNext 900, 60px, normal line-height | AvenirNext 900, 45px, normal line-height |
| Title tracking / margin bottom | 1px / -10px | 1px / -10px |
| Subtitle | 12px / 400 / 16.32px tracking | 9px / 400 / 12.29px tracking |
| Subtitle margin left | 14px | 12px |
| Body font | AvenirNext 400 / 16px / normal | same |
| Body container width / margin | 720px / 40px 0 | 351px / 24px 0 |
| Primary CTA | 242×50px / 16px / 600 / 20px line-height | same |
| CTA padding / margin bottom | 14px 30px / 24px | same |
| CTA fill / border / blur | white .2 / 1px white .1 / 5px | same |
| CTA corner strokes | four original CSS 12px corners / 2px borders / 5px hover offset | same |
| Look card | 330×165px / right20 / bottom28 | 358×179px / right16 / bottom28 |
| Replay | right40 / top30 / 14px / 600 / line20 | right16 / top16 / same font |
| Intro counter font size | 244.8px | 100px |
| Intro glass mask | rgba(0,0,0,.1) / blur20px | same |

Checked selectors: body, .hero, .culture-title h1, .culture-title>span, .culture-body, .culture-body p, .culture-ctas, .culture-ctas>.button, .culture-ctas>a, .hero-look, .look-gallery, .hero-bottom-note, .culture-replay, .culture-scroll, .loading, .loading_counter, .loading_sequence_mask, .garment. Properties: width, height, font-family/size/weight/line-height/letter-spacing, padding, margin, four positioning offsets, background, border, backdrop-filter, display.

There are no SVG paths in the retained hero; the remix arrow is the original ↻ character, the scroll mouse is original CSS, and CTA corners are original CSS strokes.

Original `redesign.css` copied byte for byte. Base CSS is limited to the original reset and hero dependencies, retaining source media queries. Original hero dimensions were preserved even after removing the header. Images and font bytes are unchanged (SHA-256 in source-assets.json).

Verification completed: JavaScript syntax valid; exactly one section, no header/footer, no horizontal overflow at either viewport; images loaded; no browser console errors; automatic intro finish, replay and skip checked. Intro mask is blur20px while running. Carousel control retained with original interpolation and input listeners.
