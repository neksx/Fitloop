# Local42 publication checks — 2026-11-04

Source: existing `dist/` served at http://127.0.0.1:8039/#next. Target: existing FITLOOP project, public audience, latest hosted version V41 at the time of inspection. No layout, asset, font, SVG, or responsive implementation changes were made during publication preparation.

## Observed computed desktop styles, 1280 × 720

| Element | Measured result |
| --- | --- |
| Look selector, two looks | x 994.0078, y 30, width 245.9922, height 40; padding 7px 8px; AvenirNext 400, 10px / 13.2px |
| Save | x 56, y 653, width 361.3281, height 50; bottom 17px; padding 14px 30px; AvenirNext 600, 16px / 20px |
| Panel viewport | x 40, y 100; width 393.3281, height 620; scrollHeight 669 |
| My saved looks link | x 56, y 732 before scrolling; AvenirNext 400, 10px / 13.2px; padding-bottom 24px |
| Desktop garment action badge | height 50; AvenirNext 600, 14px / 18px; padding 6px 8px; rest width 50, hover target 128 per retained CSS |

Values match the existing local42 review notes. The panel link opens #saved; View Look opens #next. Saved cards expose View and Delete without edit buttons. No warning/error console entries were recorded during this check.

All eight existing section-navigation tests pass. All `dist/*.js` syntax checks pass. Both entry pages load `local-review.css` and omit the old TRY FITLOOP FREE label.
