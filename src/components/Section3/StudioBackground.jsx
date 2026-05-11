import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import LazyImage from '../LazyImage'
import { gsap } from '../../lib/gsap'
import { usePerformanceProfile } from '../../lib/performance'

const StudioBackground = forwardRef(({ sectionRef }, ref) => {
  const bgRef = useRef(null)
  const flashRef = useRef(null)
  const profile = usePerformanceProfile()

  useImperativeHandle(ref, () => ({
    onMouseMove(x, y) {
      if (!profile.hoverFxEnabled || !flashRef.current) return
      flashRef.current.style.background = `radial-gradient(circle 420px at ${x}px ${y}px, rgba(212,169,106,0.08), transparent 70%)`
    },
    onMouseLeave() {
      if (!flashRef.current) return
      flashRef.current.style.background = 'transparent'
    },
  }), [profile.hoverFxEnabled])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(bgRef.current, {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [sectionRef])

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <LazyImage
        src="/studio.png"
        alt=""
        ref={bgRef}
        className="h-[130%] w-full object-cover opacity-[0.15]"
        style={{ willChange: 'transform' }}
        loading="lazy"
      />

      <div
        ref={flashRef}
        className="pointer-events-none absolute inset-0"
        style={{ transition: 'background 0.15s ease' }}
      />

      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, #06050a 0%, transparent 25%, transparent 75%, #06050a 100%)' }}
      />

      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, rgba(4,3,8,0.7) 100%)' }}
      />
    </div>
  )
})

StudioBackground.displayName = 'StudioBackground'

export default StudioBackground
