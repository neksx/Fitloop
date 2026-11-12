# FITLOOP V61

Based on published V60 commit bd715536aec7a0790cccb2e2d8766d786d99efdf. V61 publication is explicitly approved by the user; this document records its source and validation.

## Garments and galleries

Added Ksubi Anti K Stage Dive Trashed, MPS25DJ030, catalog ID12 / bottom6. Product: https://ksubi.com.au/products/anti-k-stage-dive-trashed . Brand guide: https://ksubi.com.au/pages/jean-fit-guide-mens . The screenshot's sale price is not presented as current data. Available sizes come from the official product source.

Built-in ImageGen produced the Ksubi cutout and two portrait assets using the original approved portraits and official jeans photo. Existing poses, jackets, shoes and head configuration are retained around the denim. `generation-prompts.json`, `sources.json` and `thumbnail-measurements.json` record the inputs and measurements. Catalog, fitting room and Saved Looks accept seven bottoms; all84 supported sex/top/bottom combinations resolve to complete local files.

Nineteen gallery photos with off-white, gray or beige backdrops now use transparent PNGs. Existing alpha images and pure-white photos that blend into the page remain. Original photos and thumbnail transforms remain available. `gallery-background-mapping.json`, `*-background-prompts.json` and `*-background-qa.json` record substitutions, generation and alpha checks. All generated photos were reviewed on white. Tiny markings, lettering or fabric texture may vary after generative extraction.

## Panel and motion

The profile kicker reads LOOK, without numeric counts. The separate top look switcher retains its navigation count. All/Tops/Bottoms controls are removed; profile rows always show both selected garments. The garment group translates2px down. Names, gender advisories, KEEP/REPLACE and VIEW share AvenirNext400,10px/13.2px; normal VIEW remains #b2b2b2. Bold titles compensate for the actual uppercase glyph side bearing relative to the kicker (MY:−1.04px at30px/900).

Fit notices retain #ac5b70, now use500 weight, and reveal their range in one line with a centered dot. Hover width is the measured range text plus12px, at least the label's resting width. Corners move2px. Desktop-only notices are also hidden on resize to mobile.

Replacement opening overlaps the divider with the final280ms of the700ms rail/model transition after280ms control fading. Back returns locally to the same fitting room and restores its internal category state. Independent REFRESH/REPLACE, clicked-card identity, head/hood masking and full-resolution save snapshots retain V60 behavior.

## Buttons and shared edges

Save, Create model and Add model use REFRESH's measured surface: rgba(38,38,38,.86),blur5px,AvenirNext600. Save is42px high with12px/16px text on desktop,48px with14px/20px text on mobile. Add retains its40px square. Two neutral rounded objects with radial highlights and cast shadows sit below a separate glass pane. Hero/menu buttons are unchanged.

Resting corners copy REFRESH exactly:12px length,2px white strokes,−1px edge offsets,opacity1,transform none. Hover/focus corners use the garment-row reference's1px/#b2b2b2. Add translates5px outward. Save translates4px horizontally and5px vertically because its surface already extends4px beyond the panel and row frames extend8px. The header action group shifts4px right so the Close frame shares the row's right edge. Mobile uses the same alignment geometry.

## Save prompt and follow-up screen

Only a successful, actual garment change made by a rail REFRESH card offers `Your look is ready. SAVE 10 sec` below the selected model. Its final desktop top is527px at1440×660, exactly2px above the initial placement. It is absent on entry, model selection, closing a panel, card-only REPLACE cycling and unchanged REFRESH. A REFRESH inside the split chooser defers its offer until the chooser returns. The timer expires after10 seconds without automatically saving. The prompt is dismissed on model changes, opening a panel, leaving the section or starting Save; its model ID is checked again when clicked.

Prompt SAVE and the panel's SAVE MY LOOK call one guarded saver. It snapshots the chosen model before asynchronous loading and uses that model's settings when the panel is closed, rather than an old panel draft. Both start the same existing full-resolution portrait flight through the menu and Saved Looks link. Its ending now reveals a white screen without outfit cards, the native MY SAVED LOOKS navbar and two centered, horizontal actions: My saved looks / Back.

Actions reuse saved-export-action directly. Computed family,10px/600 type,13.2px line height,24px height,0px12px padding, #171816 text and white fill match the existing Copy/Download reference. Their6px,1px/#b2b2b2 corners expand5px on hover/focus. Touch hit area extends beyond the visible frame. Back smoothly reveals the same fitting model on #next; My saved looks opens the saved collection. Native menu navigation remains usable, and the decision layer is cleaned up when navigation completes. Reduced-motion preference bypasses the flight.

Browser validation: desktop prompt was absent after entry and panel close, then appeared with10 sec only after Monogram REFRESH. Prompt center x720, target top527. The blank decision center is720×330 at1440×660, with zero portraits inside. Both panel and under-model Save launch the flight; menu and Back work; My saved looks ends on screen3 with no overlay and no blocked main. The model stayed selected after Back. Mobile REFRESH (390×844) also produced the prompt and launched the same saver. A partial rail card was first brought fully into view with keyboard focus before the pointer check.

## Validation

60 automated checks pass, covering independent garments, pointer focus and press/release identity, Back, model identity, save snapshots, Ksubi validation and guide, all84 asset combinations and navigation. All13 JavaScript files parsed; later edited fitting.js was checked again. git diff --check passes.

Browser checks: Ksubi gallery offers six photos and its own guide. Paint Splatter side photo resolves to the transparent-v61 PNG. Saving MY reports success, and its Ksubi VIEW action survives reload. Replacement completes with the model on the right and divider visible; Back restores look mode and zero blocked rail cards. New Create/Save actions retain the glass and corner structure after relabeling.

Measured shared edges (`edge-alignment.json`): desktop1440×660 has row/Save bounds x52…474.664 and Close-frame right474.664; mobile390×844 has row/Save bounds x28…362 and Close-frame right362. All edge differences are0px; mobile document width is390px. `corner-comparison.json` confirms white resting shapes match REFRESH; `corner-hover-comparison.json` records the original gray stroke/color check, with final Save horizontal movement refined to4px in `edge-alignment.json`.

`final-desktop.jpg`, `final-mobile.jpg` and the other local evidence files show the reviewed states. Older measurement files record their named intermediate checks; this README and final measurement files describe the final implementation.

Final mobile decision verification: viewport390×844, action-group center195×422, zero outfit cards/canvases inside the decision layer, native Saved label visible, page width390. Back removed the layer, restored main interaction and left one selected model; the save prompt stayed hidden.
