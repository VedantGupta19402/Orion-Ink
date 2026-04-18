import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

const lines = [
  { text: 'Every mark is a decision.',    italic: false },
  { text: 'Every decision is permanent.', italic: true  },
  { text: "We don't tattoo skin.",         italic: false },
  { text: 'We tattoo identity.',           italic: true  },
]

const stats = [
  { label: 'Years active',       value: '4+'    },
  { label: 'Pieces completed',   value: '340+'  },
  { label: 'Avg session',        value: '6–12h' },
  { label: 'Styles',             value: '8'     },
]

const Text = () => {
  const linesRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      linesRef.current.forEach((el) => {
        if (!el) return

        const split = new SplitText(el, { type: 'words' })
        gsap.set(split.words, { opacity: 0, y: 30, rotateX: -60 })

        ScrollTrigger.create({
          trigger: el,
          start: 'top 82%',
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
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className="flex flex-col justify-center md:pl-16 lg:pl-24 gap-16 md:gap-24 md:py-40">

      <div className="flex items-baseline gap-4">
        <span
          className="text-[80px] md:text-[120px] leading-none text-white/[0.04] select-none"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          02
        </span>
        <span
          className="text-[10px] tracking-[0.3em] uppercase text-white/30 mb-2"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          Philosophy
        </span>
      </div>

      <div className="flex flex-col gap-8 md:gap-10" style={{ perspective: '600px' }}>
        {lines.map((line, i) => (
          <p
            key={i}
            ref={(el) => (linesRef.current[i] = el)}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] leading-[1.1] m-0"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: line.italic ? 400 : 300,
              fontStyle: line.italic ? 'italic' : 'normal',
              color: i === lines.length - 1 ? 'rgba(212,169,106,0.9)' : 'rgba(255,255,255,0.75)',
            }}
          >
            {line.text}
          </p>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/[0.06]">
        {stats.map(({ label, value }) => (
          <div key={label} className="flex flex-col gap-1">
            <span
              className="text-[9px] tracking-[0.28em] uppercase text-white/25"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              {label}
            </span>
            <span
              className="text-2xl md:text-3xl text-white/80"
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

export default Text