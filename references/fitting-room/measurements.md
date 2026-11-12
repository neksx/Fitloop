# Fitting room — desktop reference and verification

Scope: desktop only, initially one woman, plus adds the second; maximum two. Mobile/tablet adaptation requires the user's next choice.

## Reference inspected from source and computed styles

- https://www.becaneparis.com/looks/heroines-drop/the-rider
- https://www.becaneparis.com/looks/heroines-drop/the-warrior
- https://www.becaneparis.com/products/freya-pant

Raw source and the 1280×900 DOM/style capture are retained alongside this file in `rider-desktop.json`, `becane-original.css`, and the original JS excerpts. Third-party content is reference data only.

Bécane uses a green-keyed 9:16 video texture in WebGL, with video time driving the displayed angle. Its desktop carousel equations are copied into fitting.js: r=(index-focus)/4.2; i=1-abs(r); scale=.2+.8*i³; x=r*(.8+.55*scale)*viewportWidth. Inactive opacity uses the source exponential interpolation and .4 factor; focus interpolation is .05 per animation frame. Our photographic sheet has eight angles and a 3:4 cell ratio, rather than a 3D model or continuous video.

Source CSS desktop grid: 12 columns, margin30px, gutter20px; column=(viewportWidth-11*20px-2*30px)/12. PageInfo left30px, top144px, width4 columns+3 gutters. Source title30px/30px, weight700 expanded; source small labels8px/8.8px/.04em. The user explicitly requests FITLOOP type instead: AvenirNext heavy900/30px/30px/1px title and AvenirNext12px/13.2px labels, reduced from the preceding16px controls. Existing FITLOOP font files are reused.

Reference rotation bar: height28px, padding2px, margin-top40px, x20px; frame thumbnails24px high. Metadata: top margin40px, row gap20px, label column one grid column+20px. Reference white product bars: height28px, padding2px, image24×24, gap10px, minimum width2 columns+40px. VIEW color#B2B2B2, hover#666666; replace catalog#F6F6F6. These neutral colors are retained with the user's #E6E8EA line override.

## User exceptions retained

- Top controls align with the approved hero at40px from sides and30px from top. Burger40×40; logo55×19; selector40px high (source28px), editable look name and two thumbnails.
- Burger and selector have transparent backgrounds with1px#E6E8EA outlines; selector AvenirNext600/12px/13.2px, black text, gray counter. Thumbnails24×24/gap2, inactive opacity.4.
- Models have no background, pseudo-background, blur or click backdrop. Hover uses only12px corner strokes. Plus is40px from the right edge.
- PageInfo is transparent. Filters appear above the product bars. Save uses the hero242×50px button, AvenirNext600/16px/20px, padding14px30px,12px/2px corner strokes.
- Moving rail remains160px high, each card160×160, white#FFFFFF, full-height separators#E6E8EA.18px/sec, immediate pointer hover pause, continuation on leave. The card's left half exposes REFRESH; right half exposes REPLACE.
- Info panel bottom equals rail top. Product bars sit90px above panel bottom; save20px above bottom. The panel cannot cover the rail.

## Measured FITLOOP result at1280×900

| Element | x / y | Width / height | Verified type/color |
| --- | --- | --- | --- |
| Burger |40 /30|40 /40|transparent; border rgb(230,232,234)|
| Look selector, two looks |973.296875 /30|266.703125 /40|60012px/13.2 AvenirNext; transparent|
| PageInfo |30 /144|393.328125 /596|transparent;#171816|
| Title |30 /165.203125|content /30|90030px/30 AvenirNext;1px tracking|
| Rotation |20 /235.203125|246.6640625 /28|60012px/13.2 AvenirNext|
| Products |20 /622|content /28|VIEW#B2B2B2|
| Save |30 /670|242 /50|#666 surface; hero corner treatment|
| Rail |0 /740|1280 /160|#FFF;#E6E8EA separators|

Gallery header wraps naturally; scroll area starts20px below its actual bottom. Checked title bottom225.203125, gallery top245.203125, gallery bottom650; rail top740.

## Behavior checked

Plus adds exactly one second look and disappears. Selection preserves two distinct identities; active model centers, neighbor shrinks/fades using source equations. Editable name, gallery photo switching, manual angle selection, refresh preserving the chosen piece, replacement preserving identity, and browser-local save/reload were exercised. Replace shows the source neutral grays. No woman hover/click background remains. Rail stays visible under all panel modes.

Save is browser-local (`fitloop-fitting-saved-v1`), no account/server storage. Model sizes are demo presets; blonde height178cm comes from the selected THE DOMINA source metadata. Garment sizes on AI outfit variants are illustrative, not verified fitting measurements.

At1440×900, verified again: rail160px, cards160×160, burger40px, selector40px, two models, plus hidden after addition, panelBottom=railTop=740px, AvenirNext heavy font loaded. Browser error/warning log empty.

## Final user corrections — 2026-11-02

These replace the earlier two-person arrangement and previous PageInfo positioning above.

One main woman only; decorative plus remains beside her with aria-disabled=true and no action. The bottom strip is128px high, cards160×128. Information left axis60px, top100px; uniform width4 reference columns+20px. Left line40px; right line sits20px beyond the information block. Both lines appear only with information open, ending above the rail. Name has a permanent#E6E8EA underline. The filters and garment rows are grouped above Save with20px gaps; Save ends20px above the rail. Thumbnails use generated transparent PNGs, alpha-tight measured viewBoxes and xMinYMid alignment.

The white-section entrance centers the question, fades it into a small woman, enlarges her, then reveals controls/rail outward from her center. The navbar is outside these animation targets. Question is hidden after arrival. Reduced motion bypasses the sequence.

Automatic route: `/#next`. Manual variant: `/manual/#next`, identical styles/content and independent browser-local save key. The manual version is stationary until pointer drag, directly follows .6 degrees per CSS pixel, reverses with drag direction and stops on release. Click without dragging opens details. Section navigation preserves the manual path.

Rotation uses20 ordered photographic views per trouser choice, drawn from three generated sheets. Per-view height and center are stabilized. Silhouette contours align adjacent views; DIS optical-flow displacement supplies interior interpolation in WebGL. No 3D mesh or true360 video is claimed: generated pose/texture inconsistencies can still remain during transitions. Source PNGs remain unchanged; analysis produces only small motion/contour fields. OpenCV was installed under/private/tmp for this analysis and is not a site runtime dependency.

QA at1280×694: manual angle0 remained stationary;200px right drag reached120°,60px left drag reached84°, release stayed84°; dragging did not open details. WebGL ready,20 views, one woman, no console warnings/errors. Rail top566; Save bottom546. All15 gallery PNGs are present with transparent corners; jacket photo2 loaded as jacket-1.png with transparent container background. Existing checks for1280/1440 desktop geometry are retained as historical observations; no mobile/tablet adaptation was added.
