import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from './Image'
import Text from './Text'
import WorkStrip from './WorkStrip'

gsap.registerPlugin(ScrollTrigger)

const works = [
  { id: '01' },
  { id: '02' },
  { id: '03' },
]

const WorkSection = () => {
  const sectionRef = useRef(null)
  const counterRef = useRef(null)

  const initCounter = () => {
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        if (!counterRef.current) return
        const idx = Math.min(Math.floor(self.progress * works.length), works.length - 1)
        counterRef.current.textContent = `0${idx + 1}`
      },
    })
  }

  return (
    <section id="selected-works" ref={sectionRef} className="relative bg-[#0c0b0f] text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Mono:wght@300&display=swap');
      `}</style>

      <div className="flex items-center justify-between px-6 pt-10 md:px-12">
        <span
          className="text-[10px] tracking-[0.3em] uppercase text-white/25"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          Selected Works
        </span>
        <span
          className="text-[10px] tracking-[0.3em] uppercase text-white/25"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          Brooklyn, NY - Est. 2021
        </span>
      </div>

      <div className="relative grid min-h-screen grid-cols-1 gap-12 px-6 py-20 md:grid-cols-2 md:gap-0 md:px-12 md:py-0">
        <Image sectionRef={sectionRef} counterRef={counterRef} onReady={initCounter} />
        <Text />
      </div>

      <WorkStrip />

      <div
        className="mx-6 h-px md:mx-12"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(212,169,106,0.2), transparent)' }}
      />
    </section>
  )
}

export default WorkSection
