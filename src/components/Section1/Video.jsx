import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import WebGLScene from './WebGLScene'
import CurvedLoop from './CurvedLoop'

gsap.registerPlugin(ScrollTrigger, SplitText)

const lerp = (a, b, t) => a + (b - a) * t

const Video = () => {
  const containerRef = useRef(null)
  const videoRef = useRef(null)
  const webglRef = useRef(null)
  const contentRef = useRef(null)
  const titleRef = useRef(null)
  const subRef = useRef(null)
  const badgeRef = useRef(null)
  const ctaRef = useRef(null)
  const cursorRef = useRef(null)
  const lineRef = useRef(null)

  const dissolveRef = useRef(0)
  const mouseRef = useRef({ x: 0, y: 0 })
  const cursorPos = useRef({ x: 0, y: 0 })
  const targetPos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1),
      }
      targetPos.current = { x: e.clientX, y: e.clientY }
    }

    window.addEventListener('mousemove', onMove)

    let raf
    const tick = () => {
      cursorPos.current.x = lerp(cursorPos.current.x, targetPos.current.x, 0.08)
      cursorPos.current.y = lerp(cursorPos.current.y, targetPos.current.y, 0.08)
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cursorPos.current.x - 20}px, ${cursorPos.current.y - 20}px)`
      }
      raf = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const video = videoRef.current
      const webgl = webglRef.current
      const content = contentRef.current
      const title = titleRef.current
      const sub = subRef.current
      const badge = badgeRef.current
      const cta = ctaRef.current
      const line = lineRef.current

      const split = new SplitText(title, { type: 'chars' })
      const chars = split.chars

      gsap.set(video, { filter: 'blur(16px) brightness(0.4) saturate(0)' })
      gsap.set(webgl, { opacity: 0 })
      gsap.set(chars, { opacity: 0, y: 80, rotateX: -90, transformOrigin: '50% 50% -40px' })
      gsap.set([badge, line, sub, cta], { opacity: 0, y: 24 })

      gsap.to(video, {
        filter: 'blur(0px) brightness(1) saturate(1)',
        duration: 2.4,
        delay: 0.3,
        ease: 'power3.out',
      })

      gsap.to(chars, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 1.2,
        delay: 0.7,
        stagger: 0.04,
        ease: 'power4.out',
      })

      gsap.to([badge, line, sub, cta], {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 1.3,
        stagger: 0.12,
        ease: 'power3.out',
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=200%',
          scrub: 1.4,
          pin: true,
          onUpdate: (self) => {
            dissolveRef.current = Math.max(0, (self.progress - 0.6) / 0.35)
          },
        },
      })

      tl.to(video, { scale: 1.06, ease: 'none' }, 0)
      tl.to(video, { scale: 1.18, filter: 'contrast(1.2) saturate(1.15) brightness(0.92)', ease: 'none' }, 0.28)
      tl.to(content, { opacity: 0, y: -90, ease: 'none' }, 0.35)
      tl.to(video, { scale: 1.3, filter: 'contrast(1.6) saturate(0.4) brightness(0.3)', ease: 'none' }, 0.6)
      tl.to(video, { opacity: 0, ease: 'none' }, 0.82)
      tl.to(webgl, { opacity: 1, ease: 'none' }, 0.84)
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const onCtaMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    gsap.to(e.currentTarget, { x: x * 0.35, y: y * 0.35, duration: 0.4, ease: 'power2.out' })
  }

  const onCtaLeave = (e) => {
    gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' })
  }

  const expandCursor = () => gsap.to(cursorRef.current, { scale: 3.5, opacity: 0.6, duration: 0.3 })
  const collapseCursor = () => gsap.to(cursorRef.current, { scale: 1, opacity: 1, duration: 0.3 })

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;1,300&display=swap');
        * { cursor: none !important; }
        @keyframes scanline {
          from { transform: translateY(0); }
          to { transform: translateY(200px); }
        }
        @keyframes dot-breathe {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.7); opacity: 1; }
        }
      `}</style>

      {/* custom cursor */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-[9999]"
        style={{ border: '1px solid rgba(212,169,106,0.7)', mixBlendMode: 'difference', willChange: 'transform' }}
      />

      <div className="h-[300vh]">
        <section
          ref={containerRef}
          className="sticky top-0 h-svh overflow-hidden bg-[#06050a]"
        >

          {/* webgl */}
          <div ref={webglRef} className="absolute inset-0 z-0 opacity-0">
            <WebGLScene dissolveRef={dissolveRef} mouseRef={mouseRef} />
          </div>

          {/* video */}
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            src="/hero.mp4"
            className="absolute inset-0 w-full h-full object-cover z-[1]"
            style={{ transformOrigin: 'center center', willChange: 'transform, filter' }}
          />

          {/* colour grade */}
          <div
            className="absolute inset-0 z-[2] pointer-events-none"
            style={{
              background: `
                radial-gradient(ellipse 70% 60% at 30% 40%, rgba(180,80,20,0.12), transparent 65%),
                radial-gradient(ellipse 60% 60% at 75% 65%, rgba(10,40,80,0.15), transparent 65%),
                radial-gradient(ellipse 90% 80% at 50% 50%, transparent 35%, rgba(4,3,8,0.85) 100%)
              `,
            }}
          />

          {/* scanlines */}
          <div
            className="absolute inset-0 z-[3] pointer-events-none"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.06) 0px, rgba(0,0,0,0.06) 1px, transparent 1px, transparent 4px)',
              animation: 'scanline 10s linear infinite',
            }}
          />

          {/* top bottom fade */}
          <div
            className="absolute inset-0 z-[4] pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, rgba(6,5,10,0.6) 0%, transparent 22%, transparent 68%, rgba(6,5,10,0.88) 100%)' }}
          />

          {/* content */}
          <div
            ref={contentRef}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6"
          >

            {/* badge */}
            <div
              ref={badgeRef}
              onMouseEnter={expandCursor}
              onMouseLeave={collapseCursor}
              className="flex items-center gap-2 mb-8 px-[18px] py-[6px] rounded-full"
              style={{ border: '1px solid rgba(212,169,106,0.2)', backdropFilter: 'blur(12px)', background: 'rgba(212,169,106,0.05)' }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full bg-[#d4a96a]"
                style={{ animation: 'dot-breathe 2.6s ease-in-out infinite' }}
              />
              <span
                className="text-[11px] uppercase tracking-[0.24em] italic text-[rgba(212,169,106,0.7)]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Accepting bookings
              </span>
            </div>

            {/* title */}
            <h1
  ref={titleRef}
  className="
    text-white leading-none m-0
    text-7xl md:text-[10rem] lg:text-[148px]
    tracking-[0.18em] md:tracking-[0.24em]
    mx-auto text-center
  "
  style={{ fontFamily: "'Bebas Neue', sans-serif", perspective: '800px' }}
>
  <span className="block md:inline">ORION</span>
  <span className="block md:inline">BLACK</span>
</h1>

            {/* divider */}
            <div
              ref={lineRef}
              className="w-12 h-px my-5"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(212,169,106,0.7), transparent)' }}
            />

            {/* sub */}
            <p
              ref={subRef}
              className="text-sm md:text-base tracking-[0.32em] italic font-light m-0 text-white/40"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Stories Written in Color
            </p>

            {/* cta */}
            <a
              ref={ctaRef}
              href="/portfolio"
              onMouseMove={onCtaMove}
              onMouseEnter={(e) => {
                expandCursor()
                e.currentTarget.style.color = '#fff'
                e.currentTarget.style.borderColor = 'rgba(212,169,106,0.5)'
              }}
              onMouseLeave={(e) => {
                onCtaLeave(e)
                collapseCursor()
                e.currentTarget.style.color = 'rgba(255,255,255,0.55)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'
              }}
              className="mt-10 px-10 py-3 rounded-full text-[13px] tracking-[0.22em] uppercase italic no-underline transition-colors duration-300"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                color: 'rgba(255,255,255,0.55)',
                border: '1px solid rgba(255,255,255,0.14)',
                backdropFilter: 'blur(10px)',
              }}
            >
              View Portfolio
            </a>

          </div>

          {/* scroll hint */}
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
            <span
              className="text-[9px] tracking-[0.35em] uppercase text-white/20 italic"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              scroll
            </span>
            <div
              className="w-px h-10"
              style={{ background: 'linear-gradient(to bottom, rgba(212,169,106,0.4), transparent)' }}
            />
          </div>

          {/* corner labels */}
          <span
            className="absolute top-5 left-6 z-10 text-[10px] tracking-[0.2em] uppercase italic text-white/[0.18]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            © 2025
          </span>
          <span
            className="absolute top-5 right-6 z-10 text-[10px] tracking-[0.2em] uppercase italic text-white/[0.18]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            est. mmxxi
          </span>

          {/* marquee */}
          <div className="absolute bottom-0 left-0 w-full z-10">
            <CurvedLoop
              marqueeText="ORION BLACK • TATTOO • IDENTITY • ART • TRANSFORMATION • "
              className="w-screen fill-[#E6EDF7] opacity-[0.28] text-[28px] sm:text-[44px] md:text-6xl font-black uppercase italic"
              speed={1.5}
            />
          </div>

        </section>
      </div>
    </>
  )
}

export default Video