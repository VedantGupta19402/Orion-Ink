import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { SITE_NOTICE_EVENT } from '../pages/utils/siteEvents'

const SiteNotice = () => {
  const noticeRef = useRef(null)
  const closeTimerRef = useRef(null)
  const [notice, setNotice] = useState(null)

  useEffect(() => {
    const handleNotice = (event) => {
      const detail = event.detail ?? {}

      clearTimeout(closeTimerRef.current)
      setNotice({
        id: Date.now(),
        title: detail.title ?? 'Updated',
        message: detail.message ?? '',
      })
    }

    window.addEventListener(SITE_NOTICE_EVENT, handleNotice)

    return () => {
      clearTimeout(closeTimerRef.current)
      window.removeEventListener(SITE_NOTICE_EVENT, handleNotice)
    }
  }, [])

  useEffect(() => {
    if (!notice || !noticeRef.current) return

    gsap.fromTo(
      noticeRef.current,
      { autoAlpha: 0, y: 28, scale: 0.96 },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.45,
        ease: 'power3.out',
      },
    )

    closeTimerRef.current = window.setTimeout(() => {
      if (!noticeRef.current) {
        setNotice(null)
        return
      }

      gsap.to(noticeRef.current, {
        autoAlpha: 0,
        y: 18,
        duration: 0.35,
        ease: 'power2.in',
        onComplete: () => setNotice(null),
      })
    }, 3600)

    return () => clearTimeout(closeTimerRef.current)
  }, [notice])

  if (!notice) return null

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[100000] w-[min(92vw,24rem)] md:right-6 md:top-6">
      <div
        ref={noticeRef}
        className="overflow-hidden border bg-[#09080d]/95 px-5 py-4 text-white shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl"
        style={{ borderColor: 'rgba(212,169,106,0.22)' }}
      >
        <div
          className="absolute left-0 top-0 h-px w-full"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(212,169,106,0.5), transparent)' }}
        />

        <span
          className="block text-[10px] uppercase tracking-[0.3em] text-[#d4a96a]/75"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          Orion Ink
        </span>

        <h4
          className="mt-3 text-[30px] leading-none text-white/90"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            fontWeight: 400,
          }}
        >
          {notice.title}
        </h4>

        <p
          className="mt-3 mb-0 text-sm leading-6 text-white/45"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}
        >
          {notice.message}
        </p>
      </div>
    </div>
  )
}

export default SiteNotice
