# Oakley centered layout — 30 October 2026

Reference: https://www.oakley.com/en-us/l/culture-redefined-collection

Read rendered HTML, SVG and computed styles before editing at1440×900 and390×844. The live stylesheet was exported through the browser asset inventory because a direct download returned403. The complete exported stylesheet is oakley-original-main.min.css; oakley-components.css contains its original navbar, menu, CTA and grid rules, including original media queries. Reference-page content was treated only as source data. Tracking scripts were not included.

## Copied source geometry and style

- Desktop navbar:left40,right40,top30,height40. Mobile:left16,right16,top16,height40.
- Menu button40×40; rgba(0,0,0,.2) fill;1px white.4 border; observed button padding1px6px.
- Original hamburger SVG24×14, three24×2 white rectangles at y0/6/12, radius1. Original close SVG20×20,viewBox0 0 20 18, source transform matrices and rect dimensions retained byte-for-byte in attributes.
- Menu:full viewport,rgba(0,0,0,.8),.2s opacity transition; items AvenirNext600,16px/20px,32px bottom margins; list32px bottom margin; source100×1px white.2 separator before homepage link.
- Grid:1px lines,rgba(255,255,255,.2), fixed100vw×100vh,pointer-events:none,z10. At1440px, x40/312/584/856/1128/1400. Desktop horizontal line bottom60. At390px, x40/195/350, no horizontal line.
- Hero contents:source full-height centered flex column; title60px/900 or45px mobile,1px tracking,-10px margin bottom; subtitle12px/16.32px tracking/14px left margin, mobile9px/12.29px/12px; body16px/400/normal,50% width and40px vertical margin, mobile90%/24px; CTA242×50,padding14×30,16px/600/20px; secondary link24px below CTA.

## Explicit requested adaptations

Menu text and destinations are FITLOOP content; the source55×19 logo slot contains the FITLOOP wordmark. Menu and close icon SVGs, dimensions, colors, transitions and menu spacing remain sourced. Keyboard focus management, Escape and inert controls are implemented locally.

The bottom strip is160px tall on desktop and112px on mobile, full width, with square white cards, source photographs and fine#b8bec6 dividers retained from the prior approved version. Only the four photographed Purple items remain. The prior18px/s movement now uses translateX to travel RIGHT TO LEFT. Hover freezes instantly and resumes from the same offset; manual pause, keyboard, wheel and touch controls remain.

The newest supplied artwork replaces the goggles photo in both intro and hero. ImageGen removed screenshot controls, bottom wording, small signature and text on the magenta tag, retaining the figure and chain. No typography was generated. The cleaned1672×940 bitmap is hero-illustration-clean-v4.png. It remains unblurred on disk; the site applies the existing20px blur.

The art's observed nonwhite bounds are x575..1116,y0..900. The original figure is centered and fitted inside the area ABOVE the wardrobe strip, with32px breathing room per side. The background stage clips at the strip's top edge, so products do not overlap the artwork. The centered text container uses that same upper region; this is the deliberate height exception to the reference's full-screen container. Existing copy uses its supplied line breaks for readability over the narrower dark figure.

After intro, the background gently moves continuously:9s cycle,translate up to6px/4px,rotation-.35 to.3deg,scale1.025–1.045. This is a custom requested animation inspired by the source intro ending. It is disabled for reduced-motion preferences. The previous clear goggle cutout and all of its projection code are removed.

## Verification

- Syntax check passed.
-1440×900:heading center719.996px,stage1440×740,strip1440×160 at y740; exact source grid x positions; no cutout; no horizontal overflow; browser console has no errors.
-390×844:heading centered at195px,stageheight732,strip390×112 at y732; navbar40×40 at16,16; grid40/195/350; no overflow. Figure is fully contained above the strip.
- Menu opens/closes via button and Escape; menu computed fillrgba(0,0,0,.8),item16px/20px,margin32px,separator100×1px, matching reference. Hero and strip are inert while menu is open. Navigation links keep real destinations.
- Intro completes; after it the background animation name isglass-afterglow. Separate browser observations show the background transform changing and strip offset advancing97.00→417.09.
- Four product images remain centered and unchanged; cells stay white. The strip moves horizontally with hover stop/resume retained from the tested prior implementation.
