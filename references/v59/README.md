# FITLOOP V59 — interaction and UX audit, 2026-11-05

## Changes

- White card REPLACE cycles within the same category and gender, in place. It swaps catalog slots so every garment remains available without duplicates or changing the outfit. Dark REFRESH applies the displayed garment. Repeated copies synchronize; controls retain focus during image changes; rapid clicks are guarded during the 260ms crossfade.
- Normal sidebar rows offer VIEW only. Cross-gender rows offer independent KEEP / REPLACE. Replacement filters remain strict to the selected model gender and item category, including all three women's tops/bottoms.
- Cropped sidebar SVGs now use measured garment bounds rather than a complete 160×104 rail frame. Rail artwork remains at the V58 normalized scale. Bounds derive from references/v58/thumbnail-measurements.json; no new reference brand icon approximations.
- Both half-width card actions remain available in split mode. Removing the full-width REFRESH override restores the shared center anchor of each badge and prevents overflow into the following card.
- Panel visibility now switches after 440ms rather than inheriting an additional 850ms delay. Rail/model moves take 620ms, followed by a 300ms divider reveal; the reverse move also takes 620ms. The model remains visible throughout.
- Persistent “Home page. BACK” in the split selector, without a countdown. Explicit navigation retains section cleanup.
- Pink selection (#f4ccd9) and gentle rose fit warnings (#ac5b70). KEEP/REPLACE are black; mismatch names gray, explanatory text black/600, 3px line gap, 38px row. A ResizeObserver adjusts filter position to actual item height, retaining the existing 14px gap.
- Faster frame-independent cursor response: square 75→60ms, Saved/split 50→42ms.
- Saved deletion status moves from 40px to 10px above the viewport bottom, below card corner boundaries. The grid reserves 44px at its end.
- Male head restoration excludes the source jacket collar (female blending remains unchanged): horizontal neck taper and vertical fade .135→.165 replace the full-width .145→.175 blend that produced a ghost behind the Anorak neckline. Existing face asset retained.

## Validation

43 automated tests pass, including all 72 gender/top/bottom asset graphs, independent garment selection, latest-request wins, gender changes during loading, failure/retry, scoped mismatch acknowledgements, saving during model switching, rail transition landing positions, native scrolling, fitting exit, saved-page background and export-dismiss logic. Five new regressions cover inventory-preserving card cycling, no apply/navigation from white REPLACE, VIEW-only regular rows, profile restoration after mobile replacement, and split cleanup before Home exit. The mobile audit found and corrected stale replacement content after selection.

Browser evidence and viewport observations are recorded after the final audit below.

### Browser UX audit

- 1280×720: white REPLACE changed the garment in the clicked slot; model portrait key and split state remained unchanged. The next REFRESH applied the displayed item. The cross-gender advisory was attached to clicked copy 12, not a neighboring/repeated card.
- Sidebar: regular rows show only VIEW; mismatch rows measure 38px, names rgb(138,138,138), hint rgb(23,24,22)/600, action labels rgb(23,24,22). Filter-to-rows gap remained 14px. New SVG row crops show actual garment bounds.
- Split tops: exactly 6/7/8 (women), both actions 80px each. Card cycling retained all three items and did not change the portrait; REFRESH applied the newly displayed item. Confirm returned all 48 card copies to their native interactive state.
- 1440×900: KEEP survived switching between two models. Bottom replacement contained exactly 9/10/11, Escape restored the profile and removed all card inert attributes. Home completed at #hero/screen0, with split class cleared, the Home control hidden and all rail inert attributes removed. No console errors were reported.
- Gallery: VIEW opens the correct product with its native photo controls; no ASOS note. Normal fit warning measured 120.1875×24px with rose rgb(172,91,112).
- Save: returns to fitting room, preserves #next, re-enables Save, renders one selected model. Saved VIEW returns the correct person and garment set.
- Saved deletion: text starts y696 with card ending y690 at 720px viewport; UNDO restores the look. Copy reports “Image copied.”; Download reports “Image download started.” No download-completion event was awaited. OS Downloads directory is unreadable in this environment, so file delivery was verified by the browser success state rather than opening a downloaded file.
- 390×844: no horizontal page overflow; gallery opens the correct product; touch card actions stay open after white REPLACE so REFRESH remains immediately usable. Cross-gender row remains 38px. Male replacement lists exactly 0/4/5. After selection, all five measurement controls, normal profile title and Save return correctly (new regression fixed during audit).

Limit: browser checks cover the flows above in the available Chromium environment, not an exhaustive guarantee across every browser, GPU or operating system. The 72-state automated asset graph validates availability/dependencies, not every visual combination.
