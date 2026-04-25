import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Clock from './Clock'

gsap.registerPlugin(ScrollTrigger)

const navLinks = [
  { label: 'Work',    id: 'work'    },
  { label: 'Process', id: 'process' },
  { label: 'Book',    id: 'book'    },
]

const Footer = () => {
  const footerRef = useRef(null)
  const lineRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {

      gsap.from(lineRef.current, {
        scaleX: 0,
        transformOrigin: 'left',
        duration: 1.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      })

      gsap.from(footerRef.current.querySelectorAll('.footer-col'), {
        opacity: 0,
        y: 20,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      })

    }, footerRef)

    return () => ctx.revert()
  }, [])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer ref={footerRef} className="relative z-10">

      {/* amber divider */}
      <div
        ref={lineRef}
        className="h-px mx-6 md:mx-12"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(212,169,106,0.18), transparent)' }}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-0 px-6 md:px-0">

        {/* OB mark */}
        <div className="footer-col flex flex-col gap-3 px-6 md:px-10 py-10 border-r border-white/[0.04]">
          <span
            className="text-3xl tracking-[0.12em] text-[#d4a96a]/65"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            OB
          </span>
          <span
            className="text-[9px] tracking-[0.22em] uppercase text-white/18 leading-relaxed"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            Orion Black Studio<br />Brooklyn, NY<br />Est. 2021
          </span>
        </div>

        {/* nav */}
        <div className="footer-col flex flex-col gap-4 px-6 md:px-10 py-10 border-r border-white/[0.04]">
          <span
            className="text-[9px] tracking-[0.3em] uppercase text-white/18 mb-1"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            Navigate
          </span>
          {navLinks.map(({ label, id }) => (
            <button
              key={label}
              onClick={() => scrollTo(id)}
              data-cursor="open"
              className="text-[10px] tracking-[0.22em] uppercase text-white/28 hover:text-white/55 transition-colors duration-300 text-left"
              style={{ fontFamily: "'DM Mono', monospace", background: 'none', border: 'none', cursor: 'none' }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* clock */}
        <div className="footer-col flex flex-col justify-center px-6 md:px-10 py-10 border-r border-white/[0.04]">
          <Clock />
        </div>

        {/* socials */}
        <div className="footer-col flex flex-col gap-4 px-6 md:px-10 py-10">
          <span
            className="text-[9px] tracking-[0.3em] uppercase text-white/18 mb-1"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            Follow
          </span>
          <a
            data-cursor="open"
            className="text-[10px] tracking-[0.22em] uppercase text-white/28 hover:text-[#d4a96a]/55 transition-colors duration-300 no-underline"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            Instagram
          </a>
          <a
            data-cursor="open"
            className="text-[10px] tracking-[0.22em] uppercase text-white/28 hover:text-[#d4a96a]/55 transition-colors duration-300 no-underline"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            TikTok
          </a>
          <span
            className="text-[9px] tracking-[0.18em] uppercase text-white/12 mt-auto"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            © Orion Black 2025
          </span>
        </div>

      </div>

    </footer>
  )
}

export default Footer