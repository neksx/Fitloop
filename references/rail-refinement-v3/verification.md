# Requested refinements — 30 October 2026

## Background

The existing 1672×941 photo is retained. The general background now uses the original intro's20px blur. A second, geometrically identical photo layer is clipped to the recorded goggle rectangle (native pixels x750..1300,y250..440) with brightness.72. This gives the requested soft overall background and a darker, sharp window behind the logo. Both layers share object-fit:cover and object-position61.4%50%; the same ResizeObserver projection positions the clip and the existing logo.

## Wardrobe

- Desktop rail:320px wide (previously244), top0,left0,bottom0; mobile96px, also flush to all three edges.
- Only the four items in attachments3–6 remain: Pearl Cropped Jacket, P018 Textured Pearl, P005 Coated Gradient, P004 Upside Down Flare. All four are PURPLE products, so their badge correctly says Purple. Product/source URLs are in selected-products.json.
- All card fields are pure#fff. The source JPEG corner pixels are also255,255,255. No recoloring or regenerated clothing is used.
- Dividers are1px,#b8bec6, the actual dominant line color (184,190,198) in the user's seventh attached image. Right rail border uses the same value.
- Every original bitmap sits in an SVG viewport centered on its garment bounds; longest garment edge occupies82% of the square. Coordinates are in product-layout.json. This is layout of the unchanged photographs, with no additional image parallax or scale animation.
- Old descriptive captions, glass overlays, SVG distortion filter and hover blur have been removed.
- Hover badge uses the actual original CTA typography (AvenirNext600,16px/20px),50px height, four12px corners with2px white strokes. It expands from50px to242px wide, centered; corners stay inside the dark field so white strokes remain visible over white cards. The only visible text is the real brand. Mobile expanded width74px.

## Motion and checks

Almira's wheel factor.5, interpolation.06 and signed modulo wrapping remain. Idle autoplay is18px/second. Pointerenter immediately assigns target=current and freezes the animation; pointerleave resumes from that same offset. Six repeated sets maintain coverage on tall/narrow screens. Manual pause/play and reduced-motion support remain.

Browser verified1440×900: railleft0,top0,bottom900,width320; background blur20px; cutout brightness.72; only four unique products; zero glass/caption nodes; all card backgrounds rgb(255,255,255), product filters none; no horizontal overflow.

Actual pointer hover was tested through browser native input. Offset remained exactly417.37 across separate observations while hoverPaused=true. The badge reached242×50px, opacity1,16px font and2px corner stroke. After pointer leave hoverPaused=false and offset advanced to417.71, confirming immediate freeze and automatic continuation without a position reset.

JavaScript syntax check passed. The retained intro completed normally. Mobile layout was checked at390×844; no horizontal overflow and a flush96px rail. The small badge keeps the same corner treatment and fits inside the mobile card.
