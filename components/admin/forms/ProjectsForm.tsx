'use client'

import { useState } from 'react'
import type { Project } from '@/lib/types'
import { validateProject } from '@/lib/validation'

interface ProjectsFormProps {
  data: Project[]
  onSave: (d: Project[]) => void
}

export default function ProjectsForm({ data, onSave }: ProjectsFormProps) {
  const [projects, setProjects] = useState<Project[]>(data)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Omit<Project, 'id'>>({
    title: '',
    description: '',
    tags: [],
    link: '',
    imageUrl: ''
  })
  const [tagsInput, setTagsInput] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const tags = tagsInput.split(',').map(t => t.trim()).filter(t => t.length > 0)
    const projectData = { ...formData, tags }
    
    const validationErrors = validateProject(projectData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setErrors({})

    if (editingId) {
      const updated = projects.map(proj =>
        proj.id === editingId ? { ...projectData, id: editingId } : proj
      )
      onSave(updated)
      setProjects(updated)
      setEditingId(null)
    } else {
      const newProject: Project = { ...projectData, id: crypto.randomUUID() }
      const updated = [...projects, newProject]
      onSave(updated)
      setProjects(updated)
    }

    setFormData({
      title: '',
      description: '',
      tags: [],
      link: '',
      imageUrl: ''
    })
    setTagsInput('')
  }

  const handleEdit = (proj: Project) => {
    setEditingId(proj.id)
    setFormData({
      title: proj.title,
      description: proj.description,
      tags: proj.tags,
      link: proj.link,
      imageUrl: proj.imageUrl
    })
    setTagsInput(proj.tags.join(', '))
  }

  const handleDelete = (id: string) => {
    const updated = projects.filter(proj => proj.id !== id)
    onSave(updated)
    setProjects(updated)
  }

  const handleCancel = () => {
    setEditingId(null)
    setFormData({
      title: '',
      description: '',
      tags: [],
      link: '',
      imageUrl: ''
    })
    setTagsInput('')
    setErrors({})
  }

  return (
    <div className="space-y-6">
      <div className="bg-[var(--bg-secondary)]/30 border border-[var(--card-border)] rounded-xl p-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-[var(--accent-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {editingId ? 'Edit Project' : 'Add New Project'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="group">
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2 group-focus-within:text-[var(--accent-primary)] transition-colors">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-2.5 bg-[var(--bg-secondary)]/50 border border-[var(--card-border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all duration-300 placeholder:text-[var(--text-secondary)]/50"
              placeholder="Project name"
            />
            {errors.title && <p className="text-red-400 text-sm mt-1.5 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.title}
            </p>}
          </div>

          <div className="group">
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2 group-focus-within:text-[var(--accent-primary)] transition-colors">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2.5 bg-[var(--bg-secondary)]/50 border border-[var(--card-border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all duration-300 placeholder:text-[var(--text-secondary)]/50 resize-none"
              placeholder="Describe your project..."
            />
            {errors.description && <p className="text-red-400 text-sm mt-1.5 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.description}
            </p>}
          </div>

          <div className="group">
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2 group-focus-within:text-[var(--accent-primary)] transition-colors">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="React, TypeScript, Node.js"
              className="w-full px-4 py-2.5 bg-[var(--bg-secondary)]/50 border border-[var(--card-border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all duration-300 placeholder:text-[var(--text-secondary)]/50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="group">
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2 group-focus-within:text-[var(--accent-primary)] transition-colors">
                Project Link
              </label>
              <input
                type="text"
                value={formData.link}
                onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                className="w-full px-4 py-2.5 bg-[var(--bg-secondary)]/50 border border-[var(--card-border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all duration-300 placeholder:text-[var(--text-secondary)]/50"
                placeholder="https://project-url.com"
              />
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2 group-focus-within:text-[var(--accent-primary)] transition-colors">
                Image URL
              </label>
              <input
                type="text"
                value={formData.imageUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                className="w-full px-4 py-2.5 bg-[var(--bg-secondary)]/50 border border-[var(--card-border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all duration-300 placeholder:text-[var(--text-secondary)]/50"
                placeholder="https://image-url.com/image.jpg"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-[var(--accent-primary)]/50 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {editingId ? 'Update' : 'Add'} Project
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Existing Projects ({projects.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map(proj => (
            <div key={proj.id} className="bg-[var(--bg-secondary)]/30 border border-[var(--card-border)] rounded-xl p-4 hover:border-[var(--accent-primary)]/50 transition-all duration-300 group">
              <div className="flex justify-between items-start gap-4 mb-3">
                <div className="flex-1">
                  <p className="font-semibold text-[var(--text-primary)] text-lg">{proj.title}</p>
                  <p className="text-sm text-[var(--text-secondary)] mt-1 line-clamp-2">{proj.description}</p>
                </div>
              </div>
              {proj.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {proj.tags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-1 bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-xs rounded-lg border border-[var(--accent-primary)]/20">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(proj)}
                  className="flex-1 px-3 py-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-500 hover:text-white transition-all duration-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(proj.id)}
                  className="flex-1 px-3 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500 hover:text-white transition-all duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {projects.length === 0 && (
            <div className="col-span-full text-center py-12 text-[var(--text-secondary)] bg-[var(--bg-secondary)]/20 rounded-xl border border-dashed border-[var(--card-border)]">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              No projects yet. Add your first one above!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
