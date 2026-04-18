import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const works = [
  {
    id: '01',
    title: 'Serpent & Bone',
    category: 'Japanese Traditional',
    year: '2024',
    duration: '18h',
    image: '/work-01.jpg',
  },
  {
    id: '02',
    title: 'Void Garden',
    category: 'Blackwork / Botanical',
    year: '2024',
    duration: '24h',
    image: '/work-02.jpg',
  },
  {
    id: '03',
    title: 'The Becoming',
    category: 'Neo-Traditional',
    year: '2023',
    duration: '32h',
    image: '/work-03.jpg',
  },
]

const WorkStrip = () => {
  const stripRef = useRef(null)
  const cardsRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {

      cardsRef.current.forEach((el, i) => {
        if (!el) return
        gsap.from(el, {
          opacity: 0,
          y: 60,
          duration: 1,
          delay: i * 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: stripRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        })
      })

      gsap.to(stripRef.current, {
        x: () => -(stripRef.current.scrollWidth - window.innerWidth + 96),
        ease: 'none',
        scrollTrigger: {
          trigger: stripRef.current,
          start: 'top 60%',
          end: () => `+=${stripRef.current.scrollWidth}`,
          scrub: 1.2,
        },
      })

    })

    return () => ctx.revert()
  }, [])

  return (
    <div className="relative mt-10 md:mt-0 pb-24">

      <div className="px-6 md:px-12 mb-8 flex items-center justify-between">
        <span
          className="text-[10px] tracking-[0.3em] uppercase text-white/25"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          Recent work
        </span>
        <a
          href="/portfolio"
          className="text-[10px] tracking-[0.25em] uppercase text-[#d4a96a]/60 hover:text-[#d4a96a] transition-colors duration-300 no-underline"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          View all →
        </a>
      </div>

      <div
        ref={stripRef}
        className="flex gap-5 px-6 md:px-12"
        style={{ width: 'max-content' }}
      >
        {works.map((work, i) => (
          <div
            key={work.id}
            ref={(el) => (cardsRef.current[i] = el)}
            className="group relative flex-shrink-0 w-[75vw] sm:w-[50vw] md:w-[36vw] lg:w-[28vw]"
            style={{ cursor: 'none' }}
          >
            <div className="relative w-full aspect-[3/4] overflow-hidden">
              <img
                src={work.image}
                alt={work.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: 'linear-gradient(to top, rgba(4,3,8,0.8), transparent 50%)' }}
              />
            </div>

            <div className="mt-4 flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <span
                  className="text-[10px] tracking-[0.25em] uppercase text-white/30"
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  {work.id} — {work.category}
                </span>
                <h3
                  className="text-xl md:text-2xl text-white/85 m-0"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 300 }}
                >
                  {work.title}
                </h3>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0 ml-4">
                <span
                  className="text-[9px] tracking-[0.2em] uppercase text-white/20"
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  {work.year}
                </span>
                <span
                  className="text-[9px] tracking-[0.2em] uppercase text-[#d4a96a]/40"
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  {work.duration}
                </span>
              </div>
            </div>

            <div
              className="mt-3 h-px w-0 group-hover:w-full transition-all duration-500 ease-out"
              style={{ background: 'linear-gradient(90deg, #d4a96a, transparent)' }}
            />
          </div>
        ))}
      </div>

    </div>
  )
}

export default WorkStrip