'use client'

import FadeContent from '@/components/reactbits/FadeContent'
import ProjectMedia from '@/components/ui/ProjectMedia'
import { isSafeUrl } from '@/lib/safeUrl'
import type { AnalystSample } from '@/lib/types'

interface AnalystProofSectionProps {
  samples?: AnalystSample[]
}

const KIND_LABEL: Record<AnalystSample['kind'], string> = {
  flow: 'Process flow',
  erd: 'Data model',
  requirements: 'Requirements',
}

export default function AnalystProofSection({ samples }: AnalystProofSectionProps) {
  if (!samples || samples.length === 0) return null

  return (
    <section
      id="analysis"
      className="snap-section flex flex-col items-center px-6 pt-28 pb-16 md:pt-28 md:pb-16 md:h-dvh md:overflow-y-auto"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="w-full max-w-5xl flex flex-col gap-[2rem] md:m-auto">
        <h2 className="gradient-heading text-3xl font-bold text-center md:text-4xl">
          How I Analyze
        </h2>

        <ul className="grid grid-cols-1 gap-[1.5rem] md:grid-cols-2">
          {samples.map((sample) => {
            const imageHref =
              sample.imageUrl && /^(https:\/\/|\/)/i.test(sample.imageUrl) && isSafeUrl(sample.imageUrl)
                ? sample.imageUrl
                : undefined
            return (
              <li key={sample.id} className="min-w-0">
                <FadeContent className="h-full">
                  <article
                    className="flex h-full min-w-0 flex-col gap-[0.75rem] rounded-xl p-[1.25rem]"
                    style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
                  >
                    <span
                      className="text-xs font-medium uppercase tracking-wide"
                      style={{ color: 'var(--accent-secondary)' }}
                    >
                      {KIND_LABEL[sample.kind]}
                    </span>
                    <h3 className="text-lg font-semibold break-words" style={{ color: 'var(--text-primary)' }}>
                      {sample.title}
                    </h3>
                    <p className="text-sm leading-relaxed break-words" style={{ color: 'var(--text-secondary)' }}>
                      {sample.summary}
                    </p>

                    {imageHref && (
                      <a
                        href={imageHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open full image: ${sample.title}`}
                        className="block overflow-hidden rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2"
                        style={{ border: '1px solid var(--card-border)' }}
                      >
                        <ProjectMedia
                          src={imageHref}
                          alt={sample.imageAlt ?? sample.title}
                          className="block h-auto w-full max-w-full"
                        />
                      </a>
                    )}

                    {sample.requirements && sample.requirements.length > 0 && (
                      <ul
                        className="list-disc pl-[1.25rem] text-sm leading-relaxed flex flex-col gap-[0.25rem]"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {sample.requirements.map((req, i) => (
                          <li key={i} className="break-words">
                            {req}
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>
                </FadeContent>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
