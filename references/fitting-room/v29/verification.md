# V29 — fitting room corrections

Project: appgprj_6ae480be373c8191a2538e77a4aa79d1
Published baseline: v28.
Working checkout: /Users/neksx/Documents/ChatGPT/Others/fitloop-intro-hero

Changes:
- Remove fitting-room decorative vertical axes and the full-height borders on the opaque panel backdrop. Preserve panel geometry, white background and rail clipping.
- Position close/delete buttons relative to their own 20 × 20px boxes. Hover/focus corner frames now measure 28 × 28px rather than using the panel as their containing block.
- Remove Undo's inserted corner span and its disabled-state corner pseudo-elements.
- Select white navigation styling from zoom progress, starting at the existing white-wash onset (.55), rather than waiting for body data-screen=2. Prepare this state before directly revealing #next.
- Reverse the model/question crossfade, hold the centered question for 650ms, fade it out, then perform the existing return to the second screen.
- Bust changed JS/CSS cache URLs on main/manual pages. Black-section layout remains unchanged; redesign is a separate image proposal.

Browser checks at 1440 × 820:
- Added a second model through the UI; count became 02 / 02.
- Opened selected model and deleted it; count became 01 / 01, status "Look 02 deleted", Delete hid and focus moved to Close.
- Computed close/delete position=relative; targets 20 × 20 and corner spans 28 × 28.
- Panel backdrop border-left/right both 0px; fitting-grid count=0.
- Refreshed with P005 Coated Gradient; Undo enabled with no corner children or before/after content.
- During forward zoom (body data-screen still 1, exitPhase=zooming), menu already had transparent background, rgb(230,232,234) border and rgb(102,102,102) icon.
- During reverse transition, #next remained active with fitting-leaving; question display=block and opacity=1. Captured reverse-question.jpg.
- Browser warning/error log empty at checked point.
- node --check passed for fitting.js and sections.js.

Initial publication was paused because automatic approval review required explicit authorization. The user subsequently approved all prepared corrections for publication to the existing public Site.

Design proposal:
section-design-proposal.png, generated using the built-in imagegen tool with screenshots 6–8 as references. Preview only; not used as a raster replacement for webpage content.

Additional request: name underline now measures the native rendered name plus 4px, capped at the existing 88px maximum. It updates on typing, model selection, restored data and font readiness. Counter and thumbnail alignment are retained.
Browser verification for name underline at 1440 × 820: My text measured 14.3359375px and input measured 19px; long name capped at 88px. Enter/blur retained My and 19px width. Screenshot: name-underline.jpg. Syntax and whitespace checks passed.

Follow-up verification: published Site still v28 before release. Delete button's focus-visible frame is 28 × 28px and exactly -4px/-4px relative to its 20 × 20px target. Screenshot trash-corners.jpg. Undo pointer hover=true with no corner nodes and before/after display:none; screenshot undo-no-corners.jpg. Added an explicit plain Undo decoration rule and bumped stylesheet cache to v31. User explicitly approved publication of all prepared corrections; black-section redesign remains a separate proposal.
