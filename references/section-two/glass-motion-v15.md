# Glass menu and horizontal-only split correction

The supplied first screenshot identifies the menu button on the white screen: retain the original hero grey fill/white bars, rather than the inverted outlined appearance. Existing source dimensions remain40×40; original background rgba(0,0,0,.2) and border rgba(255,255,255,.4) remain. A counter-invert on the button cancels the navbar ink inversion, while the logo remains dark on white. Open-menu state resets both filters. Glass blur is5px, reused from the approved hero CTA.

Two independent vertical movements were removed: renderOpening’s changing imageY parallax and the page-screen translateY enter/exit rules. Images now have a constant transform(0,0,0); the halves retain the exact source smoothstep X displacement. The requested zoom into the white corner remains a separate phase after closure.

An opaque white wash finishes the zoom across the whole viewport. Source/destination classes then swap with transitions temporarily disabled for two animation frames. This avoids a moving section edge and the old double-opacity blend over black. Reverse navigation uses the same white surface before unzoom/open.

Latest spacing request applies to the step shown in the attachment (CREATE A COMBINATION and its description). The desktop title/copy coordinate offset is now28px, the existing tablet/mobile source value, replacing50px. With the24px centered title line, visible title-bottom to copy-top gap is16px.

Desktop1280×720 verification: visible title-bottom to copy-top gap is16px. In the closing phase, section transform is none, frame is matrix(1,0,0,1,0,0), both image transforms are matrix(1,0,0,1,0,0), while the two half transforms change only their X component. The original source X travel at this viewport is390px. Syntax check passes.

White destination verification: wash opacity1 and no leftover white-handoff class; menu button background rgba(0,0,0,.2), blur5px, counter-filter invert1, producing original grey fill/white bars. Menu opens/closes. Mobile390×844 reverse finishes at finale with split±180px, image Y0, section transform none, wash opacity0 and no handoff class. Browser reports no script errors.
