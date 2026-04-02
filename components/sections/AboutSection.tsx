'use client'

import { useState } from 'react'
import FadeContent from '@/components/reactbits/FadeContent'
import Magnet from '@/components/reactbits/Magnet'
import type { Profile } from '@/lib/types'

interface AboutSectionProps {
  profile: Profile
}

const PLACEHOLDER_AVATAR = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='40' r='22' fill='%236366f1'/%3E%3Ccircle cx='50' cy='95' r='38' fill='%236366f1'/%3E%3C/svg%3E`

export default function AboutSection({ profile }: AboutSectionProps) {
  const [pdfLoading, setPdfLoading] = useState(false)
  const [pdfError, setPdfError] = useState<string | null>(null)
  const [avatarSrc, setAvatarSrc] = useState(profile.avatarUrl || PLACEHOLDER_AVATAR)

  const handleDownloadResume = async () => {
    setPdfLoading(true)
    setPdfError(null)
    try {
      const { generateResumePDF } = await import('@/lib/pdf')
      // We need full PortfolioData — pull from localStorage directly here
      const raw = typeof window !== 'undefined' ? localStorage.getItem('portfolio_data') : null
      const data = raw ? JSON.parse(raw) : null
      if (!data) throw new Error('No portfolio data found')
      await generateResumePDF(data)
    } catch (err) {
      setPdfError(err instanceof Error ? err.message : 'Failed to generate PDF')
    } finally {
      setPdfLoading(false)
    }
  }

  const { social } = profile

  return (
    <section
      id="about"
      className="snap-section flex items-center justify-center px-6 py-16"
      style={{ background: 'var(--bg-primary)' }}
    >
      <FadeContent className="w-full max-w-4xl">
        <div className="flex flex-col items-center gap-10 md:flex-row md:items-start">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <img
              src={avatarSrc}
              alt={profile.name || 'Profile avatar'}
              onError={() => setAvatarSrc(PLACEHOLDER_AVATAR)}
              className="h-40 w-40 rounded-full object-cover ring-4"
              style={{ outline: '4px solid var(--accent-primary)', outlineOffset: '2px' }}
            />
          </div>

          {/* Info */}
          <div className="flex flex-col gap-4 text-center md:text-left">
            <div>
              <h2
                className="text-3xl font-bold md:text-4xl"
                style={{ color: 'var(--text-primary)' }}
              >
                {profile.name}
              </h2>
              <p
                className="mt-1 text-lg font-medium"
                style={{ color: 'var(--accent-primary)' }}
              >
                {profile.title}
              </p>
            </div>

            {profile.bio && (
              <p
                className="max-w-xl leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
                {profile.bio}
              </p>
            )}

            {/* Social links */}
            <div className="flex flex-wrap justify-center gap-3 md:justify-start">
              {social.github && (
                <a
                  href={social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-80"
                  style={{ background: 'var(--card-bg)', color: 'var(--text-primary)', border: '1px solid var(--card-border)' }}
                >
                  GitHub
                </a>
              )}
              {social.linkedin && (
                <a
                  href={social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-80"
                  style={{ background: 'var(--card-bg)', color: 'var(--text-primary)', border: '1px solid var(--card-border)' }}
                >
                  LinkedIn
                </a>
              )}
              {social.twitter && (
                <a
                  href={social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-80"
                  style={{ background: 'var(--card-bg)', color: 'var(--text-primary)', border: '1px solid var(--card-border)' }}
                >
                  Twitter
                </a>
              )}
              {social.website && (
                <a
                  href={social.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Website"
                  className="rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-80"
                  style={{ background: 'var(--card-bg)', color: 'var(--text-primary)', border: '1px solid var(--card-border)' }}
                >
                  Website
                </a>
              )}
              {social.email && (
                <a
                  href={`mailto:${social.email}`}
                  aria-label="Email"
                  className="rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-80"
                  style={{ background: 'var(--card-bg)', color: 'var(--text-primary)', border: '1px solid var(--card-border)' }}
                >
                  Email
                </a>
              )}
            </div>

            {/* Download Resume */}
            <div className="flex flex-col items-center gap-2 md:items-start">
              <Magnet>
                <button
                  onClick={handleDownloadResume}
                  disabled={pdfLoading}
                  className="rounded-full px-8 py-3 font-semibold transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  style={{ background: 'var(--accent-primary)', color: '#fff' }}
                >
                  {pdfLoading ? 'Generating…' : 'Download Resume'}
                </button>
              </Magnet>
              {pdfError && (
                <p className="text-sm" style={{ color: '#f87171' }}>
                  {pdfError}
                </p>
              )}
            </div>
          </div>
        </div>
      </FadeContent>
    </section>
  )
}
