import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { value: 340, suffix: '+', label: 'Pieces completed' },
  { value: 4,   suffix: '+', label: 'Years active'     },
  { value: 8,   suffix: '',  label: 'Styles mastered'  },
  { value: 12,  suffix: 'h', label: 'Avg session max'  },
]

const Counter = () => {
  const wrapRef = useRef(null)
  const numsRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      numsRef.current.forEach((el, i) => {
        if (!el) return

        const target = stats[i].value
        const obj = { val: 0 }

        gsap.to(obj, {
          val: target,
          duration: 1.8,
          ease: 'power3.out',
          delay: i * 0.1,
          scrollTrigger: {
            trigger: wrapRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
          onUpdate: () => {
            el.textContent = `${Math.round(obj.val)}${stats[i].suffix}`
          },
        })
      })

      gsap.from(wrapRef.current.querySelectorAll('.stat-row'), {
        opacity: 0,
        y: 30,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: wrapRef.current,
          start: 'top 82%',
          toggleActions: 'play none none none',
        },
      })
    }, wrapRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={wrapRef} className="grid grid-cols-2 md:grid-cols-4 gap-0 border-t border-white/[0.05]">
      {stats.map((s, i) => (
        <div
          key={s.label}
          className="stat-row flex flex-col gap-2 px-6 md:px-10 py-8 border-r border-white/[0.05] last:border-r-0"
        >
          <span
            ref={(el) => (numsRef.current[i] = el)}
            className="text-4xl md:text-5xl text-white/80 leading-none"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.06em' }}
          >
            0{s.suffix}
          </span>
          <span
            className="text-[9px] tracking-[0.28em] uppercase text-white/22"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            {s.label}
          </span>
        </div>
      ))}
    </div>
  )
}

export default Counter