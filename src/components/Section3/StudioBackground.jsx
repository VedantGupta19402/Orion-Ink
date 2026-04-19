import { useRef, useImperativeHandle, forwardRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect } from 'react'

gsap.registerPlugin(ScrollTrigger)

const StudioBackground = forwardRef(({ sectionRef }, ref) => {
  const bgRef = useRef(null)
  const flashRef = useRef(null)

  useImperativeHandle(ref, () => ({
    onMouseMove(x, y) {
      if (!flashRef.current) return
      flashRef.current.style.background = `radial-gradient(circle 420px at ${x}px ${y}px, rgba(212,169,106,0.08), transparent 70%)`
    },
    onMouseLeave() {
      if (!flashRef.current) return
      flashRef.current.style.background = 'transparent'
    },
  }))

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
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <img
        ref={bgRef}
        src="/studio-bg.jpg"
        alt=""
        className="w-full h-[130%] object-cover opacity-[0.15]"
        style={{ willChange: 'transform' }}
      />

      <div
        ref={flashRef}
        className="absolute inset-0 pointer-events-none"
        style={{ transition: 'background 0.15s ease' }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, #06050a 0%, transparent 25%, transparent 75%, #06050a 100%)' }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, rgba(4,3,8,0.7) 100%)' }}
      />
    </div>
  )
})

StudioBackground.displayName = 'StudioBackground'

export default StudioBackground