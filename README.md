ORION BLACK

Every mark is a decision. Every decision is permanent.

A high-end interactive tattoo studio site, built to awards-site standards — cinematic scroll, a custom WebGL ink shader, and a scroll-reactive grain layer, wrapped around a real booking flow.

Benchmarked against: Active Theory, Resn, Fantasy Interactive.


What this is

Not a template. Not a component library. A handcrafted, single continuous scroll built section by section, with a real performance budget behind every effect.

SectionConceptKey interactionS1 — HeroCinematic entryVideo crushes through contrast/saturation, then dissolves into a live WebGL ink shader as you scrollS2 — WorkEditorial identitySticky featured image, word-by-word text reveal, horizontal work stripS3 — BookingDesire + urgencyStudio flashlight background effect, full two-step booking modalS4 — ArchiveClose the worldAsymmetric image grid, scramble/glitch statement, live clock, footer

Sections 3 and 4 are code-split and only mount once you scroll near them — the WebGL hero loads eagerly, everything downstream of it doesn't cost you a byte until it's needed.

Stack


React 19 + Vite 7
Tailwind CSS 4
GSAP 3 + ScrollTrigger — every scroll-driven animation in the site
Lenis — smooth scroll, synced into GSAP's ticker so ScrollTrigger reads Lenis' scroll position, not the native one
React Three Fiber + Three.js — the hero's WebGL canvas
Custom GLSL — hand-written vertex + fragment shaders for the ink effect (no shader library)
Redux Toolkit — small UI slice for cross-section state


Architecture

src/
├── App.jsx                    ← Lenis setup, preloader gate, section mount order
├── lib/
│   ├── gsap.js                 ← GSAP registration + useIsVisible intersection hook
│   └── performance.js          ← device-tier profiling (see below)
├── components/
│   ├── Preloader.jsx
│   ├── NoiseLayer.jsx           ← global canvas grain, adaptive FPS
│   ├── DeferredSection.jsx      ← lazy-mounts a section once it's near the viewport
│   ├── LazyImage.jsx
│   ├── Section1/
│   │   ├── Section1.jsx         ← orchestrator
│   │   ├── Video.jsx            ← hero video, scroll-driven crush
│   │   ├── WebGLScene.jsx       ← R3F canvas, custom FBM ink shader
│   │   ├── CurvedLoop.jsx
│   │   └── Text.jsx
│   ├── Section2/
│   │   ├── WorkSection.jsx      ← orchestrator
│   │   ├── Image.jsx
│   │   ├── Text.jsx
│   │   └── WorkStrip.jsx
│   ├── Section3/
│   │   ├── Section3.jsx         ← orchestrator (lazy-loaded)
│   │   ├── StudioBackground.jsx
│   │   ├── BookingHeadline.jsx
│   │   ├── BookingCTA.jsx
│   │   ├── BookingModal.jsx     ← two-step booking flow, local state only
│   │   └── ProcessList.jsx
│   └── Section4/
│       ├── Section4.jsx         ← orchestrator (lazy-loaded)
│       ├── Background.jsx
│       ├── Grid.jsx
│       ├── ImageCard.jsx
│       ├── GlitchStatement.jsx  ← scramble/settle text effect
│       ├── Counter.jsx
│       ├── Clock.jsx
│       └── Footer.jsx
└── app/store.js                ← Redux store

The ink shader

The hero's WebGL scene runs a hand-written GLSL shader — no noise package, no shader library:


6-octave fractal Brownian motion (FBM) built on a hash-based value noise function
Mouse-driven ripple: distance-to-cursor feeds a damped sine wave into the vertex displacement
A scroll-controlled dissolve uniform blends the ink surface in as the hero video fades out


Performance engineering

This is the part that doesn't show up in a screenshot. lib/performance.js profiles the device on load — touch capability, hover support, deviceMemory, hardwareConcurrency — and derives a full quality tier from it:


WebGL pixel ratio and shader mesh segment count both scale down on low-end/touch devices
Grain and noise layers run at a capped, device-appropriate frame rate (as low as 10fps on low-end hardware) instead of every frame
DeferredSection uses an intersection observer to keep Sections 3 and 4 out of the bundle's critical path entirely until they're within 1200–1400px of the viewport


Booking flow

A real two-step modal — name, date, time, style, idea, then a confirmation screen with a booking summary. No backend, all state local (useState); built to prove out the full interaction, not just the UI shell.

Code conventions


const arrow functions only, no function declarations
export default at the bottom of every file
Tailwind for layout/spacing/type/color; style={{}} reserved for gradients, willChange, mixBlendMode, and anything GSAP animates directly
No clamp() — responsive breakpoints instead
One JSX prop per line


Running it locally

bashnpm install
npm run dev      # http://localhost:5174
npm run build

Status

Actively in progress — mobile performance pass most recently in flight. Sections 1–4 are functionally complete; polish (cursor treatment, inter-section transitions) is the next layer being added on top of the current build.
