import { useEffect, useRef, useState } from 'react'

const Clock = () => {
  const [time, setTime] = useState('')
  const [date, setDate] = useState('')
  const intervalRef = useRef(null)

  useEffect(() => {
    const tick = () => {
      const now = new Date()

      const t = now.toLocaleTimeString('en-US', {
        timeZone: 'America/New_York',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })

      const d = now.toLocaleDateString('en-US', {
        timeZone: 'America/New_York',
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }).toUpperCase()

      setTime(t)
      setDate(d)
    }

    tick()
    intervalRef.current = setInterval(tick, 1000)
    return () => clearInterval(intervalRef.current)
  }, [])

  return (
    <div className="flex flex-col gap-1">
      <span
        className="text-[9px] tracking-[0.3em] uppercase text-white/18"
        style={{ fontFamily: "'DM Mono', monospace" }}
      >
        Brooklyn, NY
      </span>
      <span
        className="text-sm tracking-[0.15em] text-white/35"
        style={{ fontFamily: "'DM Mono', monospace" }}
      >
        {time}
      </span>
      <span
        className="text-[9px] tracking-[0.2em] text-white/18"
        style={{ fontFamily: "'DM Mono', monospace" }}
      >
        {date}
      </span>
    </div>
  )
}

export default Clock