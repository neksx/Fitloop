# V38 — completed transition corrections

User scope: slower panel lines, smoother model selection, removal of the blank fourth section, and second-section scrolling that never requires a click. Desktop geometry, fonts and approved content are preserved.

Changes: line reveal1.5s, cubic-bezier(.45,0,.15,1), still delayed650ms until the panel opens. Selection uses the exact critically damped position/velocity solution (omega9), preserving velocity on reselection. Opacity follows a smoothstep and new thumbnails fade in; retained thumbnails move over650ms. During model travel the texture jitter is suspended. Depth values remain below panel/navbar controls.

Navigation now contains hero/how/next/saved. The blank fourth section is removed from both HTML entry points and retired horizontal-transition CSS/JS is removed. Legacy#fourth links resolve to#next. Saved looks uses data-screen3. The fitting room is the terminal presentation section; forward wheel/keys never open an empty page.

Root cause of the reported second-section stall: the wheel-tail guard intended for the fitting room also applied to how. It now applies only to the fitting room. Wheel/touch input during how's opening is queued (bounded to0.8 viewport) and scheduled after opening; no idle gap or click is required. A finally block always restores access/focus after handoffs.

Validation:8 Node regression tests passed, covering continuous forward/reverse wheel streams, queued touch movement, fitting-room inertia, no forward blank page, native local controls, saved scrolling and both entry-page structures. JavaScript syntax and whitespace checks passed.

Browser at1280×800: seven continuous scroll operations from the hero reached#how, phase1, scroll691.8 without clicking. End and PageDown reached#next/fitting-arrived. Forward PageDown kept#next. A reverse wheel gesture restored#how/finale; another forward gesture returned#next. Four models created through UI retained exactly three thumbnails; repeated selections1,2,3 completed without errors. Panel lines initially scaleY0 and have0.65s delay/1.5s duration. Saved collection opened at#saved/data-screen3, showed saved cards and its nav label. View Look returned to#next. At390×844, no horizontal overflow; Save remains x36..354,y778..828 and the name uses original Avenir Next60010px/13.2px.

Screenshots in this directory are direct captures of the completed implementation.
