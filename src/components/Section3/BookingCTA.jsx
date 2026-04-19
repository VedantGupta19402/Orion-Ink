import { useRef } from 'react'
import gsap from 'gsap'

const BookingCTA = ({ onOpen }) => {
  const ctaRef = useRef(null)

  const onMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left - rect.width / 2
    const y = event.clientY - rect.top - rect.height / 2

    gsap.to(ctaRef.current, {
      x: x * 0.38,
      y: y * 0.38,
      duration: 0.4,
      ease: 'power2.out',
    })
  }

  const onMouseEnter = () => {
    gsap.to(ctaRef.current, { scale: 1.04, duration: 0.3, ease: 'power2.out' })
  }

  const onMouseLeave = () => {
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
        className="rounded-full px-10 py-4 text-[11px] tracking-[0.3em] uppercase transition-all duration-300 bg-transparent border border-white/10 text-white/45 backdrop-blur-[14px] hover:bg-[#d4a96a]/10 hover:border-[#d4a96a]/45 hover:text-[#d4a96a]"
        style={{ fontFamily: "'DM Mono', monospace" }}
      >
        Request a session
      </button>
    </div>
  )
}

export default BookingCTA
