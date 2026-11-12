# Desktop wardrobe update — 2026-11-02

Scope: desktop only. One woman/jacket; original Pearl pants plus two additional denim variants from the hero products, P005 Coated Gradient and P004 Upside Down Flare. BACK link removed; wheel-up reverse transition retained. Hero and section-two layouts retained.

All four original hero product SVGs now appear in the128px moving fitting rail, with160px cards and18px/s travel. Hover pauses the strip. Left half: REFRESH, selecting the shown pants or cycling pants while retaining the jacket. Right half: REPLACE, opening a catalog limited to the three supported trousers. Replacement preserves the model identity/name/current rotation angle and changes only the outfit state. Save restores the selected supported trousers. No extra woman is created.

## Source style measurements

Live source inspected at1440×900 before editing. Hero product badge: AvenirNext600,14px/18px,padding6px8px,height50px, hover width128px,backdrop blur5px, corner strokes12×12px/2px. REFRESH shares these values and rgba(38,38,38,.86). REPLACE shares the dimensions/corners, but is pure#fff with#666 text and#E6E8EA corners as explicitly requested. Model frame511.5×682 atx464.25,y90; rail1440×128 aty772. Matching garment thumbnail centering from V22 retained.

## Rotation assets

Built-in Image Generation, no CLI fallback. New intermediate model sheet and two garment edits per source sheet were generated, then the blue denim material was refined. Originals copied unchanged into the site. Each garment set exposes20 ordered sampled views (previous18), using11 photographic anchors and9 opposite-side reflections. This is photographic interpolation, not20 independently filmed360° frames or a physical fit simulation. Details and the denim wash/pattern remain generated approximations. All three sets use shared body alignment and separate96×128 flow/342-row contour fields; no source pixels are modified by analysis.768×1024 WebGL canvas; frequent Bécane-inspired pulses retained.

### pearl

- Asset: /Users/neksx/Documents/ChatGPT/AI/sites/fitloop-intro-hero/dist/assets/fitting-room/model-pearl-v23-s0.png
  Generated source: /Users/neksx/Documents/ChatGPT/AI/sites/fitloop-intro-hero/dist/assets/fitting-room/model-pearl-v22-s0.png
- Asset: /Users/neksx/Documents/ChatGPT/AI/sites/fitloop-intro-hero/dist/assets/fitting-room/model-pearl-v23-s1.png
  Generated source: /Users/neksx/Documents/ChatGPT/AI/sites/fitloop-intro-hero/dist/assets/fitting-room/model-pearl-v22-s1.png
- Asset: /Users/neksx/Documents/ChatGPT/AI/sites/fitloop-intro-hero/dist/assets/fitting-room/model-pearl-v23-s2.png
  Generated source: /Users/neksx/.codex/generated_images/01a19bec-6561-7ba0-92ac-990906f00a80/exec-7c8f1e11-04cf-49bd-9e69-a5b980a84df3.png

### flare

- Asset: /Users/neksx/Documents/ChatGPT/AI/sites/fitloop-intro-hero/dist/assets/fitting-room/model-flare-v23-s0.png
  Generated source: /Users/neksx/.codex/generated_images/01a19bec-6561-7ba0-92ac-990906f00a80/exec-b0ba0edc-e2f2-4462-a85a-12a913da5e91.png
- Asset: /Users/neksx/Documents/ChatGPT/AI/sites/fitloop-intro-hero/dist/assets/fitting-room/model-flare-v23-s1.png
  Generated source: /Users/neksx/.codex/generated_images/01a19bec-6561-7ba0-92ac-990906f00a80/exec-276c68c0-4034-4dca-a6ef-4815df55f82e.png
- Asset: /Users/neksx/Documents/ChatGPT/AI/sites/fitloop-intro-hero/dist/assets/fitting-room/model-flare-v23-s2.png
  Generated source: /Users/neksx/.codex/generated_images/01a19bec-6561-7ba0-92ac-990906f00a80/exec-a419b76e-6ac1-4359-80e3-14021beddc07.png

### gradient

- Asset: /Users/neksx/Documents/ChatGPT/AI/sites/fitloop-intro-hero/dist/assets/fitting-room/model-gradient-v23-s0.png
  Generated source: /Users/neksx/.codex/generated_images/01a19bec-6561-7ba0-92ac-990906f00a80/exec-967d0f2a-0d69-4e88-a673-322b2f220b40.png
- Asset: /Users/neksx/Documents/ChatGPT/AI/sites/fitloop-intro-hero/dist/assets/fitting-room/model-gradient-v23-s1.png
  Generated source: /Users/neksx/.codex/generated_images/01a19bec-6561-7ba0-92ac-990906f00a80/exec-ed7ba8dc-eba4-44ea-9322-e69be3e95301.png
- Asset: /Users/neksx/Documents/ChatGPT/AI/sites/fitloop-intro-hero/dist/assets/fitting-room/model-gradient-v23-s2.png
  Generated source: /Users/neksx/.codex/generated_images/01a19bec-6561-7ba0-92ac-990906f00a80/exec-a059f867-eb1d-4091-9ec3-7392923bdf2c.png

## Prompt set

Additional main views: preserve the exact adult woman, hair, face, body, black Pearl jacket/pants and fixed4×2 grid; generate small intermediate right-side azimuths at native1536×1024 on genuine transparency, consistent full-length scale and baseline.

### gradient-0

Use case: precise-object-edit / identity-preserve. EDIT target image1, a transparent 4columns by2rows fashion turntable sprite sheet. Change ONLY the woman's black pants in ALL8cells into blue P005 Coated Gradient jeans, light faded blue across hips gradually deepening to darker indigo down the legs, wide leg cut, natural denim five-pocket seams, NO pearls on pants. Reference image2 is the exact replacement jeans product. CRITICAL invariants: keep image1's adult woman face, hair low bun, skin, natural curvy body/hips, head, jacket and pearl texture, hands, shoes, pose, azimuth orientation of EACH cell, lighting, size, silhouette alignment,8cell grid and transparent background EXACTLY as supplied. Do not invent new poses, do not reorder/mirror the cells, keep every shoe inside its cell. Keep the black pearl cropped zip jacket COMPLETELY UNCHANGED; make only the jeans replacement convincing at the waist/hips. Each frame is still the same woman in the SAME corresponding original pose. Native output1536x1024 landscape transparent PNG or higher same ratio. Preserve sharp face/hair/fabric detail, clear seam/patch textures. No floor, shadows, text or grids.

### gradient-1

Use case: precise-object-edit / identity-preserve. EDIT target image1, a transparent 4columns by2rows fashion turntable sprite sheet. Change ONLY the woman's black pants in ALL8cells into blue P005 Coated Gradient jeans, light faded blue across hips gradually deepening to darker indigo down the legs, wide leg cut, natural denim five-pocket seams, NO pearls on pants. Reference image2 is the exact replacement jeans product. CRITICAL invariants: keep image1's adult woman face, hair low bun, skin, natural curvy body/hips, head, jacket and pearl texture, hands, shoes, pose, azimuth orientation of EACH cell, lighting, size, silhouette alignment,8cell grid and transparent background EXACTLY as supplied. Do not invent new poses, do not reorder/mirror the cells, keep every shoe inside its cell. Keep the black pearl cropped zip jacket COMPLETELY UNCHANGED; make only the jeans replacement convincing at the waist/hips. Each frame is still the same woman in the SAME corresponding original pose. Native output1536x1024 landscape transparent PNG or higher same ratio. Preserve sharp face/hair/fabric detail, clear seam/patch textures. No floor, shadows, text or grids.

### flare-0

Use case: precise-object-edit / identity-preserve. EDIT target image1, a transparent 4columns by2rows fashion turntable sprite sheet. Change ONLY the woman's black pants in ALL8cells into blue P004 Upside Down Flare jeans with distinctive dark and pale washed blue vertical patchwork panels and upside-down waistband details at the flared wide hems, exact colorblocking from garment reference, NO pearls on pants. Reference image2 is the exact replacement jeans product. CRITICAL invariants: keep image1's adult woman face, hair low bun, skin, natural curvy body/hips, head, jacket and pearl texture, hands, shoes, pose, azimuth orientation of EACH cell, lighting, size, silhouette alignment,8cell grid and transparent background EXACTLY as supplied. Do not invent new poses, do not reorder/mirror the cells, keep every shoe inside its cell. Keep the black pearl cropped zip jacket COMPLETELY UNCHANGED; make only the jeans replacement convincing at the waist/hips. Each frame is still the same woman in the SAME corresponding original pose. Native output1536x1024 landscape transparent PNG or higher same ratio. Preserve sharp face/hair/fabric detail, clear seam/patch textures. No floor, shadows, text or grids.

### flare-1

Use case: precise-object-edit / identity-preserve. EDIT target image1, a transparent 4columns by2rows fashion turntable sprite sheet. Change ONLY the woman's black pants in ALL8cells into blue P004 Upside Down Flare jeans with distinctive dark and pale washed blue vertical patchwork panels and upside-down waistband details at the flared wide hems, exact colorblocking from garment reference, NO pearls on pants. Reference image2 is the exact replacement jeans product. CRITICAL invariants: keep image1's adult woman face, hair low bun, skin, natural curvy body/hips, head, jacket and pearl texture, hands, shoes, pose, azimuth orientation of EACH cell, lighting, size, silhouette alignment,8cell grid and transparent background EXACTLY as supplied. Do not invent new poses, do not reorder/mirror the cells, keep every shoe inside its cell. Keep the black pearl cropped zip jacket COMPLETELY UNCHANGED; make only the jeans replacement convincing at the waist/hips. Each frame is still the same woman in the SAME corresponding original pose. Native output1536x1024 landscape transparent PNG or higher same ratio. Preserve sharp face/hair/fabric detail, clear seam/patch textures. No floor, shadows, text or grids.

Supplemental sheet edits use the same jeans-replacement instruction on the new main intermediate atlas. Blue denim refinement: remove raised bead/stud/dot details only from blue pants, keep every jacket pearl, pose, face, body and frame unchanged; match plain denim coated-gradient wash from gradient-front.png. Final sources and exact order recorded in v23-provenance.json.

## Verification

Node syntax checks passed; all three data sets have20 ordered views and matching field byte counts; all referenced images exist. Browser at1440×900: one woman, no BACK link, all four rail products, WebGL ready,20 frames; left hover REFRESH opacity1 and correct dark fill; no warning/error logs. Both catalog replacements were exercised: P005 produced pants=2 and P004 pants=0, each with20 views, WebGL ready and one woman. Right-half REPLACE computed pure rgb(255,255,255), AvenirNext60014px/18px, padding6px8px and opacity1. Save retains its existing browser-local mechanism.

