import { useEffect, useRef } from 'react'
import { usePerformanceProfile } from '../lib/performance'

const NoiseLayer = () => {
  const canvasRef = useRef(null)
  const profile = usePerformanceProfile()

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d', { alpha: true })
    if (!canvas || !ctx) return undefined

    const scale = profile.isLowEnd ? 0.35 : profile.isTouch ? 0.45 : 0.5
    const noiseSize = 128
    const frameInterval = 1000 / profile.noiseFps

    const noiseCanvas = document.createElement('canvas')
    noiseCanvas.width = noiseSize
    noiseCanvas.height = noiseSize
    const noiseCtx = noiseCanvas.getContext('2d')
    const imageData = noiseCtx.createImageData(noiseSize, noiseSize)

    for (let index = 0; index < imageData.data.length; index += 4) {
      const value = Math.random() * 255 | 0
      imageData.data[index] = value
      imageData.data[index + 1] = value
      imageData.data[index + 2] = value
      imageData.data[index + 3] = Math.random() * 18 | 0
    }

    noiseCtx.putImageData(imageData, 0, 0)
    const pattern = ctx.createPattern(noiseCanvas, 'repeat')

    const resize = () => {
      canvas.width = Math.max(1, Math.ceil(window.innerWidth * scale))
      canvas.height = Math.max(1, Math.ceil(window.innerHeight * scale))
    }

    let rafId = 0
    let lastFrame = 0

    const draw = (time) => {
      if (!document.hidden && time - lastFrame >= frameInterval) {
        lastFrame = time
        const { width, height } = canvas
        const offsetX = Math.floor(Math.random() * noiseSize)
        const offsetY = Math.floor(Math.random() * noiseSize)

        ctx.clearRect(0, 0, width, height)
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
  }, [profile.isLowEnd, profile.isTouch, profile.noiseFps])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 h-full w-full"
      style={{
        zIndex: 9999,
        mixBlendMode: 'soft-light',
        opacity: 0.4,
        transform: 'scale(2)',
        transformOrigin: 'top left',
        imageRendering: 'pixelated',
      }}
    />
  )
}

export default NoiseLayer
