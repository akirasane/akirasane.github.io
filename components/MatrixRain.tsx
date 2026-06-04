'use client'

import { useEffect, useRef } from 'react'

interface MatrixRainProps {
  onClose: () => void
}

export default function MatrixRain({ onClose }: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Get color from active CSS theme variable
    const themeColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--accent-primary')
      .trim() || '#00ff66'

    // Resize canvas
    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Characters
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄ'
    const charArr = chars.split('')

    const fontSize = 14
    const columns = Math.floor(canvas.width / fontSize)
    
    // Y coordinates of drops
    const drops: number[] = Array(columns).fill(1)

    let animationFrameId: number

    // Render loop
    const draw = () => {
      // Semi-transparent background to create trail
      ctx.fillStyle = 'rgba(10, 10, 10, 0.08)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = themeColor
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        // Random char
        const char = charArr[Math.floor(Math.random() * charArr.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize

        ctx.fillText(char, x, y)

        // Reset drop to top if it goes off screen (with random variance)
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }

        drops[i]++
      }

      animationFrameId = requestAnimationFrame(draw)
    }

    animationFrameId = requestAnimationFrame(draw)

    // Keydown or click listener to exit
    const handleClose = () => {
      onClose()
    }

    window.addEventListener('keydown', handleClose)
    canvas.addEventListener('click', handleClose)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('keydown', handleClose)
      if (canvas) {
        canvas.removeEventListener('click', handleClose)
      }
      cancelAnimationFrame(animationFrameId)
    }
  }, [onClose])

  return (
    <div className="absolute inset-0 bg-black/95 z-40 flex items-center justify-center cursor-pointer">
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs font-mono opacity-60 animate-pulse text-[var(--accent-primary)] pointer-events-none">
        PRESS ANY KEY OR CLICK TO EXIT MATRIX MODE
      </div>
    </div>
  )
}
