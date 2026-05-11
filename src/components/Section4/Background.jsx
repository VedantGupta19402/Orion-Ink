import { useEffect, useRef } from 'react'
import { useIsVisible } from '../../lib/gsap'
import { usePerformanceProfile } from '../../lib/performance'

const Background = () => {
  const canvasRef = useRef(null)
  const profile = usePerformanceProfile()
  const isVisible = useIsVisible(canvasRef, {
    rootMargin: '400px 0px',
    threshold: 0,
    initial: false,
  })

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d', { alpha: true })
    if (!canvas || !ctx) return undefined

    const scale = profile.isLowEnd ? 0.45 : profile.isTouch ? 0.55 : 0.7
    const noiseSize = 256
    const frameInterval = 1000 / profile.grainFps
    let grainIntensity = 14

    const noiseCanvas = document.createElement('canvas')
    noiseCanvas.width = noiseSize
    noiseCanvas.height = noiseSize
    const noiseCtx = noiseCanvas.getContext('2d')
    const imageData = noiseCtx.createImageData(noiseSize, noiseSize)

    for (let index = 0; index < imageData.data.length; index += 4) {
      const value = Math.random() * 255
      imageData.data[index] = value
      imageData.data[index + 1] = value
      imageData.data[index + 2] = value
      imageData.data[index + 3] = 255
    }

    noiseCtx.putImageData(imageData, 0, 0)
    const pattern = ctx.createPattern(noiseCanvas, 'repeat')

    const resize = () => {
      canvas.width = Math.max(1, Math.floor(window.innerWidth * scale))
      canvas.height = Math.max(1, Math.floor(window.innerHeight * scale))
    }

    let rafId = 0
    let lastFrame = 0

    const draw = (time) => {
      if (isVisible && !document.hidden && time - lastFrame >= frameInterval) {
        lastFrame = time
        const lenis = window.lenis
        const velocity = lenis ? Math.abs(lenis.velocity) : 0
        const target = 14 + Math.min(velocity * 3.5, 42)

        grainIntensity += (target - grainIntensity) * 0.08

        const { width, height } = canvas
        const offsetX = Math.floor(Math.random() * noiseSize)
        const offsetY = Math.floor(Math.random() * noiseSize)

        ctx.clearRect(0, 0, width, height)
        ctx.globalAlpha = grainIntensity / 255
        ctx.fillStyle = pattern
        ctx.save()
        ctx.translate(-offsetX, -offsetY)
        ctx.fillRect(0, 0, width + noiseSize, height + noiseSize)
        ctx.restore()
      }

      rafId = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize, { passive: true })
    rafId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
    }
  }, [isVisible, profile.grainFps, profile.isLowEnd, profile.isTouch])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
      style={{ mixBlendMode: 'overlay', opacity: 0.6 }}
    />
  )
}

export default Background
