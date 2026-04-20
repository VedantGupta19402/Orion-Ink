import { useEffect, useRef } from 'react'

const Background = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf
    let grainIntensity = 14

    // Offscreen noise canvas
    const noiseSize = 256;
    const noiseCanvas = document.createElement('canvas')
    noiseCanvas.width = noiseSize
    noiseCanvas.height = noiseSize
    const noiseCtx = noiseCanvas.getContext('2d')
    const imgData = noiseCtx.createImageData(noiseSize, noiseSize)
    for (let i = 0; i < imgData.data.length; i += 4) {
      const v = Math.random() * 255
      imgData.data[i] = v
      imgData.data[i + 1] = v
      imgData.data[i + 2] = v
      imgData.data[i + 3] = 255
    }
    noiseCtx.putImageData(imgData, 0, 0)
    
    // Create pattern once
    const pattern = ctx.createPattern(noiseCanvas, 'repeat')

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const draw = () => {
      const lenis = window.lenis
      const vel = lenis ? Math.abs(lenis.velocity) : 0

      // grain ramps up with scroll velocity, decays back to base
      const target = 14 + Math.min(vel * 3.5, 42)
      grainIntensity += (target - grainIntensity) * 0.08

      const currentOpacity = grainIntensity / 255
      const { width: w, height: h } = canvas

      ctx.clearRect(0, 0, w, h)
      ctx.globalAlpha = currentOpacity
      
      const offsetX = Math.floor(Math.random() * noiseSize)
      const offsetY = Math.floor(Math.random() * noiseSize)

      ctx.fillStyle = pattern
      ctx.save()
      ctx.translate(-offsetX, -offsetY)
      // Fill larger area to account for translation
      ctx.fillRect(0, 0, w + noiseSize, h + noiseSize)
      ctx.restore()

      raf = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
      style={{ mixBlendMode: 'overlay', opacity: 0.6 }}
    />
  )
}

export default Background