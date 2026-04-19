import React, { useEffect } from 'react'
import Lenis from 'lenis'
import SiteNotice from './components/SiteNotice'
import Section1 from './components/Section1/Section1'
import Section2 from './components/Section2/Section2'
import Section3 from './components/Section3/Section3'
const App = () => {
  useEffect(() => {
    const lenis = new Lenis()
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
  return (
    <div className="min-h-screen">
      <SiteNotice />
      <Section1 />
      <Section2 />
      <Section3 />
    </div>
  )
}
export default App