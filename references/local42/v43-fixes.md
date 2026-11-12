# V43 desktop corrections — 2026-11-04

The user's six screenshots identify clipped action corners, a low saved-collection link, invisible desktop garment actions, a changing selector width, and a saved-card delete button needing 2px extra right-side clearance.

Inspected the existing source and computed styles before editing. Existing AvenirNext assets, 16px action SVGs and paths, 1px panel corner strokes, 2px garment corner strokes, 128 × 50px desktop badge geometry, 14px/18px semibold garment labels, and approved panel coordinates remain unchanged.

## Corrections

- The scroll viewport begins 8px earlier and has 8px top padding. Panel header stays at y100, its icon corners at y96, and viewport clipping starts at y92. The original y100 clipping boundary cut the upper corner strokes.
- Saved-collection link starts at the viewport bottom instead of 12px below it. At 1280 × 720, Save remains y653–703; link top moves from y732 to y720. Initial scrollTop0 hides the link; the first small scroll reveals it. At scrollTop21.5, link top698.5 and Save bottom681.5 retain a17px gap.
- Desktop action targets cover their complete left/right half-card and have opacity1. Previously the V37 parent opacity0 persisted despite the badge hover style. Only the hovered or keyboard-focused half shows its corresponding badge at the shared card center. Mobile click-toggle rules remain in place.
- Selector width is fixed at262px, preserving its right40px inset. Measured original three-thumbnail source width was261.9921875px, rounded to the nearest CSS pixel. Removed the name/count-derived resizing calculation.
- Saved-card delete button shifts2px left; its right clearance changes from12px to14px. Icon geometry is unchanged.

## Browser validation

At1280 ×720, measured262px selector width with both three and two models. At1440 ×900 the selector remains262px. Badge inspection after Replace: parent opacity1; badge centered on the160 ×104px card; final128 ×50px badge dimensions. Panel header remains y100 and Save y653–703. Saved-card delete transform is translateX(-2px), with14px clearance. GO TO opens #saved. No warning/error console entries during the checks.
