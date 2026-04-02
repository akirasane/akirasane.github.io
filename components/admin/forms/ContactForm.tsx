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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Email *</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Phone</label>
        <input
          type="text"
          value={formData.phone}
          onChange={(e) => updateField('phone', e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Location</label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => updateField('location', e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Form Endpoint</label>
        <input
          type="text"
          value={formData.formEndpoint}
          onChange={(e) => updateField('formEndpoint', e.target.value)}
          placeholder="https://formsubmit.co/your@email.com"
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold mb-3">Social Links</h3>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">GitHub</label>
            <input
              type="text"
              value={formData.social.github}
              onChange={(e) => updateSocial('github', e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">LinkedIn</label>
            <input
              type="text"
              value={formData.social.linkedin}
              onChange={(e) => updateSocial('linkedin', e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Twitter</label>
            <input
              type="text"
              value={formData.social.twitter}
              onChange={(e) => updateSocial('twitter', e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Website</label>
            <input
              type="text"
              value={formData.social.website}
              onChange={(e) => updateSocial('website', e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-accent text-white rounded hover:opacity-90"
      >
        Save Contact Info
      </button>
    </form>
  )
}
