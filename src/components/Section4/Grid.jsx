import ImageCard from './ImageCard'

const pieces = [
  {
    id: '004',
    title: 'Storm Season',
    style: 'Blackwork',
    image: '/archive-01.jpg',
    fromDir: 'left',
    className: 'col-span-1 row-span-2',
    aspect: 'aspect-[3/4]',
  },
  {
    id: '005',
    title: 'Liminal',
    style: 'Fine Line',
    image: '/archive-02.jpg',
    fromDir: 'top',
    className: 'col-span-1 row-span-1',
    aspect: 'aspect-square',
  },
  {
    id: '006',
    title: 'Blood Moon',
    style: 'Japanese Traditional',
    image: '/archive-03.jpg',
    fromDir: 'right',
    className: 'col-span-1 row-span-1',
    aspect: 'aspect-square',
  },
  {
    id: '007',
    title: 'The Unravelling',
    style: 'Neo-Traditional',
    image: '/archive-04.jpg',
    fromDir: 'bottom',
    className: 'col-span-2 row-span-1',
    aspect: 'aspect-[16/7]',
  },
  {
    id: '008',
    title: 'Feral',
    style: 'Blackwork / Tebori',
    image: '/archive-05.jpg',
    fromDir: 'left',
    className: 'col-span-1 row-span-1',
    aspect: 'aspect-[4/3]',
  },
  {
    id: '009',
    title: 'Remnants',
    style: 'Fine Line / Geometric',
    image: '/archive-06.jpg',
    fromDir: 'right',
    className: 'col-span-1 row-span-1',
    aspect: 'aspect-[4/3]',
  },
]

const Grid = () => {
  return (
    <div className="px-6 md:px-12 py-16">

      <div className="flex items-center justify-between mb-8">
        <span
          className="text-[10px] tracking-[0.3em] uppercase text-white/20"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          The archive
        </span>
        <a
          href="/portfolio"
          data-cursor="open"
          className="text-[10px] tracking-[0.25em] uppercase text-[#d4a96a]/45 hover:text-[#d4a96a] transition-colors duration-300 no-underline"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          Full portfolio →
        </a>
      </div>

      {/* desktop — asymmetric 3-col grid */}
      <div className="hidden md:grid grid-cols-3 gap-3 auto-rows-auto">

        {/* row 1: tall left + two stacked right */}
        <div className="row-span-2">
          <ImageCard {...pieces[0]} className="w-full h-full min-h-[520px]" />
        </div>
        <ImageCard {...pieces[1]} className={`w-full ${pieces[1].aspect}`} />
        <ImageCard {...pieces[2]} className={`w-full ${pieces[2].aspect}`} />

        {/* row 2: wide span bottom */}
        <div className="col-span-2">
          <ImageCard {...pieces[3]} className={`w-full ${pieces[3].aspect}`} />
        </div>

        {/* row 3: two equal */}
        <ImageCard {...pieces[4]} className={`w-full ${pieces[4].aspect}`} />
        <ImageCard {...pieces[5]} className={`w-full ${pieces[5].aspect}`} />
        <div />

      </div>

      {/* mobile — single column */}
      <div className="flex flex-col gap-3 md:hidden">
        {pieces.map((p) => (
          <ImageCard
            key={p.id}
            {...p}
            className={`w-full ${p.aspect}`}
          />
        ))}
      </div>

    </div>
  )
}

export default Grid