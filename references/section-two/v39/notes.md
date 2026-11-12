# V39 validation

Requested scope: untouched first frame in section two; earlier line start; mobile LOOK label; close details before Save; portrait flight from its actual third-section position; no card button behind the preview logo; permanent saved-card frames and press-only button corners.

Section two entry: #how scroll0.0, MY WARDROBE visible, first service title top813px below a720px viewport. After a scroll gesture it advanced to174.6 without a click. Opening input is discarded rather than queued; the fitting-room inertia guard remains. Eight navigation/touch regression tests passed after updating expected opening behavior.

Mobile at319×675: LOOK display:block, original Avenir Next60010px/13.2px name font retained. Lines now have0s delay and the same1.5s easing/duration. No typography, model placement or approved component dimensions were changed.

Save browser QA: edited an existing saved Look01 and saved unchanged settings. During shrink, panelOpen=false and cloned model visibility=visible. Cloned portrait rect x25.470867,y160.662552,w268.058289,h357.418335; flying canvas rect x25.467218,y160.662552,w268.058258,h357.418335 (less than0.004px horizontal rounding). Both are measured in the same local viewport before scaling. The sequence completed with overlay=false, running=false, panelOpen=false and no console errors.

Created a second local test model and saved it to exercise multi-row playback. In collection phase navbar actions display:none; its white header mask is76px tall with z-index5, above card actions. Save completed normally. On the real saved collection at319×675, outer frame opacity1, button corner opacity0 and transform:none. The button's existing background, size, placement and visibility remain unchanged; only active press reveals its own corners.

JavaScript syntax checks passed for fitting.js, save-flow.js and sections.js; eight Node regression tests and git diff whitespace checks passed. Screenshot artifacts are direct browser captures.
