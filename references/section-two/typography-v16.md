# Typography reuse — 30 October 2026

User mapping: photo1 label → hero YOUR NEXT SELF; step title in photo3 → hero FITLOOP. The user explicitly chose to preserve existing step title sizes while copying type appearance.

Source/computed styles inspected before editing at1440×900 and390×844:

| Source | Desktop | Mobile |
| --- | --- | --- |
| Hero h1 | AvenirNext, weight900,60px, line-height normal, tracking1px, uppercase, #fff | same except45px |
| Hero tagline | AvenirNext, weight400,12px, normal, tracking16.32px, uppercase, #fff, margin-left14px |9px, tracking12.29px, margin-left12px |
| Previous step title |20px/24px, weight600, trackingnormal |11px/18px, weight600 |
| Previous label |12px/16px, tracking.54px |10px inherited16px line |

The hero and step selectors now share a single declaration for family, weight, style, normal line-height, tracking, white colour and uppercase. Step title sizes remain20px desktop/11px mobile by explicit user preference. Caption spans share the complete tagline typography, including size, tracking and margin changes at the existing767px breakpoint.

Label spans are laid out as centered overlapping grid cells with intrinsic widths, so the new wide tracking is not clipped to the old photo-width label box. The row collision calculation measures the currently visible label span and smoothly includes its horizontal bounds near the label, preserving the existing photo clearance and scroll behavior.

Desktop verification: caption fontFamily/fontSize/fontWeight/fontStyle/lineHeight/letterSpacing/color/textTransform/marginLeft exactly match the hero tagline (12px/400/normal,16.32px tracking,14px margin). Step title exactly matches the hero h1’s family/900/normal/1px/white/uppercase, with approved20px size exception. Caption intrinsic box is411.5×16.5px, centered above the image without clipping. Collision shift is bounded by the measured dark gap so the heavier mobile titles stay clear of the side strips.

Mobile390×844 verification: all9 inspected caption style properties exactly match the hero tagline:9px/400/normal, tracking12.29px and margin12px. Step titles retain11px and match900/normal/1px/uppercase/white. Longest caption span is298.98×12.5px and fits within the360px dark gap. At the second-step image crossing, title fragments stay at x15–375; body fragments stay inside the same bounds. Existing pairing, line dividers and scroll positions remain in place. No browser script errors; JavaScript syntax passes.
