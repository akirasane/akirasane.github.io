'use client'

import { useState } from 'react'
import FadeContent from '@/components/reactbits/FadeContent'
import Magnet from '@/components/reactbits/Magnet'
import ProfileCard from '@/components/reactbits/ProfileCard'
import GlassSurface from '@/components/reactbits/GlassSurface'
import type { Profile } from '@/lib/types'

interface AboutSectionProps {
  profile: Profile
}

const PLACEHOLDER_AVATAR = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='40' r='22' fill='%236366f1'/%3E%3Ccircle cx='50' cy='95' r='38' fill='%236366f1'/%3E%3C/svg%3E`

export default function AboutSection({ profile }: AboutSectionProps) {
  const [pdfLoading, setPdfLoading] = useState(false)
  const [pdfError, setPdfError] = useState<string | null>(null)

  const handleDownloadResume = async () => {
    setPdfLoading(true)
    setPdfError(null)
    try {
      const { generateResumePDF } = await import('@/lib/pdf')
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

  const handleContactClick = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  const { social } = profile

  return (
    <section
      id="about"
      className="snap-section flex items-center justify-center px-6 py-16 min-h-screen"
      style={{ background: 'var(--bg-primary)' }}
    >
      <FadeContent className="w-full max-w-4xl">
        <div className="flex flex-col items-center gap-10 md:flex-row md:items-center">
          {/* Avatar */}
          <div className='flex-shrink-0'>
            <ProfileCard className="object-cover"
              name={profile.name}
              title={profile.title}
              handle="javicodes"
              status="Online"
              contactText="Download Resume"
              avatarUrl="/img/avatar.jpg"
              showUserInfo={false}
              enableTilt={true}
              enableMobileTilt={false}
              onContactClick={handleContactClick}
              behindGlowColor="rgba(125, 190, 255, 0.67)"
              iconUrl="/img/iconpattern.png"
              behindGlowEnabled
              innerGradient="linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col gap-6 text-center md:text-left w-full md:w-auto">
            {/* Bio */}
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
