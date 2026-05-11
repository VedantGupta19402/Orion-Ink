import React, { memo, startTransition, useEffect, useState } from 'react'
import Lenis from 'lenis'
import SiteNotice from './components/SiteNotice'
import Section1 from './components/Section1/Section1'
import Section2 from './components/Section2/Section2'
import NoiseLayer from './components/NoiseLayer'
import Preloader from './components/Preloader'
import DeferredSection from './components/DeferredSection'
import { lazyWithPreload, usePerformanceProfile } from './lib/performance'

const Section3 = lazyWithPreload(() => import('./components/Section3/Section3'))
const Section4 = lazyWithPreload(() => import('./components/Section4/Section4'))

const App = () => {
  const [loaded, setLoaded] = useState(false)
  const profile = usePerformanceProfile()

  useEffect(() => {
    const lenis = new Lenis({
      smoothWheel: true,
      syncTouch: profile.isTouch,
      touchMultiplier: profile.isLowEnd ? 0.95 : 1,
      wheelMultiplier: 1,
    })

    window.lenis = lenis

    let frameId = 0

    const raf = (time) => {
      lenis.raf(time)
      frameId = requestAnimationFrame(raf)
    }

    frameId = requestAnimationFrame(raf)

    const handleVisibilityChange = () => {
      if (document.hidden) {
        lenis.stop()
        cancelAnimationFrame(frameId)
        return
      }

      lenis.start()
      frameId = requestAnimationFrame(raf)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange, { passive: true })

    return () => {
      cancelAnimationFrame(frameId)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      lenis.destroy()
      delete window.lenis
    }
  }, [profile.isLowEnd, profile.isTouch])
  return (
    <div className="min-h-screen">
      <NoiseLayer />
      {!loaded && <Preloader onComplete={() => startTransition(() => setLoaded(true))} />}
      <SiteNotice />
      <Section1 />
      <Section2 />
      <DeferredSection
        component={Section3}
        rootMargin="1200px 0px"
        placeholderClassName="min-h-[140vh] bg-[#06050a]"
      />
      <DeferredSection
        component={Section4}
        rootMargin="1400px 0px"
        placeholderClassName="min-h-[180vh] bg-[#07060b]"
      />
    </div>
  )
}

export default memo(App)
