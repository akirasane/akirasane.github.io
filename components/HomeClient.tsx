'use client'

import { useState, useEffect } from 'react'
import { usePortfolioStore } from '@/lib/store'
import Navbar from '@/components/layout/Navbar'
import HeroSection from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'
import SkillsSection from '@/components/sections/SkillsSection'
import ExperienceSection from '@/components/sections/ExperienceSection'
import ProjectsSection from '@/components/sections/ProjectsSection'
import ContactSection from '@/components/sections/ContactSection'
import Terminal from '@/components/Terminal'

const SECTIONS = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
]

// Boot diagnostic lines — printed one by one over 3 seconds
const BOOT_LINES = [
  { text: 'BIOS v2.4.1 — Web Terminal OS initializing...', delay: 0 },
  { text: 'Checking memory integrity... [OK]', delay: 240 },
  { text: 'Loading kernel modules... [OK]', delay: 480 },
  { text: 'Mounting virtual filesystem (VFS)... [OK]', delay: 700 },
  { text: 'Starting oh-my-zsh framework... [OK]', delay: 920 },
  { text: 'Loading Powerlevel10k theme presets... [OK]', delay: 1120 },
  { text: 'Initializing command registry... [OK]', delay: 1340 },
  { text: 'Connecting to portfolio data source... [OK]', delay: 1560 },
  { text: 'Spawning lofi ambient renderer... [OK]', delay: 1780 },
  { text: 'Configuring CRT scanline overlay... [OK]', delay: 1960 },
  { text: 'Calibrating ASCII art engine... [OK]', delay: 2140 },
  { text: 'Loading developer profile... [OK]', delay: 2360 },
  { text: '', delay: 2520 },
  { text: 'All systems nominal. Launching shell...', delay: 2680 },
]

const TOTAL_DURATION = 3000 // ms

function BootScreen() {
  const [visibleLines, setVisibleLines] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    BOOT_LINES.forEach(({ text, delay }) => {
      timers.push(setTimeout(() => {
        setVisibleLines(prev => [...prev, text])
      }, delay))
    })

    // Progress bar — smooth from 0→100 over TOTAL_DURATION
    const startTime = Date.now()
    const rafLoop = () => {
      const elapsed = Date.now() - startTime
      const pct = Math.min(100, Math.round((elapsed / TOTAL_DURATION) * 100))
      setProgress(pct)
      if (pct < 100) requestAnimationFrame(rafLoop)
      else setDone(true)
    }
    requestAnimationFrame(rafLoop)

    return () => timers.forEach(clearTimeout)
  }, [])

  const barFilled = Math.round((progress / 100) * 30)
  const barEmpty  = 30 - barFilled

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center font-mono overflow-hidden"
      style={{ background: 'rgb(6,0,16)' }}
    >
      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.18) 50%)',
          backgroundSize: '100% 4px',
        }}
      />

      {/* Ambient orb */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 500, height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Boot log window */}
      <div className="relative z-20 w-full max-w-xl px-6">
        {/* Window chrome */}
        <div className="flex items-center gap-1.5 px-3 py-2 bg-white/5 border border-white/10 rounded-t-lg border-b-0">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] border border-[#e0443e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] border border-[#1aab29]" />
          <span className="ml-3 text-[10px] text-white/30 tracking-widest uppercase">boot sequence</span>
        </div>

        {/* Log area */}
        <div className="border border-white/10 rounded-b-lg bg-black/60 px-5 py-4 min-h-[220px] space-y-1 overflow-hidden">
          {visibleLines.map((line, i) => (
            <div
              key={i}
              className="text-xs leading-relaxed"
              style={{
                color: line.includes('[OK]')
                  ? '#6ee7b7'
                  : line.startsWith('All systems')
                  ? '#a78bfa'
                  : line === ''
                  ? 'transparent'
                  : '#9ca3af',
                animation: 'fadeSlideIn 0.15s ease-out both',
              }}
            >
              {line || '\u00A0'}
            </div>
          ))}

          {/* Blinking cursor on last line */}
          {!done && (
            <div className="flex items-center gap-1 text-xs text-indigo-400">
              <span
                style={{
                  display: 'inline-block',
                  width: 7, height: 13,
                  background: 'currentColor',
                  animation: 'cursorBlink 1s step-end infinite',
                }}
              />
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="mt-4 space-y-1.5">
          <div className="flex justify-between text-[10px] font-mono text-white/30">
            <span>SYSTEM INIT</span>
            <span>{progress}%</span>
          </div>
          <div className="text-xs font-mono text-indigo-400 tracking-tighter select-none">
            {'['}
            <span className="text-indigo-300">{'█'.repeat(barFilled)}</span>
            <span className="text-white/10">{'░'.repeat(barEmpty)}</span>
            {']'}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cursorBlink {
          from, to { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}

export default function HomeClient() {
  const { data, loading } = usePortfolioStore()
  const [mode, setMode] = useState<'terminal' | 'gui'>('terminal')
  const [activeTheme, setActiveTheme] = useState<string>('matrix')
  const [isTransitioning, setIsTransitioning] = useState(false)
  // Keep boot screen visible for at least TOTAL_DURATION ms
  const [bootDone, setBootDone] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setBootDone(true), TOTAL_DURATION)
    return () => clearTimeout(t)
  }, [])

  const handleModeToggle = (newMode: 'terminal' | 'gui') => {
    setIsTransitioning(true)
    setTimeout(() => {
      setMode(newMode)
      setIsTransitioning(false)
    }, 400)
  }

  // Show boot screen until both data is loaded AND 3s have elapsed
  if (loading || !bootDone) {
    return <BootScreen />
  }

  if (mode === 'terminal') {
    return (
      <div
        className={`w-screen h-screen flex flex-col bg-[var(--bg-primary)] select-none overflow-hidden ${isTransitioning ? 'mode-glitch-transition' : ''}`}
      >
        <Terminal
          data={data}
          setMode={handleModeToggle}
          activeTheme={activeTheme}
          setTheme={setActiveTheme}
        />
      </div>
    )
  }

  return (
    <>
      <Navbar sections={SECTIONS} currentMode={mode} setMode={handleModeToggle} />
      <main className={`flex-1 w-full ${isTransitioning ? 'mode-glitch-transition' : ''}`}>
        <HeroSection landing={data.landing} />
        <AboutSection profile={data.profile} />
        <SkillsSection skills={data.skills} projects={data.projects} />
        <ExperienceSection experiences={data.experiences} />
        <ProjectsSection projects={data.projects} />
        <ContactSection contact={data.contact} />
      </main>
    </>
  )
}
