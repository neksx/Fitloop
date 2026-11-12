# V45 — approved saved-look export and fitting-room return

## Source measurements and approved design

Inspected the fitting-panel action group and the existing saved-card components before implementation. At1280 ×720 the fitting-panel controls are20 ×20px with16px SVGs,10px clear box-to-box gap, and hover corner inset−4px (28 ×28px frame). Saved-card Export/Delete now use those same20px targets,16px symbols,10px gap and28px hover frames. Measured gap is10px both before and after opening export. The existing2px left adjustment is applied to the whole saved-card action group, preserving Delete's right axis without reducing the inter-control gap.

Transferred the approved v3 SVG design from the separate saved-look-export preview: AvenirNext60010px /13.2px; equal88.223958px ×24px buttons;12px horizontal padding;6px icon/text gap;16px between buttons;10px Copy/Download icons;12px checkmark;6px gray corner strokes with1px width. Hover/focus/press moves the corner marks5px diagonally without darkening them. The two expanded frames retain6px geometric clearance. The model moves126px left and scales to0.5 over650ms; the centered controls fade in after280ms. Only the chosen control shows a black centered check after successful execution. The other fades to28% opacity. After850ms, controls disappear and the portrait reverses its movement.

## Actual export

Image resolution and identity/outfit come from the selected saved record's existing `static-models-v24.json` set. Copy starts ClipboardItem during the click gesture and resolves the matching PNG asynchronously. Download uses that same PNG and a filename derived from the saved look's name. No success indicator is shown for a rejected clipboard operation or failed image request; controls unlock for retry and an English status explains the failure. Escape, outside clicks, switching cards and section navigation clean up the open state. Export does not modify or delete the saved record.

## Smooth return

Saved-card View now crossfades into the fitting room over900ms on desktop as well as touch layouts. The selected saved model's position and velocity are settled while hidden, preventing an extra horizontal spring movement during the fade. Existing savedId matching reuses the current model. The selected outfit is preloaded; the details panel stays closed. Reduced motion retains an immediate handoff.

## Validation

- Existing8 navigation tests pass; syntax checks run for changed JavaScript.
- Browser1280 ×720: Export/Delete gaps measured10px in both states; controls88.21875 ×24px (layout rounding),16px vertical gap; native Avenir font and gray corner color retained.
- Copy completed with `Image copied.` status and selected check/other-control fade. Portrait and interaction restored afterward.
- Download produced a1024 ×1536 RGBA PNG byte-identical to the selected `static-pearl-v24.png` source.
- View Look02 exposed the900ms transition class/duration; its selected model was centered attranslateX(−50%) scale(1) before the fade. On completion: screen2, no open export, same two models, correct Look02, unlocked navigation.
- At390 ×844: equal button dimensions,10px header gap, native saved-page scrolling and no horizontal overflow.
