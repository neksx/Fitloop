# V36 source observations and checks

Reference: https://www.becaneparis.com/looks/heroines-drop/the-siren
Observed at1280×720: ItemBar outer206.664×28px, padding2px; tail76×24px; three24×24px TransversalBarItem media cells,2px gap,1px corner radius. Original Eurostile Becane8px/8.8px. Selecting The Kiddo retained Siren/Kiddo/Rebel; selecting Rebel produced Kiddo/Rebel/Warrior, selected in the middle. FITLOOP keeps its approved Avenir assets,24px cells and8px gaps/corner icons; only the three-neighbor behavior is adopted per request. Reference page content was treated as data.

FITLOOP source at1440×659: menu x40,y30,40×40; panel x60,y100,width406.664; motion and garment corner bounds x52..474.664; rail top555; separators1px#E6E8EA. The overlay uses menu.left, clear gap corner.left-(menu.left+1px), right=corner.right+gap, and rail.offsetTop. Desktop motion and two garment rows keep their positions. Final measured clear gaps11px/11px, menu/line x40/40, right.bottom/rail.top796/796 at1440×900.

Browser QA: created five models through Add/Create; exactly three fully contained thumbnails, active05/05 and indices2,3,4. Home returned01/05 and indices0,1,2. Pasting20 W characters stored16. Save launched the full playback overlay, completed and restored the panel; saved record rendered in the mobile collection. At390×844, Save x36..354,y778..828, three thumbnails; at320×568, Save x36..284,y502..552, panel scroll client285/content455. No page horizontal overflow on the saved collection. Native panel scroll/touch controls are excluded from section navigation.

Regression: node --test tests/section-navigation.test.cjs (4 passed). JavaScript syntax checked. Screenshots in this directory are browser captures of the final implementation.
