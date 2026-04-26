import { useEffect } from 'react'

const useNoise = () => {
  useEffect(() => {
    // Create offscreen canvas
    const canvas = document.createElement('canvas')
    canvas.width = 200
    canvas.height = 200
    const ctx = canvas.getContext('2d')

    // Fill with random pixel data (grayscale with random alpha)
    const imgData = ctx.createImageData(200, 200)
    for (let i = 0; i < imgData.data.length; i += 4) {
      const v = Math.floor(Math.random() * 255)
      imgData.data[i] = v
      imgData.data[i + 1] = v
      imgData.data[i + 2] = v
      imgData.data[i + 3] = 255
    }
    ctx.putImageData(imgData, 0, 0)

    // Convert to data URL and set as CSS custom property
    const url = canvas.toDataURL('image/png')
    document.documentElement.style.setProperty('--noise', `url(${url})`)

    return () => {
      document.documentElement.style.removeProperty('--noise')
    }
  }, [])
}

export default useNoise
