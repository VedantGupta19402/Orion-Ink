import { memo, useEffect, useRef } from 'react'
import Image from './Image'
import Text from './Text'
import WorkStrip from './WorkStrip'
import { ScrollTrigger } from '../../lib/gsap'

const works = [{ id: '01' }, { id: '02' }, { id: '03' }]

const WorkSection = () => {
  const sectionRef = useRef(null)
  const counterRef = useRef(null)

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        if (!counterRef.current) return

        const index = Math.min(Math.floor(self.progress * works.length), works.length - 1)
        counterRef.current.textContent = `0${index + 1}`
      },
    })

    return () => trigger.kill()
  }, [])

  return (
    <section id="selected-works" ref={sectionRef} className="relative bg-[#0c0b0f] text-white">
      <div className="flex items-center justify-between px-6 pt-10 md:px-12">
        <span
          className="text-[10px] uppercase tracking-[0.3em] text-white/25"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          Selected Works
        </span>
        <span
          className="text-[10px] uppercase tracking-[0.3em] text-white/25"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          Brooklyn, NY - Est. 2021
        </span>
      </div>

      <div className="relative grid min-h-screen grid-cols-1 gap-12 px-6 py-20 md:grid-cols-2 md:gap-0 md:px-12 md:py-0">
        <Image sectionRef={sectionRef} counterRef={counterRef} />
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

export default memo(WorkSection)
