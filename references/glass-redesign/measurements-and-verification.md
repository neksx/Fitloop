# Glass hero redesign — 30 October 2026

## Sources inspected before editing

- https://almirakho.com/ — rendered DOM and computed styles at 1440×900 and 390×844; source HTML, entry CSS, MobileCarousel CSS, page component and DRNPaYx9.js carousel saved alongside this file.
- Official Ksubi new-in-mens and mens-denim-maxx catalog JSON; official Purple new-arrivals catalog JSON. Selected names and exact source image/product URLs are in products.json. Original downloaded photographs are used without generating clothing.
- User-provided first attached photo. ImageGen removed baked-in lettering/logos and expanded its portrait composition to landscape. The hooded figure, red-orange goggles, pebbled glass and clear rectangle are retained. The final image is 1672×941, stored as assets/hero-glass-v2.png. This is an edited background, not an unmodified original photo.

## Observed Almira values

Desktop 1440×900: top region 1440×700px; hero photo 862×700px; carousel x862,width578px,height700px. Cards578×700, position:absolute, overflow:hidden. Images cover the card, transform-origin:bottom, scale1.2, parallax0–30%. Big titles Archivo500,40px/40px,10px padding. Mobile390×844: cards390×844px, position:static; title Archivo500,16px/16px,5px padding.

Source movement: wheel delta multiplier.5, target/current interpolation.06 per frame, stop tolerance.01px, signed modulo wrapping. Source site responds to wheel; it does not autoplay. The requested autoplay is added explicitly at18px/second (one244px desktop card takes about13.6s).

## Explicit adaptations requested by the user

The new rail is on the LEFT and narrower than Almira:244px wide with20px edge offsets on desktop,92px with12px offsets below767px. Cards are square and have white/off-white fields; product photos use contain to retain their silhouettes. Three repeated sets avoid gaps on tall screens; duplicates are excluded from keyboard tab order. The original .5/.06/modulo/30%/1.2 motion is retained.

Other cards receive the glass overlay on hover or keyboard focus; the active card stays crisp. Glass uses8px backdrop blur, a noise texture and an SVG displacement filter; the photographic hero contains the stronger pebbled texture from the supplied art. Pointer hover takes precedence over keyboard focus so only one card remains crisp.

The intro remains, including its exact count and transition timings, skip, Escape and reduced-motion support. All intro frames now use the new photograph. Replay, bottom-left copy, old bottom-right look/remix card and its handler have been removed.

Main typeface and CTA remain original AvenirNext assets: title60px/900 or45px on mobile,1px tracking; subtitle12px/16.32px tracking or9px/12.29px. CTA242×50px on desktop,16px/600/20px,padding14px30px,blur5px and original four corner strokes. The mobile button fills the available copy column.

## Photo and logo geometry

The clear opening is recorded in intrinsic image pixels at x750..1300,y250..440. The photo uses object-fit:cover, object-position61.4%50%. A ResizeObserver applies the same cover scale and crop offsets to the logo anchor. This projects the actual photo window into the viewport rather than positioning the logo independently by eye. The original title/subtitle sit inside the clear rectangle, with body/CTA beneath it.

Hero fills100svh with minimum700px; the old72px header allowance is removed because the header was removed in the standalone extraction.

## Verification

- JavaScript syntax check passed.
- Browser1440×900 and390×844: background and all product images loaded; no horizontal overflow; one hero section; zero old replay/note/look-card nodes.
- Full initial animation reaches hero; skip works; no browser console errors.
- Offset changes during idle autoplay; pause switches aria-pressed and stops further autoplay. Wheel and keyboard remain scoped to the rail.
- Focus on a product applies glass opacity1/filter to the other cards and leaves the focused card unfiltered. Source-backed hover selectors use the same rules.
- At390×844 the logo and CTA fit beside the rail; title45px and rail92px. At1440×900 title60px and rail244px. The title is positioned within the photograph's clear opening.
