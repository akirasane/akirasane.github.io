'use client'

import { useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

interface AuroraProps {
  colorStops?: string[]
  amplitude?: number
  blend?: number
  speed?: number
  className?: string
}

export default function Aurora({
  colorStops = ['#6366f1', '#a78bfa', '#06b6d4'],
  amplitude = 1.0,
  blend = 0.5,
  speed = 1.0,
  className = '',
}: AuroraProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number | null>(null)
  const timeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const hexToRgb = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16)
      const g = parseInt(hex.slice(3, 5), 16)
      const b = parseInt(hex.slice(5, 7), 16)
      return { r, g, b }
    }

    const draw = () => {
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      colorStops.forEach((color, i) => {
        const rgb = hexToRgb(color)
        const t = timeRef.current * speed
        const xOffset = Math.sin(t * 0.3 + i * 2.1) * w * 0.3 * amplitude
        const yOffset = Math.cos(t * 0.2 + i * 1.5) * h * 0.2 * amplitude
        const cx = w * (0.3 + i * 0.2) + xOffset
        const cy = h * 0.5 + yOffset
        const radius = Math.max(w, h) * (0.4 + i * 0.1)

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius)
        grad.addColorStop(0, `rgba(${rgb.r},${rgb.g},${rgb.b},${blend})`)
        grad.addColorStop(1, `rgba(${rgb.r},${rgb.g},${rgb.b},0)`)

        ctx.globalCompositeOperation = i === 0 ? 'source-over' : 'screen'
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, w, h)
      })

      if (!prefersReduced) {
        timeRef.current += 0.016
        animRef.current = requestAnimationFrame(draw)
      }
    }

    draw()

    return () => {
      ro.disconnect()
      if (animRef.current !== null) cancelAnimationFrame(animRef.current)
    }
  }, [colorStops, amplitude, blend, speed])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ pointerEvents: 'none' }}
    />
  )
}
