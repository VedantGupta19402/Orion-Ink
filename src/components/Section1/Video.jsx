import React from 'react'
import CurvedLoop from './CurvedLoop' 

const Video = () => {
  return (
    <div className='relative w-full h-[100svh] md:h-screen overflow-hidden bg-black'>
      <video 
        autoPlay 
        muted
        loop 
        playsInline 
        src="/Tattoo_needle_engraving_202604101036.mp4" 
        className='w-full h-full object-cover'
      />

      {/* The Marquee Overlay */}
      <div className='absolute bottom-6 md:bottom-10 left-0 w-full z-10'>
        <CurvedLoop 
          marqueeText="ORION INK • TATTOO • IDENTITY • ART • TRANSFORMATION • "
          className="w-screen fill-[#E6EDF7] opacity-[0.6] text-[32px] sm:text-[48px] md:text-7xl font-black uppercase italic tracking-tight"
          speed={1.8}
        />
      </div>

      {/* Optional: Dark gradient at bottom to make text pop */}
      <div className='absolute bottom-0 left-0 w-full h-20 md:h-32 bg-gradient-to-t from-black/60 to-transparent pointer-events-none' />
    </div>
  )
}

export default Video