'use client'

import ScrollReveal from '@/components/reactbits/ScrollReveal'
import { resolveColor } from '@/lib/colors'
import type { SkillCategory, Project } from '@/lib/types'

interface SkillsSectionProps {
  skills: SkillCategory[]
  projects?: Project[]
}

function getSkillLevel(proficiency: number) {
  if (proficiency >= 85) {
    return {
      label: 'Expert',
      color: '#10b981', // emerald
      bg: 'rgba(16, 185, 129, 0.08)',
      border: '1px solid rgba(16, 185, 129, 0.2)',
    }
  } else if (proficiency >= 70) {
    return {
      label: 'Advanced',
      color: '#a78bfa', // purple/indigo
      bg: 'rgba(167, 139, 250, 0.08)',
      border: '1px solid rgba(167, 139, 250, 0.2)',
    }
  } else {
    return {
      label: 'Learning',
      color: '#f59e0b', // amber
      bg: 'rgba(245, 158, 11, 0.08)',
      border: '1px solid rgba(245, 158, 11, 0.2)',
    }
  }
}

const MAX_STRONG_SKILLS = 10

export default function SkillsSection({ skills }: SkillsSectionProps) {
  const all = skills.flatMap((category) =>
    category.items.map((item) => ({ item, color: resolveColor(category.color, '#c084fc') }))
  )
  const strong = all
    .filter(({ item }) => item.proficiency >= 70)
    .sort((a, b) => b.item.proficiency - a.item.proficiency)
    .slice(0, MAX_STRONG_SKILLS)
  const exploring = all.filter(({ item }) => item.proficiency < 70).map(({ item }) => item.name)

  return (
    <section
      id="skills"
      className="snap-section relative flex flex-col items-center justify-center px-6 pt-28 pb-20 md:pt-28 md:pb-20 md:h-dvh md:overflow-y-auto overflow-hidden"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="w-full max-w-4xl flex flex-col gap-10 relative z-10">
        <h2 className="gradient-heading text-3xl font-bold text-center md:text-4xl">
          Skills
        </h2>

        {all.length === 0 ? (
          <p
            className="text-center"
            style={{ color: 'var(--text-secondary)' }}
          >
            No skills added yet.
          </p>
        ) : (
          <>
            <ScrollReveal className="flex flex-wrap justify-center gap-[0.75rem]">
              {strong.map(({ item, color }) => {
                const level = getSkillLevel(item.proficiency)
                return (
                  <span
                    key={item.id}
                    className="inline-flex items-center gap-[0.625rem] rounded-full border px-[1rem] py-[0.5rem] text-[0.875rem] font-medium"
                    style={{
                      color: 'var(--text-primary)',
                      borderColor: `color-mix(in srgb, ${color} 45%, transparent)`,
                      background: `color-mix(in srgb, ${color} 10%, transparent)`,
                    }}
                  >
                    {item.name}
                    <span
                      className="rounded-full px-[0.5rem] py-[0.125rem] text-[0.6875rem] font-semibold"
                      style={{ color: level.color, backgroundColor: level.bg, border: level.border }}
                    >
                      {level.label}
                    </span>
                  </span>
                )
              })}
            </ScrollReveal>

            {exploring.length > 0 && (
              <p
                className="text-center text-[0.9375rem] break-words"
                style={{ color: 'var(--text-secondary)' }}
              >
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Currently exploring:
                </span>{' '}
                {exploring.join(', ')}
              </p>
            )}
          </>
        )}
      </div>
    </section>
  )
}
