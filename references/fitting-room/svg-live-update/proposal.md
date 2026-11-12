# Desktop SVG concept — 2026-11-04

Local preview only, requested before site implementation. No dist assets modified.

Source measured at 1440 × 900 on V51. Original AvenirNext regular/demibold/heavy WOFF2 embedded. Original gradient woman/man PNG portraits embedded. Logo and trash paths copied from source.

1. Gallery heading preserves 900 30px/30px, 1px letter spacing. Full `P005 COATED / GRADIENT` in two lines; remove nowrap/ellipsis in gallery only on implementation.
2. Fit profile labels preserve 400 10px/13.2px; move label down 2px while keeping 600 12px/15.6px values fixed (effective label/value gap 8 → 6px). Same 2px label offset illustrated for model controls.
3. Boundary duration 1.8 → 1.5s, keeping .5s delay and cubic-bezier(.4,0,.2,1). `0.3s faster` interpreted as reveal duration, not a change to the previously requested pause.
4. Main model receives current selected parameters immediately, without waiting for Save. Proposed identity transition: 0–140ms light jitter, 140–340ms displaced horizontal strips, 340–650ms incoming identity resolves, 650–900ms settles. Reverse uses the same stages. No RGB fringe, full-scene flash or model relocation. Height/weight and outfit fit changes use a proposed 320ms easing from the current state.

Existing code only writes draft parameters until Save; later implementation needs an immediate preview path, async image request ordering, cancellation during rapid parameter changes, and selected-person isolation. Size changes in the SVG are a motion concept, not a claim of physical fit simulation. Exact jacket/pant size rendering requires size-aware assets or a calibrated deformation step.

Artifacts: /Users/neksx/Documents/ChatGPT/AI/FITLOOP-previews/live-model-svg/fitloop-live-model.svg and fitloop-changes-storyboard.svg. Both are standalone; embedded photos remain raster inside SVG.
