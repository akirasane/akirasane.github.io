'use client'

import { useState } from 'react'
import type { SkillCategory, SkillItem } from '@/lib/types'
import { validateSkillItem } from '@/lib/validation'

interface SkillsFormProps {
  data: SkillCategory[]
  onSave: (d: SkillCategory[]) => void
}

export default function SkillsForm({ data, onSave }: SkillsFormProps) {
  const [categories, setCategories] = useState<SkillCategory[]>(data)
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [categoryForm, setCategoryForm] = useState({ category: '', color: 'indigo' })
  const [itemForm, setItemForm] = useState<Omit<SkillItem, 'id'>>({
    name: '',
    proficiency: 50,
    years: 0
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null)

  const handleAddCategory = () => {
    if (!categoryForm.category.trim()) return
    const newCategory: SkillCategory = {
      id: crypto.randomUUID(),
      category: categoryForm.category,
      color: categoryForm.color,
      items: []
    }
    const updated = [...categories, newCategory]
    onSave(updated)
    setCategories(updated)
    setCategoryForm({ category: '', color: 'indigo' })
  }

  const handleDeleteCategory = (id: string) => {
    const updated = categories.filter(cat => cat.id !== id)
    onSave(updated)
    setCategories(updated)
  }

  const handleAddItem = (categoryId: string) => {
    const validationErrors = validateSkillItem(itemForm)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setErrors({})

    const updated = categories.map(cat => {
      if (cat.id === categoryId) {
        if (editingItemId) {
          return {
            ...cat,
            items: cat.items.map(item =>
              item.id === editingItemId ? { ...itemForm, id: editingItemId } : item
            )
          }
        } else {
          return {
            ...cat,
            items: [...cat.items, { ...itemForm, id: crypto.randomUUID() }]
          }
        }
      }
      return cat
    })
    onSave(updated)
    setCategories(updated)
    setItemForm({ name: '', proficiency: 50, years: 0 })
    setEditingItemId(null)
    setActiveCategoryId(null)
  }

  const handleEditItem = (categoryId: string, item: SkillItem) => {
    setActiveCategoryId(categoryId)
    setEditingItemId(item.id)
    setItemForm({
      name: item.name,
      proficiency: item.proficiency,
      years: item.years
    })
  }

  const handleDeleteItem = (categoryId: string, itemId: string) => {
    const updated = categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          items: cat.items.filter(item => item.id !== itemId)
        }
      }
      return cat
    })
    onSave(updated)
    setCategories(updated)
  }

  const handleCancelItem = () => {
    setEditingItemId(null)
    setActiveCategoryId(null)
    setItemForm({ name: '', proficiency: 50, years: 0 })
    setErrors({})
  }

  return (
    <div className="space-y-6">
      <div className="bg-[var(--bg-secondary)]/30 border border-[var(--card-border)] rounded-xl p-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-[var(--accent-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Category
        </h3>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Category name (e.g., Frontend, Backend)"
            value={categoryForm.category}
            onChange={(e) => setCategoryForm(prev => ({ ...prev, category: e.target.value }))}
            className="flex-1 px-4 py-2.5 bg-[var(--bg-secondary)]/50 border border-[var(--card-border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all duration-300 placeholder:text-[var(--text-secondary)]/50"
          />
          <select
            value={categoryForm.color}
            onChange={(e) => setCategoryForm(prev => ({ ...prev, color: e.target.value }))}
            className="px-4 py-2.5 bg-[var(--bg-secondary)]/50 border border-[var(--card-border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all duration-300"
          >
            <option value="indigo">Indigo</option>
            <option value="emerald">Emerald</option>
            <option value="violet">Violet</option>
            <option value="rose">Rose</option>
            <option value="amber">Amber</option>
          </select>
          <button
            type="button"
            onClick={handleAddCategory}
            className="px-6 py-2.5 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-[var(--accent-primary)]/50 transition-all duration-300 transform hover:scale-105 active:scale-95 whitespace-nowrap"
          >
            Add Category
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {categories.map(cat => (
          <div key={cat.id} className="bg-[var(--bg-secondary)]/30 border border-[var(--card-border)] rounded-xl p-6 hover:border-[var(--accent-primary)]/50 transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full bg-${cat.color}-500`}></span>
                {cat.category}
                <span className="text-sm text-[var(--text-secondary)] font-normal">({cat.items.length} skills)</span>
              </h3>
              <button
                onClick={() => handleDeleteCategory(cat.id)}
                className="px-3 py-1.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500 hover:text-white transition-all duration-300"
              >
                Delete Category
              </button>
            </div>

            <div className="space-y-2 mb-4">
              {cat.items.map(item => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-[var(--bg-secondary)]/50 rounded-lg border border-[var(--card-border)] hover:border-[var(--accent-primary)]/30 transition-all group">
                  <div className="flex-1">
                    <p className="font-medium text-[var(--text-primary)]">{item.name}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-full transition-all duration-300"
                            style={{ width: `${item.proficiency}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-[var(--text-secondary)]">{item.proficiency}%</span>
                      </div>
                      <span className="text-xs text-[var(--text-secondary)]">• {item.years} years</span>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditItem(cat.id, item)}
                      className="px-2 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded text-xs font-medium hover:bg-blue-500 hover:text-white transition-all duration-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteItem(cat.id, item.id)}
                      className="px-2 py-1 bg-red-500/10 border border-red-500/30 text-red-400 rounded text-xs font-medium hover:bg-red-500 hover:text-white transition-all duration-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {cat.items.length === 0 && (
                <p className="text-[var(--text-secondary)] text-sm text-center py-4 bg-[var(--bg-secondary)]/20 rounded-lg border border-dashed border-[var(--card-border)]">
                  No skills in this category yet
                </p>
              )}
            </div>

            {(activeCategoryId === cat.id || activeCategoryId === null) && (
              <div className="border-t border-[var(--card-border)] pt-4">
                <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
                  {editingItemId && activeCategoryId === cat.id ? 'Edit Skill' : 'Add Skill to this Category'}
                </h4>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Skill name (e.g., React, Python)"
                    value={activeCategoryId === cat.id ? itemForm.name : ''}
                    onChange={(e) => {
                      setActiveCategoryId(cat.id)
                      setItemForm(prev => ({ ...prev, name: e.target.value }))
                    }}
                    className="w-full px-4 py-2.5 bg-[var(--bg-secondary)]/50 border border-[var(--card-border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all duration-300 placeholder:text-[var(--text-secondary)]/50"
                  />
                  {errors.name && activeCategoryId === cat.id && (
                    <p className="text-red-400 text-sm flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.name}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-[var(--text-secondary)] mb-1.5">Proficiency (0-100)</label>
                      <input
                        type="number"
                        placeholder="50"
                        value={activeCategoryId === cat.id ? itemForm.proficiency : 50}
                        onChange={(e) => {
                          setActiveCategoryId(cat.id)
                          setItemForm(prev => ({ ...prev, proficiency: parseInt(e.target.value) || 0 }))
                        }}
                        min="0"
                        max="100"
                        className="w-full px-4 py-2.5 bg-[var(--bg-secondary)]/50 border border-[var(--card-border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all duration-300"
                      />
                      {errors.proficiency && activeCategoryId === cat.id && (
                        <p className="text-red-400 text-xs mt-1">{errors.proficiency}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs text-[var(--text-secondary)] mb-1.5">Years of Experience</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={activeCategoryId === cat.id ? itemForm.years : 0}
                        onChange={(e) => {
                          setActiveCategoryId(cat.id)
                          setItemForm(prev => ({ ...prev, years: parseInt(e.target.value) || 0 }))
                        }}
                        min="0"
                        className="w-full px-4 py-2.5 bg-[var(--bg-secondary)]/50 border border-[var(--card-border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleAddItem(cat.id)}
                      className="px-6 py-2.5 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-[var(--accent-primary)]/50 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {editingItemId && activeCategoryId === cat.id ? 'Update' : 'Add'} Skill
                    </button>
                    {editingItemId && activeCategoryId === cat.id && (
                      <button
                        type="button"
                        onClick={handleCancelItem}
                        className="px-6 py-2.5 bg-[var(--bg-secondary)] border border-[var(--card-border)] text-[var(--text-secondary)] rounded-xl font-medium hover:text-[var(--text-primary)] hover:border-[var(--accent-primary)]/50 transition-all duration-300"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        {categories.length === 0 && (
          <div className="text-center py-12 text-[var(--text-secondary)] bg-[var(--bg-secondary)]/20 rounded-xl border border-dashed border-[var(--card-border)]">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            No skill categories yet. Add your first one above!
          </div>
        )}
      </div>
    </div>
  )
}
