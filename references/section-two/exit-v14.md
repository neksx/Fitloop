# White-corner exit — 30 October 2026

Latest instruction replaces the earlier shrink-to-center idea: close the artwork halves on screen two, zoom into the white right corner, then show a new #FFFFFF screen. Keep the existing navbar on that white screen. Hero hover labels are translated to “Create a combination”.

The approved Offform split function plays backwards over1450ms. After closure, frame transform-origin is100% 0% (upper-right) and a1100ms smoothstep zoom moves from1× to64×. A matching upward translation removes the existing90px desktop header gap so the white photo corner covers the whole viewport. The new white screen then crossfades with the existing650ms section transition. Reverse scroll uses the exact inverse zoom and opens the photo again, restoring the final CTA. The transition is triggered only by a further forward input after the finale, preserving the clickable CTA. Reduced motion skips the timed sequence.

The navbar is the same shared component and SVG paths, at the original dimensions/positions. Its ink inverts during the zoom for white-background contrast; open-menu ink stays white. New screen content is intentionally empty, apart from a screen-reader heading; no new product copy was supplied.

Read-only image sampling verified that the actual projected corner is white: mean RGB254.1/254.1/254.3 at1280×720, and253.7/253.7/253.8 at390×844. The destination itself is literal#FFFFFF. This uses the existing image file without editing it.

Verification: desktop1280×720 closing phase observed with both halves moving toward0. Destination has one active screen, literal rgb(255,255,255), frame zoom matrix(64,0,0,64,0,-90), and original navbar bounds (40,30)–(1240,70). Menu opens/closes on the white screen. Mobile390×844 reverse restores final CTA opacity1, frame scale1, source split±180px, navbar invert0 and document height844. Hover on the hero shows the English badge with lang=en at the approved88px mobile width; all24 labels translated. JavaScript syntax passes.
