'use client'

import BlurText from '@/components/reactbits/BlurText'
import Magnet from '@/components/reactbits/Magnet'
import TerminalPreview from '@/components/reactbits/TerminalPreview'
import Aurora from '@/components/Aurora'
import { LandingContent } from '@/lib/types'
import { scrollToSectionId } from '@/lib/utils'

const DEFAULT_TAGLINE = 'Building elegant solutions to complex problems.'

interface HeroSectionProps {
  landing: LandingContent
  title?: string
}

export default function HeroSection({ landing, title }: HeroSectionProps) {
  const tagline = landing.tagline || DEFAULT_TAGLINE

  const scrollTo = (target: string) => {
    scrollToSectionId(target)
  }

  return (
    <section
      id="hero"
      className="snap-sectionfirst h-dvh w-full relative flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Aurora background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Aurora
          colorStops={['#3b82f6', '#8b5cf6', '#06b6d4']}
          amplitude={1.0}
          blend={0.5}
          speed={0.6}
        />
        {/* Subtle dark overlay to keep contrast high for text */}
        <div className="absolute inset-0 bg-black/50 pointer-events-none" />
        {/* Ambient grid + scanline, layered over the aurora for extra depth */}
        <div className="ambient-bg">
          <div className="ambient-grid" />
          <div className="ambient-scanline" />
        </div>
      </div>

      {/* Content — text left, terminal preview right on desktop; stacked on mobile */}
      <div className="relative z-20 w-full max-w-6xl px-6 md:px-10 grid md:grid-cols-[1.15fr_0.85fr] gap-10 md:gap-16 items-center">
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-5">
          {title && (
            <span
              className="font-mono text-xs md:text-sm font-medium uppercase tracking-[0.2em]"
              style={{ color: 'var(--accent-secondary)' }}
            >
              {title}
            </span>
          )}

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white font-sans">
            <BlurText text={landing.displayName || 'WELCOME'} delay={0.05} />
          </h1>

          <p
            className="max-w-xl text-lg md:text-xl font-medium tracking-wide"
            style={{ color: 'var(--text-secondary)' }}
          >
            <BlurText text={tagline} delay={0.2} />
          </p>

          {landing.ctaLinks && landing.ctaLinks.length > 0 && (
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2">
              {landing.ctaLinks.map((cta, i) => (
                <Magnet key={i}>
                  <button
                    onClick={() => scrollTo(cta.target)}
                    className={
                      i === 0
                        ? 'rounded-full px-8 py-3 font-semibold transition-opacity hover:opacity-90 active:scale-95'
                        : 'rounded-full border px-8 py-3 font-semibold transition-opacity hover:opacity-80 active:scale-95'
                    }
                    style={
                      i === 0
                        ? {
                            background: 'var(--accent-primary)',
                            color: '#fff',
                          }
                        : {
                            borderColor: 'var(--accent-primary)',
                            color: 'var(--accent-primary)',
                          }
                    }
                  >
                    {cta.label}
                  </button>
                </Magnet>
              ))}
            </div>
          )}
        </div>

        <div className="hidden md:flex justify-end">
          <TerminalPreview />
        </div>
      </div>
    </section>
  )
}
