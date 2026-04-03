'use client'

import { useState } from 'react'
import type { ContactInfo } from '@/lib/types'
import { validateContactInfo } from '@/lib/validation'

interface ContactFormProps {
  data: ContactInfo
  onSave: (d: ContactInfo) => void
}

export default function ContactForm({ data, onSave }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactInfo>(data)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validateContactInfo(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setErrors({})
    onSave(formData)
  }

  const updateField = (field: keyof Omit<ContactInfo, 'social'>, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const updateSocial = (field: keyof ContactInfo['social'], value: string) => {
    setFormData(prev => ({
      ...prev,
      social: { ...prev.social, [field]: value }
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="group md:col-span-2">
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2 group-focus-within:text-[var(--accent-primary)] transition-colors">
            Email <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
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
            Phone
          </label>
          <input
            type="text"
            value={formData.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            className="w-full px-4 py-2.5 bg-[var(--bg-secondary)]/50 border border-[var(--card-border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all duration-300 placeholder:text-[var(--text-secondary)]/50"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div className="group">
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2 group-focus-within:text-[var(--accent-primary)] transition-colors">
            Location
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => updateField('location', e.target.value)}
            className="w-full px-4 py-2.5 bg-[var(--bg-secondary)]/50 border border-[var(--card-border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all duration-300 placeholder:text-[var(--text-secondary)]/50"
            placeholder="City, Country"
          />
        </div>

        <div className="group md:col-span-2">
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2 group-focus-within:text-[var(--accent-primary)] transition-colors">
            Form Endpoint
          </label>
          <input
            type="text"
            value={formData.formEndpoint}
            onChange={(e) => updateField('formEndpoint', e.target.value)}
            placeholder="https://formsubmit.co/your@email.com"
            className="w-full px-4 py-2.5 bg-[var(--bg-secondary)]/50 border border-[var(--card-border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all duration-300 placeholder:text-[var(--text-secondary)]/50"
          />
        </div>
      </div>

      <div className="border-t border-[var(--card-border)] pt-6">
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

          <div className="group">
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
          Save Contact Info
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </form>
  )
}
