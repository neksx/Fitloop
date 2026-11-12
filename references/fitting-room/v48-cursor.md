# V48 — subtle desktop cursor inertia

Reference: [GSAP official mouse follower example](https://gsap.com/docs/v3/GSAP/gsap.quickTo%28%29/). The reference follows pointer targets smoothly and snaps on first entry. Implemented the same motion pattern with native requestAnimationFrame, without adding a library.

Preserved V47 computed appearance: 12 × 12 CSS px, white fill with difference blending, 6px centered offset, no border or radius. Desktop fine pointer only. No other components changed.

Motion: exponential smoothing with a 75ms time constant, adjusted for frame duration. Stops at <0.05px and snaps to the target. First entry and pointerdown snap immediately; reduced motion tracks directly. Leave, blur, hidden document and media changes cancel the animation.
