# Local42 — not published

Local only at127.0.0.1:8039. Last production remains V41; no source push or Sites deployment performed.

Changes:10-second BACK hint on entering fitting room from a saved card; GO TO link left aligned below Save, hidden initially in a scroll viewport. Bottom product/filter/Save group moved down3px on desktop. Selector right edge retained, excess name/counter gap halved from the natural300px layout (at1280px two looks: width245.992px). Saved-card pencil removed. TRY FITLOOP FREE replaced with TRY FITLOOP in both entry HTML files.

Desktop rail: left Refresh/right Replace share cell center, native hero128×50,14px/18px600,padding6×8,50→128px easing copied. max-width override avoids accidental80px clamp inside half-card targets. Hover pauses scrolling, including after mouse release; touch click-toggle/drag unchanged. Already-applied jacket/current trousers trigger2400ms fading message in the card, AvenirNext Regular12px/20px from .saved-empty. Repeated taps restart feedback.

Browser QA1280×720: BACK returns to #saved; Save completes and unlocks with panel closed; GO TO returns to saved collection; no pencil icons or FREE button labels remain. Panel viewport clientHeight620,scrollHeight669, initial scrollTop0; link starts at y732 (below720px viewport), scroll49 reveals it at y683; left alignment x56 matches Save. Product hover feedback shown at same card; offset350.91 remains unchanged across click and message expiry. Clean final browser logs. Existing8 navigation tests pass, JavaScript syntax checks pass.

Local server intentionally left running for user review. Screenshots: panel-scrolled.png,back-hint.png,garment-feedback.png.
