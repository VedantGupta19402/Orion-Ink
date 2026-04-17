import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import WebGLScene from './WebGLScene'
import CurvedLoop from './CurvedLoop'
 
gsap.registerPlugin(ScrollTrigger)
 
function Video() {
  const containerRef = useRef(null)
  const videoRef     = useRef(null)
  const webglRef     = useRef(null)
  const contentRef   = useRef(null)
 
  useEffect(() => {
    const ctx = gsap.context(() => {
      const video   = videoRef.current
      const webgl   = webglRef.current
      const content = contentRef.current
 
      // — entry —
      gsap.set(video,   { filter: 'blur(12px) brightness(0.55)' })
      gsap.set(webgl,   { opacity: 0 })
      gsap.set(content, { opacity: 0, y: 56 })
 
      gsap.to(video, {
        filter: 'blur(0px) brightness(1)',
        duration: 2.2,
        delay: 0.4,
        ease: 'power3.out',
      })
 
      gsap.to(content, {
        opacity: 1,
        y: 0,
        duration: 1.6,
        delay: 0.9,
        ease: 'power4.out',
      })
 
      // — scroll —
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=170%',
          scrub: 1.2,
          pin: true,
        },
      })
 
      tl.to(video, { scale: 1.1, ease: 'none' }, 0)
 
      tl.to(video, {
        scale: 1.22,
        filter: 'contrast(1.18) saturate(1.12)',
        ease: 'none',
      }, 0.3)
 
      tl.to(content, { opacity: 0, y: -70, ease: 'none' }, 0.4)
 
      tl.to(video,  { opacity: 0, scale: 1.28, ease: 'none' }, 0.65)
      tl.to(webgl,  { opacity: 1, ease: 'none' }, 0.68)
 
    }, containerRef)
 
    return () => ctx.revert()
  }, [])
 
  return (
    <section
      ref={containerRef}
      className="relative w-full h-[100svh] overflow-hidden bg-[#06050a]"
    >
 
      {/* webgl — crossfades in on scroll */}
      <div ref={webglRef} className="absolute inset-0 z-0">
        <WebGLScene />
      </div>
 
      {/* video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        src="/hero.mp4"
        className="absolute inset-0 w-full h-full object-cover will-change-transform z-[1]"
      />
 
      {/* vignette */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 85% 75% at 50% 50%, transparent 38%, rgba(4,3,8,.82) 100%)' }}
      />
 
      {/* scanlines */}
      <div
        className="absolute inset-0 z-[3] pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,.07) 0px, rgba(0,0,0,.07) 1px, transparent 1px, transparent 3px)',
          animation: 'scanline 9s linear infinite',
        }}
      />
 
      {/* top + bottom fade */}
      <div
        className="absolute inset-0 z-[4] pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(6,5,10,.5) 0%, transparent 20%, transparent 70%, rgba(6,5,10,.8) 100%)' }}
      />
 
      {/* content */}
      <div
        ref={contentRef}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6"
      >
 
        {/* badge */}
        <div className="flex items-center gap-2 mb-7 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-md bg-white/[.03]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4a96a] animate-[pulse_2.4s_ease-in-out_infinite]" />
          <span className="text-[10px] tracking-[.22em] text-white/40 uppercase font-light">
            Accepting bookings
          </span>
        </div>
 
        {/* title */}
        <h1 className="font-['Bebas_Neue'] text-[clamp(58px,11.5vw,136px)] tracking-[.22em] text-white leading-none">
          ORION BLACK
        </h1>
 
        {/* divider */}
        <div
          className="w-10 h-px my-5"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(212,169,106,.55), transparent)' }}
        />
 
        {/* sub */}
        <p className="font-['Cormorant_Garamond'] italic font-light text-[clamp(12px,1.4vw,16px)] tracking-[.28em] text-white/45">
          Stories Written in Color
        </p>
 
        {/* cta */}
        <a
          href="/portfolio"
          className="mt-9 px-9 py-3 rounded-full border border-white/[.16] text-white/60 text-[11px] tracking-[.2em] uppercase backdrop-blur-md font-['Cormorant_Garamond'] italic transition-all duration-300 hover:border-[rgba(212,169,106,.5)] hover:text-white"
        >
          View Portfolio
        </a>
 
      </div>
 
      {/* scroll indicator */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <span
          className="text-[9px] tracking-[.3em] uppercase text-white/25"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}
        >
          scroll
        </span>
        <div
          className="w-px h-9"
          style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,.28), transparent)' }}
        />
      </div>
 
      {/* corner labels */}
      <span className="absolute top-5 left-6 z-10 text-[9px] tracking-[.2em] text-white/20 uppercase italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        © 2025
      </span>
      <span className="absolute top-5 right-6 z-10 text-[9px] tracking-[.2em] text-white/20 uppercase italic" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        est. mmxxi
      </span>
 
      {/* marquee */}
      <div className="absolute bottom-0 left-0 w-full z-10">
        <CurvedLoop
          marqueeText="ORION BLACK • TATTOO • IDENTITY • ART • TRANSFORMATION • "
          className="w-screen fill-[#E6EDF7] opacity-[0.32] text-[28px] sm:text-[44px] md:text-6xl font-black uppercase italic"
          speed={1.5}
        />
      </div>
 
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;1,300&display=swap');
        @keyframes scanline { from { transform: translateY(0) } to { transform: translateY(150px) } }
      `}</style>
 
    </section>
  )
}

export default Video