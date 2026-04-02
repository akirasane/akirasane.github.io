import type { Profile, Experience, SkillItem, Project, ContactInfo } from './types'

export function validateRequired(value: string): boolean {
  return value.trim().length > 0
}

export function validateEmail(value: string): boolean {
  const atIndex = value.indexOf('@')
  if (atIndex <= 0) return false
  const local = value.slice(0, atIndex)
  const domain = value.slice(atIndex + 1)
  return local.length > 0 && domain.length > 0
}

export function validateProficiency(value: number): boolean {
  return value >= 0 && value <= 100
}

export function validateProfile(data: Profile): Record<string, string> {
  const errors: Record<string, string> = {}
  if (!validateRequired(data.name)) errors.name = 'Name is required'
  if (!validateRequired(data.title)) errors.title = 'Title is required'
  if (data.social?.email && !validateEmail(data.social.email)) {
    errors.email = 'Invalid email address'
  }
  return errors
}

export function validateExperience(data: Omit<Experience, 'id'>): Record<string, string> {
  const errors: Record<string, string> = {}
  if (!validateRequired(data.company)) errors.company = 'Company is required'
  if (!validateRequired(data.title)) errors.title = 'Title is required'
  if (!validateRequired(data.startDate)) errors.startDate = 'Start date is required'
  return errors
}

export function validateSkillItem(data: Omit<SkillItem, 'id'>): Record<string, string> {
  const errors: Record<string, string> = {}
  if (!validateRequired(data.name)) errors.name = 'Name is required'
  if (!validateProficiency(data.proficiency)) {
    errors.proficiency = 'Proficiency must be between 0 and 100'
  }
  return errors
}

export function validateProject(data: Omit<Project, 'id'>): Record<string, string> {
  const errors: Record<string, string> = {}
  if (!validateRequired(data.title)) errors.title = 'Title is required'
  if (!validateRequired(data.description)) errors.description = 'Description is required'
  return errors
}

export function validateContactInfo(data: ContactInfo): Record<string, string> {
  const errors: Record<string, string> = {}
  if (!validateRequired(data.email)) {
    errors.email = 'Email is required'
  } else if (!validateEmail(data.email)) {
    errors.email = 'Invalid email address'
  }
  return errors
}
