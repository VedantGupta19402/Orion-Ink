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

  // counter scrub lives here because it needs sectionRef + counterRef together
  // and counterRef is rendered inside FeaturedImage
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
    <section ref={sectionRef} className="relative bg-[#0c0b0f] text-white">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Mono:wght@300&display=swap');
      `}</style>

      {/* top label bar */}
      <div className="flex items-center justify-between px-6 md:px-12 pt-10">
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
          Brooklyn, NY — Est. 2021
        </span>
      </div>

      {/* split layout */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 min-h-screen px-6 md:px-12 gap-12 md:gap-0 py-20 md:py-0">
        <Image sectionRef={sectionRef} counterRef={counterRef} onReady={initCounter} />
        <Text />
      </div>

      <WorkStrip />

      {/* bottom divider */}
      <div
        className="h-px mx-6 md:mx-12"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(212,169,106,0.2), transparent)' }}
      />

    </section>
  )
}

export default WorkSection