'use client'

import FadeContent from '@/components/reactbits/FadeContent'
import BorderGlow from '@/components/reactbits/BorderGlow'
import type { Certification } from '@/lib/types'

interface CertificationsSectionProps {
  certifications: Certification[]
}

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
}

export default function CertificationsSection({ certifications }: CertificationsSectionProps) {
  const sorted = [...certifications].sort(
    (a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()
  )

  return (
    <section
      id="certifications"
      className="snap-section flex flex-col items-center px-6 py-16 md:py-16 md:h-dvh md:overflow-y-auto"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="w-full max-w-5xl flex flex-col gap-8 md:m-auto">
        <h2
          className="text-3xl font-bold text-center md:text-4xl"
          style={{ color: 'var(--text-primary)' }}
        >
          Certifications
        </h2>

        {sorted.length === 0 ? (
          <p className="text-center" style={{ color: 'var(--text-secondary)' }}>
            No certifications added yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sorted.map((cert) => {
              const expired = cert.expiryDate && new Date(cert.expiryDate).getTime() < Date.now()
              return (
                <FadeContent key={cert.id}>
                  <BorderGlow
                    className="rounded-xl p-5 flex flex-col gap-3 h-full"
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
                    <div className="flex items-start gap-3">
                      {cert.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={cert.imageUrl}
                          alt={`${cert.issuer} badge`}
                          className="w-10 h-10 rounded object-contain shrink-0"
                        />
                      ) : (
                        <div
                          className="w-10 h-10 rounded flex items-center justify-center shrink-0 text-lg"
                          style={{ background: 'rgba(99,102,241,0.15)' }}
                        >
                          🎓
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3
                          className="font-semibold text-sm md:text-base leading-snug"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {cert.name}
                        </h3>
                        <span
                          className="text-xs md:text-sm font-medium"
                          style={{ color: 'var(--accent-secondary)' }}
                        >
                          {cert.issuer}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 mt-auto pt-1">
                      <span
                        className="text-xs"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        Issued {formatDate(cert.issueDate)}
                        {cert.expiryDate && (
                          <> · {expired ? 'Expired' : 'Expires'} {formatDate(cert.expiryDate)}</>
                        )}
                      </span>
                    </div>

                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs md:text-sm font-medium"
                        style={{ color: 'var(--accent-primary)' }}
                      >
                        Verify Credential →
                      </a>
                    )}
                  </BorderGlow>
                </FadeContent>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
