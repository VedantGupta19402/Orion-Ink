import { lazy, useMemo } from 'react'

const DEFAULT_PROFILE = {
  isTouch: false,
  hasHover: true,
  isMobileViewport: false,
  isLowEnd: false,
  isLowMemory: false,
  maxDpr: 2,
  webglDpr: [1, 1.6],
  webglSegments: 224,
  cursorEnabled: true,
  hoverFxEnabled: true,
  noiseFps: 18,
  grainFps: 20,
  preloaderNoiseFps: 24,
}

const resolveProfile = () => {
  if (typeof window === 'undefined') return DEFAULT_PROFILE

  const isTouch = window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0
  const hasHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  const isMobileViewport = window.innerWidth < 1024
  const deviceMemory = navigator.deviceMemory ?? 4
  const hardwareConcurrency = navigator.hardwareConcurrency ?? 4
  const isLowMemory = deviceMemory <= 4
  const isLowEnd = isTouch && (deviceMemory <= 4 || hardwareConcurrency <= 6)

  const maxDpr = isLowEnd ? 1.2 : isTouch ? 1.5 : 2

  return {
    isTouch,
    hasHover,
    isMobileViewport,
    isLowEnd,
    isLowMemory,
    maxDpr,
    webglDpr: isLowEnd ? [0.85, 1.05] : isTouch ? [0.95, 1.25] : [1, 1.8],
    webglSegments: isLowEnd ? 128 : isTouch ? 176 : 256,
    cursorEnabled: hasHover,
    hoverFxEnabled: hasHover,
    noiseFps: isLowEnd ? 10 : isTouch ? 12 : 18,
    grainFps: isLowEnd ? 12 : isTouch ? 14 : 20,
    preloaderNoiseFps: isLowEnd ? 16 : isTouch ? 18 : 24,
  }
}

export const usePerformanceProfile = () => useMemo(() => resolveProfile(), [])

export const scheduleIdleTask = (callback, timeout = 1200) => {
  if (typeof window === 'undefined') return () => {}

  if ('requestIdleCallback' in window) {
    const id = window.requestIdleCallback(callback, { timeout })
    return () => window.cancelIdleCallback(id)
  }

  const id = window.setTimeout(callback, 1)
  return () => window.clearTimeout(id)
}

export const lazyWithPreload = (factory) => {
  const Component = lazy(factory)
  Component.preload = factory
  return Component
}
