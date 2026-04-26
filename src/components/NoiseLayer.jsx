import { useEffect, useRef } from 'react'

const NoiseLayer = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let rafId
    let frameCount = 0

    const resize = () => {
      canvas.width  = Math.ceil(window.innerWidth  / 2)
      canvas.height = Math.ceil(window.innerHeight / 2)
    }

    const draw = () => {
      frameCount++

      if (frameCount % 3 === 0) {
        const { width: w, height: h } = canvas
        const imgData = ctx.createImageData(w, h)

        for (let i = 0; i < imgData.data.length; i += 4) {
          const v = Math.random() * 255 | 0
          imgData.data[i]     = v
          imgData.data[i + 1] = v
          imgData.data[i + 2] = v
          // max alpha 18 — barely visible, just texture
          imgData.data[i + 3] = Math.random() * 18 | 0
        }

        ctx.putImageData(imgData, 0, 0)
      }

      rafId = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    draw()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
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