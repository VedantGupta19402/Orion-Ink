import React from 'react'

const GridRow1 = () => {
  return (
    <>
      {/* row 1 */}
      <div className='w-full h-auto flex flex-col md:flex-row gap-6 md:gap-8 px-4 md:pl-10 pt-10 bg-[#0B0F17]'>
        
        {/* BOX 1 */}
        <div className='h-auto md:h-80 w-full md:w-[55%] bg-gradient-to-b from-[#111827] to-[#0B0F17] rounded-lg border border-white/5 p-6 md:p-10 transition-transform duration-300 ease-out hover:scale-[1.02]'>
          <div className='max-w-full md:max-w-[60%]'>
            <h1 className='text-[#E6EDF7] text-[11px] md:text-[12px] opacity-45 font-medium leading-relaxed mb-4 md:mb-5 tracking-[0.32em] uppercase'>
              DEFINE YOURSELF
            </h1>

            <p className='text-[#E6EDF7] text-[36px] md:text-[56px] font-semibold leading-[1.1] mb-3 md:mb-4 tracking-tight'>
              IDENTITY
            </p>

            <p className='text-[#E6EDF7] text-[14px] md:text-[15px] opacity-65 font-normal leading-relaxed'>
              Ink that defines who you are.
            </p>
          </div>
        </div>

        {/* BOX 2 */}
        <div className='h-auto md:h-64 w-full md:w-[34%] bg-[#0F1623] rounded-lg border border-white/5 p-5 md:p-7 transition-transform duration-300 ease-out hover:scale-[1.015] self-start'>
          <h1 className='text-[#E6EDF7] text-[10px] md:text-[11px] opacity-40 font-medium leading-relaxed mb-3 md:mb-4 tracking-[0.28em] uppercase'>
            EXACTING DETAIL
          </h1>

          <p className='text-[#E6EDF7] text-[22px] md:text-[28px] font-semibold leading-snug mb-2 md:mb-2.5 tracking-wide'>
            PRECISION
          </p>

          <p className='text-[#E6EDF7] text-[12px] md:text-[13px] opacity-60 font-normal leading-normal'>
            Art in every line.
          </p>
        </div>

      </div>
    </>
  )
}

export default GridRow1