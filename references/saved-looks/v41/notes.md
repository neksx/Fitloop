# V41 — desktop Saved Looks cursor

Exact paths copied from the approved output/fitloop-cursor-concept SVG:36×36,8px corner arms,1px corner stroke; arrow path M12.5 23.5 23.5 12.5 M12.5 12.5H23.5V23.5,1.5px stroke. Background arrow#171816/corners#B2B2B2; portrait arrow#FFFFFF/corners#E6E8EA. No fill, blur or shadow. Desktop gate reuses(min-width:768px) and(hover:hover) and(pointer:fine).

A native accessible button covers the card body below its unchanged header. Cursor is a pointer-events:none SVG inside that button. Position follows pointer with reduced-motion support. Color uses actual rendered canvas alpha, compensating for object-fit padding. One silhouette read is cached per portrait; it is cleared when the portrait loads. Existing edit/delete actions remain separate.

Browser QA1280×720: body click target x40 y146,384×544; cursor exactly36×36. At white point100,400: arrow rgb23,24,22; corners178,178,178; background transparent, backdrop-filter none. At model232,400: arrow255,255,255; corners230,232,234. Click white area80,500 navigates to #next. Edit Look02 opens its details panel. Console errors/warnings absent.

Mobile375×812: SVG display:none; View Look text visible; original button x102.5 y694,170×50,14px text,rgba153,153,153,.7 and blur5px retained. Original permanent outer frames remain. Mobile button reveal and700ms crossfade still complete into #next without errors. Viewport override reset after QA.

Screenshot desktop-cursor.png is a real browser image at1280×720.
