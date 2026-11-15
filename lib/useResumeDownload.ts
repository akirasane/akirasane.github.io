'use client'

import { useCallback, useState } from 'react'
import { isSafeUrl } from '@/lib/safeUrl'
import type { PortfolioData } from '@/lib/types'

export function useResumeDownload(portfolioData: PortfolioData) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const download = useCallback(async () => {
    const resumeUrl = portfolioData?.profile?.resumeUrl
    if (resumeUrl && /^https:\/\//i.test(resumeUrl) && isSafeUrl(resumeUrl)) {
      window.open(resumeUrl, '_blank', 'noopener,noreferrer')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const { generateResumePDF } = await import('@/lib/pdf')
      if (!portfolioData) throw new Error('No portfolio data found')
      await generateResumePDF(portfolioData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate PDF')
    } finally {
      setLoading(false)
    }
  }, [portfolioData])

  return { download, loading, error }
}
