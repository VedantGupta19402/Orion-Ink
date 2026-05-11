import { memo, useRef } from 'react'
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
      className="relative overflow-hidden bg-[#07060b] text-white"
    >
      <Background />

      <div className="relative z-10 flex items-center justify-between px-6 pb-0 pt-10 md:px-12">
        <span
          className="text-[10px] uppercase tracking-[0.3em] text-white/20"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          04 - Archive
        </span>
        <span
          className="text-[10px] uppercase tracking-[0.3em] text-white/20"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          2021-2025
        </span>
      </div>

      <div className="relative z-10 mt-10">
        <Counter />
      </div>

      <div className="relative z-10">
        <Grid />
      </div>

      <div className="relative z-10">
        <GlitchStatement sectionRef={sectionRef} />
      </div>

      <div className="relative z-10">
        <Footer />
      </div>
    </section>
  )
}

export default memo(Section4)
