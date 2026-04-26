import React, { useEffect, useState } from 'react'
import Lenis from 'lenis'
import SiteNotice from './components/SiteNotice'
import Section1 from './components/Section1/Section1'
import Section2 from './components/Section2/Section2'
import Section3 from './components/Section3/Section3'
import Section4 from './components/Section4/Section4'
import useNoise from './components/useNoise'
import NoiseLayer from './components/NoiseLayer'
import Preloader from './components/Preloader'
const App = () => {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    const lenis = new Lenis()
    window.lenis = lenis
    let frameId;
    
    function raf(time) {
      lenis.raf(time)
      frameId = requestAnimationFrame(raf)
    }
    
    frameId = requestAnimationFrame(raf)
    
    return () => {
      cancelAnimationFrame(frameId)
      lenis.destroy()
    }
  }, [])
  useNoise()

  return (
    <div className="min-h-screen">
      <NoiseLayer />
      {!loaded && <Preloader onComplete={() => setLoaded(true)} />}
      <SiteNotice />
      <Section1 />
      <Section2 />
      <Section3 />
      < Section4/>
    </div>
  )
}
export default App