# V28 approved design and behavior — 2026-11-02

Approved for implementation and publication by the user after the final profile-row preview. Implemented in v28.

Visual: primary buttons default gray#B3B3B3, hover#999999 (slightly darker than v27). All existing geometry/type is retained except the top-right selector: LOOK10px400, editable name10px600, counter10px400. Open information panel must have opaque white fill through full height, hiding inactive people underneath. Close/trash/icon buttons show four external corner marks on hover/focus.

Remember for implementation:
- Close/trash buttons reportedly do not work. Inspect actual hit targets and event handling. The full-height absolutely positioned .fitting-panel-scroll may cover the header: verify with elementsFromPoint, then fix pointer stacking and test both buttons. Do not merely restyle them.
- REPLACE on a rail card must replace that CARD'S garment with another available wardrobe item; it must not change the person's outfit. Update repeated copies/data consistently as needed.
- REFRESH changes clothing ONLY on the current selected person. Remove the group-wide models.animate opacity pulse in applyPants; preserve every other person's pixels and opacity. No white flashing on the current or other models.
- Preserve existing positioning, wheel behavior, profile persistence and navigation.

The functional changes above cannot be demonstrated in a still image; they are recorded here explicitly for the next approved implementation.

Selector refinement: name matches LOOK at10px, weight600; thumbnails24×24, gap8px, panel right padding8px, vertical padding8px; shortened name underline88px to retain clear spacing. Reference SVG: fitloop-v28-full-preview-revised.svg.

Product sizing preview (still preview-only): keep white gallery, native Avenir, gray corner marks. Add below gallery a current-model profile (gender/height/weight), cropped cut, EU/UK/US tabs and CM/IN toggle, body bust/waist/hips table. Data displayed is illustrative ASOS women coats/jackets, NOT verified measurements for the Purple jacket. Do not label weight or height as optimal fit; need actual manufacturer chart before claiming this. Sources: https://www.asos.com/discover/size-charts/women/coats-jackets/ and https://www.zalando-lounge.co.uk/sizehelper/women/measure/ . ASOS EU34/36/38/40/42/44 corresponds UK6/8/10/12/14/16, US2/4/6/8/10/12. Bust80.5/83/88/93/98/103, waist62.5/65/70/75/80/85, hips86/88.5/93.5/98.5/103.5/108.5 cm.

Fit profile refinement: four equal columns in the same row, GENDER/WOMAN, HEIGHT/172 CM, WEIGHT/62 KG, CUT/CROPPED. Column positions20,124,228,332; label baseline590, value611. Remove the separate CUT row. Preview source fitloop-product-sizing-preview-revised.svg.

## Implementation and desktop QA

Original v27 computed styles at1440×660: panel x60/y100/406.664×560; mode x52/y169.195/422.664×40; save x56/y590/414.664×50,16px600/20px with14px30px padding; plus40×40,16px600/20px,8px padding; close20×20 with native16×16 SVG; native AvenirNext regular/demi/heavy files retained.

The close icon was covered by .fitting-panel-scroll, confirmed with elementsFromPoint. Scroll wrapper no longer receives pointer events in look/create; actual content/filters/rows remain interactive, header sits above it. Panel white fill and side axes extend to viewport top/bottom. Undo is above this background. No layout changes to the model, mode, wheels, clothing footer or earlier sections.

Look selector260×40, x1140/y30; regular10px LOOK, demi10px name, counter10px. Two24px thumbnails at x1335 and1367 (8px gap,8px inner right padding plus1px border); vertical inset8px.

Added product gallery FIT & SIZING below existing photos/thumbnails. Four equal columns GENDER / HEIGHT / WEIGHT / CUT. Native10px regular labels and12px600 values. EU/UK/US tabs and CM/IN buttons render actual conversions. Chart is explicitly an illustrative ASOS women's body reference, not brand-specific garment measurements or an optimal weight/height recommendation. Bottoms show waist/hips; jacket shows bust/waist/hips.

Browser checks: header close hit target is now the close button; close via X, current person and white stage background all work; Add has no clothing tabs/rows; created a second woman, saved height172→173; REPLACE changed all repeated copies of its rail slot from gradient to flare without changing either person's clothing/opacity; REFRESH changed only selected woman's pants1→0 and kept inactive woman at pearl/opacity.38 and selected opacity1; Undo restored1; EU38/UK10/US6 and CM88/70/93.5→IN34.6/27.6/36.8; all four profile values share the same y baseline; Delete removed the test woman and hid trash for the last model; no browser errors.
