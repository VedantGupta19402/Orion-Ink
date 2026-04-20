import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect } from 'react'

gsap.registerPlugin(ScrollTrigger)

// fromDir: 'top' | 'bottom' | 'left' | 'right'
const entryProps = {
  top:    { y: -60, x: 0    },
  bottom: { y: 60,  x: 0    },
  left:   { y: 0,   x: -60  },
  right:  { y: 0,   x: 60   },
}

const ImageCard = ({ image, title, style, id, fromDir = 'bottom', className = '' }) => {
  const cardRef = useRef(null)
  const overlayRef = useRef(null)
  const imgRef = useRef(null)

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
          toggleActions: 'play none none none',
        },
      })
    }, cardRef)

    return () => ctx.revert()
  }, [fromDir])

  const onEnter = () => {
    // bleed — amber vignette intensifies, image desaturates
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
      <img
        ref={imgRef}
        src={image}
        alt={title}
        className="w-full h-full object-cover"
        style={{ willChange: 'transform, filter' }}
      />

      {/* amber bleed overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 pointer-events-none opacity-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, rgba(212,169,106,0.18) 100%),
            linear-gradient(to top, rgba(4,3,8,0.7), transparent 50%)
          `,
        }}
      />

      {/* label — always visible at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
        <div className="flex flex-col gap-0.5">
          <span
            className="text-[9px] tracking-[0.22em] uppercase text-[#d4a96a]/45"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            {id} — {style}
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

export default ImageCard