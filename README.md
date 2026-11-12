v86: Warm the exact opposite-gender outfit before the first switch. SKIP INTRO clears the stored route and returns to hero even if an intro transition is pending.

v85: The empty fitting room return label has the standard 24px visual gap from the menu, and the already-worn notice/reveal each last 0.2 seconds longer. The item reveal keeps its final opacity through animation cleanup.

Latest local fix (v84): Fitting room BACK fades immediately when the split clothing view closes, before the navigation arrow returns.

Latest local fix (v83): the “Website pages. BACK” navigation remains visible while adding the first model, on desktop and mobile. Publication is paused at the user’s request.

# Approved local Fitloop update

All agreed changes after the v71 link are implemented locally. See [the implementation checklist](references/approved-after-v71.md) for the final scope, rollbacks and measured verification.

Latest local update: first-time visitors see a centered Add model control in the fitting room. The empty saved page uses that native plus as its following cursor; BACK is clickable in the navigation bar. The name counter opens on mobile tap, stays gray below 10 characters and turns pink at the limit. The look selector is slightly narrower, and the two-thumbnail mobile window animates in both directions.

Undo now follows the actual order of garment changes and model deletions. The only remaining model can be deleted, leaving a centered Add control and an available Undo action. An explicitly empty people list takes precedence over the old singleton storage entry, so a deleted last model stays deleted after reload.

Model deletion and restoration now animate the departing/returning portrait and slide surviving models into place. The centered Add control travels to its regular position as the first-model panel opens; creating the first model combines the panel closing, Add movement and portrait reveal. These animations honor reduced-motion preferences.

Follow-up: surviving models now travel horizontally at a fixed vertical center when another model is deleted, with their size and opacity interpolated. Undo brings a restored model in from the side; closing the first-model panel also moves the Add control back to the center.

Validation: the automated tests cover model deletion and mixed Undo sequences; the local server serves the updated files. Export changes apply only below 768px. Native icons and glass components are reused. No public deployment or GitHub push has been performed.

Run: `python3 -m http.server 4174 --directory dist`, then open http://127.0.0.1:4174/.

---

# FITLOOP v71

Imported directly from https://fitloop-intro-hero-oct30.kymodelsx.chatgpt.site/ on 2026-11-11. The published HTML, CSS and JavaScript are preserved without redesign. See SOURCE_VERIFICATION.json for byte comparisons and checksums.

## Run locally

```sh
python3 -m http.server 4173 --directory dist
```

Open http://localhost:4173/. No build or dependency installation is needed. Edit the files in dist/ directly.

## GitHub

The project includes all static assets. Publish dist/ as the web root. The repository is local; no GitHub repository has been created or pushed yet.

## Verification

37 unique linked files matched the published versions byte for byte. All 15 top-level JavaScript files passed syntax parsing. 185 asset downloads succeeded. The approved local changes and completed browser QA are recorded in references/approved-after-v71.md. The import verification file records the original v71 baseline.

---

## Historical documentation from the local copy

# FITLOOP — Intro, Hero and How It Works

Serve `dist/` with a static HTTP server. No installation or build is required.

The original intro and approved centered hero are preserved. The hero uses the enlarged supplied illustration with CSS blur and gentle drift, an outlined FITLOOP symbol, Oakley source navbar/menu and grid, and the four approved Purple products on a white horizontal rail. Card separators are full-height #E6E8EA; hover pauses movement and reveals “Create a combination”. Only the intro has the extra dim overlay.

The second screen is a pinned scroll sequence adapted from Offform Services. Its original row-displacement algorithm moves title/copy halves around the fixed image and label, then rejoins them above it. Three steps play in order: Add your clothes, Create a combination, Save your look. The first uses one white square; the next two use adjacent white squares separated by a full-height #E6E8EA line. Labels sit above the photos. A final heading, description and example CTA follow the third step. Photos and AvenirNext assets are the exact hero assets; the CTA shares the hero's original style rule. The opening artwork is flush left/right/bottom, with no outer margin.

The page uses discrete full-screen transitions. Vertical wheel/swipe and keyboard navigation enter the second screen, then drive its internal scroll timeline in both directions. Home returns to the hero; End reaches the final CTA. The 01/02 control was removed. Repeated input is locked until a transition completes. Horizontal motion inside the wardrobe remains available. The shared menu works across both screens; inactive sections and hidden menu contents are inert. Reduced-motion preferences skip the transitions.

`experience.js` handles the original intro, menu, hero grid and wardrobe. `sections.js` handles section navigation and the split-image reveal. `sections.css` contains the second screen and page transitions. Reference source snapshots and observed measurements are recorded under `references/section-two/`; the prior Oakley measurements remain under `references/oakley-centered-v4/`.

V14 adds a third, white screen. After the final heading/CTA, the next forward scroll closes the two artwork halves, then zooms into the white upper-right corner and reveals #next. Reverse scroll returns to the final CTA through the inverse animation. The shared navbar keeps its original geometry and uses dark ink on white, returning to white ink when the dark menu is open. Hero product hover labels now read “Create a combination”.

V15 removes vertical photo parallax and page sliding: split halves move only along X. White-screen arrival uses a full-viewport opaque wash and a transition-free handoff to prevent a moving edge or crossfade seam. The white-screen menu button keeps the original grey translucent fill and white icon, with the hero CTA’s5px glass blur. Step title/copy offset is reduced from50 to28px.

V16 shares hero typography with the how-it-works labels/titles: labels use YOUR NEXT SELF’s exact font/size/tracking, titles use FITLOOP’s900 weight, normal line-height and1px tracking. Step title sizes stay unchanged by explicit user preference.

V17 constrains all three captions to their product-stage width. MY WARDROBE /001 uses two lines; ROOM FOR IDEAS and MY LOOKS /001 use one line with distributed letter spacing.

## V18 — remove retired design (2026-11-02)

Removed all outgoing links to the retired wardrobe site. The hero primary button enters the existing #how sequence; menu and final example links enter #next, reserved for the upcoming experience. Removed unused old palette/hero/atlas styles, the clothing atlas and legacy fonts. Current hero, section-two animation and white section are retained. The separate retired Site now serves only a redirect to this Site.

## Third section — desktop fitting room (2026-11-02)

The existing white destination now contains a fitting room inspired by Bécane's source carousel. Starts with one generated woman; the plus adds one more, with a different face and body. Eight photographic rotation views per model/outfit. The existing four hero products are repeated in a 160px moving rail. Left-half Refresh builds a combination retaining that item; right-half Replace opens category choices. Names are editable; model click opens garment/size information, filters, photo albums and browser-local Save My Look. The transparent source PageInfo composition ends at the rail's top edge. No background is applied on model hover or click. The second woman is the user-selected blonde without a helmet, adapted into the hero garments. Burger and look selector use transparent #E6E8EA outlines; plus sits40px from the right. Gray replace surfaces/suffixes follow the reference.

Desktop only by explicit user workflow. No mobile/tablet layout added. Reused hero font, CTA corners, glass, 40px header control and source SVG close icon. Measurements/source research and image-generation provenance are in references/fitting-room/.

## Current comparison versions

`/#next` rotates the single main woman automatically. `/manual/#next` uses the same design and model with direct pointer-drag rotation, stops on release, and has a separate browser-local saved look. The second woman is removed; the plus is decorative. The white-section entrance introduces the centered question, small model, model growth and UI reveal while retaining the navbar. Information lines appear only when its panel opens. The rail is128px high; all gallery photographs are transparent PNGs. Rotation is interpolated photographic imagery, with remaining source-pose limitations documented under references/fitting-room/measurements.md.

## V22 — desktop fixed Pearl outfit

The automatic fitting room now has one fixed black Pearl jacket/P018 trouser look, generated from the supplied body/outfit references. Outfit switching and Add/Refresh/Replace controls are removed. Two fixed pieces retain their photo galleries.24px garment icons are centered on the same axis. New stabilized photographic assets and denser motion fields render at768×1024 with the Bécane model shader's UV jitter, simplex horizontal distortion and grain; pulses occur four times more frequently. The existing entrance reverses before BACK/wheel-up returns through the inverse white zoom to the previous section. Details, actual browser measurements and source-image limitations are in references/fitting-room/desktop-v22.md.

## V23 — hero wardrobe and jeans replacement

BACK is removed; reverse navigation through wheel-up remains. The fitting rail again repeats all four hero items, pauses on hover and provides left-half REFRESH and right-half REPLACE actions. Hero badge typography, glass blur, corner strokes and dimensions are shared; REPLACE uses pure white. Replacement is limited to the original Pearl trousers and two hero jeans (P005/P004), preserving the same woman, jacket, name and current angle. Each outfit exposes20 sampled rotation views and its own optical-flow fields. Generation prompts, sources, native dimensions and reflection/interpolation limitations are recorded in references/fitting-room/desktop-v23.md and v23-provenance.json. Desktop browser QA verified both replacements,20 frames/WebGL ready, the white button's computed styles and no console warnings/errors.

## V24 — static models and one combined settings panel

Front-facing1024×1536 portraits replace photographic rotation. The original woman uses the supplied face/long loose hair reference; two additional adult identities (woman/man) each support the same three trouser looks. STATIC, JITTER and JITTER + SWAY remain thumbnail selections. Sway follows the hero9s timing at half strength, with no zoom; jitter lasts320ms every4.8s. No optical-flow assets are loaded.

The hero-cloned40px plus opens the existing transparent left panel. Only the add-person panel uses scroll-snap wheels for gender, height, weight, jacket size and pant size; CREATE MODEL adds a person. Normal model information preserves plain values, wardrobe tabs/rows and SAVE MY LOOK. The previous model slides left, becomes smaller and fades. A trash icon beside Close appears when at least two models exist. Measurements/sizes are saved profile settings; pre-generated portraits are not a body-fit simulation. Added people use the two prepared identities rather than a new runtime-generated face on every click.

All four hero garments move in104px-high cards with40px of air above. REPLACE changes trousers directly; the white button has thick corner marks without a thin connecting border. REFRESH, galleries and reverse section navigation remain. Undo restores clothing changes and sits8px from the burger. The plus retains hero glass/corners with gray corner ink on white. All UI text is English. Source prompts, native images, observed styles and checks: references/fitting-room/static-v24.md and factory-v24-prompts.md.

## V25 — matching panel icons

Trash now matches the actual close SVG's20×20 box,18px visible height,2.00585px rounded weight and#b2b2b2 ink, with12px between controls. The combined create panel omits wardrobe tabs/items. Plus corners match the gray hover fill and appear only on hover/keyboard focus. Measurements and verification are recorded in static-v24.md.

## V26 — preserve normal information view

Clicking a selected model again shows the approved plain information values, motion thumbnails, wardrobe tabs/items and SAVE MY LOOK. Only the plus opens measurement wheels with CREATE MODEL and no wardrobe tabs/items. Close/trash symbols are reduced to16px inside aligned20px targets; the trash silhouette is simplified.

## V27 — approved full-height profile panel

Implements the approved precise preview: original Avenir assets,10px labels,12px demi selected values,52px-spaced scroll drums in both look/create modes, corner-only frames, and the plus button's shared glass/hover treatment for Save/Create. Look saves edited profile settings; create adds a new person in the current outfit. The add panel keeps NEW LOOK/ADD MODEL and omits wardrobe tabs/items. The panel extends to the viewport bottom, with its footer fixed20px above the edge, and clips the moving rail at its right axis. Model and navbar geometry remain unchanged. Exact source measurements and QA: references/fitting-room/panel-v27.md.

## V28 — approved fitting-room refinements

Implemented the final image previews: darker gray primary buttons with external hover corners, opaque white information panel, compact look-name typography, and spaced thumbnail corners. Close/trash controls now receive clicks correctly. Re-clicking the active model or clicking the white stage background closes the panel. Rail REPLACE cycles the card's garment (all repeated copies of that slot); REFRESH swaps only the selected person's preloaded outfit texture, with no group opacity pulse. Product galleries now include a four-column profile row and an explicitly illustrative ASOS body-size guide with EU/UK/US and CM/IN controls. Native fonts, SVG icon paths, button geometry and existing layout were preserved. QA measurements and cases: references/fitting-room/next-preview-v28.md.

## V29 — fitting room corrections

Removes full-height panel axes, fixes close/delete corner positioning, removes Undo corner decorations, applies the final white menu styling during the white transition, and restores HOW WOULD YOU PAIR IT? in reverse navigation. Browser checks and screenshots are in references/fitting-room/v29/. The black-section design image is a proposal only. Publication explicitly approved by the user after automatic approval review required clarification.

## V30 — approved intro and second-section typography

Transferred final image previews: darker intro mask, restored inactive Undo corners,10px tracked clothing captions without numbers,12px headings/copy in all three steps, and full-group centering relative to the product photo. Finale uses34px title,16px copy,20px title/copy gap and52px before the original CTA. Preserved V29 fitting-room fixes and reverse transition. Measurements and QA: references/section-two/v30.md.

## V31 — center against the large photo and connect existing destinations

Corrected the reference used for vertical centering: the card, caption, text groups and finale now align to the large photo below the navigation, rather than the full viewport. Look selector is232px wide. Added native-styled SAVED LOOKS beside the menu CTA, falling back to the existing fitting room because no saved-library page exists. Primary try-on and combination cards now lead to the existing fitting room. Main/manual navigation targets and browser interactions verified; references/section-two/v31.md records measurements.

## V32 — fourth section

Added a blank black fourth screen using the second section's shared white navbar. Third/fourth navigation slides horizontally in800ms, supports scroll and keyboard, and preserves the model/outfit on return. Rail and panel scrolling remain local. Direct route: #fourth. Details and checks: references/section-two/v32.md.

V33 fixes wheel inertia skipping the fitting room on entry or return from section four. It waits for the model entrance to finish and a fresh scroll gesture before navigating again. Regression coverage and browser verification are recorded in `references/section-two/v33.md`.

V34 adds the approved My Saved Looks page (`#saved`) with a three-column collection, native fitting-room components, hover motion, View/Edit/Delete and Undo, browser-local saved snapshots, and mild gray glass CTAs. No generated images or added dependencies. Component measurements are in `references/section-two/v34.md`.

V35 implements the approved Save playback overlay with whole-screen scaling, a continuous curved portrait flight, native menu and saved-list previews, and exact restoration of the fitting room. Escape/Skip and reduced-motion behavior are supported. See `references/section-two/v35.md`.


## V36 — panel boundaries, three-model selector and responsive screens

Adds the approved two1px#E6E8EA panel boundaries without changing desktop content coordinates: left shares the existing menu border; right ends at the garment rail. Placement is measured from native menu/corner bounds, including the line thickness, so the clear gaps match.

The selector is300px wide on desktop and reserves24px cells plus8px gaps for a maximum of three consecutive models. The selected model keeps its previous/next neighbors, with first/last edge windows, matching Bécane's observed behavior. All models remain reachable by thumbnail selection, keyboard arrows/Home/End, and horizontal model swipes on touch. Names accept16 Unicode grapheme clusters; old/imported names are normalized, and constrained fields/headings show ellipsis with full title attributes.

Adds mobile fitting-room header/stage/panel, scrolling details and fixed Save footer, touch rail actions and swiping, one-column saved looks, two-column tablet saved looks, compact mobile finale and separated menu CTAs. The approved desktop panel positions and fonts remain unchanged. Native controls no longer trigger global section gestures.

Reference measurements and validation: references/section-two/v36/notes.md.


## V37 — native typography, continuous switching and deliberate garment actions

Pins the original selector Avenir Next regular/demibold10px/13.2px metrics and existing font assets. Retains model buttons and canvases between choices, avoids redundant background assignments, and uses time-based280ms exponential convergence plus500ms thumbnail movement. Panel lines begin their top-down900ms reveal after the existing650ms panel opening. On mobile only, the small kicker moves4px down while the heading stays fixed.

Garment controls are hidden until selecting a card. That exact card pauses the rail and exposes Refresh/Replace. Tapping the card again, background, Escape, opening a panel or leaving the section closes them. The rail resumes unless keyboard focus, dragging or reduced motion requires it to stay paused. Details and checks: references/section-two/v37/notes.md.


## V38 — continuous transitions and three presentation sections

Panel boundaries keep their approved geometry and reveal from the top over1.5s after the650ms panel opening. Model movement uses a critically damped spring with preserved velocity on rapid reselection, eased opacity and650ms thumbnail motion; the texture jitter pauses during movement. The blank fourth section and its horizontal handoff are removed. Saved looks is now screen3, still opened through its menu action; legacy#fourth links resolve to the fitting room.

Wheel/touch movement during the second-section opening is queued within one screenful and played when opening completes. The fitting-room wheel-tail guard no longer blocks the second section. Navigation cleanup runs in finally so a transition failure cannot leave controls locked. Updated regression tests cover continuous forward/reverse scroll, wheel-tail protection, the terminal fitting room, local controls and removed section markup.


## V39 — deliberate section entry and a grounded Save sequence

The second section no longer replays input accumulated during its opening. Its first frame contains only the garment stage and MY WARDROBE; scrolling after opening advances the copy without a click. Panel lines retain the1.5s reveal but start immediately. LOOK remains visible below360px.

Save locks interaction, closes the real details panel and waits for its existing transition before capturing the visible fitting-room portrait. The flying canvas and model share viewport-local coordinates measured before camera scaling. Completion returns to the third section with the panel closed and focuses the selected model. Reduced motion also closes the panel and restores interaction. Collection previews use their actual header padding; a white native header region masks preceding-row buttons, and preview navbar actions are hidden in collection phase.

Saved-card outer corner marks are always visible. View Look retains its previous appearance/visibility; its own marks remain hidden except while pressed and extend outward on press. Measurements and QA: references/section-two/v39/notes.md.

## V40

Restored desktop Saved Looks card/button hover corners. Mobile retains permanent card frames and waits for the button-corner reveal before a 700ms fitting-room crossfade. Dimensions/fonts unchanged; see references/saved-looks/v40/notes.md for QA.

## V41

Desktop Saved Looks now uses the approved transparent36px pointer-following SVG arrow. The portrait alpha switches arrow/corner colors; the full model block opens its look. Header actions and mobile View Look remain unchanged. Browser measurements and QA: references/saved-looks/v41/notes.md.

## V42 — latest local fitting-room updates

Promotes the reviewed local42 implementation: desktop garment hover actions and already-worn feedback, scrollable details with GO TO saved looks, the ten-second BACK hint, compact look selector, lower desktop panel controls, removal of saved-card edit icons, and TRY FITLOOP labels. Original assets and implementation are retained. Current validation and measured desktop styles: references/local42/publication-checks.md.

## V43 — desktop hover and panel corrections

Restores visible centered Refresh/Replace badges on desktop half-card hover, prevents the details panel from clipping upper icon corners, raises the saved-collection link to the initial viewport edge, fixes the selector at262px, and shifts saved-card Delete2px left. Measurements and browser verification: references/local42/v43-fixes.md.


## V44 — panel action spacing

Moves the fitting-room trash control2px left by increasing its gap from Close from8px to10px. Close stays at its approved right axis. The saved-look export interaction remains a separate SVG design preview and is not included in this publication.

## V45 — saved-look image export and smooth return

Adds the approved animated Copy/Download flow to each saved look, exporting the selected identity/outfit as a real PNG. The header Export/Delete pair matches the fitting panel's20px targets,16px SVGs and10px gap in both closed/open states. View Look now returns to a pre-positioned fitting-room model through a900ms crossfade. Exact measurements and browser validation: references/saved-looks/v45-export.md.

## V46 — staged desktop model handoff

View Look clears the collection, moves one portrait into the fitting room, then unfolds the native controls from the model. The timer's BACK action reverses those stages. The selected export button retains its original dark check and gray corners while only its sibling fades. Desktop scope, measured rectangles, source motion reuse and validation: references/saved-looks/v46-desktop-motion.md.

## V47 — gallery scrolling, stable model plane and desktop polish

Restores bounded scrolling and header controls in every garment gallery, prevents focus scrolling from moving the model/plus plane, makes Refresh/Replace equally compact, and removes the repeated model closure on logo navigation. Panel opening is smoother and boundary lines start500ms later. Adds the requested12px square desktop cursor with background inversion. Measurements and full garment checks: references/fitting-room/v47-panels.md.

## V48 — subtle cursor inertia

The 12px desktop square follows the pointer with a frame-rate-independent 75ms smoothing constant. Entry and clicks snap to the exact pointer position; reduced motion uses direct tracking. The animation stops at rest and on blur/leave. All V47 panel and transition refinements are preserved.

## V49 — opaque 10px cursor

Cursor reduced to 10 × 10px including a 1px contrasting border (white on black, black on white). Solid black/white fill replaces difference blending; contrast follows the hovered background. V48 inertia preserved.

## V50 — hairline cursor corners

Replaced the continuous cursor border with four 0.7px contrasting corners (3px arms), retaining its 10 × 10px outer size, solid fill and subtle inertia.

## V51 — 1px cursor corners

Latest requested adjustment: corner stroke increased to 1px. The 10px opaque square and inertia remain unchanged.

## V52 — live model controls and saved-look pointer restoration

Approved SVG refinements now apply on desktop: full gallery headings, 2px label alignment and a 1.5s panel line reveal. Model parameters update the selected person immediately, with a 900ms identity transition and 320ms proportion easing. Restores the 36px saved-look mouse follower alongside the small square cursor, and adds a smooth GO TO collection entrance. Saved PNG exports include the current proportions.

Validation: 15 tests pass; live controls, actual PNG download, pointer colors, GO TO and forward/BACK portrait flights verified in browser.

## V53 — saved pointer available on first entry

Keeps the desktop saved-look hit area active before hover so the first pointer event reaches its follower immediately. Export mode still disables that hit area. All V52 behavior retained.

## V54 — saved-page frames and background return

Saved-card corner frames now follow hover instead of retained export-button focus. Status/UNDO stays 40px above the bottom; the empty-state text sits 16px below center. Reuses the approved arrow as the Saved Looks background cursor and return action, with controls, export dismissal and mobile behavior preserved.

Validation: 20 tests pass; focus/hover frame regression, empty-state footer, real UNDO, export dismissal and background return verified in browser.

## V55 — return arrow only on the empty saved page

Limits the page background return action/cursor to zero saved looks, as clarified by the user. Populated collections retain only their per-card arrows. V54 frame and footer fixes retained.
