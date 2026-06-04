'use client'

import { useEffect, useRef } from 'react'

/**
 * LofiBackground — a canvas-based ambient animation for the terminal.
 *
 * Aesthetic: programmer lofi night scene
 *   • Slow-drifting floating code particles (keywords, symbols)
 *   • Soft glowing orbs that breathe AND slowly drift
 *   • Subtle rain streaks (slight angle variation) on the far background
 *   • Faint twinkling star field in the upper area
 *   • Occasional glitch line flashes for programmer aesthetic
 *   • A thin horizon glow line near the bottom (city-lights feel)
 * All drawn at very low opacity so the terminal content stays readable.
 * HiDPI/retina aware via devicePixelRatio.
 */
export default function LofiBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // ── Resize with DPR support ──────────────────────────────────────────
    let dpr = 1
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      const cssW = canvas.offsetWidth
      const cssH = canvas.offsetHeight
      canvas.width  = cssW * dpr
      canvas.height = cssH * dpr
      // Reset transform so repeat resizes don't stack; all draw coords = CSS px
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    // logical (CSS-pixel) dimensions used throughout draw loop
    const W = () => canvas.offsetWidth
    const H = () => canvas.offsetHeight

    // ── Config ──────────────────────────────────────────────────────────
    const CODE_TOKENS = [
      'const', 'async', 'await', 'return', 'import', 'export',
      'function', 'class', 'interface', 'type', '{}', '=>',
      '[]', '()', '...', 'null', 'true', 'false', '0x1F',
      'git', 'npm', 'cd', 'ls', 'grep', 'sudo',
      '404', '200', '∞', '∑', 'π', '∂', 'λ',
    ]

    const COLORS = [
      'rgba(99,102,241,',   // indigo
      'rgba(167,139,250,',  // violet
      'rgba(96,165,250,',   // blue
      'rgba(52,211,153,',   // emerald
      'rgba(251,191,36,',   // amber (rare)
    ]

    // ── Particles (floating code words) ─────────────────────────────────
    interface Particle {
      x: number; y: number
      vx: number; vy: number
      text: string
      size: number
      alpha: number
      alphaDelta: number
      alphaMin: number
      alphaMax: number
      color: string
    }

    const makeParticle = (): Particle => {
      const alphaMax = 0.04 + Math.random() * 0.1
      return {
        x: Math.random() * W(),
        y: Math.random() * H(),
        vx: (Math.random() - 0.5) * 0.18,
        vy: -0.06 - Math.random() * 0.14,
        text: CODE_TOKENS[Math.floor(Math.random() * CODE_TOKENS.length)],
        size: 9 + Math.random() * 7,
        alpha: Math.random() * alphaMax,
        alphaDelta: 0.0003 + Math.random() * 0.0006,
        alphaMin: 0.005,
        alphaMax,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }
    }

    const PARTICLE_COUNT = 55
    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, makeParticle)

    // ── Orbs — breathe AND drift slowly around their origin ──────────────
    interface Orb {
      ox: number; oy: number   // origin (relative 0-1, never changes)
      cx: number; cy: number   // current position (relative 0-1)
      radius: number
      color: string
      phase: number
      phaseSpeed: number
      baseAlpha: number
      driftAmp: number
      driftPhaseX: number
      driftPhaseY: number
      driftSpeedX: number
      driftSpeedY: number
    }

    const ORB_DEFS: Orb[] = [
      {
        ox: 0.15, oy: 0.75, cx: 0.15, cy: 0.75,
        radius: 180, color: '99,102,241',
        phase: 0,   phaseSpeed: 0.004,  baseAlpha: 0.045,
        driftAmp: 0.06, driftPhaseX: 0,   driftPhaseY: 1.2,
        driftSpeedX: 0.0009, driftSpeedY: 0.0007,
      },
      {
        ox: 0.85, oy: 0.25, cx: 0.85, cy: 0.25,
        radius: 220, color: '167,139,250',
        phase: 1.5, phaseSpeed: 0.003,  baseAlpha: 0.035,
        driftAmp: 0.05, driftPhaseX: 2.1, driftPhaseY: 0,
        driftSpeedX: 0.0007, driftSpeedY: 0.001,
      },
      {
        ox: 0.50, oy: 0.90, cx: 0.50, cy: 0.90,
        radius: 260, color: '96,165,250',
        phase: 0.8, phaseSpeed: 0.0025, baseAlpha: 0.03,
        driftAmp: 0.04, driftPhaseX: 1.0, driftPhaseY: 2.5,
        driftSpeedX: 0.0006, driftSpeedY: 0.0008,
      },
      {
        ox: 0.72, oy: 0.60, cx: 0.72, cy: 0.60,
        radius: 150, color: '52,211,153',
        phase: 2.2, phaseSpeed: 0.005,  baseAlpha: 0.025,
        driftAmp: 0.07, driftPhaseX: 3.0, driftPhaseY: 1.8,
        driftSpeedX: 0.0011, driftSpeedY: 0.0009,
      },
    ]

    // ── Star field (upper 70% of canvas) ────────────────────────────────
    interface Star {
      x: number; y: number
      radius: number
      baseAlpha: number
      twinklePhase: number
      twinkleSpeed: number
    }

    const STAR_COUNT = 60
    const stars: Star[] = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * W(),
      y: Math.random() * H() * 0.7,
      radius: 0.4 + Math.random() * 1.1,
      baseAlpha: 0.03 + Math.random() * 0.09,
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.003 + Math.random() * 0.008,
    }))

    // ── Rain streaks ─────────────────────────────────────────────────────
    interface Streak {
      x: number; y: number; len: number; speed: number; alpha: number; angle: number
    }
    const STREAK_COUNT = 30
    const streaks: Streak[] = Array.from({ length: STREAK_COUNT }, () => ({
      x: Math.random() * W(),
      y: Math.random() * H(),
      len: 15 + Math.random() * 35,
      speed: 0.4 + Math.random() * 0.8,
      alpha: 0.015 + Math.random() * 0.025,
      angle: -0.08 + Math.random() * 0.16,   // subtle angle variation
    }))

    // ── Glitch lines ─────────────────────────────────────────────────────
    interface GlitchLine {
      y: number; width: number; x: number
      alpha: number; life: number; maxLife: number
    }
    const glitchLines: GlitchLine[] = []
    let nextGlitch = 180 + Math.random() * 300

    // ── Main loop ────────────────────────────────────────────────────────
    let rafId: number

    const draw = () => {
      rafId = requestAnimationFrame(draw)

      const w = W()
      const h = H()

      ctx.clearRect(0, 0, w, h)

      // ── Stars ─────────────────────────────────────────────────────────
      for (const s of stars) {
        s.twinklePhase += s.twinkleSpeed
        const a = s.baseAlpha * (0.5 + 0.5 * Math.sin(s.twinklePhase))
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200,210,255,${a})`
        ctx.fill()
      }

      // ── Rain streaks ──────────────────────────────────────────────────
      ctx.save()
      for (const s of streaks) {
        const dx = Math.sin(s.angle) * s.len
        ctx.beginPath()
        ctx.moveTo(s.x, s.y)
        ctx.lineTo(s.x - 1 + dx, s.y + s.len)
        ctx.strokeStyle = `rgba(167,139,250,${s.alpha})`
        ctx.lineWidth = 0.8
        ctx.stroke()

        s.y += s.speed
        if (s.y > h + s.len) {
          s.y = -s.len
          s.x = Math.random() * w
        }
      }
      ctx.restore()

      // ── Orbs ──────────────────────────────────────────────────────────
      for (const orb of ORB_DEFS) {
        orb.phase       += orb.phaseSpeed
        orb.driftPhaseX += orb.driftSpeedX
        orb.driftPhaseY += orb.driftSpeedY

        const pulse = Math.sin(orb.phase)
        const alpha = orb.baseAlpha + pulse * 0.015

        orb.cx = orb.ox + Math.sin(orb.driftPhaseX) * orb.driftAmp
        orb.cy = orb.oy + Math.cos(orb.driftPhaseY) * orb.driftAmp * 0.6

        const grd = ctx.createRadialGradient(
          orb.cx * w, orb.cy * h, 0,
          orb.cx * w, orb.cy * h, orb.radius
        )
        grd.addColorStop(0,   `rgba(${orb.color},${alpha})`)
        grd.addColorStop(0.5, `rgba(${orb.color},${alpha * 0.4})`)
        grd.addColorStop(1,   `rgba(${orb.color},0)`)

        ctx.beginPath()
        ctx.arc(orb.cx * w, orb.cy * h, orb.radius, 0, Math.PI * 2)
        ctx.fillStyle = grd
        ctx.fill()
      }

      // ── Horizon glow line ─────────────────────────────────────────────
      const horizonY = h * 0.88
      const hGrd = ctx.createLinearGradient(0, horizonY - 2, 0, horizonY + 18)
      hGrd.addColorStop(0,   'rgba(99,102,241,0.0)')
      hGrd.addColorStop(0.3, 'rgba(99,102,241,0.07)')
      hGrd.addColorStop(0.6, 'rgba(167,139,250,0.05)')
      hGrd.addColorStop(1,   'rgba(99,102,241,0.0)')
      ctx.fillStyle = hGrd
      ctx.fillRect(0, horizonY - 2, w, 20)

      ctx.beginPath()
      ctx.moveTo(0, horizonY)
      ctx.lineTo(w, horizonY)
      ctx.strokeStyle = 'rgba(167,139,250,0.08)'
      ctx.lineWidth = 1
      ctx.stroke()

      // ── Glitch lines ──────────────────────────────────────────────────
      nextGlitch--
      if (nextGlitch <= 0) {
        const count = 1 + Math.floor(Math.random() * 3)
        for (let i = 0; i < count; i++) {
          const lineW = 40 + Math.random() * 200
          glitchLines.push({
            y: Math.random() * h,
            width: lineW,
            x: Math.random() * (w - lineW),
            alpha: 0.06 + Math.random() * 0.1,
            life: 0,
            maxLife: 4 + Math.floor(Math.random() * 8),
          })
        }
        nextGlitch = 200 + Math.random() * 400
      }

      for (let i = glitchLines.length - 1; i >= 0; i--) {
        const g = glitchLines[i]
        g.life++
        const a = g.alpha * (1 - g.life / g.maxLife)
        ctx.fillStyle = `rgba(167,139,250,${a})`
        ctx.fillRect(g.x, g.y, g.width, 1)
        if (g.life >= g.maxLife) glitchLines.splice(i, 1)
      }

      // ── Floating code particles ───────────────────────────────────────
      ctx.save()
      for (const p of particles) {
        p.alpha += p.alphaDelta
        if (p.alpha >= p.alphaMax) {
          p.alpha = p.alphaMax
          p.alphaDelta = -Math.abs(p.alphaDelta)
        } else if (p.alpha <= p.alphaMin) {
          p.alpha = p.alphaMin
          p.alphaDelta = Math.abs(p.alphaDelta)
        }

        ctx.font = `${p.size}px "JetBrains Mono", monospace`
        ctx.fillStyle = `${p.color}${p.alpha.toFixed(3)})`
        ctx.fillText(p.text, p.x, p.y)

        p.x += p.vx
        p.y += p.vy

        if (p.x > w + 60)  p.x = -60
        if (p.x < -60)     p.x = w + 60
        if (p.y < -20) {
          p.y = h + 10
          p.x = Math.random() * w
          p.text = CODE_TOKENS[Math.floor(Math.random() * CODE_TOKENS.length)]
        }
      }
      ctx.restore()
    }

    draw()

    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none select-none z-0"
      aria-hidden="true"
    />
  )
}
