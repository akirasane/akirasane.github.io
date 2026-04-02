'use client'

import { useState, useEffect, useCallback } from 'react'
import { PortfolioData } from './types'
import { DEFAULT_DATA, STORAGE_KEY } from './defaults'

interface PortfolioStore {
  data: PortfolioData
  loading: boolean
  save: (patch: Partial<PortfolioData>) => void
}

export function usePortfolioStore(): PortfolioStore {
  const [data, setData] = useState<PortfolioData>(DEFAULT_DATA)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed: PortfolioData = JSON.parse(raw)
        setData(parsed)
      }
    } catch {
      // corrupt JSON or localStorage unavailable — fall back to DEFAULT_DATA
    } finally {
      setLoading(false)
    }
  }, [])

  const save = useCallback((patch: Partial<PortfolioData>) => {
    setData(current => {
      const next = { ...current, ...patch }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        // quota exceeded or storage unavailable — keep in-memory state only
      }
      return next
    })
  }, [])

  return { data, loading, save }
}
