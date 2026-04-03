'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import GlassSurface from '@/components/reactbits/GlassSurface'

interface NavbarProps {
  sections: Array<{ id: string; label: string }>
}

export default function Navbar({ sections }: NavbarProps) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 max-w-4xl w-[90%]">
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
          <span className="font-semibold text-base" style={{ color: 'var(--accent-primary)' }}>
            Portfolio
          </span>

          {/* Desktop nav links */}
          <ul className="hidden md:flex gap-8 list-none m-0 p-0">
            {sections.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => scrollToSection(s.id)}
                  className="text-sm font-medium transition-all hover:scale-105"
                  style={{
                    color: pathname === `/#${s.id}` ? 'var(--accent-primary)' : 'var(--text-primary)',
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
            {/* Mobile hamburger */}
            <button
              aria-label="Toggle menu"
              className="md:hidden w-8 h-8 flex flex-col items-center justify-center gap-1 rounded-full transition-all hover:scale-110"
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
          opacity={0.7}
          blur={15}
          backgroundOpacity={0.3}
          saturation={1.2}
          className="mt-2"
        >
          <ul className="flex flex-col md:hidden list-none m-0 p-4 gap-3 w-full">
            {sections.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => scrollToSection(s.id)}
                  className="w-full text-left text-sm font-medium transition-all hover:translate-x-1"
                  style={{ color: 'var(--text-primary)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {s.label}
                </button>
              </li>
            ))}
          </ul>
        </GlassSurface>
      )}
    </div>
  )
}
