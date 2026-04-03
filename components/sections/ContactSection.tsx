'use client'

import { useState } from 'react'
import FadeContent from '@/components/reactbits/FadeContent'
import BorderGlow from '@/components/reactbits/BorderGlow'
import type { ContactInfo } from '@/lib/types'

interface ContactSectionProps {
  contact: ContactInfo
}

interface FormState {
  name: string
  email: string
  message: string
  status: 'idle' | 'submitting' | 'success' | 'error'
}

function isValidEmail(email: string): boolean {
  const atIdx = email.indexOf('@')
  if (atIdx <= 0) return false
  const local = email.slice(0, atIdx)
  const domain = email.slice(atIdx + 1)
  return local.length > 0 && domain.length > 0
}

export default function ContactSection({ contact }: ContactSectionProps) {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    message: '',
    status: 'idle',
  })
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({})

  function validate() {
    const errs: { name?: string; email?: string; message?: string } = {}
    if (!form.name.trim()) errs.name = 'Name is required.'
    if (!form.email.trim()) {
      errs.email = 'Email is required.'
    } else if (!isValidEmail(form.email)) {
      errs.email = 'Please enter a valid email address.'
    }
    if (!form.message.trim()) errs.message = 'Message is required.'
    return errs
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    setForm((f) => ({ ...f, status: 'submitting' }))
    try {
      const res = await fetch(contact.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, message: form.message }),
      })
      if (!res.ok) throw new Error('Submission failed')
      setForm({ name: '', email: '', message: '', status: 'success' })
    } catch {
      setForm((f) => ({ ...f, status: 'error' }))
    }
  }

  const inputStyle: React.CSSProperties = {
    background: 'var(--card-bg)',
    border: '1px solid var(--card-border)',
    color: 'var(--text-primary)',
    borderRadius: '0.5rem',
    padding: '0.625rem 0.875rem',
    width: '100%',
    outline: 'none',
    fontSize: '0.875rem',
  }

  const labelStyle: React.CSSProperties = {
    color: 'var(--text-secondary)',
    fontSize: '0.875rem',
    fontWeight: 500,
    marginBottom: '0.25rem',
    display: 'block',
  }

  const errorStyle: React.CSSProperties = {
    color: '#f87171',
    fontSize: '0.75rem',
    marginTop: '0.25rem',
  }

  return (
    <section
      id="contact"
      className="snap-section flex flex-col items-center justify-center px-6 py-16 md:py-16 md:overflow-y-auto"
      style={{ background: 'var(--bg-secondary)' }}
    >
      <div className="w-full max-w-5xl flex flex-col gap-10">
        <h2
          className="text-3xl font-bold text-center md:text-4xl"
          style={{ color: 'var(--text-primary)' }}
        >
          Get In Touch
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Contact form */}
          <FadeContent>
            {/* <div
              className="rounded-xl p-6 flex flex-col gap-5"
              style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
            > */}
            <BorderGlow className="rounded-xl p-6 flex flex-col gap-5"
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
              {form.status === 'success' ? (
                <div className="flex flex-col items-center gap-3 py-8 text-center">
                  <span className="text-4xl">✓</span>
                  <p className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
                    Message sent!
                  </p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    Thanks for reaching out. I&apos;ll get back to you soon.
                  </p>
                  <button
                    onClick={() => setForm({ name: '', email: '', message: '', status: 'idle' })}
                    className="mt-2 text-sm font-medium"
                    style={{ color: 'var(--accent-primary)' }}
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                  <div>
                    <label htmlFor="contact-name" style={labelStyle}>Name</label>
                    <input
                      id="contact-name"
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="Your name"
                      style={inputStyle}
                      aria-describedby={errors.name ? 'contact-name-error' : undefined}
                    />
                    {errors.name && <p id="contact-name-error" style={errorStyle}>{errors.name}</p>}
                  </div>

                  <div>
                    <label htmlFor="contact-email" style={labelStyle}>Email</label>
                    <input
                      id="contact-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder="your@email.com"
                      style={inputStyle}
                      aria-describedby={errors.email ? 'contact-email-error' : undefined}
                    />
                    {errors.email && <p id="contact-email-error" style={errorStyle}>{errors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="contact-message" style={labelStyle}>Message</label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      placeholder="Your message…"
                      style={{ ...inputStyle, resize: 'vertical' }}
                      aria-describedby={errors.message ? 'contact-message-error' : undefined}
                    />
                    {errors.message && <p id="contact-message-error" style={errorStyle}>{errors.message}</p>}
                  </div>

                  {form.status === 'error' && (
                    <p style={{ color: '#f87171', fontSize: '0.875rem' }}>
                      Something went wrong. Please try again.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={form.status === 'submitting'}
                    className="rounded-full px-6 py-2.5 font-semibold text-sm transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ background: 'var(--accent-primary)', color: '#fff' }}
                  >
                    {form.status === 'submitting' ? 'Sending…' : 'Send Message'}
                  </button>
                </form>
              )}
              {/* </div> */}
            </BorderGlow>
          </FadeContent>

          {/* Contact info */}
          <FadeContent delay={0.1}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                {contact.email && (
                  <div className="flex items-start gap-3">
                    <span style={{ color: 'var(--accent-primary)', fontSize: '1.1rem' }}>✉</span>
                    <div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 500 }}>Email</p>
                      <a
                        href={`mailto:${contact.email}`}
                        style={{ color: 'var(--text-primary)', fontSize: '0.875rem' }}
                        className="hover:opacity-80 transition-opacity"
                      >
                        {contact.email}
                      </a>
                    </div>
                  </div>
                )}

                {contact.phone && (
                  <div className="flex items-start gap-3">
                    <span style={{ color: 'var(--accent-primary)', fontSize: '1.1rem' }}>☎</span>
                    <div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 500 }}>Phone</p>
                      <p style={{ color: 'var(--text-primary)', fontSize: '0.875rem' }}>{contact.phone}</p>
                    </div>
                  </div>
                )}

                {contact.location && (
                  <div className="flex items-start gap-3">
                    <span style={{ color: 'var(--accent-primary)', fontSize: '1.1rem' }}>⌖</span>
                    <div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 500 }}>Location</p>
                      <p style={{ color: 'var(--text-primary)', fontSize: '0.875rem' }}>{contact.location}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Social links */}
              <div className="flex flex-wrap gap-3">
                {contact.social.github && (
                  <a
                    href={contact.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-80"
                    style={{ background: 'var(--card-bg)', color: 'var(--text-primary)', border: '1px solid var(--card-border)' }}
                  >
                    GitHub
                  </a>
                )}
                {contact.social.linkedin && (
                  <a
                    href={contact.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-80"
                    style={{ background: 'var(--card-bg)', color: 'var(--text-primary)', border: '1px solid var(--card-border)' }}
                  >
                    LinkedIn
                  </a>
                )}
                {contact.social.twitter && (
                  <a
                    href={contact.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter"
                    className="rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-80"
                    style={{ background: 'var(--card-bg)', color: 'var(--text-primary)', border: '1px solid var(--card-border)' }}
                  >
                    Twitter
                  </a>
                )}
                {contact.social.website && (
                  <a
                    href={contact.social.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Website"
                    className="rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-80"
                    style={{ background: 'var(--card-bg)', color: 'var(--text-primary)', border: '1px solid var(--card-border)' }}
                  >
                    Website
                  </a>
                )}
              </div>
            </div>
          </FadeContent>
        </div>
      </div>
    </section>
  )
}
