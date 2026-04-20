import { useRef } from 'react'
import Background from './Background'
import Counter from './Counter'
import Grid from './Grid'
import GlitchStatement from './GlitchStatement'
import Footer from './Footer'

const Section4 = () => {
  const sectionRef = useRef(null)

  return (
    <section
      ref={sectionRef}
      id="archive"
      className="relative bg-[#07060b] text-white overflow-hidden"
    >

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;1,300&family=DM+Mono:wght@300&display=swap');
      `}</style>

      {/* scroll-reactive grain canvas */}
      <Background />

      {/* top label */}
      <div className="relative z-10 flex items-center justify-between px-6 md:px-12 pt-10 pb-0">
        <span
          className="text-[10px] tracking-[0.3em] uppercase text-white/20"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          04 — Archive
        </span>
        <span
          className="text-[10px] tracking-[0.3em] uppercase text-white/20"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          2021–2025
        </span>
      </div>

      {/* count-up stats strip */}
      <div className="relative z-10 mt-10">
        <Counter />
      </div>

      {/* asymmetric image grid */}
      <div className="relative z-10">
        <Grid />
      </div>

      {/* glitch statement */}
      <div className="relative z-10">
        <GlitchStatement sectionRef={sectionRef} />
      </div>

      {/* footer */}
      <div className="relative z-10">
        <Footer />
      </div>

    </section>
  )
}

export default Section4