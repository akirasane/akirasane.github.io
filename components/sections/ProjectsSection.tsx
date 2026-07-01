'use client'

import { useState, useRef, useEffect } from 'react'
import FadeContent from '@/components/reactbits/FadeContent'
import BorderGlow from '@/components/reactbits/BorderGlow'
import type { Project } from '@/lib/types'

interface ProjectsSectionProps {
  projects: Project[]
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const uniqueTags = Array.from(new Set(projects.flatMap((p) => p.tags)))

  const filtered = activeTag
    ? projects.filter((p) => p.tags.includes(activeTag))
    : projects

  useEffect(() => {
    const section = sectionRef.current
    const container = scrollContainerRef.current
    if (!section || !container) return

    const handleWheel = (e: WheelEvent) => {
      // Only lock/hijack if scroll is primarily vertical
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        const scrollLeft = container.scrollLeft
        const maxScrollLeft = container.scrollWidth - container.clientWidth

        // Lock vertically and scroll horizontally if we haven't reached the boundaries
        if (e.deltaY > 0 && scrollLeft < maxScrollLeft - 1) {
          e.preventDefault()
          container.scrollLeft += e.deltaY
        } else if (e.deltaY < 0 && scrollLeft > 1) {
          e.preventDefault()
          container.scrollLeft += e.deltaY
        }
      }
    }

    section.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      section.removeEventListener('wheel', handleWheel)
    }
  }, [filtered]) // Re-run when projects filtered list changes to adapt container scroll width

  useEffect(() => {
    const container = scrollContainerRef.current
    if (container) {
      container.scrollTo({ left: 0, behavior: 'smooth' })
    }
  }, [activeTag])

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current
    if (!container) return
    const scrollAmount = container.clientWidth * 0.75
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    })
  }

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="snap-section flex flex-col items-center justify-center px-6 py-16 md:py-16 overflow-hidden"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="w-full max-w-5xl flex flex-col gap-8">
        <div className="flex items-center justify-between w-full">
          <h2
            className="text-3xl font-bold md:text-4xl text-left"
            style={{ color: 'var(--text-primary)' }}
          >
            Projects
          </h2>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)] transition-all active:scale-95"
              aria-label="Scroll projects left"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)] transition-all active:scale-95"
              aria-label="Scroll projects right"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {projects.length === 0 ? (
          <p className="text-center" style={{ color: 'var(--text-secondary)' }}>
            No projects added yet.
          </p>
        ) : (
          <>
            <div className="flex flex-wrap gap-2 justify-start">
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

            <div
              ref={scrollContainerRef}
              id="projects-container"
              className="flex flex-row gap-6 overflow-x-auto pb-6"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              <style dangerouslySetInnerHTML={{__html: `
                #projects-container::-webkit-scrollbar {
                  display: none;
                }
              `}} />
              
              {filtered.map((project) => (
                <FadeContent
                  key={project.id}
                  className="shrink-0 w-[290px] sm:w-[360px] md:w-[400px] h-[300px]"
                >
                  <BorderGlow
                    className="rounded-xl p-5 flex flex-col gap-3 h-full"
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
                    <h3
                      className="font-semibold text-base md:text-lg"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {project.title}
                    </h3>

                    <p
                      className="text-xs md:text-sm leading-relaxed flex-1 overflow-y-auto"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {project.description}
                    </p>

                    {project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded text-[10px] md:text-xs font-medium"
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
                        className="text-xs md:text-sm font-medium mt-auto"
                        style={{ color: 'var(--accent-primary)' }}
                      >
                        View Project →
                      </a>
                    )}
                  </BorderGlow>
                </FadeContent>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
