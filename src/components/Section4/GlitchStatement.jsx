import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const ORIGINAL = 'Permanent.  Considered.  Yours.'
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%'

const GlitchStatement = ({ sectionRef }) => {
  const textRef = useRef(null)
  const glitchInterval = useRef(null)
  const isGlitching = useRef(false)

  const runGlitch = () => {
    if (isGlitching.current || !textRef.current) return
    isGlitching.current = true

    let frame = 0
    const totalFrames = 14
    const scramble = setInterval(() => {
      if (!textRef.current) { clearInterval(scramble); return }

      const chars = ORIGINAL.split('')
      const scrambled = chars.map((c, i) => {
        if (c === ' ' || c === '.' ) return c
        // randomize only a few chars each frame, settle from left
        const settled = i < (frame / totalFrames) * chars.length
        return settled ? c : (Math.random() > 0.65 ? CHARS[Math.floor(Math.random() * CHARS.length)] : c)
      })

      textRef.current.textContent = scrambled.join('')
      frame++

      if (frame > totalFrames) {
        clearInterval(scramble)
        textRef.current.textContent = ORIGINAL
        isGlitching.current = false
      }
    }, 40)
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      // horizontal drift on scroll
      gsap.fromTo(
        textRef.current,
        { x: '20vw' },
        {
          x: '-12vw',
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            end: 'bottom 10%',
            scrub: 1.4,
          },
        }
      )
    }, sectionRef)

    // glitch fires every 5s after a 2s delay
    const timeout = setTimeout(() => {
      runGlitch()
      glitchInterval.current = setInterval(runGlitch, 5000)
    }, 2000)

    return () => {
      ctx.revert()
      clearTimeout(timeout)
      clearInterval(glitchInterval.current)
    }
  }, [])

  return (
    <div className="overflow-hidden py-12 md:py-16 border-t border-white/[0.04]">
      <p
        ref={textRef}
        className="whitespace-nowrap leading-none select-none"
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 'clamp(10vw, 12vw, 13vw)',
          letterSpacing: '0.05em',
          color: 'rgba(255,255,255,0.055)',
          willChange: 'transform',
        }}
      >
        {ORIGINAL}
      </p>
    </div>
  )
}

export default GlitchStatement