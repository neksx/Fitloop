# FITLOOP V57 — 2026-11-05

Integrated the approved v57 SVG previews into the real site. Reversible Fur Denim remains absent from the catalog.

## Source measurements

Reference: https://purple-brand.com/collections/new-arrivals
Inspected the actual DOM and computed SVG styles, at 1440px. Full captured SVG geometry, dimensions and computed strokes are in purple-icons.json.
- Account: 24×24 viewBox, rendered25×25, 1px stroke, square body caps.
- Search: original filled path, approximately1px contour.
- Close: original18×17 filled path, used verbatim.
- Existing FITLOOP action paths retain their meaning and geometry, using1px non-scaling strokes; menu bars reduced to1px. Branding and clothing image SVGs are excluded.

Native FITLOOP type and frames:
- AvenirNext Demibold,10px/13.2px.
- Fit frame24px high,10px horizontal padding,6px corners/1px border.
- Actual browser base width119.914px and hover width132.0547px (for154–194CM ·39–57KG).
- Hover corner translation±5px/.2s; label fade.18s and translation.28s.
- Advisory12px/18px (previous20px line-height).
- Confirm36×36 frame with16px check path from the existing export control.
- Tie Dye visible thumbnail height matches96% of the Anorak's actual visible1199px source bounds, preserving a centered baseline. Normal rail104px, split rail114.4px.

## Behavior

- Top and bottom are independent. Every selectable gender/top/bottom combination has a corresponding portrait.
- Garments apply regardless of catalog gender; selection then reveals a non-blocking advisory.
- KEEP is stored by stable model ID, product and gender, and retained through reload, model switching and saved looks.
- Latest asynchronous selection wins. Selecting a second category while the first is loading combines both choices. Late work cannot replace another model's panel.
- Saving captures the intended model and profile before awaiting assets.
- Desktop replacement keeps the24 existing card nodes and current rail phase. Profile closes, unrelated controls fade500ms, model moves to75% and rail to the left center900ms, then the50% divider descends1500ms.
- Confirmation is confined to the right half, follows with the same50ms response as Saved Looks, and samples model alpha for white/dark stroke. Reverse sequence restores the profile.
- Escape and viewport changes recover gracefully; mobile uses the category picker.

## Validation

32 automated tests passed; all JavaScript files parsed.
Browser checks at1280×720,1440×900: applying opposite-gender clothing, KEEP then reload, replacing bottoms without replacing tops, split/reverse, white/dark confirmation, stable model switching, saved-card rendering, non-navigating save animation, icons and range hover.
PNG export:1536×2048, transparency present.
Mobile390×844: checked separately before release.

