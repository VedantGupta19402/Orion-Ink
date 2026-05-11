import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { usePerformanceProfile } from '../lib/performance'

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%<>?'
const TITLE = 'ORION BLACK'

const Preloader = ({ onComplete }) => {
  const wrapRef = useRef(null)
  const panelTopRef = useRef(null)
  const panelBotRef = useRef(null)
  const panelMidRef = useRef(null)
  const charsRef = useRef([])
  const lineRef = useRef(null)
  const subRef = useRef(null)
  const counterRef = useRef(null)
  const progressRef = useRef(null)
  const inkCanvasRef = useRef(null)
  const profile = usePerformanceProfile()

  useEffect(() => {
    const canvas = inkCanvasRef.current
    if (!canvas) return undefined

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return undefined

    const scale = profile.isLowEnd ? 0.65 : profile.isTouch ? 0.8 : 1
    const frameInterval = 1000 / profile.preloaderNoiseFps

    const resize = () => {
      canvas.width = Math.max(1, Math.floor(window.innerWidth * scale))
      canvas.height = Math.max(1, Math.floor(window.innerHeight * scale))
    }

    let drops = []
    let rafId = 0
    let lastFrame = 0

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

    for (let index = 0; index < 6; index += 1) addDrop()
    const dropInterval = window.setInterval(addDrop, 800)

    const draw = (time) => {
      if (time - lastFrame >= frameInterval) {
        lastFrame = time
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        drops = drops.filter((drop) => drop.r < drop.maxR)

        drops.forEach((drop) => {
          drop.r += drop.speed

          const gradient = ctx.createRadialGradient(drop.x, drop.y, 0, drop.x, drop.y, drop.r)
          gradient.addColorStop(0, `rgba(212,169,106,${drop.alpha})`)
          gradient.addColorStop(0.5, `rgba(212,169,106,${drop.alpha * 0.3})`)
          gradient.addColorStop(1, 'rgba(212,169,106,0)')

          ctx.beginPath()
          ctx.arc(drop.x, drop.y, drop.r, 0, Math.PI * 2)
          ctx.fillStyle = gradient
          ctx.fill()
        })
      }

      rafId = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize, { passive: true })
    rafId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafId)
      clearInterval(dropInterval)
      window.removeEventListener('resize', resize)
    }
  }, [profile.isLowEnd, profile.isTouch, profile.preloaderNoiseFps])

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    const ctx = gsap.context(() => {
      const chars = charsRef.current
      const tl = gsap.timeline()

      gsap.set(chars, { opacity: 0 })
      gsap.set(lineRef.current, { scaleX: 0, transformOrigin: 'left' })
      gsap.set(subRef.current, { opacity: 0, y: 10 })
      gsap.set(counterRef.current, { opacity: 0 })
      gsap.set(progressRef.current, { scaleX: 0, transformOrigin: 'left' })

      chars.forEach((element, index) => {
        if (!element) return

        const original = TITLE.replace(' ', '')[index] ?? ' '
        const isSpace = TITLE[index] === ' '

        if (isSpace) {
          gsap.set(element, { opacity: 1 })
          return
        }

        const obj = { t: 0 }
        tl.to(obj, {
          t: 1,
          duration: 0.4,
          ease: 'power2.out',
          onUpdate: () => {
            const settled = obj.t > 0.75
            element.textContent = settled
              ? original
              : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
            element.style.opacity = `${Math.min(obj.t * 3, 1)}`
          },
          onComplete: () => {
            element.textContent = TITLE[index] === ' ' ? '\u00A0' : TITLE[index]
          },
        }, index * 0.07)
      })

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

      const count = { val: 0 }
      tl.to(count, {
        val: 100,
        duration: 2,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (counterRef.current) {
            const value = Math.round(count.val)
            counterRef.current.textContent = value < 10 ? `0${value}` : `${value}`
          }

          if (progressRef.current) {
            progressRef.current.style.transform = `scaleX(${count.val / 100})`
          }
        },
      }, 0.2)

      tl.to({}, { duration: 0.4 }, 2.4)

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

      tl.to(panelMidRef.current, {
        xPercent: -100,
        duration: 0.7,
        ease: 'power4.inOut',
      }, 3)

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
      }, [], 4)

      return () => tl.kill()
    }, wrapRef)

    return () => {
      ctx.revert()
      document.body.style.overflow = ''
    }
  }, [onComplete])

  return (
    <div
      ref={wrapRef}
      className="pointer-events-auto fixed inset-0 overflow-hidden"
      style={{ zIndex: 999999 }}
    >
      <canvas
        ref={inkCanvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{ zIndex: 0 }}
      />

      <div
        ref={panelMidRef}
        className="absolute inset-0 bg-[#06050a]"
        style={{ zIndex: 1 }}
      />

      <div
        ref={panelTopRef}
        className="absolute left-0 top-0 h-1/2 w-full bg-[#06050a]"
        style={{ zIndex: 2, transformOrigin: 'top' }}
      />

      <div
        ref={panelBotRef}
        className="absolute bottom-0 left-0 h-1/2 w-full bg-[#06050a]"
        style={{ zIndex: 2, transformOrigin: 'bottom' }}
      />

      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-6"
        style={{ zIndex: 3 }}
      >
        <h1
          className="m-0 flex items-center leading-none"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          aria-label={TITLE}
        >
          {TITLE.split('').map((char, index) => (
            <span
              key={index}
              ref={(element) => {
                charsRef.current[index] = element
              }}
              className="inline-block text-5xl tracking-[0.18em] text-white sm:text-6xl md:text-8xl"
              style={{ opacity: 0 }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h1>

        <div
          ref={lineRef}
          className="h-px w-16"
          style={{
            background: 'linear-gradient(90deg, transparent, #d4a96a, transparent)',
            transformOrigin: 'left',
          }}
        />

        <p
          ref={subRef}
          className="m-0 text-[10px] uppercase tracking-[0.38em] text-white/35"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          Brooklyn, NY - Est. 2021
        </p>
      </div>

      <span
        className="absolute left-8 top-7 text-[9px] uppercase tracking-[0.28em] text-white/20"
        style={{ zIndex: 3, fontFamily: "'DM Mono', monospace" }}
      >
        Loading
      </span>

      <span
        ref={counterRef}
        className="absolute bottom-8 right-8 text-[11px] tracking-[0.15em] text-white/25"
        style={{ zIndex: 3, fontFamily: "'DM Mono', monospace" }}
      >
        00
      </span>

      <div
        className="absolute bottom-0 left-0 h-px w-full"
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
