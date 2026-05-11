import { memo, useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { usePerformanceProfile } from '../../lib/performance'

const BookingCTA = ({ onOpen }) => {
  const ctaRef = useRef(null)
  const xToRef = useRef(null)
  const yToRef = useRef(null)
  const profile = usePerformanceProfile()

  useEffect(() => {
    if (!profile.hoverFxEnabled || !ctaRef.current) return undefined

    xToRef.current = gsap.quickTo(ctaRef.current, 'x', {
      duration: 0.4,
      ease: 'power2.out',
    })
    yToRef.current = gsap.quickTo(ctaRef.current, 'y', {
      duration: 0.4,
      ease: 'power2.out',
    })

    return undefined
  }, [profile.hoverFxEnabled])

  const onMouseMove = (event) => {
    if (!profile.hoverFxEnabled || !xToRef.current || !yToRef.current) return

    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left - rect.width / 2
    const y = event.clientY - rect.top - rect.height / 2

    xToRef.current(x * 0.38)
    yToRef.current(y * 0.38)
  }

  const onMouseEnter = () => {
    if (!profile.hoverFxEnabled) return
    gsap.to(ctaRef.current, { scale: 1.04, duration: 0.3, ease: 'power2.out' })
  }

  const onMouseLeave = () => {
    if (!profile.hoverFxEnabled) return

    xToRef.current?.(0)
    yToRef.current?.(0)
    gsap.to(ctaRef.current, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: 'elastic.out(1, 0.5)',
    })
  }

  return (
    <div ref={ctaRef} className="relative z-20 w-fit">
      <button
        type="button"
        onClick={onOpen}
        onMouseMove={onMouseMove}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className="rounded-full border border-white/10 bg-transparent px-10 py-4 text-[11px] uppercase tracking-[0.3em] text-white/45 transition-all duration-300 hover:border-[#d4a96a]/45 hover:bg-[#d4a96a]/10 hover:text-[#d4a96a] backdrop-blur-[14px]"
        style={{ fontFamily: "'DM Mono', monospace" }}
      >
        Request a session
      </button>
    </div>
  )
}

export default memo(BookingCTA)
