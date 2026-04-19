import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { emitSiteNotice } from '../../utils/siteEvents'

const times = [
  '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM',
  '4:00 PM', '5:00 PM',
]

const BookingModal = ({ onClose }) => {
  const overlayRef = useRef(null)
  const panelRef = useRef(null)

  const [form, setForm] = useState({
    date: '',
    time: '',
  })
  const [error, setError] = useState('')

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'power2.out' }
      )
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power4.out' }
      )
    })
    
    return () => ctx.revert()
  }, [])

  const close = () => {
    gsap.to(panelRef.current, { opacity: 0, y: 40, duration: 0.35, ease: 'power2.in' })
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: onClose,
    })
  }

  const onField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setError('')
  }

  const onSubmit = () => {
    if (!form.date) return setError('Pick a date.')
    if (!form.time) return setError('Pick a time.')

    const formattedDate = new Date(form.date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })

    emitSiteNotice({
      title: 'Session Booked',
      message: `Your session is successfully booked for ${formattedDate} at ${form.time}.`,
    })

    close()
  }

  const inputClass = `
    w-full bg-transparent border-b border-white/10 py-3 text-white/70 text-sm
    outline-none placeholder-white/20 transition-colors duration-300
    focus:border-[#d4a96a]/50 focus:text-white/90
  `

  const labelClass = `
    text-[9px] tracking-[0.28em] uppercase text-white/25 mb-1 block
  `

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[99999] flex items-end justify-center p-4 md:items-center md:p-0 bg-[#040308]/90 backdrop-blur-md"
      onClick={(event) => event.target === overlayRef.current && close()}
    >
      <div
        ref={panelRef}
        className="relative w-full max-w-md overflow-hidden bg-[#0c0b0f] border border-[#d4a96a]/10"
      >
        <div className="flex items-center justify-between border-b border-white/5 px-8 py-5">
          <span
            className="text-[10px] uppercase tracking-[0.3em] text-white/30"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            Date & Time Selector
          </span>
          <button
            type="button"
            onClick={close}
            className="text-lg leading-none text-white/20 transition-colors duration-200 hover:text-white/60 bg-transparent border-none appearance-none"
            aria-label="Close booking form"
          >
            x
          </button>
        </div>

        <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-[#d4a96a]/40 to-transparent" />

        <div className="flex flex-col gap-6 px-8 py-8">
          <div>
            <span className={labelClass} style={{ fontFamily: "'DM Mono', monospace" }}>Select Date</span>
            <input
              type="date"
              value={form.date}
              onChange={(event) => onField('date', event.target.value)}
              className={`${inputClass} text-xs md:text-sm`}
              style={{ fontFamily: "'DM Mono', monospace", colorScheme: 'dark' }}
            />
          </div>
          <div>
            <span className={labelClass} style={{ fontFamily: "'DM Mono', monospace" }}>Select Time</span>
            <select
              value={form.time}
              onChange={(event) => onField('time', event.target.value)}
              className={`${inputClass} text-xs md:text-sm`}
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              <option value="" disabled>Choose an available slot</option>
              {times.map((time) => (
                <option key={time} value={time} className="bg-[#0c0b0f]">{time}</option>
              ))}
            </select>
          </div>

          {error && (
            <span
              className="text-[10px] tracking-[0.2em] text-[#d4a96a]/70"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              {`-> ${error}`}
            </span>
          )}

          <div className="flex flex-col gap-4 border-t border-white/5 pt-6 mt-2 md:flex-row md:items-center md:justify-between">
            <span
              className="text-[9px] uppercase tracking-[0.2em] text-white/20 text-center md:text-left"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              Select time to confirm
            </span>
            <button
              type="button"
              onClick={onSubmit}
              className="px-8 py-3 text-[10px] uppercase tracking-[0.28em] transition-all duration-300 border border-[#d4a96a]/25 text-white/50 bg-transparent hover:bg-[#d4a96a]/5 hover:border-[#d4a96a]/50 hover:text-[#d4a96a]"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingModal
