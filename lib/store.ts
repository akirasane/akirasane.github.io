'use client'

import { useState, useEffect } from 'react'
import { PortfolioData } from './types'
import { DEFAULT_DATA } from './defaults'
import { sanitizeConfig } from './safeUrl'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://admin.omelettesalmon.com/api/config'

interface PortfolioStore {
  data: PortfolioData
  loading: boolean
}

export function usePortfolioStore(): PortfolioStore {
  const [data, setData] = useState<PortfolioData>(DEFAULT_DATA)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadConfig = async () => {
      try {
        let config = DEFAULT_DATA
        let loaded: PortfolioData | null = null
        // Prefer the admin API; fall back to the bundled /config.json if it is down or unreachable.
        try {
          const api = await fetch(API_URL, { signal: AbortSignal.timeout(5000) })
          if (api.ok) loaded = await api.json()
        } catch {
          // fall through to static config
        }
        if (!loaded) {
          const response = await fetch('/config.json')
          if (response.ok) loaded = await response.json()
          else console.warn('Failed to load config, using defaults')
        }
        if (loaded) {
          config = sanitizeConfig(loaded)
          setData(config)
        }
        if (typeof window !== 'undefined') {
          localStorage.setItem('portfolio_data', JSON.stringify(config))
        }
      } catch (error) {
        console.error('Error loading config.json:', error)
        if (typeof window !== 'undefined') {
          localStorage.setItem('portfolio_data', JSON.stringify(DEFAULT_DATA))
        }
        // Falls back to DEFAULT_DATA
      } finally {
        setLoading(false)
      }
    }

    loadConfig()
  }, [])

  return { data, loading }
}
