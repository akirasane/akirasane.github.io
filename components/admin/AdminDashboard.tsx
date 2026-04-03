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
      <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-primary)] p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-4 border-[var(--accent-primary)]/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-[var(--accent-primary)] border-r-[var(--accent-secondary)] rounded-full animate-spin"></div>
          </div>
          <p className="text-[var(--text-secondary)] text-lg animate-pulse">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-primary)] p-4 md:p-8 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[var(--accent-primary)]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[var(--accent-secondary)]/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-[var(--card-bg)]/80 backdrop-blur-xl border border-[var(--card-border)] rounded-2xl p-6 shadow-xl">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-[var(--text-secondary)] text-sm mt-1">Manage your portfolio content</p>
          </div>
          <button
            onClick={onLogout}
            className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2 group"
          >
            <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>

        {/* Main Content Card */}
        <div className="bg-[var(--card-bg)]/80 border border-[var(--card-border)] rounded-2xl backdrop-blur-xl overflow-hidden shadow-2xl">
          {/* Tab Navigation */}
          <div className="flex border-b border-[var(--card-border)] overflow-x-auto scrollbar-thin scrollbar-thumb-[var(--accent-primary)] scrollbar-track-transparent">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-6 py-4 font-medium transition-all duration-300 whitespace-nowrap group ${
                  activeTab === tab.id
                    ? 'text-white'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {activeTab === tab.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] animate-slideIn"></div>
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {getTabIcon(tab.id)}
                  {tab.label}
                </span>
                {activeTab !== tab.id && (
                  <div className="absolute inset-0 bg-[var(--bg-secondary)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6 md:p-8 animate-fadeIn">
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

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  )
}

function getTabIcon(tabId: TabId) {
  const icons: Record<TabId, React.ReactElement> = {
    profile: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    landing: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    experience: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    skills: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    projects: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    contact: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  }
  return icons[tabId]
}
