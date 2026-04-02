'use client'

import { useRef, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

interface SplitTextProps {
  text: string
  className?: string
  delay?: number
  duration?: number
  stagger?: number
  from?: gsap.TweenVars
}

export default function SplitText({
  text,
  className = '',
  delay = 0,
  duration = 0.6,
  stagger = 0.04,
  from = { opacity: 0, y: 40 },
}: SplitTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const container = containerRef.current
      if (!container) return

      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (prefersReduced) return

      const chars = container.querySelectorAll<HTMLSpanElement>('.split-char')
      gsap.from(chars, {
        ...from,
        duration,
        stagger,
        delay,
        ease: 'power3.out',
      })
    },
    { scope: containerRef }
  )

  const chars = text.split('').map((char, i) => (
    <span
      key={i}
      className="split-char inline-block"
      style={{ whiteSpace: char === ' ' ? 'pre' : undefined }}
    >
      {char}
    </span>
  ))

  return (
    <span ref={containerRef} className={className} aria-label={text}>
      {chars}
    </span>
  )
}
