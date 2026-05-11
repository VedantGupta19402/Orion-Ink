import { memo, useEffect, useRef } from 'react'
import { gsap, SplitText, ScrollTrigger } from '../../lib/gsap'

const lines = [
  { text: 'Every mark is a decision.', italic: false },
  { text: 'Every decision is permanent.', italic: true },
  { text: "We don't tattoo skin.", italic: false },
  { text: 'We tattoo identity.', italic: true },
]

const stats = [
  { label: 'Years active', value: '4+' },
  { label: 'Pieces completed', value: '340+' },
  { label: 'Avg session', value: '6-12h' },
  { label: 'Styles', value: '8' },
]

const Text = () => {
  const linesRef = useRef([])

  useEffect(() => {
    const splits = []
    const triggers = []

    const ctx = gsap.context(() => {
      linesRef.current.forEach((element) => {
        if (!element) return

        const split = new SplitText(element, { type: 'words' })
        splits.push(split)
        gsap.set(split.words, { opacity: 0, y: 30, rotateX: -60 })

        const trigger = ScrollTrigger.create({
          trigger: element,
          start: 'top 82%',
          once: true,
          onEnter: () => {
            gsap.to(split.words, {
              opacity: 1,
              y: 0,
              rotateX: 0,
              duration: 0.9,
              stagger: 0.08,
              ease: 'power3.out',
            })
          },
        })

        triggers.push(trigger)
      })
    })

    return () => {
      ctx.revert()
      triggers.forEach((trigger) => trigger.kill())
      splits.forEach((split) => split.revert())
    }
  }, [])

  return (
    <div className="flex flex-col justify-center gap-16 md:gap-24 md:py-40 md:pl-16 lg:pl-24">
      <div className="flex items-baseline gap-4">
        <span
          className="select-none text-[80px] leading-none text-white/[0.04] md:text-[120px]"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          02
        </span>
        <span
          className="mb-2 text-[10px] uppercase tracking-[0.3em] text-white/30"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          Philosophy
        </span>
      </div>

      <div className="flex flex-col gap-8 md:gap-10" style={{ perspective: '600px' }}>
        {lines.map((line, index) => (
          <p
            key={line.text}
            ref={(element) => {
              linesRef.current[index] = element
            }}
            className="m-0 text-3xl leading-[1.1] sm:text-4xl md:text-5xl lg:text-[56px]"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: line.italic ? 400 : 300,
              fontStyle: line.italic ? 'italic' : 'normal',
              color: index === lines.length - 1 ? 'rgba(212,169,106,0.9)' : 'rgba(255,255,255,0.75)',
            }}
          >
            {line.text}
          </p>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6 border-t border-white/[0.06] pt-8">
        {stats.map(({ label, value }) => (
          <div key={label} className="flex flex-col gap-1">
            <span
              className="text-[9px] uppercase tracking-[0.28em] text-white/25"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              {label}
            </span>
            <span
              className="text-2xl text-white/80 md:text-3xl"
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.1em' }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default memo(Text)
