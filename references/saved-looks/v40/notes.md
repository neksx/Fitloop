# V40 — Saved Looks hover and touch transitions

Desktop hover restored only at the existing >=768px breakpoint on fine pointers with hover. Touch/mobile retains always-visible outer frames. Buttons retain all layout/font rules.

## Browser measurements

Production V39 and local V40, 1280 x 720: first card x40 y110, 384 x580; View Look x147 y375, 170 x50, padding14px30px. Local font AvenirNext, 14px, weight600, line-height20px (unchanged stylesheet rules).

Desktop rest: outer corner opacity0, button corner opacity0. Card hover: outer1, button visible1, button corner0. Button hover: corner1, top-left transform(-5px,-5px), matching the existing 5px CTA extension.

Mobile375x812: card x16 y96,343x672; button x102.5 y694,170x50; same font/padding. Outer frame opacity1 at rest and button corner0. On click, is-opening/aria-busy are set while URL remains #saved. Corner transitions run 380ms before navigation. The saved->fitting crossfade runs700ms; sampled saved opacity0.798624, fitting opacity0.201376. Final page #next, fitting controls accessible, no console errors.

Corner opacity280ms, movement380ms cubic-bezier(.22,1,.36,1); reduced-motion skips the wait and crossfade. Other section transitions unchanged. Eight existing navigation tests and JS syntax checks pass.

Screenshot desktop-hover.png shows actual local browser hover.
