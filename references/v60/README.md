# FITLOOP V60 — interaction fixes, 2026-11-05

## Final scope

- Pointer focus no longer recenters partially visible rail cards. Keyboard focus still brings hidden cards into view. Pointer actions bind to the garment at pointer-down; a busy or changed card cannot apply another item on release.
- White REPLACE updates and fades only the clicked DOM card. Neighbors and repeated copies are independent. Each card cycles through every matching gender/category option, so duplicated garments are allowed after independent cycling. Dark REFRESH applies the garment displayed on that card, retaining the other half of the outfit.
- Replacement BACK returns to the fitting room on the same `#next` URL, restores the previous category filter, and removes temporary interaction blocks. Mobile replacement has its own Back action. Desktop menu-to-Back gap is 20px, based on the observed menu bounds x40–80.
- The source male head overlay now ends at normalized y .132, above the hood collar. Its transition begins at .118; the previous .135–.165 blend imported the open neck/collar of the Tie Dye head reference into the closed Leather Anorak neckline. The original face assets and female overlay are retained.
- Save animation snapshots now use the source portrait canvas dimensions. Previously a 1536×2048 portrait was copied unscaled into a 768×1024 fly canvas, cropping it to the upper-left quarter.
- Fitting-room entrance grows the model and introduces controls concurrently, preserving the question and centered model. Exit collapses controls and model concurrently before the reverse question handoff.
- Normal VIEW labels are gray (#b2b2b2, hover #666). The gender advisory is regular 400 weight; product names remain gray and KEEP/REPLACE remain black.

## Final visual decisions

Hero and menu buttons retain their original styles. `protected-buttons-before.json` records their computed dimensions, typography, padding, fill and border before edits.

After user revisions, SAVE MY LOOK retains the V59 flat #b3b3b3 fill, white 600/16px text, and 50px height, matching the Add-model square. REFRESH/REPLACE retain their original 42px badges, 600/12px text and dark-gray/white fills. The fit warning retains #ac5b70 and 600 weight. The temporary blue/metallic fills and lighter warning were removed.

Only the secondary section's large finale CTA receives neutral light glass, a 44px height and 14px text. It has no blue channel tint. The fitting-room filter and garment group are positioned from the Save button height, retaining the established 20px row-to-button and 14px filter-to-row gaps. Since Save's original 50px height was restored, its original group position is restored too.

## Checks

52 automated checks pass. Nine checks cover pointer-vs-keyboard focus, pointer press/release identity, keyboard refresh, local Back, restoring the previous filter, one-card-only DOM cycling, and full-resolution save snapshots. Existing checks cover independent garments, all 72 asset combinations, asynchronous selection and saving, navigation, exported-image dismissal and saved-page behavior.

All JavaScript parses and `git diff --check` passes. Browser evidence is recorded below after final verification.

### Browser verification

- Desktop 1440×660 and 1280×720: normal REPLACE changed only copy 6 (Logo Bling → Paint Splatter); the selected portrait remained identical. REFRESH then applied Paint Splatter while retaining the selected skirt. A second split-mode check changed only copy 12 and retained the portrait; all other 47 card IDs remained unchanged.
- A partial card near the split boundary applied the clicked skirt without recentering the rail. The small offset drift before pointer hover was ordinary auto-scrolling, not a card jump.
- BACK completed at #next/screen 2 with the profile open, the previous All filter selected, and zero inert rail cards. The left header gap is 20px.
- Save animation: both source and flying snapshot measure 1536×2048. It completed without changing #next, removed its overlay, and left exactly one selected fitting model.
- 390×844: native replacement offers all three male tops (0/4/5) plus Back. Back restores all five measurement controls. Selecting Anorak restores the normal profile and Save label. No horizontal page overflow.
- Computed hero/menu typography, height, padding, background and border match the pre-edit records exactly; see browser-checks.json.
- Final Save computed fill is rgb(179,179,179), height 50px, type 600/16px. Normal VIEW actions are rgb(178,178,178); the gender hint is 400 weight. Warning is rgb(172,91,112)/600. Rail badges are 42px with 600/12px type.
- The male Anorak collar was inspected with the revised head mask; its native closed collar is preserved rather than blended with the source Tie Dye neckline.

These checks cover the available browser and the stated viewport sizes; they are not a guarantee for every browser/GPU combination.
