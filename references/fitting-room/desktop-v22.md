# Desktop-only fixed outfit — 2026-11-02

User scope: automatic route, one woman with proportions guided by photo 1, only the black Pearl Cropped Jacket + P018 Textured Pearl outfit from photo 3. No new mobile/tablet layout.

## Source inspection

Live FITLOOP inspected before changes at 1440×900. Bécane THE DOMINA inspected through DOM, Next data and the original model shader:
https://www.becaneparis.com/looks/heroines-drop/the-domina
Original app source: https://www.becaneparis.com/_next/static/chunks/pages/_app-836585c985db192a.js
THE DOMINA main video declared by source: https://cdn.shopify.com/videos/c/o/v/08a5e771f579475d895c1e7c08d5153b.mp4

The model class creates a looped, muted, inline video, uses it as a WebGL texture, keys green to transparency, and derives angle display from currentTime/duration. It is filmed imagery, not a 3D model. Its shader adds simplex horizontal distortion, UV jitter and grain. Original source/snippet is preserved in becane-model-original.js/.frag as reference data.

Source effect: uTime += .01 per update; burst when mod(uTime,2)>1.95; jitter amplitude1/256; UV noise grid102×102 and y32; xIntensity .01/uv.x or .1 during burst; yIntensity100.5; grain amplitude.1; grad(uv.x-.05)*.8 mixes distorted/clean samples. New implementation preserves these formulas around the interpolated transparent model. Burst period .5 with threshold.46 makes it4× more frequent: about833ms period/67ms burst at the source's60Hz timing. Time now uses elapsed time so frequency is stable across refresh rates. Reduced motion disables rotation and all shader effects.

## Preserved geometry, computed in browser at1440×900

| Element | Before | After |
|---|---|---|
| Stage | x0,y90,1440×682 | same |
| Model frame | x464.25,y90,511.5×682 | same |
| Look header | x1159.296875,y30,240.703125×40 | same |
| Look header type | AvenirNext600,12px/13.2px,padding2px8px | same |
| Rail | x0,y772,1440×128 | same |
| Garment thumbnail cells |24×24|same; both x60 with open panel|

Reference typography and the existing hero/second-section layouts are retained. Open panel bottom752 remains20px above rail top772. Both alpha-tight garment SVGs now use xMidYMid meet instead of xMinYMid meet, centering the pants under the jacket in identical24px cells. No image was manually shifted or approximated from a screenshot.

## Model assets and limitations

Built-in Image Generation produced new photographic atlases using the two user photos as identity/body and wardrobe references. The selected original1536×1024 transparent PNGs were copied unchanged to dist/assets/fitting-room/model-pearl-v22-s0.png and s1.png. Native per-view resolution is384×512. No claim of additional real detail from upscaling: WebGL output768×1024 reduces display sampling artifacts but does not manufacture photographic detail.

Observed orientations were selected and stabilized by silhouette/height/center. Opposite-side views use a runtime horizontal reflection of matching right-side samples for consistent body/outfit geometry; this is an approximation, not a filmed360° reconstruction.18 ordered views include the wrap to front. Original generated nominal angles were not blindly trusted. Pose and texture differences can still remain: a real full-turn video of this woman in this outfit is needed to match Bécane's underlying footage exactly.

Optical-flow fields are96×128 (previous48×64), estimated from aligned256×342 images; contours342rows (previous256). Analysis writes only numeric fields; original generated PNGs remain unmodified. Exact-neutral quantization prevents half-byte flow drift. The renderer uses premultiplied alpha, original texture details, no CSS blur, and source-inspired grain/distortion. Frame delta is capped40ms to prevent jumps after tab suspension. Full turn15s.

## Behavior verification

- WebGL ready,18 views,768×1024 canvas, only one outfit, no Add/Refresh/Replace options; only the two matching garment gallery buttons.
- Existing save values cannot restore other pants; dedicated fixed-outfit save key.
- Both garment artwork centers match in24px cells.
- BACK reverses the controls/model entrance, then reverses the white zoom and split artwork into the second section's final CTA.
- Wheel-up outside the panel successfully returns #next→#how; Home then returns #how→#hero. Scroll inside a gallery panel stays in that panel. Horizontal strip scrolling remains local.
- Returning from direct #next correctly initializes the reverse zoom geometry; reentry preserves one model and one outfit.
- Browser warning/error log empty during QA; all three changed scripts pass Node syntax checks.

A viewport capability request for1280×900 was ignored by the available browser (innerWidth remained1440); only1440×900 is recorded as visually verified. No mobile/tablet verification claimed.
