import { memo, useEffect, useRef } from 'react'
import { emitSiteNotice } from '../../pages/utils/siteEvents'
import { gsap } from '../../lib/gsap'
import { usePerformanceProfile } from '../../lib/performance'

const steps = [
  { id: '01', label: 'Consultation', detail: 'Vision + placement' },
  { id: '02', label: 'Design', detail: 'Custom artwork only' },
  { id: '03', label: 'Session', detail: '4-12 hour blocks' },
  { id: '04', label: 'Aftercare', detail: 'Lifetime guidance' },
]

const ProcessList = () => {
  const stepsRef = useRef([])
  const dashesRef = useRef([])
  const profile = usePerformanceProfile()

  useEffect(() => {
    const ctx = gsap.context(() => {
      stepsRef.current.forEach((element, index) => {
        if (!element) return

        gsap.from(element, {
          clipPath: 'inset(0 100% 0 0)',
          duration: 1,
          delay: index * 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 87%',
            once: true,
          },
        })
      })
    })

    return () => ctx.revert()
  }, [])

  const onStepEnter = (index) => {
    if (!profile.hoverFxEnabled) return

    gsap.to(dashesRef.current[index], {
      width: 48,
      duration: 0.4,
      ease: 'power2.out',
    })
    gsap.to(stepsRef.current[index].querySelector('.step-label'), {
      x: 6,
      duration: 0.4,
      ease: 'power2.out',
    })
  }

  const onStepLeave = (index) => {
    if (!profile.hoverFxEnabled) return

    gsap.to(dashesRef.current[index], {
      width: 24,
      duration: 0.5,
      ease: 'elastic.out(1, 0.6)',
    })
    gsap.to(stepsRef.current[index].querySelector('.step-label'), {
      x: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.6)',
    })
  }

  return (
    <div className="flex flex-col justify-center md:pl-16 lg:pl-24">
      <span
        className="mb-8 text-[10px] uppercase tracking-[0.3em] text-white/20"
        style={{ fontFamily: "'DM Mono', monospace" }}
      >
        How it works
      </span>

      {steps.map((step, index) => (
        <div
          key={step.id}
          ref={(element) => {
            stepsRef.current[index] = element
          }}
          className="flex items-start gap-6 border-b border-white/[0.05] py-6"
          style={{ clipPath: 'inset(0 0 0 0)', cursor: profile.hoverFxEnabled ? 'none' : 'auto' }}
          onMouseEnter={() => onStepEnter(index)}
          onMouseLeave={() => onStepLeave(index)}
        >
          <span
            className="mt-1 shrink-0 text-[10px] tracking-[0.2em] text-[#d4a96a]/35"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            {step.id}
          </span>

          <div className="flex flex-1 flex-col gap-1">
            <span
              className="step-label text-2xl text-white/75 md:text-3xl"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: 'italic',
                fontWeight: 300,
              }}
            >
              {step.label}
            </span>
            <span
              className="text-[9px] uppercase tracking-[0.25em] text-white/22"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              {step.detail}
            </span>
          </div>

          <div
            ref={(element) => {
              dashesRef.current[index] = element
            }}
            className="mt-3 h-px shrink-0 self-start"
            style={{
              width: 24,
              background: 'rgba(212,169,106,0.28)',
            }}
          />
        </div>
      ))}

      <button
        type="button"
        onClick={async () => {
          const handle = '@orionblack.studio'

          try {
            await navigator.clipboard.writeText(handle)
            emitSiteNotice({
              title: 'Instagram handle copied',
              message: `${handle} is ready to paste. This demo stays on the site, so nothing redirects away.`,
            })
          } catch {
            emitSiteNotice({
              title: 'Instagram handle',
              message: `${handle} is shown here for the frontend demo. Redirects are intentionally disabled.`,
            })
          }
        }}
        className="group mt-8 flex w-fit items-center gap-3"
        style={{ cursor: profile.hoverFxEnabled ? 'none' : 'auto' }}
      >
        <span
          className="text-[9px] uppercase tracking-[0.28em] text-white/22 transition-colors duration-300 group-hover:text-[#d4a96a]/55"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          @orionblack.studio
        </span>
        <div
          className="h-px w-0 transition-all duration-500 group-hover:w-8"
          style={{ background: 'rgba(212,169,106,0.45)' }}
        />
      </button>
    </div>
  )
}

export default memo(ProcessList)
