'use client'

import { useState, useEffect } from 'react'
import AdminLogin from '@/components/admin/AdminLogin'
import AdminDashboard from '@/components/admin/AdminDashboard'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check authentication status on mount
    const authStatus = sessionStorage.getItem('admin_auth') === 'true'
    setIsAuthenticated(authStatus)
    setIsLoading(false)
  }, [])

  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth')
    setIsAuthenticated(false)
  }

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-primary)]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-[var(--accent-primary)]/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-[var(--accent-primary)] rounded-full animate-spin"></div>
          </div>
          <div className="text-[var(--text-secondary)] animate-pulse">Loading...</div>
        </div>
      </div>
    )
  }

  return isAuthenticated ? (
    <AdminDashboard onLogout={handleLogout} />
  ) : (
    <AdminLogin onSuccess={handleLoginSuccess} />
  )
}
