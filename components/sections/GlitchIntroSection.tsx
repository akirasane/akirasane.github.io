'use client'

import { useState } from 'react'
import LetterGlitchIntro from '@/components/reactbits/LetterGlitchIntro'

interface GlitchIntroSectionProps {
  welcomeText?: string
  onComplete?: () => void
}

export default function GlitchIntroSection({
  welcomeText = 'WELCOME',
  onComplete,
}: GlitchIntroSectionProps) {
  const [fading, setFading] = useState(false)

  const handleGlitchComplete = () => {
    // Start CSS fade-out
    setFading(true)
    
    // Wait for fade transition duration then unmount
    setTimeout(() => {
      onComplete?.()
    }, 1800) // Match overlay's transition duration (1.5s + buffer)
  }

  return (
    <div
      className="glitch-intro-overlay"
      style={{
        opacity: fading ? 0 : 1,
        pointerEvents: fading ? 'none' : 'auto',
      }}
    >
      <div className="absolute inset-0 w-full h-full text-white bg-black">
        <LetterGlitchIntro
          targetWord={welcomeText.toUpperCase()}
          glitchColors={['#6366f1', '#a78bfa', '#c4b5fd', '#818cf8']}
          glitchSpeed={40}
          smooth={true}
          onComplete={handleGlitchComplete}
        />
      </div>
    </div>
  )
}
