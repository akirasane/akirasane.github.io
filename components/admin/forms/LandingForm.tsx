'use client'

import { useState } from 'react'
import type { LandingContent } from '@/lib/types'

interface LandingFormProps {
  data: LandingContent
  onSave: (d: LandingContent) => void
}

export default function LandingForm({ data, onSave }: LandingFormProps) {
  const [formData, setFormData] = useState<LandingContent>(data)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const updateField = (field: keyof Omit<LandingContent, 'ctaLinks'>, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const updateCtaLink = (index: number, field: 'label' | 'target', value: string) => {
    setFormData(prev => ({
      ...prev,
      ctaLinks: prev.ctaLinks.map((link, i) =>
        i === index ? { ...link, [field]: value } : link
      )
    }))
  }

  const addCtaLink = () => {
    setFormData(prev => ({
      ...prev,
      ctaLinks: [...prev.ctaLinks, { label: '', target: '' }]
    }))
  }

  const removeCtaLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ctaLinks: prev.ctaLinks.filter((_, i) => i !== index)
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="group">
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2 group-focus-within:text-[var(--accent-primary)] transition-colors">
            Display Name
          </label>
          <input
            type="text"
            value={formData.displayName}
            onChange={(e) => updateField('displayName', e.target.value)}
            className="w-full px-4 py-2.5 bg-[var(--bg-secondary)]/50 border border-[var(--card-border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all duration-300 placeholder:text-[var(--text-secondary)]/50"
            placeholder="Your display name"
          />
        </div>

        <div className="group">
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2 group-focus-within:text-[var(--accent-primary)] transition-colors">
            Tagline
          </label>
          <input
            type="text"
            value={formData.tagline}
            onChange={(e) => updateField('tagline', e.target.value)}
            className="w-full px-4 py-2.5 bg-[var(--bg-secondary)]/50 border border-[var(--card-border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all duration-300 placeholder:text-[var(--text-secondary)]/50"
            placeholder="Your catchy tagline"
          />
        </div>
      </div>

      <div className="border-t border-[var(--card-border)] pt-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[var(--accent-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Call-to-Action Links</h3>
          </div>
          <button
            type="button"
            onClick={addCtaLink}
            className="px-4 py-2 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-[var(--accent-primary)]/50 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Link
          </button>
        </div>

        <div className="space-y-4">
          {formData.ctaLinks.map((link, index) => (
            <div key={index} className="bg-[var(--bg-secondary)]/30 border border-[var(--card-border)] rounded-xl p-4 hover:border-[var(--accent-primary)]/50 transition-all duration-300">
              <div className="flex gap-3 items-start">
                <div className="flex-1 space-y-3">
                  <input
                    type="text"
                    placeholder="Button Label"
                    value={link.label}
                    onChange={(e) => updateCtaLink(index, 'label', e.target.value)}
                    className="w-full px-4 py-2.5 bg-[var(--bg-secondary)]/50 border border-[var(--card-border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all duration-300 placeholder:text-[var(--text-secondary)]/50"
                  />
                  <input
                    type="text"
                    placeholder="Target (section id, e.g., #projects)"
                    value={link.target}
                    onChange={(e) => updateCtaLink(index, 'target', e.target.value)}
                    className="w-full px-4 py-2.5 bg-[var(--bg-secondary)]/50 border border-[var(--card-border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all duration-300 placeholder:text-[var(--text-secondary)]/50"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeCtaLink(index)}
                  className="px-3 py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm font-medium hover:bg-red-500 hover:text-white transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
          {formData.ctaLinks.length === 0 && (
            <div className="text-center py-8 text-[var(--text-secondary)] bg-[var(--bg-secondary)]/20 rounded-xl border border-dashed border-[var(--card-border)]">
              No CTA links yet. Click "Add Link" to create one.
            </div>
          )}
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
          Save Landing
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </form>
  )
}
