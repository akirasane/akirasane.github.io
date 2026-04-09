'use client'

import { useState } from 'react'
import BlurText from '@/components/reactbits/BlurText'
import Magnet from '@/components/reactbits/Magnet'
import LetterGlitchIntro from '@/components/reactbits/LetterGlitchIntro'
import { LandingContent } from '@/lib/types'

const DEFAULT_TAGLINE = 'Building elegant solutions to complex problems.'

interface HeroSectionProps {
  landing: LandingContent
}

export default function HeroSection({ landing }: HeroSectionProps) {
  const tagline = landing.tagline || DEFAULT_TAGLINE
  // 0: Glitching phase, 1: Glitch finished, show rest of content
  const [glitchDone, setGlitchDone] = useState(false)

  const scrollTo = (target: string) => {
    document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="hero"
      className="h-screen snap-sectionfirst w-full relative flex flex-col items-center justify-center overflow-hidden bg-black"
    >
      {/* 1. Glitch Canvas Wallpaper */}
      <div className="absolute inset-0 w-full h-full z-0">
        <LetterGlitchIntro
          targetWord={landing.displayName?.toUpperCase() || 'WELCOME'}
          glitchColors={['#6366f1', '#a78bfa', '#c4b5fd', '#818cf8']}
          glitchSpeed={40}
          smooth={true}
          onComplete={() => setGlitchDone(true)}
        />
      </div>

      {/* 2. Content that fades in AFTER the glitch resolves the name */}
      {/* We position it slightly below the vertical center so it sits under the canvas text */}
      <div
        className={`absolute top-[58%] z-10 flex flex-col items-center gap-6 px-6 text-center transition-opacity duration-1000 ${
          glitchDone ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <p
          className="max-w-xl text-lg md:text-2xl"
          style={{ color: 'var(--text-secondary)' }}
        >
          {glitchDone && <BlurText text={tagline} delay={0.1} />}
        </p>

        {landing.ctaLinks && landing.ctaLinks.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
            {landing.ctaLinks.map((cta, i) => (
              <Magnet key={i}>
                <button
                  onClick={() => scrollTo(cta.target)}
                  className={
                    i === 0
                      ? 'rounded-full px-8 py-3 font-semibold transition-opacity hover:opacity-90'
                      : 'rounded-full border px-8 py-3 font-semibold transition-opacity hover:opacity-80'
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
    </section>
  )
}

