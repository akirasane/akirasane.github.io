'use client'

import MagicRings from '@/components/reactbits/MagicRings'
import SplitText from '@/components/reactbits/SplitText'
import BlurText from '@/components/reactbits/BlurText'
import Magnet from '@/components/reactbits/Magnet'
import { LandingContent } from '@/lib/types'

const DEFAULT_TAGLINE = 'Building elegant solutions to complex problems.'

interface HeroSectionProps {
  landing: LandingContent
}

export default function HeroSection({ landing }: HeroSectionProps) {
  const tagline = landing.tagline || DEFAULT_TAGLINE

  const scrollTo = (target: string) => {
    document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="hero"
      className="h-screen snap-sectionfirst relative flex flex-col items-center justify-center px-6 overflow-hidden"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* Animated background */}

      {/* className="absolute inset-0 w-full h-full" */}
      {/* <div style={{ width: '600px', height: '400px', position: 'relative' }}> */}
      <div className="absolute inset-0 w-full h-full">
        <MagicRings
          color="#fc42ff"
          colorTwo="#42fcff"
          ringCount={6}
          speed={1}
          attenuation={10}
          lineThickness={2}
          baseRadius={0.35}
          radiusStep={0.1}
          scaleRate={0.1}
          opacity={1}
          blur={0}
          noiseAmount={0.1}
          rotation={0}
          ringGap={1.5}
          fadeIn={0.7}
          fadeOut={0.5}
          followMouse={false}
          mouseInfluence={0}
          hoverScale={1.2}
          parallax={0}
          clickBurst={true}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
        <h1
          className="text-5xl font-bold md:text-7xl"
          style={{ color: 'var(--text-primary)' }}
        >
          <SplitText text={landing.displayName || 'Your Name'} />
        </h1>

        <p
          className="max-w-xl text-lg md:text-2xl"
          style={{ color: 'var(--text-secondary)' }}
        >
          <BlurText text={tagline} delay={0.3} />
        </p>

        {landing.ctaLinks.length > 0 && (
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
