# Static model, face and hair update — 2026-11-02

Final user scope replaces the earlier rotation plan. Every person stays front-facing for every outfit. Automatic rotation, pointer drag, keyboard rotation and angle thumbnails are removed. The four-piece hero rail, REFRESH/white REPLACE actions, three supported trouser options, gallery, saved profiles and reverse section navigation remain. The three former angle previews now select STATIC / JITTER / JITTER + SWAY.

## Motion

JITTER + SWAY keeps slight sway at half the earlier strength. Source: dist/glass.css glass-afterglow,9s ease-in-out loop with keyframes0/25/53/76/100%. Model translation/tilt stops are exactly50% of the approved hero values: (-3px,1.5px,-.175deg), (2px,-2px,.15deg), (-1px,1px,-.1deg). Scale stays1 to avoid clipping head or shoes. Tiny periodic WebGL jitter occurs for320ms every4.8s, using one source portrait only; no photo blending, geometric turntable warping, changing pose or frame switching. JITTER omits sway; STATIC disables both. Reduced motion disables sway and jitter; inactive sections/menu pause sway. The chosen mode persists on this browser.

## Face and hair

Built-in Image Generation used the user's latest photo as face/long loose hair reference and the approved black outfit as the body/clothing/pose reference.100% identity equivalence is not guaranteed by generation. A new1024×1536 front-facing portrait was made, then edited for the two jeans. Original generated PNGs copied unchanged; numeric alpha bounds alone set portrait placement. New native per-person image resolution is1024×1536 rather than384×512 atlas cells.

Assets:
- /Users/neksx/Documents/ChatGPT/AI/sites/fitloop-intro-hero/dist/assets/fitting-room/static-pearl-v24.png
- /Users/neksx/Documents/ChatGPT/AI/sites/fitloop-intro-hero/dist/assets/fitting-room/static-gradient-v24.png
- /Users/neksx/Documents/ChatGPT/AI/sites/fitloop-intro-hero/dist/assets/fitting-room/static-flare-v24.png

The static loader initially requests only the original three portraits, then lazily loads additional woman/man portraits when needed. No turntable sheets or optical-flow fields. Static renderer preserves premultiplied alpha, crisp source details, full head/shoes, and a no-WebGL photo fallback. Six additional native assets and their exact prompts are recorded in factory-v24-prompts.md and factory-v24-assets.json.

## Prompt set

### Main portrait

Use case: identity-preserve / compositing. Asset: ONE single full-length transparent photographic fashion model for a desktop website, not a sprite atlas. Image1 is the exact FACE AND HAIR reference of the adult woman requested by the user: reproduce her face identity as faithfully as possible, the same face proportions, almond brown eyes, eyebrows, nose, lips, warm skin tone, and long very dark brown loose hair with soft natural waves, center/slight side part, hair reaching below her chest. Preserve her natural expression. Image2 is the CLOTHING, BODY AND STANDING POSE reference: use the front-facing woman in the TOP LEFT CELL ONLY; same natural softly curvy body, same straight neutral full length standing pose, arms down at sides, hands visible, same black pearl embellished collared cropped zip jacket, matching high rise black wide leg pearl textured jeans and black low shoes. Replace the old woman's face and bun with image1's exact face and long loose hair. Long hair must fall naturally on both sides down over the front of the jacket, NOT in a bun. The jacket remains zipped, fully clothed adult fashion catalogue. Output ONE woman facing camera straight front, whole head and all shoes visible, same fixed scale, centered pelvis, comfortably within frame. Tall portrait1024x1536 or higher resolution, extremely sharp face and hair strand detail, natural skin, crisp jacket/denim/pearl detail, soft even luxury ecommerce studio light. Genuinely TRANSPARENT background, no shadow, no floor, no gradient/halo, no grids, labels, watermarks, other women or objects. Only one complete isolated woman, not a sheet.

### Coated Gradient

Use case: precise-object-edit / identity-preserve. EDIT target image1. Replace ONLY the black pants with P005 Coated Gradient jeans: ordinary smooth blue denim, washed pale blue hips/thighs with a darker indigo coated-gradient lower leg, five pockets, wide straight legs, completely plain denim without pearls, beads, studs or decorative dots, matching product image2. Everything ABOVE THE WAIST must remain pixel-faithful: the exact same woman's face, long loose hair, skin, facial expression, black cropped pearl zip jacket, hair strands over jacket, hands/arms and pose. Keep exact same full-body front-facing pose, body proportions, head level, pelvis location, shoes, baseline, camera, scale, framing and soft studio lighting. This is the same woman wearing different jeans, not a new woman. Jacket pearls unchanged, but replacement jeans are the actual product from image2 with flat denim texture. ONE whole adult woman, entire head and shoes, same portrait1024x1536, genuinely transparent PNG with no background, halo, shadow, grids, text or floor. Highest sharp photographic detail. Do not alter face or hair in any way.

### Upside Down Flare

Use case: precise-object-edit / identity-preserve. EDIT target image1. Replace ONLY the black pants with P004 Upside Down Flare jeans: contrasting light and dark blue washed vertical patchwork panels, upside-down waistband details at the wide/flared lower hems, matching exact garment reference. No pearls/beads on the blue jeans, matching product image2. Everything ABOVE THE WAIST must remain pixel-faithful: the exact same woman's face, long loose hair, skin, facial expression, black cropped pearl zip jacket, hair strands over jacket, hands/arms and pose. Keep exact same full-body front-facing pose, body proportions, head level, pelvis location, shoes, baseline, camera, scale, framing and soft studio lighting. This is the same woman wearing different jeans, not a new woman. Jacket pearls unchanged, but replacement jeans are the actual product from image2 with flat denim texture. ONE whole adult woman, entire head and shoes, same portrait1024x1536, genuinely transparent PNG with no background, halo, shadow, grids, text or floor. Highest sharp photographic detail. Do not alter face or hair in any way.

## Verification

Desktop1440×900 preview: new face and long loose hair visible; frame0, rotation0, one front-facing photo, WebGL ready; no angle controls. All three motion modes work and persist. The add/view panels share the existing left PageInfo composition. Actual UI selection created Man/180cm/75kg/L/32 with the same trousers; APPLY CHANGES edited weight to76kg and retained all values through motion-picker changes. Browser warning/error log empty. Source filenames and numeric placement measurements are in static-v24-assets.json and factory-v24-assets.json.

## Combined model settings and clothing actions

The plus now opens the same left panel used by the selected model. Five scroll-snap wheels edit Gender (Woman/Man), Height140–210cm, Weight40–140kg, Jacket XS–XXL, and Pant24–48 in steps of2. Scroll and arrow keys stay within the panel rather than navigating between sections. The motion picker retains its text-left/three-thumbnails-right interaction. CREATE MODEL adds a person with the current outfit. Normal information uses plain read-only values, wardrobe tabs/items and SAVE MY LOOK; scroll wheels are exclusive to creating a person. A20px trash button sits12px left of the20px Close icon, only when at least two models exist. Deleting removes only that saved local model and its clothing-history entries.

The create panel omits wardrobe tabs and garment rows. The selected model's information panel retains those tabs and galleries.

Profiles persist to browser localStorage. Height/weight/sizes are stored settings; these prepared portraits do not calculate body shape or garment fit. Additional woman/man portraits are two identity presets, not unique generated identities on every click. The preceding model slides left by.28 of stage width, scales to.74, opacity.38, saturation.5 and brightness1.12 after the transition settles.

REPLACE directly changes between the three supported trousers. Refresh also updates trousers. Every actual change records the person's ID and previous trousers; Undo restores that person's earlier outfit. The rail repeats all four hero products, pauses on hover, and uses104px-high/160px-wide cards with40px between stage bottom and rail top. All text is English.

## Observed source styles and final exceptions

At1440×900 the actual hero CTA measures242×50px with14px30px padding, AvenirNext60016px/20px, rgba(255,255,255,.2) fill,1px rgba(255,255,255,.1) border,5px backdrop blur, and12px corner strokes of2px. The plus clones that DOM element and shares its existing .button rules. The user-approved icon footprint remains40×40px, padding8px,20px SVG with1.5px round stroke. White-section shared fill is rgba(0,0,0,.2), hover.3. The final explicit exception shows corner strokes only on hover/keyboard focus, using#b3b3b3 to match the hover fill composited onto white.

Burger x40/width40, Undo x88/width40:8px gap. Undo uses the user's supplied curved-arrow shape. Left panel motion-row background computes transparent, so no white horizontal band covers neighboring faces. Panel-scroll top margin24px; measurement wheels48px high,16px option rows,16px padding, original12px/13.2px AvenirNext labels and selected values. Product-panel flex gap14px lowers the tabs6px relative to the prior20px gap. White REPLACE border is transparent, while its2px corner strokes remain#E6E8EA, removing only thin connecting lines as requested.

Final interaction checks also passed: profile settings survived reload; deleting the newly created test model reduced count4→3 and focused the remaining model; all five wheels fit without panel overflow. A hidden opacity-zero navbar CTA was found intercepting look thumbnails; its pointer events/visibility are now disabled in the white screen while the menu is closed. Selecting Look01 through its actual thumbnail then succeeded.


Final icon refinement (saved after V24): the close SVG uses a20×20 box with viewBox0 0 20 18, rounded2.00585px bars, and computed fill#b2b2b2. The trash now has the same20×20 box/viewBox,2.00585px round strokes, matching#b2b2b2 ink in both normal/hover states, and12px separation (the existing panel header gap). Its visible shape spans the same18px height rather than the previous14px height after24-unit scaling.

V26 restores normal information after clarification: no measurement listboxes appear in normal look mode; all five values are plain text, with the original24px top margin and20px row gaps. SAVE MY LOOK persists without turning this view into an editor. The plus alone opens the create form; mode thumbnails retain their original selection behavior in both views.

Latest user refinement: close and trash SVGs render at16×16 inside their existing20×20 aligned button targets, preserving the same ink and matching scaled stroke. Trash walls are straight for a simpler silhouette. Normal info verified: zero listboxes, five plain values, visible wardrobe tabs and two garment rows; SAVE MY LOOK showed SAVED while keeping info open. Add mode verified separately: five listboxes, zero wardrobe rows, hidden tabs and CREATE MODEL.
