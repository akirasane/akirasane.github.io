'use client'

import { useEffect, useRef } from 'react'
import ScrollReveal from '@/components/reactbits/ScrollReveal'
import type { SkillCategory, SkillItem } from '@/lib/types'

interface SkillsSectionProps {
  skills: SkillCategory[]
}

interface SkillCardProps {
  item: SkillItem
}

function SkillCard({ item }: SkillCardProps) {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return
    // Start at 0, then animate to proficiency on next frame
    bar.style.width = '0%'
    const raf = requestAnimationFrame(() => {
      bar.style.width = `${item.proficiency}%`
    })
    return () => cancelAnimationFrame(raf)
  }, [item.proficiency])

  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-2"
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
      }}
    >
      <div className="flex items-center justify-between">
        <span
          className="font-medium text-sm"
          style={{ color: 'var(--text-primary)' }}
        >
          {item.name}
        </span>
        <span
          className="text-xs font-semibold"
          style={{ color: 'var(--accent-primary)' }}
        >
          {item.proficiency}%
        </span>
      </div>

      {/* Progress bar */}
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ background: 'var(--bg-primary)' }}
        role="progressbar"
        aria-valuenow={item.proficiency}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${item.name} proficiency`}
      >
        <div
          ref={barRef}
          className="h-full rounded-full"
          style={{
            width: `${item.proficiency}%`,
            background: 'var(--accent-primary)',
            transition: 'width 0.8s ease-out',
          }}
        />
      </div>

      <span
        className="text-xs"
        style={{ color: 'var(--text-secondary)' }}
      >
        {item.years} {item.years === 1 ? 'year' : 'years'} experience
      </span>
    </div>
  )
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  return (
    <section
      id="skills"
      className="snap-section flex flex-col items-center justify-center px-6 py-16 overflow-y-auto"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="w-full max-w-4xl flex flex-col gap-10">
        <h2
          className="text-3xl font-bold text-center md:text-4xl"
          style={{ color: 'var(--text-primary)' }}
        >
          Skills
        </h2>

        {skills.length === 0 ? (
          <p
            className="text-center"
            style={{ color: 'var(--text-secondary)' }}
          >
            No skills added yet.
          </p>
        ) : (
          skills.map((category) => (
            <div key={category.id} className="flex flex-col gap-4">
              <h3
                className="text-lg font-semibold"
                style={{ color: 'var(--accent-primary)' }}
              >
                {category.category}
              </h3>
              <ScrollReveal className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                {category.items.map((item) => (
                  <SkillCard key={item.id} item={item} />
                ))}
              </ScrollReveal>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
