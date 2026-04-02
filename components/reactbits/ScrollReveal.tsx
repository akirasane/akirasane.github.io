'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  duration?: number
  delay?: number
  stagger?: number
  threshold?: number
  from?: gsap.TweenVars
}

export default function ScrollReveal({
  children,
  className = '',
  duration = 0.6,
  delay = 0,
  stagger = 0.1,
  threshold = 0.1,
  from = { opacity: 0, y: 50, scale: 0.95 },
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const container = containerRef.current
      if (!container) return

      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (prefersReduced) return

      const children = Array.from(container.children) as HTMLElement[]
      gsap.set(children, from)

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              gsap.to(children, {
                opacity: 1,
                y: 0,
                x: 0,
                scale: 1,
                duration,
                delay,
                stagger,
                ease: 'power3.out',
              })
              observer.unobserve(container)
            }
          })
        },
        { threshold }
      )

      observer.observe(container)

      return () => observer.disconnect()
    },
    { scope: containerRef }
  )

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}
