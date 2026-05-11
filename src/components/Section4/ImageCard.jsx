import { memo, useEffect, useRef } from 'react'
import LazyImage from '../LazyImage'
import { gsap } from '../../lib/gsap'
import { usePerformanceProfile } from '../../lib/performance'

const entryProps = {
  top: { y: -60, x: 0 },
  bottom: { y: 60, x: 0 },
  left: { y: 0, x: -60 },
  right: { y: 0, x: 60 },
}

const ImageCard = ({ image, title, style, id, fromDir = 'bottom', className = '' }) => {
  const cardRef = useRef(null)
  const overlayRef = useRef(null)
  const imgRef = useRef(null)
  const profile = usePerformanceProfile()

  useEffect(() => {
    const ctx = gsap.context(() => {
      const { x, y } = entryProps[fromDir]

      gsap.from(cardRef.current, {
        opacity: 0,
        x,
        y,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 88%',
          once: true,
        },
      })
    }, cardRef)

    return () => ctx.revert()
  }, [fromDir])

  const onEnter = () => {
    if (!profile.hoverFxEnabled) return

    gsap.to(overlayRef.current, {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out',
    })
    gsap.to(imgRef.current, {
      scale: 1.05,
      filter: 'saturate(0.4) brightness(0.85)',
      duration: 0.7,
      ease: 'power2.out',
    })
  }

  const onLeave = () => {
    if (!profile.hoverFxEnabled) return

    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out',
    })
    gsap.to(imgRef.current, {
      scale: 1,
      filter: 'saturate(1) brightness(1)',
      duration: 0.7,
      ease: 'power2.out',
    })
  }

  return (
    <div
      ref={cardRef}
      data-cursor="view"
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <LazyImage
        ref={imgRef}
        src={image}
        alt={title}
        className="h-full w-full object-cover"
        style={{ willChange: 'transform, filter' }}
      />

      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 opacity-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, rgba(212,169,106,0.18) 100%),
            linear-gradient(to top, rgba(4,3,8,0.7), transparent 50%)
          `,
        }}
      />

      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-4">
        <div className="flex flex-col gap-0.5">
          <span
            className="text-[9px] uppercase tracking-[0.22em] text-[#d4a96a]/45"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            {id} - {style}
          </span>
          <span
            className="text-base text-white/70"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontWeight: 300,
            }}
          >
            {title}
          </span>
        </div>
      </div>
    </div>
  )
}

export default memo(ImageCard)
