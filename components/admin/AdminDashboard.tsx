'use client'

import { useState } from 'react'
import { usePortfolioStore } from '@/lib/store'
import ProfileForm from './forms/ProfileForm'
import LandingForm from './forms/LandingForm'
import ExperienceForm from './forms/ExperienceForm'
import SkillsForm from './forms/SkillsForm'
import ProjectsForm from './forms/ProjectsForm'
import ContactForm from './forms/ContactForm'

interface AdminDashboardProps {
  onLogout: () => void
}

type TabId = 'profile' | 'landing' | 'experience' | 'skills' | 'projects' | 'contact'

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const { data, loading, save } = usePortfolioStore()
  const [activeTab, setActiveTab] = useState<TabId>('profile')

  const tabs: Array<{ id: TabId; label: string }> = [
    { id: 'profile', label: 'Profile' },
    { id: 'landing', label: 'Landing' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] p-8 flex items-center justify-center">
        <p className="text-[var(--text-secondary)]">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">
            Admin Dashboard
          </h1>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-md font-medium hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg backdrop-blur-sm overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex border-b border-[var(--card-border)] overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[var(--accent-primary)] text-white'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'profile' && (
              <ProfileForm
                data={data.profile}
                onSave={(profile) => save({ profile })}
              />
            )}

            {activeTab === 'landing' && (
              <LandingForm
                data={data.landing}
                onSave={(landing) => save({ landing })}
              />
            )}

            {activeTab === 'experience' && (
              <ExperienceForm
                data={data.experiences}
                onSave={(experiences) => save({ experiences })}
              />
            )}

            {activeTab === 'skills' && (
              <SkillsForm
                data={data.skills}
                onSave={(skills) => save({ skills })}
              />
            )}

            {activeTab === 'projects' && (
              <ProjectsForm
                data={data.projects}
                onSave={(projects) => save({ projects })}
              />
            )}

            {activeTab === 'contact' && (
              <ContactForm
                data={data.contact}
                onSave={(contact) => save({ contact })}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
