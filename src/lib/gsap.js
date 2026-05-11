import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

let isRegistered = false
let refreshTimer = null

const registerGsap = () => {
  if (isRegistered) return

  gsap.registerPlugin(ScrollTrigger, SplitText)
  ScrollTrigger.config({
    ignoreMobileResize: true,
    autoRefreshEvents: 'DOMContentLoaded,load,visibilitychange',
  })

  isRegistered = true
}

registerGsap()

export const requestScrollTriggerRefresh = (delay = 120) => {
  if (typeof window === 'undefined') return

  window.clearTimeout(refreshTimer)
  refreshTimer = window.setTimeout(() => {
    ScrollTrigger.refresh()
  }, delay)
}

export const useIsVisible = (ref, options = {}) => {
  const {
    root = null,
    rootMargin = '0px',
    threshold = 0,
    initial = true,
    freezeOnceVisible = false,
  } = options

  const [isVisible, setIsVisible] = useState(initial)
  const observerRef = useRef(null)

  useEffect(() => {
    const element = ref.current
    if (!element || typeof IntersectionObserver === 'undefined') return undefined

    observerRef.current?.disconnect()
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)

          if (freezeOnceVisible) {
            observerRef.current?.disconnect()
          }

          return
        }

        if (!freezeOnceVisible) {
          setIsVisible(false)
        }
      },
      { root, rootMargin, threshold },
    )

    observerRef.current.observe(element)

    return () => observerRef.current?.disconnect()
  }, [freezeOnceVisible, initial, ref, root, rootMargin, threshold])

  return isVisible
}

export { gsap, ScrollTrigger, SplitText }
