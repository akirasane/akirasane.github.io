'use client'

import { useState } from 'react'
import type { Experience } from '@/lib/types'
import { validateExperience } from '@/lib/validation'

interface ExperienceFormProps {
  data: Experience[]
  onSave: (d: Experience[]) => void
}

export default function ExperienceForm({ data, onSave }: ExperienceFormProps) {
  const [experiences, setExperiences] = useState<Experience[]>(data)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Omit<Experience, 'id'>>({
    company: '',
    title: '',
    startDate: '',
    endDate: '',
    description: '',
    color: 'indigo'
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validateExperience(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setErrors({})

    if (editingId) {
      const updated = experiences.map(exp =>
        exp.id === editingId ? { ...formData, id: editingId } : exp
      )
      onSave(updated)
      setExperiences(updated)
      setEditingId(null)
    } else {
      const newEntry: Experience = { ...formData, id: crypto.randomUUID() }
      const updated = [...experiences, newEntry]
      onSave(updated)
      setExperiences(updated)
    }

    setFormData({
      company: '',
      title: '',
      startDate: '',
      endDate: '',
      description: '',
      color: 'indigo'
    })
  }

  const handleEdit = (exp: Experience) => {
    setEditingId(exp.id)
    setFormData({
      company: exp.company,
      title: exp.title,
      startDate: exp.startDate,
      endDate: exp.endDate,
      description: exp.description,
      color: exp.color
    })
  }

  const handleDelete = (id: string) => {
    const updated = experiences.filter(exp => exp.id !== id)
    onSave(updated)
    setExperiences(updated)
  }

  const handleCancel = () => {
    setEditingId(null)
    setFormData({
      company: '',
      title: '',
      startDate: '',
      endDate: '',
      description: '',
      color: 'indigo'
    })
    setErrors({})
  }

  return (
    <div className="space-y-6">
      <div className="bg-[var(--bg-secondary)]/30 border border-[var(--card-border)] rounded-xl p-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-[var(--accent-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {editingId ? 'Edit Experience' : 'Add New Experience'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="group">
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2 group-focus-within:text-[var(--accent-primary)] transition-colors">
                Company <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                className="w-full px-4 py-2.5 bg-[var(--bg-secondary)]/50 border border-[var(--card-border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all duration-300 placeholder:text-[var(--text-secondary)]/50"
                placeholder="Company name"
              />
              {errors.company && <p className="text-red-400 text-sm mt-1.5 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.company}
              </p>}
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2 group-focus-within:text-[var(--accent-primary)] transition-colors">
                Job Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2.5 bg-[var(--bg-secondary)]/50 border border-[var(--card-border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all duration-300 placeholder:text-[var(--text-secondary)]/50"
                placeholder="Your position"
              />
              {errors.title && <p className="text-red-400 text-sm mt-1.5 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.title}
              </p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="group">
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2 group-focus-within:text-[var(--accent-primary)] transition-colors">
                Start Date <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-4 py-2.5 bg-[var(--bg-secondary)]/50 border border-[var(--card-border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all duration-300"
              />
              {errors.startDate && <p className="text-red-400 text-sm mt-1.5">{errors.startDate}</p>}
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2 group-focus-within:text-[var(--accent-primary)] transition-colors">
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-4 py-2.5 bg-[var(--bg-secondary)]/50 border border-[var(--card-border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all duration-300"
                placeholder="Leave empty for current"
              />
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2 group-focus-within:text-[var(--accent-primary)] transition-colors">
                Color Theme
              </label>
              <select
                value={formData.color}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                className="w-full px-4 py-2.5 bg-[var(--bg-secondary)]/50 border border-[var(--card-border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all duration-300"
              >
                <option value="indigo">Indigo</option>
                <option value="emerald">Emerald</option>
                <option value="violet">Violet</option>
                <option value="rose">Rose</option>
                <option value="amber">Amber</option>
              </select>
            </div>
          </div>

          <div className="group">
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2 group-focus-within:text-[var(--accent-primary)] transition-colors">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2.5 bg-[var(--bg-secondary)]/50 border border-[var(--card-border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all duration-300 placeholder:text-[var(--text-secondary)]/50 resize-none"
              placeholder="Describe your role and achievements..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-[var(--accent-primary)]/50 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {editingId ? 'Update' : 'Add'} Experience
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2.5 bg-[var(--bg-secondary)] border border-[var(--card-border)] text-[var(--text-secondary)] rounded-xl font-medium hover:text-[var(--text-primary)] hover:border-[var(--accent-primary)]/50 transition-all duration-300"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-[var(--accent-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Existing Experiences ({experiences.length})
        </h3>
        <div className="space-y-3">
          {experiences.map(exp => (
            <div key={exp.id} className="bg-[var(--bg-secondary)]/30 border border-[var(--card-border)] rounded-xl p-4 hover:border-[var(--accent-primary)]/50 transition-all duration-300 group">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <p className="font-semibold text-[var(--text-primary)] text-lg">{exp.company}</p>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">{exp.title}</p>
                  <p className="text-xs text-[var(--text-secondary)]/70 mt-2 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {exp.startDate} - {exp.endDate || 'Present'}
                  </p>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(exp)}
                    className="px-3 py-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-500 hover:text-white transition-all duration-300 transform hover:scale-105 active:scale-95"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(exp.id)}
                    className="px-3 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500 hover:text-white transition-all duration-300 transform hover:scale-105 active:scale-95"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {experiences.length === 0 && (
            <div className="text-center py-12 text-[var(--text-secondary)] bg-[var(--bg-secondary)]/20 rounded-xl border border-dashed border-[var(--card-border)]">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              No experiences yet. Add your first one above!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
