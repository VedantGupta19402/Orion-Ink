import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect } from 'react'
import StudioBackground from './StudioBackground'
import BookingHeadline from './BookingHeadline'
import BookingCTA from './BookingCTA'
import ProcessList from './ProcessList'

gsap.registerPlugin(ScrollTrigger)

const tickerText = 'BROOKLYN — APPOINTMENT ONLY — DM TO BOOK — ORION BLACK — EST. 2021 — '

const Section3 = () => {
  const sectionRef = useRef(null)
  const bgRef = useRef(null)
  const dividerRef = useRef(null)
  const tickerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {

      gsap.from(dividerRef.current, {
        scaleX: 0,
        transformOrigin: 'left',
        duration: 1.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 92%',
          toggleActions: 'play none none none',
        },
      })

      const tickerWidth = tickerRef.current.scrollWidth / 2
      gsap.to(tickerRef.current, {
        x: -tickerWidth,
        duration: 28,
        ease: 'none',
        repeat: -1,
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const onMouseMove = (e) => {
    const rect = sectionRef.current.getBoundingClientRect()
    bgRef.current?.onMouseMove(e.clientX - rect.left, e.clientY - rect.top)
  }

  const onMouseLeave = () => {
    bgRef.current?.onMouseLeave()
  }

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#06050a] text-white overflow-hidden"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >

      {/* amber divider — draws in from S2 */}
      <div
        ref={dividerRef}
        className="h-px mx-6 md:mx-12"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(212,169,106,0.22), transparent)' }}
      />

      {/* studio atmosphere bg */}
      <StudioBackground ref={bgRef} sectionRef={sectionRef} />

      {/* main content grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 min-h-screen px-6 md:px-12 gap-16 md:gap-0 py-28 md:py-0">

        {/* left */}
        <div className="flex flex-col justify-center gap-10">
          <BookingHeadline />
          <BookingCTA />
        </div>

        {/* right */}
        <ProcessList />

      </div>

      {/* bottom ticker */}
      <div className="relative z-10 border-t border-white/[0.04] py-4 overflow-hidden">
        <div
          ref={tickerRef}
          className="flex whitespace-nowrap"
          style={{ width: 'max-content' }}
        >
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className="text-[10px] tracking-[0.4em] uppercase text-white/18 pr-8"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              {tickerText}
            </span>
          ))}
        </div>
      </div>

      {/* footer */}
      <div className="relative z-10 px-6 md:px-12 pb-10 flex items-center justify-between">
        <span
          className="text-[9px] tracking-[0.2em] uppercase text-white/12 italic"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Orion Black © 2025
        </span>
        <span
          className="text-[9px] tracking-[0.2em] uppercase text-white/12"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          Brooklyn, NY
        </span>
      </div>

    </section>
  )
}

export default Section3