# V37 measurements and verification

Typography matched against V35 source commit045eb15cb18bb299a8e9919a9a98f67c62012aff and live V36 computed styles before editing: selector/LOOK/count40010px/13.2px AvenirNext, input60010px/13.2px AvenirNext, normal tracking, input text-transform:none. No font files replaced. These exact values are explicitly pinned so later styles cannot change them. The selector width300px, three24px thumbnails,8px gaps and16-grapheme name limit are retained.

Browser QA: during opening the panel transform was translateX(-16.5949px) while the left line scaleY was0, transition delay0.65s. The panel keeps its native0.65s opening; the lines then reveal from the top over0.9s. On390×844 the kicker top is136px and bottom149.203125px; the heading top remains153.203125px, leaving4px visible clearance instead of8px.

Clicking a garment produced exactly one is-action-open card with both action buttons visible; the rail offset remained441.36 across separate browser calls. A second click on that same card closed it and cleared actionPaused. Reopening and clicking empty background also closed it and cleared actionPaused. Mobile action visibility is hidden before selection. Three models were created/selected through UI without console errors; intermediate transforms remain continuous.

Regression navigation tests:4 passed. JavaScript syntax and git diff whitespace checks passed. Screenshots are direct browser captures, not generated edits.
