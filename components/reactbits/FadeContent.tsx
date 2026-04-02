'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

interface FadeContentProps {
  children: React.ReactNode
  className?: string
  duration?: number
  delay?: number
  threshold?: number
  from?: gsap.TweenVars
}

export default function FadeContent({
  children,
  className = '',
  duration = 0.7,
  delay = 0,
  threshold = 0.15,
  from = { opacity: 0, y: 30 },
}: FadeContentProps) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return

      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (prefersReduced) return

      // Set initial state
      gsap.set(el, from)

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              gsap.to(el, {
                opacity: 1,
                y: 0,
                x: 0,
                duration,
                delay,
                ease: 'power3.out',
              })
              observer.unobserve(el)
            }
          })
        },
        { threshold }
      )

      observer.observe(el)

      return () => observer.disconnect()
    },
    { scope: ref }
  )

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
