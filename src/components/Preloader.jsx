import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

const Preloader = ({ onComplete }) => {
  const panelTopRef = useRef(null)
  const panelBotRef = useRef(null)
  const textRef = useRef(null)
  const lineRef = useRef(null)
  const subRef = useRef(null)
  const counterRef = useRef(null)

  useEffect(() => {
    // Lock scroll on mount
    document.body.style.overflow = 'hidden'

    const text = 'ORION BLACK'
    const tl = gsap.timeline({ onComplete: exitHandler })

    // Phase 1: scramble title in (duration 1.4s, starts at 0)
    const scrambleObj = { progress: 0 }
    tl.to(scrambleObj, {
      progress: 1,
      duration: 1.4,
      ease: 'none',
      onUpdate: () => {
        const settled = Math.floor(scrambleObj.progress * 11)
        let result = ''
        for (let i = 0; i < text.length; i++) {
          if (text[i] === ' ') {
            result += ' '
          } else if (i < settled) {
            result += text[i]
          } else {
            result += chars[Math.floor(Math.random() * chars.length)]
          }
        }
        if (textRef.current) {
          textRef.current.textContent = result
        }
      },
      onComplete: () => {
        if (textRef.current) {
          textRef.current.textContent = text
        }
      },
    }, 0)

    // Phase 2: line draws (starts at 0.6)
    tl.fromTo(
      lineRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.8, ease: 'power3.out', transformOrigin: 'left' },
      0.6
    )

    // Phase 3: sub fades up (starts at 0.9)
    tl.fromTo(
      subRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
      0.9
    )

    // Phase 4: counter counts (starts at 0.2)
    const counterObj = { val: 0 }
    tl.to(counterObj, {
      val: 100,
      duration: 1.8,
      ease: 'power1.inOut',
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.textContent = Math.round(counterObj.val)
        }
      },
    }, 0.2)

    // Phase 5: hold beat (duration 0.3 at position 2.2)
    tl.to({}, { duration: 0.3 }, 2.2)

    // Phase 6: text exits (starts at 2.4)
    tl.to(textRef.current, { opacity: 0, y: -20, duration: 0.5, ease: 'power2.in' }, 2.4)
    tl.to([subRef.current, lineRef.current, counterRef.current], { opacity: 0, duration: 0.3 }, 2.5)

    // Phase 7: panels split (starts at 2.7)
    tl.to(panelTopRef.current, { yPercent: -100, duration: 1, ease: 'power4.inOut' }, 2.7)
    tl.to(panelBotRef.current, { yPercent: 100, duration: 1, ease: 'power4.inOut' }, 2.7)

    function exitHandler() {
      document.body.style.overflow = ''
      onComplete()
    }

    return () => {
      tl.kill()
      document.body.style.overflow = ''
    }
  }, [onComplete])

  return (
    <div
      className="fixed inset-0 pointer-events-auto"
      style={{ zIndex: 999999 }}
    >
      {/* Top panel */}
      <div
        ref={panelTopRef}
        className="absolute top-0 left-0 w-full h-1/2 bg-[#06050a]"
        style={{ transformOrigin: 'top' }}
      />

      {/* Bottom panel */}
      <div
        ref={panelBotRef}
        className="absolute bottom-0 left-0 w-full h-1/2 bg-[#06050a]"
        style={{ transformOrigin: 'bottom' }}
      />

      {/* Label */}
      <div
        className="absolute top-7 left-8 z-10 text-[9px] uppercase text-white/50"
        style={{ fontFamily: "'DM Mono', monospace" }}
      >
        Loading
      </div>

      {/* Content */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-5">
        <h1
          ref={textRef}
          className="text-5xl md:text-7xl text-white tracking-[0.3em]"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          ORION BLACK
        </h1>
        <div
          ref={lineRef}
          className="w-10 h-px"
          style={{
            background: 'linear-gradient(90deg, #d4a96a, #e5bd80)',
            transform: 'scaleX(0)',
            transformOrigin: 'left',
          }}
        />
        <p
          ref={subRef}
          className="text-[10px] text-white/50 tracking-[0.35em] opacity-0"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          Brooklyn, NY — Est. 2021
        </p>
      </div>

      {/* Counter */}
      <div className="absolute bottom-8 right-8 z-10">
        <span
          ref={counterRef}
          className="text-[11px] text-white/50"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          0
        </span>
      </div>
    </div>
  )
}

export default Preloader
