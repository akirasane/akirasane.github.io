'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { usePortfolioStore } from '@/lib/store'

interface NavbarProps {
  sections: Array<{ id: string; label: string }>
}

export default function Navbar({ sections }: NavbarProps) {
  const pathname = usePathname()
  const store = usePortfolioStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  // Sync theme state from DOM on mount
  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme')
    setTheme(current === 'light' ? 'light' : 'dark')
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', newTheme)
    setTheme(newTheme)
    store.save({ theme: newTheme })
  }

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
      style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--card-border)' }}
    >
      {/* Logo / brand */}
      <span className="font-semibold text-lg" style={{ color: 'var(--accent-primary)' }}>
        Portfolio
      </span>

      {/* Desktop nav links */}
      <ul className="hidden md:flex gap-6 list-none m-0 p-0">
        {sections.map((s) => (
          <li key={s.id}>
            <button
              onClick={() => scrollToSection(s.id)}
              className="text-sm transition-colors hover:opacity-80"
              style={{
                color: pathname === `/#${s.id}` ? 'var(--accent-primary)' : 'var(--text-secondary)',
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
        {/* Theme toggle */}
        <button
          aria-label="Toggle theme"
          onClick={toggleTheme}
          className="w-9 h-9 flex items-center justify-center rounded-full transition-colors"
          style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', cursor: 'pointer', color: 'var(--text-primary)' }}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {/* Mobile hamburger */}
        <button
          aria-label="Toggle menu"
          className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1 rounded"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span style={{ display: 'block', width: 20, height: 2, background: 'var(--text-primary)' }} />
          <span style={{ display: 'block', width: 20, height: 2, background: 'var(--text-primary)' }} />
          <span style={{ display: 'block', width: 20, height: 2, background: 'var(--text-primary)' }} />
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <ul
          className="absolute top-full left-0 right-0 flex flex-col md:hidden list-none m-0 p-4 gap-3"
          style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--card-border)' }}
        >
          {sections.map((s) => (
            <li key={s.id}>
              <button
                onClick={() => scrollToSection(s.id)}
                className="w-full text-left text-sm"
                style={{ color: 'var(--text-primary)', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </nav>
  )
}
