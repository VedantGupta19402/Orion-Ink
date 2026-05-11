import { createElement, memo, Suspense, useRef } from 'react'
import { useIsVisible } from '../lib/gsap'

const DeferredSection = ({
  component: Component,
  rootMargin = '1200px 0px',
  placeholderClassName = '',
}) => {
  const anchorRef = useRef(null)
  const shouldMount = useIsVisible(anchorRef, {
    rootMargin,
    threshold: 0,
    initial: false,
    freezeOnceVisible: true,
  })

  return (
    <div ref={anchorRef}>
      {shouldMount ? (
        <Suspense fallback={null}>
          {createElement(Component)}
        </Suspense>
      ) : (
        <div aria-hidden="true" className={placeholderClassName} />
      )}
    </div>
  )
}

export default memo(DeferredSection)
