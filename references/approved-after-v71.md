# Approved local changes after the v71 link

Scope is local only. Preserve native icons, glass artwork and all unrequested layout.

- [x] Undo the mobile COMBINA / TION title experiment; retain the v71 title.
- [x] Instead split the saved-look mobile description: Keep the combina / tions you love.
- [x] Keep mobile Add visible and usable while the fitting details panel is open.
- [x] Mobile name 12→10px, content-width underline, right-aligned count/models.
- [x] Two complete mobile thumbnails; active window advances with selection using native FLIP motion; desktop retains three.
- [x] Fitting name limit 10 graphemes, native corner icon, count 10 / 10, native count typography, #ac5b70, leftward reveal, 3px diagonal corner opening. Reveal on hover, focus/tap, and when typing reaches ten.
- [x] Stable selector width independent of 1/2/3 looks, enough for the widest ten-character desktop label while closed; ellipsis yields room to the open counter and retains a visible first character.
- [x] Demo already-worn refresh swaps to the next preloaded garment under the notice. No flash of the previous garment.
- [x] Garment reveals after all fitting notices use a 420ms opacity transition without motion/scale changes.
- [x] Saved-page BACK returns to its actual entry page. Desktop divider; mobile top-right, no divider, next to Add with 16px gap.
- [x] Saved Add clones the real native component. Desktop 60px after a preceding card and vertically centered; grid handles multiple cards. Mobile upper-right. Opens create-model mode in fitting room.
- [x] Export 04 is MOBILE ONLY. Transparent button backgrounds, visible frame 44→42px (44px hit boxes retained to preserve exact centers/spacing), model 4px farther left. Desktop source geometry, 24px frames and backgrounds unchanged.
- [x] Browser QA and regression checks. 65/65 tests pass; all JavaScript parses.

## Measured verification

- Desktop 1280px: ten W characters require 100.41px; input provides 101px, no overflow; selector width 319px is independent of look count.
- Mobile 390px: selector 196px, two 24px thumbnails in a 52px window; selected window advances from 01+02 to 02+03.
- Saved mobile: BACK/Add gap 16px; export hit boxes 44px, corner frames 42px, transparent backgrounds.
- Saved desktop: original white background and 24px frames; portrait transform matrix(0.5,0,0,0.5,-126,0). Add gap exactly 60px; Add/card vertical centers both 490px at 1280×900.
- BACK verified from fitting and from About; saved Add opens create-model mode. Empty desktop grid remains height zero so the existing empty message is visible.
- Already-worn demo changed product 0→4 after notice; tests verify all three fitting notice types use a 420ms opacity-only reveal with no old-art flash.
- Corrected the legacy wheel test fixture to provide the actual scroll viewport; application wheel behavior was not changed.
- Temporary saved test look removed after QA.
