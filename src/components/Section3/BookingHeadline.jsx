import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

const availability = [
  { label: 'Current opening', value: 'By inquiry' },
  { label: 'Session length', value: '4h minimum' },
  { label: 'Deposit', value: '$200 - non-refundable' },
]

const BookingHeadline = () => {
  const headlineRef = useRef(null)
  const subRef = useRef(null)
  const availRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const split = new SplitText(headlineRef.current, { type: 'chars' })

      gsap.set(split.chars, {
        opacity: 0,
        y: 70,
        rotateX: -90,
        transformOrigin: '50% 50% -30px',
      })

      gsap.to(split.chars, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 1.2,
        stagger: 0.025,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: headlineRef.current,
          start: 'top 78%',
          toggleActions: 'play none none none',
        },
      })

      gsap.from([subRef.current, availRef.current], {
        opacity: 0,
        y: 28,
        duration: 1,
        stagger: 0.18,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: subRef.current,
          start: 'top 84%',
          toggleActions: 'play none none none',
        },
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className="flex flex-col justify-center gap-10 md:pr-16 lg:pr-24">
      <span
        className="text-[10px] tracking-[0.3em] uppercase text-white/25"
        style={{ fontFamily: "'DM Mono', monospace" }}
      >
        03 - Bookings
      </span>

      <h2
        ref={headlineRef}
        className="m-0 text-5xl leading-[0.92] sm:text-6xl md:text-7xl lg:text-[88px]"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic',
          fontWeight: 300,
          perspective: '900px',
        }}
      >
        The chair<br />is empty.
      </h2>

      <p
        ref={subRef}
        className="m-0 max-w-xs text-sm leading-loose text-white/35 md:text-base"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic',
          fontWeight: 300,
        }}
      >
        Every piece starts with a conversation.
        No walk-ins. No rush. If you&apos;re ready
        to commit to something permanent - reach out.
      </p>

      <div
        ref={availRef}
        className="flex flex-col gap-4 border-t border-white/[0.06] pt-6"
      >
        {availability.map(({ label, value }) => (
          <div key={label} className="flex items-baseline justify-between gap-6">
            <span
              className="text-[9px] tracking-[0.28em] uppercase text-white/22"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              {label}
            </span>
            <span
              className="text-right text-[11px] tracking-[0.15em] text-white/55"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BookingHeadline
