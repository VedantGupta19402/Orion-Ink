import { forwardRef, memo, useEffect, useRef, useState } from 'react'

const LazyImageBase = ({
  src,
  alt,
  className,
  style,
  loading = 'lazy',
  fetchPriority = 'low',
  decoding = 'async',
  rootMargin = '500px 0px',
  ...rest
}, forwardedRef) => {
  const internalRef = useRef(null)
  const canObserve = typeof window !== 'undefined' && 'IntersectionObserver' in window
  const shouldObserve = loading !== 'eager' && canObserve
  const [isReady, setIsReady] = useState(!shouldObserve)

  useEffect(() => {
    if (!shouldObserve) return undefined

    const element = internalRef.current
    if (!element) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setIsReady(true)
        observer.disconnect()
      },
      { rootMargin },
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [rootMargin, shouldObserve])

  const setRefs = (element) => {
    internalRef.current = element

    if (typeof forwardedRef === 'function') {
      forwardedRef(element)
      return
    }

    if (forwardedRef) {
      forwardedRef.current = element
    }
  }

  return (
    <img
      ref={setRefs}
      src={isReady ? src : undefined}
      alt={alt}
      className={className}
      style={style}
      loading={loading}
      fetchPriority={fetchPriority}
      decoding={decoding}
      {...rest}
    />
  )
}

const LazyImage = forwardRef(LazyImageBase)

export default memo(LazyImage)
