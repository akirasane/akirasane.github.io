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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Name *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => updateField('name', e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Title *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => updateField('title', e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Bio</label>
        <textarea
          value={formData.bio}
          onChange={(e) => updateField('bio', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Avatar URL</label>
        <input
          type="text"
          value={formData.avatarUrl}
          onChange={(e) => updateField('avatarUrl', e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Resume URL</label>
        <input
          type="text"
          value={formData.resumeUrl}
          onChange={(e) => updateField('resumeUrl', e.target.value)}
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
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={formData.social.email}
              onChange={(e) => updateSocial('email', e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
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
        Save Profile
      </button>
    </form>
  )
}
