import { memo } from 'react'
import ImageCard from './ImageCard'

const pieces = [
  {
    id: '004',
    title: 'Storm Season',
    style: 'Blackwork',
    image: '/archive1.png',
    fromDir: 'left',
    className: 'col-span-1 row-span-2',
    aspect: 'aspect-[3/4]',
  },
  {
    id: '005',
    title: 'Liminal',
    style: 'Fine Line',
    image: '/archive2.png',
    fromDir: 'top',
    className: 'col-span-1 row-span-1',
    aspect: 'aspect-square',
  },
  {
    id: '006',
    title: 'Blood Moon',
    style: 'Japanese Traditional',
    image: '/archive3.png',
    fromDir: 'right',
    className: 'col-span-1 row-span-1',
    aspect: 'aspect-square',
  },
  {
    id: '007',
    title: 'The Unravelling',
    style: 'Neo-Traditional',
    image: '/archive4.png',
    fromDir: 'bottom',
    className: 'col-span-2 row-span-1',
    aspect: 'aspect-[16/7]',
  },
  {
    id: '008',
    title: 'Feral',
    style: 'Blackwork / Tebori',
    image: '/archive5.png',
    fromDir: 'left',
    className: 'col-span-1 row-span-1',
    aspect: 'aspect-[4/3]',
  },
  {
    id: '009',
    title: 'Remnants',
    style: 'Fine Line / Geometric',
    image: '/archive6.png',
    fromDir: 'right',
    className: 'col-span-1 row-span-1',
    aspect: 'aspect-[4/3]',
  },
]

const Grid = () => {
  return (
    <div className="px-6 py-16 md:px-12">
      <div className="mb-8 flex items-center justify-between">
        <span
          className="text-[10px] uppercase tracking-[0.3em] text-white/20"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          The archive
        </span>
        <button
          type="button"
          data-cursor="open"
          className="text-[10px] uppercase tracking-[0.25em] text-[#d4a96a]/45 transition-colors duration-300 hover:text-[#d4a96a]"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          Full portfolio →
        </button>
      </div>

      <div className="hidden auto-rows-auto grid-cols-3 gap-3 md:grid">
        <div className="row-span-2">
          <ImageCard {...pieces[0]} className="h-full min-h-[520px] w-full" />
        </div>
        <ImageCard {...pieces[1]} className={`w-full ${pieces[1].aspect}`} />
        <ImageCard {...pieces[2]} className={`w-full ${pieces[2].aspect}`} />

        <div className="col-span-2">
          <ImageCard {...pieces[3]} className={`w-full ${pieces[3].aspect}`} />
        </div>

        <ImageCard {...pieces[4]} className={`w-full ${pieces[4].aspect}`} />
        <ImageCard {...pieces[5]} className={`w-full ${pieces[5].aspect}`} />
        <div />
      </div>

      <div className="flex flex-col gap-3 md:hidden">
        {pieces.map((piece) => (
          <ImageCard
            key={piece.id}
            {...piece}
            className={`w-full ${piece.aspect}`}
          />
        ))}
      </div>
    </div>
  )
}

export default memo(Grid)
