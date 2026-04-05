# ASCII Art Hero — Design Notes

## Current: ScrambleText

Plain text that decodes from random symbols on load, re-scrambles on mouse hover. Works well but simple.

## v2 Candidate: AsciiHero (bitmap + shimmer)

**Preview:** https://f0cac4d4.hooks-automate-builders.pages.dev/
**Commit:** `a7190ed` — first React build with AsciiHero component
**Source:** `src/components/AsciiHero.tsx` (still in repo, just not imported)

**What works:**

- Edge/fill two-tone rendering (bright edges, dim interior)
- Shimmer effect — characters subtly cycle through density chars
- Mouse hover scramble — nearby characters re-scramble on cursor
- Reveal animation — sweeps left to right on page load

**What needs fixing:**

- ASCII text is too big/chunky — needs higher resolution bitmap
- Current approach renders at 160px canvas, samples in 4x7 cells
- Need much denser grid — more "pixels" per letter, smaller display font
- Goal: Ghostty-style density where each ASCII char is a tiny dot in the shape

**Reference:**

- Ghostty animation: https://codepen.io/Stimmler/pen/mydOVPd
- Ghostty frames JSON: https://gist.githubusercontent.com/DerStimmler/9168e34a5fdcd5cbfd4d2007fb552f74/raw/ghostty-animation-frames.json
- ASCII art techniques: https://pierce.dev/notes/making-an-ascii-animation
- gostty (Go implementation): https://github.com/ashish0kumar/gostty

**Approach for v2:**
Pre-render frames offline (Python/Rust script) that converts large text to a high-res ASCII grid, outputs as JSON frame array. Load and cycle frames at 30fps in the browser, like the Ghostty CodePen does. This bypasses the browser canvas sampling issues.
