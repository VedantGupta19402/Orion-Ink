import { memo, useEffect, useRef } from 'react'
import Clock from './Clock'
import { gsap } from '../../lib/gsap'

const navLinks = [
  { label: 'Work', id: 'selected-works' },
  { label: 'Book', id: 'book' },
  { label: 'Archive', id: 'archive' },
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
          once: true,
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
          once: true,
        },
      })
    }, footerRef)

    return () => ctx.revert()
  }, [])

  const scrollTo = (id) => {
    const element = document.getElementById(id)
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer ref={footerRef} className="relative z-10">
      <div
        ref={lineRef}
        className="mx-6 h-px md:mx-12"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(212,169,106,0.18), transparent)' }}
      />

      <div className="grid grid-cols-2 gap-0 px-6 md:grid-cols-4 md:px-0">
        <div className="footer-col flex flex-col gap-3 border-r border-white/[0.04] px-6 py-10 md:px-10">
          <span
            className="text-3xl tracking-[0.12em] text-[#d4a96a]/65"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            OB
          </span>
          <span
            className="text-[9px] uppercase tracking-[0.22em] leading-relaxed text-white/18"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            Orion Black Studio<br />Brooklyn, NY<br />Est. 2021
          </span>
        </div>

        <div className="footer-col flex flex-col gap-4 border-r border-white/[0.04] px-6 py-10 md:px-10">
          <span
            className="mb-1 text-[9px] uppercase tracking-[0.3em] text-white/18"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            Navigate
          </span>
          {navLinks.map(({ label, id }) => (
            <button
              key={label}
              onClick={() => scrollTo(id)}
              data-cursor="open"
              className="text-left text-[10px] uppercase tracking-[0.22em] text-white/28 transition-colors duration-300 hover:text-white/55"
              style={{ fontFamily: "'DM Mono', monospace", background: 'none', border: 'none', cursor: 'none' }}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="footer-col flex flex-col justify-center border-r border-white/[0.04] px-6 py-10 md:px-10">
          <Clock />
        </div>

        <div className="footer-col flex flex-col gap-4 px-6 py-10 md:px-10">
          <span
            className="mb-1 text-[9px] uppercase tracking-[0.3em] text-white/18"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            Follow
          </span>
          <a
            data-cursor="open"
            className="no-underline text-[10px] uppercase tracking-[0.22em] text-white/28 transition-colors duration-300 hover:text-[#d4a96a]/55"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            Instagram
          </a>
          <a
            data-cursor="open"
            className="no-underline text-[10px] uppercase tracking-[0.22em] text-white/28 transition-colors duration-300 hover:text-[#d4a96a]/55"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            TikTok
          </a>
          <span
            className="mt-auto text-[9px] uppercase tracking-[0.18em] text-white/12"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            © Orion Black 2025
          </span>
        </div>
      </div>
    </footer>
  )
}

export default memo(Footer)
