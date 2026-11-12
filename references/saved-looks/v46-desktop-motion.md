# V46 — staged desktop model transition and export colors

Desktop only, using the existing min-width768px boundary. No mobile layout or adaptive values were added. Existing mobile/reduced-motion navigation keeps its previous handoff.

## Model transition

View Look now remembers the actual selected saved card. Its existing canvas is copied into one temporary fixed canvas at its measured object-fit content rectangle. The selected real portrait is hidden, and the rest of the collection fades away over320ms. The single portrait then moves/scales to the selected fitting-room canvas's measured content rectangle over900ms. At the identical destination rectangle it swaps to the real model. Only afterward do the selector and garment rail expand from the model, using the original first-entry650ms timing,80ms rail delay,0.12 scale and cubic-bezier(.76,0,.24,1) from fitting.js. Other fitting controls/neighboring models fade in after the portrait arrives.

BACK beside the existing ten-second timer requests the exact reverse: controls collapse toward the model, one portrait returns to its original saved-card position, then the collection reappears. Saved scroll position and selected savedId are retained; no duplicate model is added. Escape/resize cancel the temporary animation while completing the requested navigation and restoring all temporarily hidden controls.

Canvas rectangles account for the existing object-fit contain padding. Fonts, SVG paths, content coordinates and approved component sizes are unchanged. The logo and menu stay in the native navbar.

## Export color correction

Root cause: styles.css applies opacity0.4 to every disabled button. The desktop selected export button now explicitly retains opacity1 and#171816 text/check color while disabled. Its corner ink remains#b2b2b2. Only the unselected .is-muted button fades to0.28. The approved checkmark and hover corner motion are preserved.

## Validation at1280 ×720

- Forward flight observed with exactly one temporary canvas; selected real model and selector hidden during the flight.
- Completion: screen2, zero temporary canvases, selected model visible, BACK displayed after controls finish.
- BACK observed in collapse phase, then returned to screen3 without warnings/errors.
- A second saved look opened correctly; Escape during flight removed the temporary canvas and restored the selected Look02. BACK remained functional afterward.
- Actual Copy completed. Computed selected opacity1; text/check rgb(23,24,22); corner rgb(178,178,178); only the other control had .is-muted.
- Existing8 section-navigation tests and changed JavaScript syntax checks pass.
