'use client'

import { useState, useEffect } from 'react'
import GlassSurface from '@/components/reactbits/GlassSurface'
import { scrollToSectionId } from '@/lib/utils'

interface NavbarProps {
  sections: Array<{ id: string; label: string }>
  currentMode: 'terminal' | 'gui'
  setMode: (mode: 'terminal' | 'gui') => void
}

const CLI_USED_KEY = 'cli-mode-used'

export default function Navbar({ sections, currentMode, setMode }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? '')
  const [showCliHint, setShowCliHint] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        setShowCliHint(localStorage.getItem(CLI_USED_KEY) !== '1')
      } catch {
        setShowCliHint(true)
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  const enterCliMode = () => {
    try {
      localStorage.setItem(CLI_USED_KEY, '1')
    } catch {}
    setShowCliHint(false)
    setMode('terminal')
  }

  useEffect(() => {
    const root = document.querySelector('main')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { root, rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    )

    sections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [sections])

  const scrollToSection = (id: string) => {
    scrollToSectionId(id)
    setMenuOpen(false)
  }

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 max-w-6xl w-[90%]">
      <GlassSurface
        width="100%"
        height="auto"
        borderRadius={50}
        brightness={10}
        opacity={0.7}
        blur={15}
        backgroundOpacity={0.3}
        saturation={1.2}
        className="px-6 py-3"
      >
        <nav className="flex items-center justify-between w-full">
          {/* Logo / brand */}
          <span className="shrink-0 font-semibold text-base" style={{ color: 'var(--accent-primary)' }}>
            Portfolio
          </span>

          {/* Desktop nav links */}
          <ul className="hidden lg:flex gap-5 xl:gap-8 list-none m-0 p-0">
            {sections.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => scrollToSection(s.id)}
                  className="text-sm font-medium whitespace-nowrap transition-all hover:scale-105"
                  style={{
                    color: activeId === s.id ? 'var(--accent-primary)' : 'var(--text-primary)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {s.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            {/* Terminal Mode Toggle Button */}
            <button
              onClick={enterCliMode}
              className="relative px-3 py-2.5 bg-[var(--accent-primary)] text-black rounded-full text-xs font-bold font-mono tracking-wide cursor-pointer transition-all hover:scale-105 whitespace-nowrap"
            >
              {"[>_] CLI Mode"}
              {showCliHint && (
                <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75 motion-safe:animate-ping" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-pink-400 ring-1 ring-black/40" />
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              aria-label="Toggle menu"
              className="lg:hidden w-11 h-11 flex flex-col items-center justify-center gap-1 rounded-full transition-all hover:scale-110"
              style={{ 
                background: 'rgba(99, 102, 241, 0.1)', 
                border: '1px solid rgba(99, 102, 241, 0.3)', 
                cursor: 'pointer' 
              }}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span style={{ display: 'block', width: 16, height: 2, background: 'var(--text-primary)', borderRadius: 2 }} />
              <span style={{ display: 'block', width: 16, height: 2, background: 'var(--text-primary)', borderRadius: 2 }} />
              <span style={{ display: 'block', width: 16, height: 2, background: 'var(--text-primary)', borderRadius: 2 }} />
            </button>
          </div>
        </nav>
      </GlassSurface>

      {/* Mobile dropdown */}
      {menuOpen && (
        <GlassSurface
          width="100%"
          height="auto"
          borderRadius={24}
          brightness={10}
          opacity={0.95}
          blur={20}
          backgroundOpacity={0.85}
          saturation={1.2}
          distortionScale={-30}
          className="mt-2"
        >
          <ul className="flex flex-col lg:hidden list-none m-0 p-4 gap-3 w-full">
            {sections.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => scrollToSection(s.id)}
                  className="w-full text-left text-sm font-medium py-2.5 transition-all hover:translate-x-1"
                  style={{ color: activeId === s.id ? 'var(--accent-primary)' : 'var(--text-primary)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {s.label}
                </button>
              </li>
            ))}
            <li className="pt-2 border-t border-[var(--card-border)]">
              <button
                onClick={() => {
                  enterCliMode()
                  setMenuOpen(false)
                }}
                className="w-full text-center py-2 bg-[var(--accent-primary)] text-black rounded-lg text-xs font-bold font-mono tracking-wide cursor-pointer"
              >
                {"[>_] CLI Mode"}
                {showCliHint && (
                  <span className="ml-2 rounded bg-black/20 px-1.5 py-0.5 text-[0.625rem] uppercase motion-safe:animate-pulse">
                    try me
                  </span>
                )}
              </button>
            </li>
          </ul>
        </GlassSurface>
      )}
    </div>
  )
}
