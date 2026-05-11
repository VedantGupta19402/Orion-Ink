import { memo, useEffect, useRef } from 'react'
import { useIsVisible, gsap } from '../../lib/gsap'

const ORIGINAL = 'Permanent.  Considered.  Yours.'
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%'

const GlitchStatement = ({ sectionRef }) => {
  const textRef = useRef(null)
  const glitchInterval = useRef(null)
  const isGlitching = useRef(false)
  const wrapRef = useRef(null)
  const isVisible = useIsVisible(wrapRef, {
    rootMargin: '300px 0px',
    threshold: 0,
    initial: false,
  })

  const runGlitch = () => {
    if (isGlitching.current || !textRef.current) return
    isGlitching.current = true

    let frame = 0
    const totalFrames = 14
    const scramble = window.setInterval(() => {
      if (!textRef.current) {
        window.clearInterval(scramble)
        return
      }

      const chars = ORIGINAL.split('')
      const scrambled = chars.map((char, index) => {
        if (char === ' ' || char === '.') return char

        const settled = index < (frame / totalFrames) * chars.length
        return settled
          ? char
          : (Math.random() > 0.65 ? CHARS[Math.floor(Math.random() * CHARS.length)] : char)
      })

      textRef.current.textContent = scrambled.join('')
      frame += 1

      if (frame > totalFrames) {
        window.clearInterval(scramble)
        textRef.current.textContent = ORIGINAL
        isGlitching.current = false
      }
    }, 40)
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
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
            invalidateOnRefresh: true,
          },
        },
      )
    }, sectionRef)

    return () => {
      ctx.revert()
      clearInterval(glitchInterval.current)
    }
  }, [sectionRef])

  useEffect(() => {
    if (!isVisible) {
      clearInterval(glitchInterval.current)
      glitchInterval.current = null
      return undefined
    }

    const timeout = window.setTimeout(() => {
      runGlitch()
      glitchInterval.current = window.setInterval(runGlitch, 5000)
    }, 2000)

    return () => {
      clearTimeout(timeout)
      clearInterval(glitchInterval.current)
      glitchInterval.current = null
    }
  }, [isVisible])

  return (
    <div ref={wrapRef} className="overflow-hidden border-t border-white/[0.04] py-12 md:py-16">
      <p
        ref={textRef}
        className="select-none whitespace-nowrap leading-none"
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

export default memo(GlitchStatement)
