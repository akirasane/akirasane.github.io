'use client'

import ScrollReveal from '@/components/reactbits/ScrollReveal'
import BorderGlow from '@/components/reactbits/BorderGlow'
import type { SkillCategory, SkillItem, Project } from '@/lib/types'

interface SkillsSectionProps {
  skills: SkillCategory[]
  projects?: Project[]
}

interface SkillCardProps {
  item: SkillItem
  projects?: Project[]
}

function getSkillLevel(proficiency: number) {
  if (proficiency >= 85) {
    return {
      label: 'Expert',
      color: '#10b981', // emerald
      bg: 'rgba(16, 185, 129, 0.08)',
      border: '1px solid rgba(16, 185, 129, 0.2)',
    }
  } else if (proficiency >= 70) {
    return {
      label: 'Advanced',
      color: '#a78bfa', // purple/indigo
      bg: 'rgba(167, 139, 250, 0.08)',
      border: '1px solid rgba(167, 139, 250, 0.2)',
    }
  } else {
    return {
      label: 'Learning',
      color: '#f59e0b', // amber
      bg: 'rgba(245, 158, 11, 0.08)',
      border: '1px solid rgba(245, 158, 11, 0.2)',
    }
  }
}

const countSkillProjects = (skillName: string, projects: Project[] = []) => {
  const normSkill = skillName.toLowerCase().replace(/[^a-z0-9]/g, '')
  return projects.filter(proj => 
    proj.tags?.some(tag => {
      const normTag = tag.toLowerCase().replace(/[^a-z0-9]/g, '')
      return normSkill.includes(normTag) || normTag.includes(normSkill)
    })
  ).length
}

function SkillCard({ item, projects }: SkillCardProps) {
  const level = getSkillLevel(item.proficiency)
  const projectCount = countSkillProjects(item.name, projects)

  return (
    <BorderGlow
      edgeSensitivity={30}
      glowColor="40 80 80"
      backgroundColor="#060010"
      borderRadius={28}
      glowRadius={40}
      glowIntensity={1}
      coneSpread={25}
      animated={false}
      colors={['#c084fc', '#f472b6', '#38bdf8']}
    >
      <div style={{ padding: '2em' }} className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <span
            className="font-medium text-sm md:text-base tracking-wide"
            style={{ color: 'var(--text-primary)' }}
          >
            {item.name}
          </span>
          <span
            className="text-[10px] md:text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{
              color: level.color,
              backgroundColor: level.bg,
              border: level.border,
            }}
          >
            {level.label}
          </span>
        </div>

        <div className="flex flex-col gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent-primary)', opacity: 0.6 }} />
            <span>{item.years} {item.years === 1 ? 'year' : 'years'} experience</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent-primary)', opacity: 0.6 }} />
            <span>
              {projectCount > 0 
                ? `Used in ${projectCount} ${projectCount === 1 ? 'project' : 'projects'}` 
                : 'Specialized study'}
            </span>
          </div>
        </div>
      </div>
    </BorderGlow>
  )
}

export default function SkillsSection({ skills, projects }: SkillsSectionProps) {
  return (
    <section
      id="skills"
      className="snap-section relative flex flex-col items-center justify-center px-6 py-20 md:py-20 overflow-hidden"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="w-full max-w-4xl flex flex-col gap-10 relative z-10">
        <h2
          className="text-3xl font-bold text-center md:text-4xl"
          style={{ color: 'var(--text-primary)' }}
        >
          Skills
        </h2>

        {skills.length === 0 ? (
          <p
            className="text-center"
            style={{ color: 'var(--text-secondary)' }}
          >
            No skills added yet.
          </p>
        ) : (
          skills.map((category) => (
            <div key={category.id} className="flex flex-col gap-4">
              <h3
                className="text-lg font-semibold"
                style={{ color: 'var(--accent-primary)' }}
              >
                {category.category}
              </h3>
              <ScrollReveal className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                {category.items.map((item) => (
                  <SkillCard key={item.id} item={item} projects={projects} />
                ))}
              </ScrollReveal>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
