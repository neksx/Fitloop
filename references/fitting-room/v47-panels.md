# V47 — desktop panel/scroll corrections and compact garment actions

## Issues and corrections

The local scroll wrapper introduced inV42 left the old panel header selector (`.fitting-panel>header`) targeting the wrong parent. The long garment heading could force the close control outside the panel. The wrapper also allowed the entire gallery header to be scrolled away while nested content had no bounded flex height.

Desktop `.local-panel-inner` now restores the existing column flex layout; its header's first child can shrink. Gallery content has a bounded inner scroller. Its outer viewport clips instead of independently scrolling, keeping the header/close control fixed. Mode changes reset both relevant scroll positions. Look/Create geometry and the existing View/Save content remain in place.

Stage/model planes use overflow:clip on desktop, preventing native focus scrolling from shifting their contents relative to the approved plus anchor. No new plus coordinates or responsive scaling formula was introduced.

Refresh and Replace both retain their original colors, corner geometry, half-card targets and centered hover behavior. Both now measure112 ×42px, with AvenirNext60012px/16px and4px6px padding (previous128 ×50px,14px/18px,6px8px). No garment behavior was redesigned.

Panel opening uses850ms movement and350ms opacity easing. Existing side-line geometry remains unchanged; line reveal starts500ms later and runs1800ms. Reduced motion disables these transitions.

## Logo exit

The old exit removed fitting-arrived before collapsing the controls, making the model vanish through CSS and then reappear at the start of its scale animation. It now retains visibility during control collapse. Desktop logo navigation performs one scale/fade of the model and skips the second-section question playback. The observer does not re-enable controls while fitting-leaving is active. Returning to the second section retains its existing question reversal.

## Square cursor

The user additionally requested a small square cursor. Desktop fine-pointer surfaces now show a12 ×12px square. White plus mix-blend-mode:difference gives black on white and white on black. It is centered at the pointer, cannot intercept clicks, and hides on window leave/blur or keyboard Tab. It replaces the previous saved-card pointer artwork as part of the requested cursor change. No mobile cursor or layout changes were added.

## Browser verification

-1280 ×720: all15 garment photos loaded (Jacket4, Pearl4, Gradient4, Flare3).
- All four galleries: header top100px, outer scrollTop0, bounded gallery clientHeight545px and scrollHeight936px. All country tabsEU/UK/US and unitsCM/IN work; guide can scroll to the bottom and Back restores the information panel.
- Plus remained x842.25/y313 with40 ×40px dimensions across Look/Create and all galleries; stage/model scroll offsets stayed zero.
-1440 ×900: plus x989.75/y403 from the original stage geometry; gallery heading remained at100px while content scrolled and outer scroll stayed zero.
- Both black Refresh and white Replace measured112 ×42px,12px font,16px line height and4px6px padding.
- Logo exit observed fitting-arrived held with model opacity1 during control collapse, followed by hero active/model opacity0. Returning through TRY FITLOOP restored the fitting room.
- Line transition delay0.5s and duration1.8s; square cursor width12px and difference blend verified.
