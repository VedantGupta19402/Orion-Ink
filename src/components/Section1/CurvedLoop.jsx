import { memo, useEffect, useId, useMemo, useRef, useState } from 'react'
import { useIsVisible } from '../../lib/gsap'

const CurvedLoop = ({
  marqueeText = 'ORION INK • ',
  speed = 2,
  className = '',
  direction = 'left',
  interactive = true,
}) => {
  const text = useMemo(() => marqueeText + '\u00A0', [marqueeText])

  const measureRef = useRef(null)
  const textPathRef = useRef(null)
  const offsetRef = useRef(0)
  const [spacing, setSpacing] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const uid = useId()
  const pathId = `line-${uid}`
  const wrapRef = useRef(null)
  const isVisible = useIsVisible(wrapRef, {
    rootMargin: '250px 0px',
    threshold: 0,
    initial: true,
  })

  const dragRef = useRef(false)
  const lastXRef = useRef(0)
  const dirRef = useRef(direction)
  const velRef = useRef(0)
  const pathD = 'M-5000,120 L5000,120'

  const totalText = useMemo(() => (
    spacing ? Array(10).fill(text).join('') : text
  ), [spacing, text])

  const ready = spacing > 0

  useEffect(() => {
    const measure = () => {
      if (!measureRef.current) return
      setSpacing(measureRef.current.getComputedTextLength())
    }

    measure()

    if (typeof ResizeObserver === 'undefined' || !wrapRef.current) {
      window.addEventListener('resize', measure, { passive: true })
      return () => window.removeEventListener('resize', measure)
    }

    const observer = new ResizeObserver(measure)
    observer.observe(wrapRef.current)

    return () => observer.disconnect()
  }, [text, className])

  useEffect(() => {
    if (!spacing || !textPathRef.current) return

    offsetRef.current = -spacing
    textPathRef.current.setAttribute('startOffset', `${offsetRef.current}px`)
  }, [spacing])

  useEffect(() => {
    if (!spacing || !ready || !isVisible) return undefined

    let frame = 0
    const step = () => {
      if (!dragRef.current && textPathRef.current) {
        const delta = dirRef.current === 'right' ? speed : -speed
        let nextOffset = offsetRef.current + delta

        if (nextOffset <= -(spacing * 2)) nextOffset += spacing
        if (nextOffset >= 0) nextOffset -= spacing

        offsetRef.current = nextOffset
        textPathRef.current.setAttribute('startOffset', `${nextOffset}px`)
      }

      frame = requestAnimationFrame(step)
    }

    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [isVisible, ready, spacing, speed])

  const onPointerDown = (event) => {
    if (!interactive) return
    dragRef.current = true
    setIsDragging(true)
    lastXRef.current = event.clientX
    event.target.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event) => {
    if (!interactive || !dragRef.current || !textPathRef.current) return

    const dx = event.clientX - lastXRef.current
    lastXRef.current = event.clientX
    velRef.current = dx

    let nextOffset = offsetRef.current + dx

    if (nextOffset <= -(spacing * 2)) nextOffset += spacing
    if (nextOffset >= 0) nextOffset -= spacing

    offsetRef.current = nextOffset
    textPathRef.current.setAttribute('startOffset', `${nextOffset}px`)
  }

  const endDrag = () => {
    if (!interactive) return
    dragRef.current = false
    setIsDragging(false)
    dirRef.current = velRef.current > 0 ? 'right' : 'left'
  }

  return (
    <div
      ref={wrapRef}
      className={`flex w-full select-none items-center overflow-hidden touch-none ${ready ? 'visible' : 'invisible'}`}
      style={{ cursor: interactive ? (isDragging ? 'grabbing' : 'grab') : 'auto' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
    >
      <svg className="block h-[80px] w-full sm:h-[100px] md:h-[8vw] lg:h-[6vw]" viewBox="0 0 1440 240">
        <text ref={measureRef} xmlSpace="preserve" className="pointer-events-none invisible opacity-0">
          {text}
        </text>

        <defs>
          <path id={pathId} d={pathD} />
        </defs>

        {ready && (
          <text
            fontWeight="bold"
            fontSize="40"
            xmlSpace="preserve"
            className={`${className} sm:text-[32px] md:text-[40px] lg:text-[56px]`}
          >
            <textPath ref={textPathRef} href={`#${pathId}`} startOffset="0px">
              {totalText}
            </textPath>
          </text>
        )}
      </svg>
    </div>
  )
}

export default memo(CurvedLoop)
