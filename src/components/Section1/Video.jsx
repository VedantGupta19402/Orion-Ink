import { Suspense, memo, startTransition, useCallback, useEffect, useRef, useState } from 'react'
import CurvedLoop from './CurvedLoop'
import { emitSiteNotice, scrollToSection } from '../../pages/utils/siteEvents'
import { gsap, SplitText } from '../../lib/gsap'
import { lazyWithPreload, usePerformanceProfile } from '../../lib/performance'
import { useIsVisible } from '../../lib/gsap'

const WebGLScene = lazyWithPreload(() => import('./WebGLScene'))

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
  const ctaXToRef = useRef(null)
  const ctaYToRef = useRef(null)
  const hasRequestedWebGLRef = useRef(false)

  const dissolveRef = useRef(0)
  const mouseRef = useRef({ x: 0, y: 0 })
  const cursorPos = useRef({ x: 0, y: 0 })
  const targetPos = useRef({ x: 0, y: 0 })
  const [shouldLoadWebGL, setShouldLoadWebGL] = useState(false)

  const profile = usePerformanceProfile()
  const isHeroVisible = useIsVisible(containerRef, {
    rootMargin: '300px 0px',
    threshold: 0.15,
    initial: true,
  })

  useEffect(() => {
    if (!profile.cursorEnabled) return undefined

    const onMove = (event) => {
      mouseRef.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -((event.clientY / window.innerHeight) * 2 - 1),
      }

      targetPos.current = { x: event.clientX, y: event.clientY }
    }

    window.addEventListener('pointermove', onMove, { passive: true })

    let raf = 0
    const tick = () => {
      cursorPos.current.x = lerp(cursorPos.current.x, targetPos.current.x, 0.08)
      cursorPos.current.y = lerp(cursorPos.current.y, targetPos.current.y, 0.08)

      if (cursorRef.current && isHeroVisible) {
        cursorRef.current.style.transform = `translate(${cursorPos.current.x - 20}px, ${cursorPos.current.y - 20}px)`
      }

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [isHeroVisible, profile.cursorEnabled])

  useEffect(() => {
    if (!profile.hoverFxEnabled || !ctaRef.current) return undefined

    ctaXToRef.current = gsap.quickTo(ctaRef.current, 'x', {
      duration: 0.4,
      ease: 'power2.out',
    })

    ctaYToRef.current = gsap.quickTo(ctaRef.current, 'y', {
      duration: 0.4,
      ease: 'power2.out',
    })

    return undefined
  }, [profile.hoverFxEnabled])

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
          anticipatePin: 1,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            dissolveRef.current = Math.max(0, (self.progress - 0.6) / 0.35)

            if (!hasRequestedWebGLRef.current && self.progress >= 0.52) {
              hasRequestedWebGLRef.current = true
              startTransition(() => setShouldLoadWebGL(true))
            }
          },
        },
      })

      tl.to(video, { scale: 1.06, ease: 'none' }, 0)
      tl.to(video, { scale: 1.18, filter: 'contrast(1.2) saturate(1.15) brightness(0.92)', ease: 'none' }, 0.28)
      tl.to(content, { opacity: 0, y: -90, ease: 'none' }, 0.35)
      tl.to(video, { scale: 1.3, filter: 'contrast(1.6) saturate(0.4) brightness(0.3)', ease: 'none' }, 0.6)
      tl.to(video, { opacity: 0, ease: 'none' }, 0.82)
      tl.to(webgl, { opacity: 1, ease: 'none' }, 0.84)

      return () => split.revert()
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const onCtaMove = useCallback((event) => {
    if (!profile.hoverFxEnabled || !ctaXToRef.current || !ctaYToRef.current) return

    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left - rect.width / 2
    const y = event.clientY - rect.top - rect.height / 2
    ctaXToRef.current(x * 0.35)
    ctaYToRef.current(y * 0.35)
  }, [profile.hoverFxEnabled])

  const onCtaLeave = useCallback(() => {
    if (!profile.hoverFxEnabled || !ctaXToRef.current || !ctaYToRef.current) return

    ctaXToRef.current(0)
    ctaYToRef.current(0)
    gsap.to(ctaRef.current, { duration: 0.6, ease: 'elastic.out(1, 0.5)', x: 0, y: 0 })
  }, [profile.hoverFxEnabled])

  const expandCursor = useCallback(() => {
    if (!profile.cursorEnabled || !cursorRef.current) return
    gsap.to(cursorRef.current, { scale: 3.5, opacity: 0.6, duration: 0.3 })
  }, [profile.cursorEnabled])

  const collapseCursor = useCallback(() => {
    if (!profile.cursorEnabled || !cursorRef.current) return
    gsap.to(cursorRef.current, { scale: 1, opacity: 1, duration: 0.3 })
  }, [profile.cursorEnabled])

  return (
    <>
      {profile.cursorEnabled && (
        <div
          ref={cursorRef}
          className="pointer-events-none fixed left-0 top-0 z-[999999] h-10 w-10 rounded-full"
          style={{ border: '1px solid rgba(212,169,106,0.7)', mixBlendMode: 'difference', willChange: 'transform' }}
        />
      )}

      <div className="h-[300vh]">
        <section
          ref={containerRef}
          className="sticky top-0 h-svh overflow-hidden bg-[#06050a]"
          style={{ cursor: profile.cursorEnabled ? 'none' : 'auto' }}
        >
          <div ref={webglRef} className="absolute inset-0 z-0 opacity-0">
            {isHeroVisible && shouldLoadWebGL && (
              <Suspense fallback={null}>
                <WebGLScene dissolveRef={dissolveRef} mouseRef={mouseRef} active={isHeroVisible} />
              </Suspense>
            )}
          </div>

          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            fetchPriority="high"
            src="/Ink.mp4"
            className="absolute inset-0 z-[1] h-full w-full object-cover"
            style={{ transformOrigin: 'center center', willChange: 'transform, filter' }}
          />

          <div
            className="pointer-events-none absolute inset-0 z-[2]"
            style={{
              background: `
                radial-gradient(ellipse 70% 60% at 30% 40%, rgba(180,80,20,0.12), transparent 65%),
                radial-gradient(ellipse 60% 60% at 75% 65%, rgba(10,40,80,0.15), transparent 65%),
                radial-gradient(ellipse 90% 80% at 50% 50%, transparent 35%, rgba(4,3,8,0.85) 100%)
              `,
            }}
          />

          <div
            className="pointer-events-none absolute inset-0 z-[3]"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.06) 0px, rgba(0,0,0,0.06) 1px, transparent 1px, transparent 4px)',
              animation: 'scanline 10s linear infinite',
            }}
          />

          <div
            className="pointer-events-none absolute inset-0 z-[4]"
            style={{ background: 'linear-gradient(to bottom, rgba(6,5,10,0.6) 0%, transparent 22%, transparent 68%, rgba(6,5,10,0.88) 100%)' }}
          />

          <div
            ref={contentRef}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
          >
            <div
              ref={badgeRef}
              onMouseEnter={expandCursor}
              onMouseLeave={collapseCursor}
              className="mb-8 flex items-center gap-2 rounded-full px-[18px] py-[6px]"
              style={{ border: '1px solid rgba(212,169,106,0.2)', backdropFilter: 'blur(12px)', background: 'rgba(212,169,106,0.05)' }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full bg-[#d4a96a]"
                style={{ animation: 'dot-breathe 2.6s ease-in-out infinite' }}
              />
              <span
                className="text-[11px] uppercase tracking-[0.24em] italic text-[rgba(212,169,106,0.7)]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Accepting bookings
              </span>
            </div>

            <h1
              ref={titleRef}
              className="
                mx-auto text-center text-7xl leading-none text-white
                tracking-[0.18em] md:text-[10rem] md:tracking-[0.24em] lg:text-[148px]
              "
              style={{ fontFamily: "'Bebas Neue', sans-serif", perspective: '800px' }}
            >
              <span className="block md:inline">ORION</span>
              <span className="block md:inline">BLACK</span>
            </h1>

            <div
              ref={lineRef}
              className="my-5 h-px w-12"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(212,169,106,0.7), transparent)' }}
            />

            <p
              ref={subRef}
              className="m-0 text-sm font-light italic tracking-[0.32em] text-white/40 md:text-base"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Stories Written in Color
            </p>

            <button
              type="button"
              ref={ctaRef}
              onClick={() => {
                scrollToSection('#selected-works')
                emitSiteNotice({
                  title: 'Selected works below',
                  message: 'The portfolio stays inside this prototype, so we moved you straight to the showcase section.',
                })
              }}
              onMouseMove={onCtaMove}
              onMouseEnter={(event) => {
                expandCursor()
                event.currentTarget.style.color = '#fff'
                event.currentTarget.style.borderColor = 'rgba(212,169,106,0.5)'
              }}
              onMouseLeave={(event) => {
                onCtaLeave()
                collapseCursor()
                event.currentTarget.style.color = 'rgba(255,255,255,0.55)'
                event.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'
              }}
              className="mt-10 rounded-full px-10 py-3 text-[13px] uppercase italic tracking-[0.22em] transition-colors duration-300"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                color: 'rgba(255,255,255,0.55)',
                border: '1px solid rgba(255,255,255,0.14)',
                backdropFilter: 'blur(10px)',
                background: 'transparent',
              }}
            >
              View Portfolio
            </button>
          </div>

          <div className="absolute bottom-24 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2">
            <span
              className="text-[9px] uppercase italic tracking-[0.35em] text-white/20"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              scroll
            </span>
            <div
              className="h-10 w-px"
              style={{ background: 'linear-gradient(to bottom, rgba(212,169,106,0.4), transparent)' }}
            />
          </div>

          <span
            className="absolute left-6 top-5 z-10 text-[10px] uppercase italic tracking-[0.2em] text-white/[0.18]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            (c) 2025
          </span>
          <span
            className="absolute right-6 top-5 z-10 text-[10px] uppercase italic tracking-[0.2em] text-white/[0.18]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            est. mmxxi
          </span>

          <div className="absolute bottom-0 left-0 z-10 w-full">
            <CurvedLoop
              marqueeText="ORION BLACK - TATTOO - IDENTITY - ART - TRANSFORMATION - "
              className="w-screen fill-[#E6EDF7] text-[28px] font-black uppercase italic opacity-[0.28] sm:text-[44px] md:text-6xl"
              speed={1.5}
            />
          </div>
        </section>
      </div>
    </>
  )
}

export default memo(Video)
