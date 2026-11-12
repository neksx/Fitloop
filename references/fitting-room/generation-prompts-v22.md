# Model image generation — built-in tool

Selected files:
- ../../dist/assets/fitting-room/model-pearl-v22-s0.png
- ../../dist/assets/fitting-room/model-pearl-v22-s1.png

Reference1: user's first photograph (body/identity).
Reference2: user's third photograph (black Pearl outfit).
Reference3: generated consistency sheet.

The built-in Image Generation tool was used; no CLI/API fallback.

## Base prompt

Use case: identity-preserve, photorealistic fashion catalogue turntable atlas. Make an ULTRA HIGH DETAIL landscape PNG, 1536 pixels wide by 1024 pixels high or higher resolution 3:2. EXACT 4 columns by 2 rows, 8 equal 3:4 cells. One full length adult woman per cell in fixed standing relaxed straight symmetrical pose, feet parallel, arms slightly away from sides, identical height/head level/foot baseline/center axis. Input1 body reference: use adult brunette woman's face and softly curvy natural waist hips and thighs. Input2 wardrobe reference: ONLY black pearl textured cropped collared zipper jacket with long sleeves and matching pearl black wide leg high waisted pants and low black shoes. Hair low bun. Input3 consistency reference: same woman and same outfit, but improve rendering quality sharply. Highest possible photorealism with real skin, crisp face, hair strands, clear detailed seams, small raised black pearl studs. Transparent background, no shadow, no floor, no grids labels text. Fixed orthographic camera lighting subject proportions identity and clothing pattern. Only rotate rigid subject in small exact15degree increments in row major order: row1 0 front,15,30,45 degrees facing right; row2 60,75,90 right profile,105 degrees. Not8separate poses, actual consecutive views of the identical subject. Never clip head or shoes, each figure entirely inside own equal cell, no overlap. Body natural slightly fuller hips and thighs as photo1. Atlas for smooth animation. No blur.

## Follow-up sheets

Preserve exactly the selected higher-quality sheet's woman, face, outfit, fabric, body, hair and framing. Sheet1 request: row1 120,135,150,165 degrees; row2 180 straight back,195,210,225. Sheet2 request: row1 240,255,270 left profile,285; row2 300,315,330,345. Native observed orientations differed from requested labels, so only consistent observed views were selected; unused outputs are not referenced by the website. See pearl-v22-provenance.json.

