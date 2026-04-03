'use client'

import { useState } from 'react'
import type { Profile } from '@/lib/types'
import { validateProfile } from '@/lib/validation'

interface ProfileFormProps {
  data: Profile
  onSave: (d: Profile) => void
}

export default function ProfileForm({ data, onSave }: ProfileFormProps) {
  const [formData, setFormData] = useState<Profile>(data)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validateProfile(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setErrors({})
    onSave(formData)
  }

  const updateField = (field: keyof Profile, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const updateSocial = (field: keyof Profile['social'], value: string) => {
    setFormData(prev => ({
      ...prev,
      social: { ...prev.social, [field]: value }
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="group">
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2 group-focus-within:text-[var(--accent-primary)] transition-colors">
            Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            className="w-full px-4 py-2.5 bg-[var(--bg-secondary)]/50 border border-[var(--card-border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all duration-300 placeholder:text-[var(--text-secondary)]/50"
            placeholder="Your full name"
          />
          {errors.name && <p className="text-red-400 text-sm mt-1.5 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.name}
          </p>}
        </div>

        <div className="group">
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2 group-focus-within:text-[var(--accent-primary)] transition-colors">
            Title <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => updateField('title', e.target.value)}
            className="w-full px-4 py-2.5 bg-[var(--bg-secondary)]/50 border border-[var(--card-border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all duration-300 placeholder:text-[var(--text-secondary)]/50"
            placeholder="Your professional title"
          />
          {errors.title && <p className="text-red-400 text-sm mt-1.5 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.title}
          </p>}
        </div>
      </div>

      <div className="group">
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2 group-focus-within:text-[var(--accent-primary)] transition-colors">
          Bio
        </label>
        <textarea
          value={formData.bio}
          onChange={(e) => updateField('bio', e.target.value)}
          rows={4}
          className="w-full px-4 py-2.5 bg-[var(--bg-secondary)]/50 border border-[var(--card-border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all duration-300 placeholder:text-[var(--text-secondary)]/50 resize-none"
          placeholder="Tell us about yourself..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="group">
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2 group-focus-within:text-[var(--accent-primary)] transition-colors">
            Avatar URL
          </label>
          <input
            type="text"
            value={formData.avatarUrl}
            onChange={(e) => updateField('avatarUrl', e.target.value)}
            className="w-full px-4 py-2.5 bg-[var(--bg-secondary)]/50 border border-[var(--card-border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all duration-300 placeholder:text-[var(--text-secondary)]/50"
            placeholder="https://example.com/avatar.jpg"
          />
        </div>

        <div className="group">
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2 group-focus-within:text-[var(--accent-primary)] transition-colors">
            Resume URL
          </label>
          <input
            type="text"
            value={formData.resumeUrl}
            onChange={(e) => updateField('resumeUrl', e.target.value)}
            className="w-full px-4 py-2.5 bg-[var(--bg-secondary)]/50 border border-[var(--card-border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all duration-300 placeholder:text-[var(--text-secondary)]/50"
            placeholder="https://example.com/resume.pdf"
          />
        </div>
      </div>

      <div className="border-t border-[var(--card-border)] pt-6 mt-8">
        <div className="flex items-center gap-2 mb-6">
          <svg className="w-5 h-5 text-[var(--accent-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Social Links</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="group">
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2 group-focus-within:text-[var(--accent-primary)] transition-colors">
              GitHub
            </label>
            <input
              type="text"
              value={formData.social.github}
              onChange={(e) => updateSocial('github', e.target.value)}
              className="w-full px-4 py-2.5 bg-[var(--bg-secondary)]/50 border border-[var(--card-border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all duration-300 placeholder:text-[var(--text-secondary)]/50"
              placeholder="https://github.com/username"
            />
          </div>

          <div className="group">
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2 group-focus-within:text-[var(--accent-primary)] transition-colors">
              LinkedIn
            </label>
            <input
              type="text"
              value={formData.social.linkedin}
              onChange={(e) => updateSocial('linkedin', e.target.value)}
              className="w-full px-4 py-2.5 bg-[var(--bg-secondary)]/50 border border-[var(--card-border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all duration-300 placeholder:text-[var(--text-secondary)]/50"
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          <div className="group">
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2 group-focus-within:text-[var(--accent-primary)] transition-colors">
              Email
            </label>
            <input
              type="email"
              value={formData.social.email}
              onChange={(e) => updateSocial('email', e.target.value)}
              className="w-full px-4 py-2.5 bg-[var(--bg-secondary)]/50 border border-[var(--card-border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all duration-300 placeholder:text-[var(--text-secondary)]/50"
              placeholder="your@email.com"
            />
            {errors.email && <p className="text-red-400 text-sm mt-1.5 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.email}
            </p>}
          </div>

          <div className="group">
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2 group-focus-within:text-[var(--accent-primary)] transition-colors">
              Twitter
            </label>
            <input
              type="text"
              value={formData.social.twitter}
              onChange={(e) => updateSocial('twitter', e.target.value)}
              className="w-full px-4 py-2.5 bg-[var(--bg-secondary)]/50 border border-[var(--card-border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all duration-300 placeholder:text-[var(--text-secondary)]/50"
              placeholder="https://twitter.com/username"
            />
          </div>

          <div className="group md:col-span-2">
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2 group-focus-within:text-[var(--accent-primary)] transition-colors">
              Website
            </label>
            <input
              type="text"
              value={formData.social.website}
              onChange={(e) => updateSocial('website', e.target.value)}
              className="w-full px-4 py-2.5 bg-[var(--bg-secondary)]/50 border border-[var(--card-border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all duration-300 placeholder:text-[var(--text-secondary)]/50"
              placeholder="https://yourwebsite.com"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <button
          type="submit"
          className="px-8 py-3 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-[var(--accent-primary)]/50 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 group"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Save Profile
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </form>
  )
}
