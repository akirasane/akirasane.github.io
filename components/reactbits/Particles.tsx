'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  alpha: number
  color: string
}

interface ParticlesProps {
  count?: number
  colors?: string[]
  speed?: number
  minRadius?: number
  maxRadius?: number
  className?: string
}

export default function Particles({
  count = 80,
  colors = ['#6366f1', '#a78bfa', '#06b6d4', '#f3f4f6'],
  speed = 0.4,
  minRadius = 1,
  maxRadius = 3,
  className = '',
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number | null>(null)
  const particlesRef = useRef<Particle[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      initParticles()
    }

    const initParticles = () => {
      particlesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * speed * 2,
        vy: (Math.random() - 0.5) * speed * 2,
        radius: minRadius + Math.random() * (maxRadius - minRadius),
        alpha: 0.3 + Math.random() * 0.7,
        color: colors[Math.floor(Math.random() * colors.length)],
      }))
    }

    const draw = () => {
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      particlesRef.current.forEach((p) => {
        if (!prefersReduced) {
          p.x += p.vx
          p.y += p.vy
          if (p.x < 0 || p.x > w) p.vx *= -1
          if (p.y < 0 || p.y > h) p.vy *= -1
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.fill()
      })

      ctx.globalAlpha = 1

      if (!prefersReduced) {
        animRef.current = requestAnimationFrame(draw)
      }
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    draw()

    return () => {
      ro.disconnect()
      if (animRef.current !== null) cancelAnimationFrame(animRef.current)
    }
  }, [count, colors, speed, minRadius, maxRadius])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ pointerEvents: 'none' }}
    />
  )
}
