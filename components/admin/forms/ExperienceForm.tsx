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
      <div className="border rounded p-4">
        <h3 className="text-lg font-semibold mb-4">
          {editingId ? 'Edit Experience' : 'Add New Experience'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Company *</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
              className="w-full px-3 py-2 border rounded"
            />
            {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Job Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border rounded"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date *</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-3 py-2 border rounded"
              />
              {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Color</label>
            <select
              value={formData.color}
              onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="indigo">Indigo</option>
              <option value="emerald">Emerald</option>
              <option value="violet">Violet</option>
              <option value="rose">Rose</option>
              <option value="amber">Amber</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-accent text-white rounded hover:opacity-90"
            >
              {editingId ? 'Update' : 'Add'} Experience
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:opacity-90"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Existing Experiences</h3>
        <div className="space-y-2">
          {experiences.map(exp => (
            <div key={exp.id} className="flex justify-between items-start p-3 border rounded">
              <div>
                <p className="font-semibold">{exp.company}</p>
                <p className="text-sm text-gray-600">{exp.title}</p>
                <p className="text-xs text-gray-500">
                  {exp.startDate} - {exp.endDate || 'Present'}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(exp)}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(exp.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {experiences.length === 0 && (
            <p className="text-gray-500 text-sm">No experiences yet</p>
          )}
        </div>
      </div>
    </div>
  )
}
