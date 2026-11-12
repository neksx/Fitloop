# FITLOOP V58 — 2026-11-05

## Requested changes

- Added the six supplied women's products: Logo Bling Jacket, Paint Splatter Jacket, Monogram Jacket, Baggy Embossed Logo, Logo Bling Mini Skirt and Logo Bling Cut Off Short.
- REPLACE now opens the complete category for the selected model's gender. The general wardrobe still permits deliberate cross-gender try-on.
- Every regular item row exposes VIEW and REPLACE; category replacement is available without first triggering a gender advisory.
- TOPS / BOTTOMS replace JACKET / PANT in all profile/creation/replacement labels.
- Removed the ASOS footer and illustrative ASOS chart. The gallery shows the current profile, verified available product sizes where supplied, and the official Purple size-guide link.
- Wheel/touch/vertical-key progression cannot leave the fitting room for the previous presentation screen; explicit navigation remains available.

## Sources and images

Official pages and observed image URLs, actual size options and product details are recorded in catalog-sources.json. User's trailing comma in the Monogram URL was normalized to the working official product URL.
All 23 official gallery photos are stored locally. The two products with model-only source images have separate generated garment cutouts.

Built-in image_gen was used for identity-preserving try-on imagery and cutouts. All final files are in ../../dist/assets/fitting-room/ with v58 suffixes; generation-prompts.json contains the complete prompt set and reference files.
Nine direct female outfit photographs cover all new native women's top/bottom combinations. Individual garments on both supported models and aligned runtime composition cover the remaining mixed wardrobe combinations. The renderer restores the approved original head photograph and keeps the existing live-size/idle-motion behavior.

## Geometry and animation

The existing 160×104 rail frame and 1.1 split scale are preserved.
Tie Dye uses its previously measured visible bounds [196,674,1276,1149]; its visible height is 71.9814px, exactly 8% smaller than V57. New thumbnails preserve aspect ratio and use measured source silhouettes, recorded in thumbnail-measurements.json. Cropped tops, long trousers, skirts and shorts retain distinct natural lengths.

Replacement uses the existing card nodes:
- Profile closing440ms, controls fading280ms concurrently.
- Rail/model movement720ms using cubic-bezier(.4,0,.2,1).
- Divider descent480ms after movement.
- Return: divider, rail, model and delayed controls run concurrently within720ms, followed by the440ms profile opening.

Visible final card positions always match the final resting transform. Periodic-position shortcuts are only used when both endpoints are outside view; this removes the landing jump previously caused by re-wrapping a visible card after animation.
Hidden catalog cards are inert and cannot intercept clicks. The rail is locked while transitioning.
Garment feedback is attached to the exact clicked card reference; repeated copies cannot steal its message.

## Verification

38 automated tests passed, including all72 gender/top/bottom state and asset combinations, strict gender/category replacement, cross-gender acceptance, stable legacy identities, asynchronous selection/saving, exact feedback origin and visible card landing continuity.
All JavaScript files parse. Desktop browser checks confirmed the three female top choices, correct selection and blocked hidden cards. All nine new female outfit photographs were inspected on white.

Mobile390×844: confirmed TOPS/BOTTOMS labels, all three native options in each category, applying each bottom with Monogram retained, removal of ASOS text, official size options, and saving Monogram + Mini Skirt without changing the fitting-room URL.

Final desktop1440×900: panel duration0.44s, selected model opacity1 throughout both directions, correct three native bottom choices and36 blocked non-matching cards; return restores the same Monogram + Mini Skirt. Scrolling up over the model keeps #next active. No browser errors or warnings.
