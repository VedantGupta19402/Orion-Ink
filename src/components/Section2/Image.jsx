import { memo, useEffect, useRef } from 'react'
import LazyImage from '../LazyImage'
import { gsap } from '../../lib/gsap'
import { usePerformanceProfile } from '../../lib/performance'

const Image = ({ sectionRef, counterRef }) => {
  const imageRef = useRef(null)
  const overlayRef = useRef(null)
  const rotateXToRef = useRef(null)
  const rotateYToRef = useRef(null)
  const profile = usePerformanceProfile()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(imageRef.current, {
        scale: 1.1,
        duration: 1.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      })

      gsap.to(imageRef.current, {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          invalidateOnRefresh: true,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [sectionRef])

  useEffect(() => {
    if (!profile.hoverFxEnabled || !imageRef.current) return undefined

    rotateXToRef.current = gsap.quickTo(imageRef.current, 'rotateX', {
      duration: 0.6,
      ease: 'power2.out',
    })
    rotateYToRef.current = gsap.quickTo(imageRef.current, 'rotateY', {
      duration: 0.6,
      ease: 'power2.out',
    })

    return undefined
  }, [profile.hoverFxEnabled])

  const onMouseMove = (event) => {
    if (!profile.hoverFxEnabled || !imageRef.current || !rotateXToRef.current || !rotateYToRef.current) return

    const rect = imageRef.current.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5

    rotateYToRef.current(x * 6)
    rotateXToRef.current(-y * 6)

    if (overlayRef.current) {
      overlayRef.current.style.background = `radial-gradient(circle at ${event.clientX - rect.left}px ${event.clientY - rect.top}px, rgba(212,169,106,0.08), transparent 60%)`
    }
  }

  const onMouseLeave = () => {
    if (profile.hoverFxEnabled && rotateXToRef.current && rotateYToRef.current) {
      rotateXToRef.current(0)
      rotateYToRef.current(0)
      gsap.to(imageRef.current, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.6)',
      })
    }

    if (overlayRef.current) overlayRef.current.style.background = 'transparent'
  }

  return (
    <div className="flex items-center md:sticky md:top-0 md:h-screen">
      <div
        className="relative w-full overflow-hidden"
        style={{ perspective: '1000px' }}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        <div
          ref={imageRef}
          className="relative aspect-[3/4] w-full overflow-hidden"
          style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
        >
          <LazyImage
            src="/featured.png"
            alt="Featured tattoo work"
            className="h-[90%] w-full object-cover pt-16"
            loading="lazy"
            fetchPriority="low"
          />

          <div
            ref={overlayRef}
            className="pointer-events-none absolute inset-0 transition-all duration-300"
          />

          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay"
            style={{ backgroundImage: 'var(--noise, none)' }}
          />

          <div
            className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-5"
            style={{ background: 'linear-gradient(to top, rgba(6,5,10,0.85), transparent)' }}
          >
            <span
              className="text-[10px] uppercase tracking-[0.25em] text-white/50"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              Featured / 2024
            </span>
            <span
              ref={counterRef}
              className="text-[10px] tracking-[0.2em] text-[#d4a96a]/60"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              01
            </span>
          </div>
        </div>

        <div
          className="mt-5 h-px w-12"
          style={{ background: 'linear-gradient(90deg, #d4a96a, transparent)' }}
        />
      </div>
    </div>
  )
}

export default memo(Image)
