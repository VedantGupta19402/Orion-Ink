import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { emitSiteNotice, scrollToSection } from '../../pages/utils/siteEvents'

gsap.registerPlugin(ScrollTrigger)

const works = [
  {
    id: '01',
    title: 'Serpent & Bone',
    category: 'Japanese Traditional',
    year: '2024',
    duration: '18h',
    image: '/work1.png',
  },
  {
    id: '02',
    title: 'Moth & Mercury',
    category: 'Blackwork / Botanical',
    year: '2024',
    duration: '24h',
    image: '/work2.png',
  },
  {
    id: '03',
    title: 'Red Thread',
    category: 'Neo-Traditional',
    year: '2023',
    duration: '32h',
    image: '/work3.png',
  },
]

const WorkStrip = () => {
  const stripRef = useRef(null)
  const cardsRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((element, index) => {
        if (!element) return

        gsap.from(element, {
          opacity: 0,
          y: 60,
          duration: 1,
          delay: index * 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: stripRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        })
      })

      if (window.innerWidth >= 1024) {
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
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className="relative mt-10 pb-24 md:mt-0">
      <div className="mb-8 flex items-center justify-between px-6 md:px-12">
        <span
          className="text-[10px] tracking-[0.3em] uppercase text-white/25"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          Recent work
        </span>
        <button
          type="button"
          onClick={() => {
            scrollToSection('#selected-works')
            emitSiteNotice({
              title: 'Portfolio Preview',
              message: 'This frontend demo keeps the gallery on-page, so you can explore the selected works right here.',
            })
          }}
          className="text-[10px] tracking-[0.25em] uppercase text-[#d4a96a]/60 transition-colors duration-300 hover:text-[#d4a96a]"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          View all {'->'}
        </button>
      </div>

      <div
        ref={stripRef}
        className="flex flex-col gap-5 px-6 md:px-12 lg:flex-row"
        style={{ width: '100%' }}
      >
        {works.map((work, index) => (
          <div
            key={work.id}
            ref={(element) => {
              cardsRef.current[index] = element
            }}
            className="group relative w-full flex-shrink-0 sm:w-full md:w-full lg:w-[28vw]"
            style={{ cursor: 'none' }}
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden">
              <img
                src={work.image}
                alt={work.title}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: 'linear-gradient(to top, rgba(4,3,8,0.8), transparent 50%)' }}
              />
            </div>

            <div className="mt-4 flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <span
                  className="text-[10px] tracking-[0.25em] uppercase text-white/30"
                  style={{ fontFamily: "'DM Mono', monospace" }}
                >
                  {work.id} - {work.category}
                </span>
                <h3
                  className="m-0 text-xl text-white/85 md:text-2xl"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 300 }}
                >
                  {work.title}
                </h3>
              </div>
              <div className="ml-4 flex shrink-0 flex-col items-end gap-1">
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
              className="mt-3 h-px w-0 transition-all duration-500 ease-out group-hover:w-full"
              style={{ background: 'linear-gradient(90deg, #d4a96a, transparent)' }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default WorkStrip
