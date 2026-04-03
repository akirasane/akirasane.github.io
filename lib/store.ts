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
        if (response.ok) {
          const config = await response.json()
          setData(config)
        } else {
          console.warn('Failed to load config.json, using defaults')
        }
      } catch (error) {
        console.error('Error loading config.json:', error)
        // Falls back to DEFAULT_DATA
      } finally {
        setLoading(false)
      }
    }

    loadConfig()
  }, [])

  return { data, loading }
}
