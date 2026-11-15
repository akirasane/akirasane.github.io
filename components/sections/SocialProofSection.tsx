'use client'

import FadeContent from '@/components/reactbits/FadeContent'
import { useResumeDownload } from '@/lib/useResumeDownload'
import { isSafeUrl } from '@/lib/safeUrl'
import type { Profile, PortfolioData, Testimonial } from '@/lib/types'

interface SocialProofSectionProps {
  profile: Profile
  portfolioData: PortfolioData
  testimonials?: Testimonial[]
}

const linkClass =
  'inline-flex items-center justify-center rounded-lg px-[1rem] py-[0.5rem] text-sm font-medium transition-opacity hover:opacity-80'
const linkStyle = {
  background: 'var(--card-bg)',
  color: 'var(--text-primary)',
  border: '1px solid var(--card-border)',
}

function safeHttps(url?: string): string | undefined {
  return url && /^https:\/\/\S+$/i.test(url) && isSafeUrl(url) ? url : undefined
}

export default function SocialProofSection({ profile, portfolioData, testimonials }: SocialProofSectionProps) {
  const { download, loading, error } = useResumeDownload(portfolioData)
  const github = safeHttps(profile.social.github)
  const linkedin = safeHttps(profile.social.linkedin)
  const hasTestimonials = !!testimonials && testimonials.length > 0

  return (
    <section
      id="proof"
      className="snap-section flex flex-col items-center px-6 pt-28 pb-16 md:pt-28 md:pb-16 md:h-dvh md:overflow-y-auto"
      style={{ background: 'var(--bg-secondary)' }}
    >
      <div className="w-full max-w-5xl flex flex-col gap-[2rem] md:m-auto">
        <h2 className="gradient-heading text-3xl font-bold text-center md:text-4xl">
          {hasTestimonials ? 'What People Say' : "Let's Work Together"}
        </h2>

        {hasTestimonials && (
          <ul className="mx-auto grid w-full max-w-3xl grid-cols-1 justify-center gap-[1.5rem] md:grid-cols-[repeat(auto-fit,minmax(18rem,1fr))]">
            {testimonials.map((t) => {
              const href = safeHttps(t.link)
              return (
                <li key={t.id} className="min-w-0">
                  <FadeContent className="h-full">
                    <figure
                      className="flex h-full min-w-0 flex-col gap-[1rem] rounded-xl p-[1.25rem]"
                      style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
                    >
                      <blockquote
                        className="text-sm leading-relaxed break-words"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {t.quote}
                      </blockquote>
                      <figcaption className="mt-auto flex flex-col text-sm break-words">
                        <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {href ? (
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline underline-offset-2 hover:opacity-80"
                            >
                              {t.name}
                            </a>
                          ) : (
                            t.name
                          )}
                        </span>
                        <span style={{ color: 'var(--accent-secondary)' }}>
                          {[t.role, t.company].filter(Boolean).join(', ')}
                        </span>
                      </figcaption>
                    </figure>
                  </FadeContent>
                </li>
              )
            })}
          </ul>
        )}

        <div className="flex flex-col items-center gap-[1rem]">
          <div className="flex flex-wrap justify-center gap-[0.75rem]">
            <button
              type="button"
              onClick={download}
              disabled={loading}
              className="rounded-full px-[2rem] py-[0.75rem] font-semibold transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              style={{ background: 'var(--accent-primary)', color: '#fff' }}
            >
              {loading ? 'Generating…' : 'Download Resume'}
            </button>
            {github && (
              <a href={github} target="_blank" rel="noopener noreferrer" className={linkClass} style={linkStyle}>
                GitHub
              </a>
            )}
            {linkedin && (
              <a href={linkedin} target="_blank" rel="noopener noreferrer" className={linkClass} style={linkStyle}>
                LinkedIn
              </a>
            )}
          </div>
          {error && (
            <p role="alert" className="text-sm" style={{ color: '#f87171' }}>
              {error}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
