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
      <div className="border rounded p-4">
        <h3 className="text-lg font-semibold mb-4">Add New Category</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Category name"
            value={categoryForm.category}
            onChange={(e) => setCategoryForm(prev => ({ ...prev, category: e.target.value }))}
            className="flex-1 px-3 py-2 border rounded"
          />
          <select
            value={categoryForm.color}
            onChange={(e) => setCategoryForm(prev => ({ ...prev, color: e.target.value }))}
            className="px-3 py-2 border rounded"
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
            className="px-4 py-2 bg-accent text-white rounded"
          >
            Add Category
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {categories.map(cat => (
          <div key={cat.id} className="border rounded p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">{cat.category}</h3>
              <button
                onClick={() => handleDeleteCategory(cat.id)}
                className="px-3 py-1 bg-red-500 text-white rounded text-sm"
              >
                Delete Category
              </button>
            </div>

            <div className="space-y-2 mb-4">
              {cat.items.map(item => (
                <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      {item.proficiency}% • {item.years} years
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditItem(cat.id, item)}
                      className="px-2 py-1 bg-blue-500 text-white rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteItem(cat.id, item.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {cat.items.length === 0 && (
                <p className="text-gray-500 text-sm">No skills in this category</p>
              )}
            </div>

            {(activeCategoryId === cat.id || activeCategoryId === null) && (
              <div className="border-t pt-3">
                <h4 className="text-sm font-semibold mb-2">
                  {editingItemId && activeCategoryId === cat.id ? 'Edit Skill' : 'Add Skill'}
                </h4>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Skill name"
                    value={activeCategoryId === cat.id ? itemForm.name : ''}
                    onChange={(e) => {
                      setActiveCategoryId(cat.id)
                      setItemForm(prev => ({ ...prev, name: e.target.value }))
                    }}
                    className="w-full px-3 py-2 border rounded"
                  />
                  {errors.name && activeCategoryId === cat.id && (
                    <p className="text-red-500 text-sm">{errors.name}</p>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <input
                        type="number"
                        placeholder="Proficiency (0-100)"
                        value={activeCategoryId === cat.id ? itemForm.proficiency : 50}
                        onChange={(e) => {
                          setActiveCategoryId(cat.id)
                          setItemForm(prev => ({ ...prev, proficiency: parseInt(e.target.value) || 0 }))
                        }}
                        min="0"
                        max="100"
                        className="w-full px-3 py-2 border rounded"
                      />
                      {errors.proficiency && activeCategoryId === cat.id && (
                        <p className="text-red-500 text-sm">{errors.proficiency}</p>
                      )}
                    </div>
                    <input
                      type="number"
                      placeholder="Years"
                      value={activeCategoryId === cat.id ? itemForm.years : 0}
                      onChange={(e) => {
                        setActiveCategoryId(cat.id)
                        setItemForm(prev => ({ ...prev, years: parseInt(e.target.value) || 0 }))
                      }}
                      min="0"
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleAddItem(cat.id)}
                      className="px-3 py-1 bg-accent text-white rounded text-sm"
                    >
                      {editingItemId && activeCategoryId === cat.id ? 'Update' : 'Add'} Skill
                    </button>
                    {editingItemId && activeCategoryId === cat.id && (
                      <button
                        type="button"
                        onClick={handleCancelItem}
                        className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
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
          <p className="text-gray-500 text-sm">No skill categories yet</p>
        )}
      </div>
    </div>
  )
}
