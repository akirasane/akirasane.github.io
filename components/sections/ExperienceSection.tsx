'use client'

import FadeContent from '@/components/reactbits/FadeContent'
import type { Experience } from '@/lib/types'

interface ExperienceSectionProps {
  experiences: Experience[]
}

function formatDate(dateStr: string): string {
  if (!dateStr) return 'Present'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
}

export default function ExperienceSection({ experiences }: ExperienceSectionProps) {
  const sorted = [...experiences].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  )

  return (
    <section
      id="experience"
      className="snap-section flex flex-col items-center justify-center px-6 py-16 overflow-y-auto"
      style={{ background: 'var(--bg-secondary)' }}
    >
      <div className="w-full max-w-3xl flex flex-col gap-8">
        <h2
          className="text-3xl font-bold text-center md:text-4xl"
          style={{ color: 'var(--text-primary)' }}
        >
          Experience
        </h2>

        {sorted.length === 0 ? (
          <p className="text-center" style={{ color: 'var(--text-secondary)' }}>
            No experience entries added yet.
          </p>
        ) : (
          <div className="relative flex flex-col gap-8">
            {/* Vertical timeline line */}
            <div
              className="absolute left-4 top-0 bottom-0 w-0.5"
              style={{ background: 'var(--card-border)' }}
            />

            {sorted.map((exp) => (
              <FadeContent key={exp.id} className="pl-12 relative">
                {/* Timeline dot */}
                <div
                  className="absolute left-2.5 top-2 w-3 h-3 rounded-full border-2"
                  style={{
                    background: 'var(--accent-primary)',
                    borderColor: 'var(--bg-secondary)',
                  }}
                />

                <div
                  className="rounded-xl p-5 flex flex-col gap-2"
                  style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--card-border)',
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <span
                      className="font-semibold text-base"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {exp.title}
                    </span>
                    <span
                      className="text-xs font-medium"
                      style={{ color: 'var(--accent-primary)' }}
                    >
                      {formatDate(exp.startDate)} – {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                    </span>
                  </div>

                  <span
                    className="text-sm font-medium"
                    style={{ color: 'var(--accent-secondary)' }}
                  >
                    {exp.company}
                  </span>

                  {exp.description && (
                    <p
                      className="text-sm leading-relaxed mt-1"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {exp.description}
                    </p>
                  )}
                </div>
              </FadeContent>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
