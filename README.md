ORION BLACK

Every mark is a decision. Every decision is permanent.

A high-end interactive tattoo studio website built to awards level.
Cinematic scroll, ink fluid shaders, morphing cursor, page transitions.
The standard: Active Theory. Resn. Fantasy Interactive.

LIVE DEMO
orionblack.studio — Appointment only. Brooklyn, NY.

WHAT THIS IS
Not a template. Not a component library.
A handcrafted interactive system built section by section,
decision by decision, with intention at every layer.
Four sections. One continuous experience.
SectionConceptKey interactionS1 — HeroCinematic entryVideo → ink WebGL dissolve on scrollS2 — WorkEditorial identitySticky image + word-by-word reveal + horizontal stripS3 — BookingDesire + urgencyStudio flashlight + full booking modal flowS4 — ArchiveClose the worldAsymmetric grid + glitch statement + live clock

STACK
React 18 + Vite
Tailwind CSS
GSAP 3 + ScrollTrigger + SplitText (Club)
@studio-freight/lenis
React Three Fiber + Three.js
GLSL (custom vertex + fragment shaders)
React Router DOM

ARCHITECTURE
src/
├── App.jsx                  ← root, router, global systems
│
├── systems/
│   ├── GlobalCursor.jsx     ← morphing cursor, 6 states, velocity skew
│   ├── TransitionLayer.jsx  ← cinematic page exit/enter
│   ├── useLenis.js          ← smooth scroll, feeds gsap.ticker
│   └── useTransitionLink.js ← internal navigation hook
│
├── sections/
│   ├── S1/
│   │   ├── VideoHero.jsx    ← orchestrator
│   │   └── WebGLScene.jsx   ← R3F canvas, FBM ink shader
│   │
│   ├── S2/
│   │   ├── WorkSection.jsx  ← orchestrator
│   │   ├── FeaturedImage.jsx
│   │   ├── PhilosophyText.jsx
│   │   └── WorkStrip.jsx
│   │
│   ├── S3/
│   │   ├── BookingSection.jsx ← orchestrator
│   │   ├── StudioBackground.jsx
│   │   ├── BookingHeadline.jsx
│   │   ├── BookingCTA.jsx
│   │   ├── BookingModal.jsx
│   │   └── ProcessList.jsx
│   │
│   └── S4/
│       ├── Section4.jsx     ← orchestrator
│       ├── S4Background.jsx
│       ├── S4Counter.jsx
│       ├── S4Grid.jsx
│       ├── S4ImageCard.jsx
│       ├── S4GlitchStatement.jsx
│       ├── S4Clock.jsx
│       └── S4Footer.jsx
│
└── public/
    ├── hero.mp4
    ├── featured.jpg
    ├── work-01.jpg → work-03.jpg
    ├── studio-bg.jpg
    ├── archive-01.jpg → archive-06.jpg
    ├── noise.png
    └── favicon.svg

INSTALLATION
bash# clone
git clone https://github.com/yourhandle/orion-black.git
cd orion-black

# install
npm install

# install gsap club (requires license)
npm install gsap@npm:@gsap/shockingly-good

# dev
npm run dev

# build
npm run build

DEPENDENCIES
bashnpm install @studio-freight/lenis
npm install @react-three/fiber @react-three/drei three
npm install react-router-dom
npm install gsap        # or gsap club for SplitText

GSAP SplitText requires a Club GSAP license.
Free alternative: replace SplitText with a manual char split utility.


DESIGN SYSTEM
Colors
Background S1    #06050a
Background S2    #0c0b0f
Background S4    #07060b
Amber accent     #d4a96a
Opacity scale for text
Primary          white/75
Secondary        white/55
Tertiary         white/40
Labels           white/25
Ghost            white/18
Fonts
Display     Bebas Neue          — headlines, numbers, OB mark
Serif       Cormorant Garamond  — subtext, philosophy, CTA (italic 300/400)
Mono        DM Mono             — labels, metadata, UI, clock (300)
Cursor states
data-cursor="view"   — image areas, content
data-cursor="drag"   — scrollable strips
data-cursor="book"   — booking CTA
data-cursor="open"   — links, nav items

KEY INTERACTIONS
Video → WebGL Dissolve
S1 scroll crushes the video through contrast/saturation,
then fades it out as the ink fluid shader fades in.
The WebGL shader uses 6-octave FBM noise with mouse-driven
wave interference and a scroll-controlled dissolve threshold.
GlobalCursor
Two-layer system — amber ring (lagged lerp 0.08) + 4px dot (instant).
Reads lenis.velocity every frame: cursor ring skews on mouse movement,
squishes vertically during fast scroll. Six states morph via data-cursor.
No manual onMouseEnter handlers anywhere in the codebase.
Lenis → GSAP sync
jslenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)
Every ScrollTrigger in the site runs off Lenis, not native scroll.
Momentum carries between sections.
Booking Modal
Two-step flow — no backend, no redirect.
Step 1: name / date / time (dropdown) / style (pill select) / idea
Step 2: custom confirmation with booking summary
All state in useState. GSAP animates mount/unmount.
S4 Grain
Canvas noise runs at 60fps. Reads lenis.velocity and lerps
grainIntensity from base 14 toward 14 + vel * 3.5.
Scroll fast → grain gets heavy. Stop → it smooths back.
mix-blend-mode: overlay — sits above everything without killing contrast.
Glitch Statement
ORIGINAL string is stored as truth.
Every 5 seconds: 14-frame scramble loop swaps ~35% of chars
with noise characters, settling left-to-right per frame.
Simultaneously scrubbed x: 20vw → -12vw by ScrollTrigger.

ANIMATION RULES
All animations live inside gsap.context() with ctx.revert() cleanup.
js// entry — always blur + y, never opacity alone
gsap.set(video, { filter: 'blur(16px) brightness(0.4) saturate(0)' })

// headline — SplitText 3D char flip
gsap.set(chars, { opacity: 0, y: 80, rotateX: -90, transformOrigin: '50% 50% -40px' })
gsap.to(chars, { opacity: 1, y: 0, rotateX: 0, stagger: 0.025, ease: 'power4.out' })

// clip-path reveal — left to right
gsap.from(el, { clipPath: 'inset(0 100% 0 0)', ease: 'power3.out' })

// magnetic button — elastic spring back
gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' })

IMAGE ASSETS
All images generated via Google Whisk.
See whisk-prompts.md for complete Subject/Scene/Style prompts per image.
Generation order:
featured.jpg → work-01–03 → studio-bg.jpg → archive-01 → archive-02–06
Each approved image feeds as Whisk's style reference into the next.
This locks grain, amber tone, and shadow angle as a consistent set.

INTERNAL NAVIGATION
Never use <a href> for internal routes.
All navigation goes through the transition system.
jsimport useTransitionLink from './useTransitionLink'
const go = useTransitionLink()

// fires cinematic exit → navigate → cinematic enter
go('/portfolio')
Anchor links use scrollIntoView:
jsdocument.getElementById('book').scrollIntoView({ behavior: 'smooth' })

CODE CONVENTIONS
const + arrow functions only
export default at the bottom of every file
Tailwind for layout / spacing / type / color / responsive
style={{}} only for: gradients, fontFamily, willChange,
           mixBlendMode, clipPath, perspective, keyframe refs,
           and anything GSAP animates directly
No clamp() — use sm: md: lg: breakpoints
One JSX prop per line
Data above component, export below
Minimal comments — only on complex logic

BROWSER SUPPORT
Chrome 100+   ✓
Firefox 100+  ✓
Safari 15+    ✓
Mobile        ✓ (cursor disabled on touch, grain canvas paused)

PERFORMANCE TARGETS
LCP    < 2.5s
FID    < 100ms
CLS    < 0.1
Shader dpr   capped at 1.5 on mobile
Images       lazy loaded with blur placeholder