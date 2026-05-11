import { memo, useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'

const stats = [
  { value: 340, suffix: '+', label: 'Pieces completed' },
  { value: 4, suffix: '+', label: 'Years active' },
  { value: 8, suffix: '', label: 'Styles mastered' },
  { value: 12, suffix: 'h', label: 'Avg session max' },
]

const Counter = () => {
  const wrapRef = useRef(null)
  const numsRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      numsRef.current.forEach((element, index) => {
        if (!element) return

        const target = stats[index].value
        const obj = { val: 0 }

        gsap.to(obj, {
          val: target,
          duration: 1.8,
          ease: 'power3.out',
          delay: index * 0.1,
          scrollTrigger: {
            trigger: wrapRef.current,
            start: 'top 80%',
            once: true,
          },
          onUpdate: () => {
            element.textContent = `${Math.round(obj.val)}${stats[index].suffix}`
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
          once: true,
        },
      })
    }, wrapRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={wrapRef} className="grid grid-cols-2 gap-0 border-t border-white/[0.05] md:grid-cols-4">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="stat-row flex flex-col gap-2 border-r border-white/[0.05] px-6 py-8 last:border-r-0 md:px-10"
        >
          <span
            ref={(element) => {
              numsRef.current[index] = element
            }}
            className="text-4xl leading-none text-white/80 md:text-5xl"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.06em' }}
          >
            0{stat.suffix}
          </span>
          <span
            className="text-[9px] uppercase tracking-[0.28em] text-white/22"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  )
}

export default memo(Counter)
