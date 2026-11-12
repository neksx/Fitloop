# Approved panel implementation — 2026-11-02

Approval: user requested transferring fitloop-my-drums-preview-v4.png to the site and sharing its layout with Add Model, changing only the heading/button text and omitting wardrobe tabs/items there. This supersedes V26's plain metadata view: both modes now have scroll drums.

At1440×660, original panel source left60/top100/width406.667 is retained. It now ends at viewport bottom. Mode frame x52/y169.203/width422.667/height40, with8px inner padding around24px previews. Metadata52px rows,48px wheels,16px option spacing. Label10px400; selected12px600 using existing Avenir demi with0.15px text stroke; title remains30px900. Kicker shares label typography. Gray neighbors use regular10px.

The native Avenir10px regular ink metrics are ascent7.26000023/descent0.18000031. A baseline probe in the live DOM measured192.84375 before refinement; vertical offset0.6415625px yields the target192.743 baseline and equal16.28px top/bottom visible-ink gap in the mode frame.

Filters end166px above viewport bottom; garment rows are28px high with6px gap, block bottom90px. Save/Create is50px high and ends20px above bottom. Width414.667 overrides the inherited max-width cap. Thin row corners extend8px beyond content. The same actual .button rules used by the hero-cloned plus supply fonts,5px backdrop blur,12px/2px corners and hover transforms. Both primary buttons use plus fill rgba(0,0,0,.2), hover.3, gray corners only on hover/focus. Disabled Undo uses four light corners; active Undo is unchanged.

Rail104px height is unchanged; when the panel is open its left486.667px is clipped so clothes pass behind the panel. Both panel grid axes extend to the bottom. No changes to earlier sections, main portrait geometry, motion timing or rail speed.

UI QA: five wheels present in look and add; keyboard height172→173 saved correctly; reset172 saved; add Man180cm/62kg succeeded with same trousers; reload restored profile180cm; deletion removed the test model; actual look thumbnail selection worked. Add has zero garment rows, hidden filters, CREATE MODEL. No browser warnings/errors. Four script syntax checks and git whitespace check pass. Height/weight remain saved profile data, not a body-fit simulation.
