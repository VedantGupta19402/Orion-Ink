import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const Image = ({ sectionRef, counterRef }) => {
  const imageRef = useRef(null)
  const overlayRef = useRef(null)

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
        },
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const onMouseMove = (e) => {
    const rect = imageRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5

    gsap.to(imageRef.current, {
      rotateY: x * 6,
      rotateX: -y * 6,
      duration: 0.6,
      ease: 'power2.out',
    })

    if (overlayRef.current) {
      overlayRef.current.style.background = `radial-gradient(circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, rgba(212,169,106,0.08), transparent 60%)`
    }
  }

  const onMouseLeave = () => {
    gsap.to(imageRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.8,
      ease: 'elastic.out(1, 0.6)',
    })
    if (overlayRef.current) overlayRef.current.style.background = 'transparent'
  }

  return (
    <div className="md:sticky md:top-0 md:h-screen flex items-center">
      <div
        className="relative w-full overflow-hidden"
        style={{ perspective: '1000px' }}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        <div
          ref={imageRef}
          className="relative w-full aspect-[3/4] overflow-hidden"
          style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
        >
          <img
            src="/featured.jpg"
            alt="Featured tattoo work"
            className="w-full h-full object-cover"
          />

          <div
            ref={overlayRef}
            className="absolute inset-0 pointer-events-none transition-all duration-300"
          />

          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay"
            style={{ backgroundImage: 'url(/noise.png)' }}
          />

          <div
            className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between"
            style={{ background: 'linear-gradient(to top, rgba(6,5,10,0.85), transparent)' }}
          >
            <span
              className="text-[10px] tracking-[0.25em] uppercase text-white/50"
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
          className="mt-5 w-12 h-px"
          style={{ background: 'linear-gradient(90deg, #d4a96a, transparent)' }}
        />
      </div>
    </div>
  )
}

export default Image 