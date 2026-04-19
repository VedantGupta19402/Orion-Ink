import { useRef, useState } from 'react'
import BookingCTA from './BookingCTA'
import BookingHeadline from './BookingHeadline'
import BookingModal from './BookingModal'
import ProcessList from './ProcessList'
import StudioBackground from './StudioBackground'

const Section3 = () => {
  const sectionRef = useRef(null)
  const backgroundRef = useRef(null)
  const [modalOpen, setModalOpen] = useState(false)

  const handleMouseMove = (event) => {
    if (!backgroundRef.current) return

    const bounds = event.currentTarget.getBoundingClientRect()
    backgroundRef.current.onMouseMove(
      event.clientX - bounds.left,
      event.clientY - bounds.top,
    )
  }

  const handleMouseLeave = () => {
    backgroundRef.current?.onMouseLeave()
  }

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#06050a] text-white"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Mono:wght@300&display=swap');
      `}</style>

      <StudioBackground ref={backgroundRef} sectionRef={sectionRef} />

      <div className="relative z-10 px-6 pb-20 pt-10 md:px-12 md:pb-24">
        <div className="flex items-center justify-between gap-6">
          <span
            className="text-[10px] tracking-[0.3em] uppercase text-white/25"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            Booking Window
          </span>
          <span
            className="text-right text-[10px] tracking-[0.3em] uppercase text-white/25"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            By Appointment Only
          </span>
        </div>

        <div className="grid min-h-screen grid-cols-1 gap-16 py-16 md:grid-cols-2 md:gap-0 md:py-0">
          <BookingHeadline />

          <div className="flex flex-col justify-center gap-12">
            <ProcessList />

            <div className="md:pl-16 lg:pl-24">
              <BookingCTA onOpen={() => setModalOpen(true)} />
            </div>
          </div>
        </div>
      </div>

      <div
        className="relative z-10 mx-6 h-px md:mx-12"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(212,169,106,0.2), transparent)' }}
      />

      {modalOpen && <BookingModal onClose={() => setModalOpen(false)} />}
    </section>
  )
}

export default Section3
