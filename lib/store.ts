'use client'

import { useState, useEffect } from 'react'
import { PortfolioData } from './types'
import { DEFAULT_DATA } from './defaults'

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
        const response = await fetch('/config.json')
        let config = DEFAULT_DATA
        if (response.ok) {
          config = await response.json()
          setData(config)
        } else {
          console.warn('Failed to load config.json, using defaults')
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
