'use client'

import { useState } from 'react'
import { FiFileText, FiBook, FiHeart, FiCloud, FiEdit, FiBarChart2 } from 'react-icons/fi'
import FadeContent from '@/components/reactbits/FadeContent'
import BorderGlow from '@/components/reactbits/BorderGlow'
import GlassIcons from '@/components/reactbits/GlassIcons'
import type { Project } from '@/lib/types'

interface ProjectsSectionProps {
  projects: Project[]
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const uniqueTags = Array.from(new Set(projects.flatMap((p) => p.tags)))

  const filtered = activeTag
    ? projects.filter((p) => p.tags.includes(activeTag))
    : projects

  // const items = [
  //   { icon: <FiFileText />, color: 'blue', label: 'Files' },
  //   { icon: <FiBook />, color: 'purple', label: 'Books' },
  //   { icon: <FiHeart />, color: 'red', label: 'Health' },
  // ];
  return (
    <section
      id="projects"
      className="snap-section flex flex-col items-center justify-center px-6 py-16 overflow-y-auto"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="w-full max-w-5xl flex flex-col gap-8">
        <h2
          className="text-3xl font-bold text-center md:text-4xl"
          style={{ color: 'var(--text-primary)' }}
        >
          Projects
        </h2>

        {projects.length === 0 ? (
          <p className="text-center" style={{ color: 'var(--text-secondary)' }}>
            No projects added yet.
          </p>
        ) : (
          <>
            {/* Filter controls */}
            {/* <div style={{ height: '600px', position: 'relative' }}>
              <GlassIcons items={items} className="custom-class" />
            </div> */}
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setActiveTag(null)}
                className="px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
                style={{
                  background: activeTag === null ? 'var(--accent-primary)' : 'var(--card-bg)',
                  color: activeTag === null ? '#fff' : 'var(--text-secondary)',
                  border: '1px solid var(--card-border)',
                }}
              >
                All
              </button>
              {uniqueTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className="px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
                  style={{
                    background: activeTag === tag ? 'var(--accent-primary)' : 'var(--card-bg)',
                    color: activeTag === tag ? '#fff' : 'var(--text-secondary)',
                    border: '1px solid var(--card-border)',
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Project grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((project) => (
                <FadeContent key={project.id}>

                  <BorderGlow className="rounded-xl p-5 flex flex-col gap-3 h-full"
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
                    {/* <div
                    className="rounded-xl p-5 flex flex-col gap-3 h-full"
                    style={{
                      background: 'var(--card-bg)',
                      border: '1px solid var(--card-border)',
                    }}
                  > */}
                    <h3
                      className="font-semibold text-base"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {project.title}
                    </h3>

                    <p
                      className="text-sm leading-relaxed flex-1"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {project.description}
                    </p>

                    {project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded text-xs font-medium"
                            style={{
                              background: 'rgba(99,102,241,0.15)',
                              color: 'var(--accent-secondary)',
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium mt-auto"
                        style={{ color: 'var(--accent-primary)' }}
                      >
                        View Project →
                      </a>
                    )}
                  </BorderGlow>
                  {/* </div> */}
                </FadeContent>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
