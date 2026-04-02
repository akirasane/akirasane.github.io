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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Display Name</label>
        <input
          type="text"
          value={formData.displayName}
          onChange={(e) => updateField('displayName', e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Tagline</label>
        <input
          type="text"
          value={formData.tagline}
          onChange={(e) => updateField('tagline', e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Call-to-Action Links</h3>
          <button
            type="button"
            onClick={addCtaLink}
            className="px-3 py-1 bg-accent text-white rounded text-sm"
          >
            Add Link
          </button>
        </div>

        <div className="space-y-3">
          {formData.ctaLinks.map((link, index) => (
            <div key={index} className="flex gap-2 items-start p-3 border rounded">
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  placeholder="Label"
                  value={link.label}
                  onChange={(e) => updateCtaLink(index, 'label', e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Target (section id)"
                  value={link.target}
                  onChange={(e) => updateCtaLink(index, 'target', e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <button
                type="button"
                onClick={() => removeCtaLink(index)}
                className="px-3 py-2 bg-red-500 text-white rounded text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-accent text-white rounded hover:opacity-90"
      >
        Save Landing
      </button>
    </form>
  )
}
