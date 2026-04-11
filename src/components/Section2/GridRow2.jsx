import React from 'react'

const GridRow2 = () => {
  return (
    <div className='w-full h-auto flex flex-col md:flex-row gap-6 md:gap-8 px-4 md:px-10 mt-8'>

        {/* CRAFT (SMALL) */}
        <div className='h-auto md:h-64 w-full md:w-[34%] bg-[#0F1623] rounded-lg border border-[rgba(255,255,255,0.05)] p-[20px] md:p-[28px] transition-transform duration-300 ease-out hover:scale-[1.015]'>

            <h1 className='text-[#E6EDF7] text-[10px] md:text-[11px] opacity-40 font-[500] leading-[1.6] mb-[12px] md:mb-[14px] tracking-[0.28em] uppercase'>
                HANDMADE
            </h1>

            <p className='text-[#E6EDF7] text-[22px] md:text-[28px] font-[600] leading-[1.2] mb-[8px] md:mb-[10px] tracking-[0.05em]'>
                CRAFT
            </p>

            <p className='text-[#E6EDF7] text-[12px] md:text-[13px] opacity-60 font-[400] leading-[1.5]'>
                Masterful techniques.
            </p>

        </div>

        {/* TRANSFORMATION (LARGE) */}
        <div className='relative h-auto md:h-80 w-full md:w-[55%] bg-gradient-to-b from-[#111827] to-[#0B0F17] rounded-lg border border-[rgba(255,255,255,0.05)] p-[24px] md:p-[40px] overflow-hidden transition-transform duration-300 ease-out hover:scale-[1.02]'>

            {/* subtle image layer */}
            <div className='absolute inset-0 bg-[url("https://images.unsplash.com/photo-1542728928-1413d1894ed1?q=80&w=1200&auto=format&fit=crop")] bg-cover bg-center opacity-20'></div>

            {/* content */}
            <div className='relative max-w-[100%] md:max-w-[60%]'>

                <h1 className='text-[#E6EDF7] text-[11px] md:text-[12px] opacity-45 font-[500] leading-[1.6] mb-[16px] md:mb-[20px] tracking-[0.32em] uppercase'>
                    EVOLVE
                </h1>

                <p className='text-[#E6EDF7] text-[36px] md:text-[56px] font-[650] leading-[1.1] mb-[12px] md:mb-[16px] tracking-tight'>
                    TRANSFORMATION
                </p>

                <p className='text-[#E6EDF7] text-[14px] md:text-[15px] opacity-65 font-[400] leading-[1.6]'>
                    Ink that changes you.
                </p>

            </div>

        </div>

    </div>
  )
}

export default GridRow2