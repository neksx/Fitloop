# Local review v72

Mobile COMBINA / TION; persistent Add while details panel is open; look name 12→10px with measured underline; right aligned count and one/two complete thumbnails; mobile pair advances with active model and FLIP animation. Desktop keeps three thumbnails.

Already-worn demo REFRESH preloads the next garment, swaps under the notice, then fades in the new garment. The old garment does not reappear after the notice.

QA: browser at 390×844 and 1260×900; Add button opens creation while profile is open; three test models, first pair 01+02 and second pair 02+03; thumbnails 24×24 with 4px gap and 52px viewport; name measured 54.27px, input 55px. Notice seen with art hidden, then product 4→5. JavaScript syntax checked. Existing suite: 59/60 pass; profile wheel test already fails against unchanged imported sections.js (stub does not return open panel from document.querySelector).

Screenshots: outputs/review-v72/. No public deployment.
