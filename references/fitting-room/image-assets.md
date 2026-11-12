# Fitting-room model assets

Built-in ImageGen mode, no API/CLI fallback. All consumed images are saved under:
`/Users/neksx/Documents/ChatGPT/AI/sites/fitloop-intro-hero/dist/assets/fitting-room/`

One fictional adult woman and one blonde adult woman adapted from the user-selected Bécane reference, each in the exact black cropped pearl jacket referenced from the hero, with three trouser choices. Natural aspect ratio: sheet1536×1024; four columns and two rows, each cell384×512. The browser displays a cell using background-size400%200%, with per-angle horizontal-axis offsets measured from the source cutouts. Original generator outputs remain under the standard generated_images directory; the live Site uses project-local copies.

| Saved asset | Identity / trousers |
| --- | --- |
| model-0-pants-0.png | Medium-brown skin, dark low bun, athletic build / P004 flare |
| model-0-pants-1-v2.png | Same identity / P018 black pearl; alpha corrected |
| model-0-pants-2.png | Same identity / P005 gradient |
| blonde-pants-0.png | Slim fair blonde, ponytail, no helmet / P004 flare |
| blonde-pants-1.png | Same blonde / P018 black pearl |
| blonde-pants-2.png | Same blonde / P005 gradient |

## Prompt set

Base woman 0: photorealistic-natural production photographic rotation sprite sheet, exactly4 columns×2 rows with eight equally sized rectangular cells and actual transparent background. Same adult woman aged27 with medium-brown skin, natural dark curly hair tied in a low bun, athletic medium build. Wear exactly the supplied black cropped pearl/stud zip jacket and supplied washed indigo P004 flared jeans, preserving cuts and details; plain black low ankle boots barely visible below hems. Full-body neutral upright stance, arms relaxed, front0°, front-right45°, profile90°, rear-right135°, back180°, rear-left225°, left-profile270°, front-left315° in reading order. Same camera, identity, scale, pose and lighting across every cell. Full body centered with transparent margins, soft even fashion catalog lighting, crisp fabric. No text, watermarks, decorations or UI.

Base woman 1 (replacement): preserve the selected blonde without a helmet from https://cdn.sanity.io/images/mzz4iq4t/production/04f29e0d7c83ddbbec983409def78dca6b0ab0a0-1024x1820.png (THE DOMINA, visible beside THE RIDER). Same slim build, fair skin, blonde ponytail and facial identity, dressed in the supplied hero cropped black pearl jacket and black P018 trousers. Remove the bag; no helmet. Eight full-body views, neutral stance, 4 columns×2 rows1536×1024, identical positions and camera. Clean transparency outside each silhouette. These are generated reference-based outfit views, not photographs of the actual woman in PURPLE clothing.

Blonde background extraction: preserve all eight women and clothing pixel positions. Remove all dark background, brown/gray glow and shadows; alpha zero outside silhouettes, no haze. Final base original: exec-e00ba605-5835-4d44-aa89-2e826a0c2b22.png. Flare variant: exec-640fc344-ac96-4518-9b8d-f1bb03c61975.png. Gradient variant: exec-5dc83287-dc15-4963-999d-2f58ea3ed6dd.png. Checked source PNG alpha and the rendered white canvas; no model card background is used.

Clothing variant edit prompt: identity-preserve. Edit the target eight-angle4×2 sheet, replace ONLY the trousers in all eight cells with the supplied garment reference. Preserve exact same woman, face, hair, body shape/size, pose, jacket, footwear, full-body scale, placement, angles, lighting and camera. Preserve transparency, exact dimensions and four-column/two-row layout; no text, grid lines, watermark or additions.

Alpha correction for model-0-pants-1-v2: background-extraction. Remove all background haze, gradients, soft dark ghost rectangles and opaque pixels outside each woman's exact silhouette, including gaps between limbs. Outside-body pixels must be alpha0. Keep the black pearl trousers, exact poses, scale, identity, black jacket, shoes and all eight views. Preserve1536×1024 grid; change only the alpha mask, without outlines, new lighting or shadows. The original blue-trouser sheet is an alignment reference only.

Earlier discarded identities and their variants are not included in the project or publication.

## Product photo albums

Official PURPLE product photos are saved alongside the sprites, with exact source URLs in product-gallery-sources.json. Original front cutouts remain in the parent assets directory. The gallery contains static garment photography, including official editorial wearer photos; it does not add an interactive third model.

## Final assets after removing the second woman

The blonde and prior second identity are excluded from the deployed site. The main woman's dense source sheets are `dist/assets/fitting-room/rotation-p{0,1,2}-s{0,1,2}.png`; source output paths, observed orientation order and silhouette bounds are recorded in dense-frame-bounds.json. Three sheets were generated from the main woman's original sheet, requesting successive15-degree camera views while preserving her face, low bun, athletic proportions, jacket and P004 jeans. Views were visually reordered by observed orientation. Clothing edits replaced only trousers with the supplied P018 or P005 reference while preserving all eight poses/cells. Twenty usable views per outfit are used with contour and optical-flow interpolation. The original eight-view sheets remain a loading fallback.

All product-gallery images now use transparent PNGs. Exact output paths, dimensions, alpha and corner checks are in gallery-cutouts.json and front-cutouts.json. Prompt: background extraction only; remove studio backdrop/floor/shadows, preserve subject, garment, texture, crop, camera angle and colors; alpha zero outside subject, no halo or replacement backdrop,2:3 portrait. These are AI background-removal outputs, not pixel-identical originals; original source JPEGs and source URLs are retained for comparison under original-gallery/ and product-gallery-sources.json.
