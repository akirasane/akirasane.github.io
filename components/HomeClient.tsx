'use client'

import { usePortfolioStore } from '@/lib/store'
import Navbar from '@/components/layout/Navbar'
import HeroSection from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'
import SkillsSection from '@/components/sections/SkillsSection'
import ExperienceSection from '@/components/sections/ExperienceSection'
import ProjectsSection from '@/components/sections/ProjectsSection'
import ContactSection from '@/components/sections/ContactSection'

const SECTIONS = [
  { id: 'hero',       label: 'Home' },
  { id: 'about',      label: 'About' },
  { id: 'skills',     label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects',   label: 'Projects' },
  { id: 'contact',    label: 'Contact' },
]

export default function HomeClient() {
  const { data, loading } = usePortfolioStore()

  if (loading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ background: 'var(--bg-primary)', color: 'var(--text-secondary)' }}
      >
        Loading…
      </div>
    )
  }

  return (
    <>
      <Navbar sections={SECTIONS} />
      <main className="flex-1 w-full">
        <HeroSection       landing={data.landing} />
        <AboutSection      profile={data.profile} />
        <SkillsSection     skills={data.skills} />
        <ExperienceSection experiences={data.experiences} />
        <ProjectsSection   projects={data.projects} />
        <ContactSection    contact={data.contact} />
      </main>
    </>
  )
}
