'use client'

import { useState } from 'react'
import BlurText from '@/components/reactbits/BlurText'
import Magnet from '@/components/reactbits/Magnet'
import LetterGlitchIntro from '@/components/reactbits/LetterGlitchIntro'
import Aurora from '@/components/Aurora'
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
      {/* 1. Aurora Background - Fades in once the glitch resolves */}
      <div 
        className={`absolute inset-0 w-full h-full z-0 transition-opacity duration-1500 ease-out ${
          glitchDone ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <Aurora
          colorStops={['#3b82f6', '#8b5cf6', '#06b6d4']}
          amplitude={1.0}
          blend={0.5}
          speed={0.6}
        />
        {/* Subtle dark overlay to keep contrast high for text */}
        <div className="absolute inset-0 bg-black/50 pointer-events-none" />
      </div>

      {/* 2. Glitch Canvas Wallpaper - Fades out when complete */}
      <div 
        className={`absolute inset-0 w-full h-full z-10 transition-opacity duration-1000 ease-out ${
          glitchDone ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <LetterGlitchIntro
          targetWord={landing.displayName?.toUpperCase() || 'WELCOME'}
          glitchColors={['#6366f1', '#a78bfa', '#c4b5fd', '#818cf8']}
          glitchSpeed={40}
          smooth={true}
          onComplete={() => setGlitchDone(true)}
        />
      </div>

      {/* 3. Content that fades in AFTER the glitch resolves the name */}
      <div
        className={`relative z-20 flex flex-col items-center gap-6 px-6 text-center transition-all duration-1000 ease-out ${
          glitchDone ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
        }`}
      >
        {/* Dynamic Display Name Header */}
        <h1 
          className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 font-sans"
        >
          {glitchDone && <BlurText text={landing.displayName || 'WELCOME'} delay={0.05} />}
        </h1>

        {/* Tagline */}
        <p
          className="max-w-xl text-lg md:text-xl font-medium tracking-wide"
          style={{ color: 'var(--text-secondary)' }}
        >
          {glitchDone && <BlurText text={tagline} delay={0.2} />}
        </p>

        {landing.ctaLinks && landing.ctaLinks.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
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
    </section>
  )
}

