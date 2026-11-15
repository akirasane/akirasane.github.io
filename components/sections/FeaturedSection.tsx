'use client'

import FadeContent from '@/components/reactbits/FadeContent'
import BorderGlow from '@/components/reactbits/BorderGlow'
import MetricList from '@/components/ui/MetricList'
import ProjectMedia from '@/components/ui/ProjectMedia'
import type { Project } from '@/lib/types'

interface FeaturedSectionProps {
  projects: Project[]
}

const MAX_FEATURED = 3

function CaseRow({ label, text }: { label: string; text: string }) {
  return (
    <div className="flex flex-col gap-[0.125rem]">
      <dt
        className="text-[0.6875rem] font-semibold uppercase tracking-wider"
        style={{ color: 'var(--accent-primary)' }}
      >
        {label}
      </dt>
      <dd
        className="m-0 text-[0.8125rem] leading-relaxed md:text-[0.875rem]"
        style={{ color: 'var(--text-secondary)' }}
      >
        {text}
      </dd>
    </div>
  )
}

export default function FeaturedSection({ projects }: FeaturedSectionProps) {
  const featured = projects.slice(0, MAX_FEATURED)
  if (featured.length === 0) return null

  return (
    <section
      id="featured"
      className="snap-section flex flex-col items-center px-6 pt-28 pb-16 md:h-dvh md:overflow-y-auto"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="my-auto flex w-full max-w-6xl flex-col gap-8">
        <h2 className="gradient-heading text-left text-3xl font-bold md:text-4xl">
          Featured Work
        </h2>

        <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-3">
          {featured.map((project) => {
            const stack = project.caseStudy?.stack ?? project.tags
            const result = project.caseStudy?.result?.trim()
            return (
              <li key={project.id} className="min-w-0">
                <FadeContent className="h-full">
                  <BorderGlow
                    className="flex h-full flex-col gap-4 rounded-xl p-5"
                    edgeSensitivity={30}
                    glowColor="40 80 80"
                    backgroundColor="#060010"
                    borderRadius={28}
                    glowRadius={40}
                    glowIntensity={1}
                    coneSpread={25}
                    animated={false}
                    colors={['#c084fc', '#f472b6', '#38bdf8']}
                  >
                    <div className="flex h-full min-w-0 flex-col gap-4">
                    <ProjectMedia
                      src={project.imageUrl}
                      alt={project.imageAlt}
                      className="aspect-video w-full rounded-lg object-cover"
                    />

                    <h3
                      className="text-base font-semibold md:text-lg"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {project.title}
                    </h3>

                    {project.caseStudy ? (
                      <dl className="m-0 flex flex-col gap-3">
                        <CaseRow label="Problem" text={project.caseStudy.problem} />
                        <CaseRow label="Approach" text={project.caseStudy.approach} />
                      </dl>
                    ) : (
                      <p
                        className="m-0 text-[0.8125rem] leading-relaxed md:text-[0.875rem]"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {project.description}
                      </p>
                    )}

                    {stack.length > 0 && (
                      <ul className="m-0 flex list-none flex-wrap gap-[0.375rem] p-0">
                        {stack.map((item) => (
                          <li
                            key={item}
                            className="rounded px-2 py-0.5 text-[0.625rem] font-medium md:text-xs"
                            style={{
                              background: 'rgba(99,102,241,0.15)',
                              color: 'var(--accent-secondary)',
                            }}
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}

                    {result && (
                      <dl className="m-0">
                        <CaseRow label="Result" text={result} />
                      </dl>
                    )}

                    <MetricList metrics={project.metrics} />

                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto inline-block py-2 text-[0.875rem] font-medium"
                        style={{ color: 'var(--accent-primary)' }}
                      >
                        View Project →
                      </a>
                    )}
                    </div>
                  </BorderGlow>
                </FadeContent>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
