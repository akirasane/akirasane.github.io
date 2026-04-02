'use client'

import { useState, FormEvent } from 'react'

interface AdminLoginProps {
  onSuccess: () => void
}

export default function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? 'admin'

    if (password === adminPassword) {
      sessionStorage.setItem('admin_auth', 'true')
      onSuccess()
    } else {
      setError('Incorrect password. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4">
      <div className="w-full max-w-md">
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-8 backdrop-blur-sm">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-6 text-center">
            Admin Login
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-[var(--text-secondary)] mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--card-border)] rounded-md text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                placeholder="Enter admin password"
                disabled={isSubmitting}
                autoFocus
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm bg-red-500/10 border border-red-500/20 rounded-md p-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !password}
              className="w-full py-2 px-4 bg-[var(--accent-primary)] text-white rounded-md font-medium hover:bg-[var(--accent-secondary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
