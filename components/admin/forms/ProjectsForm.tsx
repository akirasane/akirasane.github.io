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
      <div className="border rounded p-4">
        <h3 className="text-lg font-semibold mb-4">
          {editingId ? 'Edit Project' : 'Add New Project'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border rounded"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border rounded"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="React, TypeScript, Node.js"
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Project Link</label>
            <input
              type="text"
              value={formData.link}
              onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Image URL</label>
            <input
              type="text"
              value={formData.imageUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-accent text-white rounded hover:opacity-90"
            >
              {editingId ? 'Update' : 'Add'} Project
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
        <h3 className="text-lg font-semibold mb-3">Existing Projects</h3>
        <div className="space-y-2">
          {projects.map(proj => (
            <div key={proj.id} className="flex justify-between items-start p-3 border rounded">
              <div>
                <p className="font-semibold">{proj.title}</p>
                <p className="text-sm text-gray-600">{proj.description}</p>
                {proj.tags.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Tags: {proj.tags.join(', ')}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(proj)}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(proj.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {projects.length === 0 && (
            <p className="text-gray-500 text-sm">No projects yet</p>
          )}
        </div>
      </div>
    </div>
  )
}
