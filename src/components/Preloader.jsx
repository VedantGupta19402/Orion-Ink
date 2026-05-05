import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#∆Ω≈'
const TITLE   = 'ORION BLACK'

const Preloader = ({ onComplete }) => {
  const wrapRef      = useRef(null)
  const panelTopRef  = useRef(null)
  const panelBotRef  = useRef(null)
  const panelMidRef  = useRef(null)
  const charsRef     = useRef([])
  const lineRef      = useRef(null)
  const subRef       = useRef(null)
  const counterRef   = useRef(null)
  const progressRef  = useRef(null)
  const inkCanvasRef = useRef(null)

  // — ink bleed canvas —
  useEffect(() => {
    const canvas = inkCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight

    let drops = []
    let rafId

    const addDrop = () => {
      drops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 0,
        maxR: 80 + Math.random() * 160,
        speed: 0.6 + Math.random() * 1.2,
        alpha: 0.03 + Math.random() * 0.05,
      })
    }

    // seed a few drops
    for (let i = 0; i < 6; i++) addDrop()
    const dropInterval = setInterval(addDrop, 800)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drops = drops.filter(d => d.r < d.maxR)
      drops.forEach(d => {
        d.r += d.speed
        const grad = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r)
        grad.addColorStop(0, `rgba(212,169,106,${d.alpha})`)
        grad.addColorStop(0.5, `rgba(212,169,106,${d.alpha * 0.3})`)
        grad.addColorStop(1, 'rgba(212,169,106,0)')
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()
      })
      rafId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(rafId)
      clearInterval(dropInterval)
    }
  }, [])

  // — main timeline —
  useEffect(() => {
    document.body.style.overflow = 'hidden'

    const chars = charsRef.current
    const tl = gsap.timeline()

    // initial states
    gsap.set(chars,              { opacity: 0 })
    gsap.set(lineRef.current,    { scaleX: 0, transformOrigin: 'left' })
    gsap.set(subRef.current,     { opacity: 0, y: 10 })
    gsap.set(counterRef.current, { opacity: 0 })
    gsap.set(progressRef.current,{ scaleX: 0, transformOrigin: 'left' })

    // — phase 1: chars scramble in one by one —
    chars.forEach((el, i) => {
      if (!el) return
      const original = TITLE.replace(' ', '')[i] ?? ' '
      const isSpace   = TITLE[i] === ' '

      if (isSpace) {
        gsap.set(el, { opacity: 1 })
        return
      }

      const obj = { t: 0 }
      tl.to(obj, {
        t: 1,
        duration: 0.4,
        ease: 'power2.out',
        onUpdate: () => {
          if (!el) return
          const settled = obj.t > 0.75
          el.textContent = settled
            ? original
            : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
          el.style.opacity = Math.min(obj.t * 3, 1)
        },
        onComplete: () => {
          if (el) el.textContent = TITLE[i] === ' ' ? '\u00A0' : TITLE[i]
        },
      }, i * 0.07)
    })

    // — phase 2: supporting elements —
    tl.to(lineRef.current, {
      scaleX: 1,
      duration: 1,
      ease: 'power3.out',
    }, 0.5)

    tl.to(subRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power3.out',
    }, 0.8)

    tl.to(counterRef.current, {
      opacity: 1,
      duration: 0.4,
    }, 0.3)

    // — phase 3: counter + progress bar —
    const count = { val: 0 }
    tl.to(count, {
      val: 100,
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (counterRef.current) {
          const v = Math.round(count.val)
          counterRef.current.textContent = v < 10 ? `0${v}` : `${v}`
        }
        if (progressRef.current) {
          progressRef.current.style.transform = `scaleX(${count.val / 100})`
        }
      },
    }, 0.2)

    // — phase 4: hold —
    tl.to({}, { duration: 0.4 }, 2.4)

    // — phase 5: content exits —
    tl.to(chars, {
      opacity: 0,
      y: -16,
      stagger: 0.02,
      duration: 0.4,
      ease: 'power2.in',
    }, 2.7)

    tl.to([subRef.current, lineRef.current], {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
    }, 2.75)

    tl.to(counterRef.current, {
      opacity: 0,
      duration: 0.25,
    }, 2.75)

    // — phase 6: 3-panel shutter exit —
    // mid panel slides left first, then top + bot split
    tl.to(panelMidRef.current, {
      xPercent: -100,
      duration: 0.7,
      ease: 'power4.inOut',
    }, 3.0)

    tl.to(panelTopRef.current, {
      yPercent: -100,
      duration: 0.9,
      ease: 'power4.inOut',
    }, 3.2)

    tl.to(panelBotRef.current, {
      yPercent: 100,
      duration: 0.9,
      ease: 'power4.inOut',
    }, 3.2)

    tl.to(inkCanvasRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.in',
    }, 3.2)

    tl.call(() => {
      document.body.style.overflow = ''
      onComplete?.()
    }, [], 4.0)

    return () => {
      tl.kill()
      document.body.style.overflow = ''
    }
  }, [onComplete])

  return (
    <div
      ref={wrapRef}
      className="fixed inset-0 pointer-events-auto overflow-hidden"
      style={{ zIndex: 999999 }}
    >

      {/* ink bleed canvas — behind panels */}
      <canvas
        ref={inkCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />

      {/* mid panel — slides left */}
      <div
        ref={panelMidRef}
        className="absolute inset-0 bg-[#06050a]"
        style={{ zIndex: 1 }}
      />

      {/* top panel */}
      <div
        ref={panelTopRef}
        className="absolute top-0 left-0 w-full h-1/2 bg-[#06050a]"
        style={{ zIndex: 2, transformOrigin: 'top' }}
      />

      {/* bottom panel */}
      <div
        ref={panelBotRef}
        className="absolute bottom-0 left-0 w-full h-1/2 bg-[#06050a]"
        style={{ zIndex: 2, transformOrigin: 'bottom' }}
      />

      {/* content layer */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-6"
        style={{ zIndex: 3 }}
      >

        {/* title — individual char spans */}
        <h1
          className="flex items-center leading-none m-0"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          aria-label={TITLE}
        >
          {TITLE.split('').map((char, i) => (
            <span
              key={i}
              ref={(el) => (charsRef.current[i] = el)}
              className="inline-block text-5xl sm:text-6xl md:text-8xl tracking-[0.18em] text-white"
              style={{ opacity: 0 }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h1>

        {/* amber line */}
        <div
          ref={lineRef}
          className="w-16 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent, #d4a96a, transparent)',
            transformOrigin: 'left',
          }}
        />

        {/* sub */}
        <p
          ref={subRef}
          className="text-[10px] tracking-[0.38em] uppercase text-white/35 m-0"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          Brooklyn, NY — Est. 2021
        </p>

      </div>

      {/* top left label */}
      <span
        className="absolute top-7 left-8 text-[9px] tracking-[0.28em] uppercase text-white/20"
        style={{ zIndex: 3, fontFamily: "'DM Mono', monospace" }}
      >
        Loading
      </span>

      {/* counter */}
      <span
        ref={counterRef}
        className="absolute bottom-8 right-8 text-[11px] tracking-[0.15em] text-white/25"
        style={{ zIndex: 3, fontFamily: "'DM Mono', monospace" }}
      >
        00
      </span>

      {/* progress bar */}
      <div
        className="absolute bottom-0 left-0 w-full h-px"
        style={{ zIndex: 3, background: 'rgba(255,255,255,0.04)' }}
      >
        <div
          ref={progressRef}
          className="h-full w-full"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(212,169,106,0.5))',
            transformOrigin: 'left',
            transform: 'scaleX(0)',
          }}
        />
      </div>

    </div>
  )
}

export default Preloader