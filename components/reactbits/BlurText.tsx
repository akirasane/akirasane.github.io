'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

interface BlurTextProps {
  text: string
  className?: string
  delay?: number
  duration?: number
  threshold?: number
}

export default function BlurText({
  text,
  className = '',
  delay = 0,
  duration = 0.8,
  threshold = 0.2,
}: BlurTextProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return

      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (prefersReduced) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              gsap.fromTo(
                el,
                { opacity: 0, filter: 'blur(12px)', y: 20 },
                {
                  opacity: 1,
                  filter: 'blur(0px)',
                  y: 0,
                  duration,
                  delay,
                  ease: 'power3.out',
                }
              )
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
    <span ref={ref} className={className} style={{ display: 'inline-block' }}>
      {text}
    </span>
  )
}
